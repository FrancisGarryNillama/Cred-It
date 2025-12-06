"""
OCR processing service for TOR documents.
Handles image processing and text extraction.
"""
import tempfile
import os
import re
from typing import List, Dict, Optional
from difflib import SequenceMatcher
from django.core.files.uploadedfile import UploadedFile
from core.exceptions import ValidationException, BusinessLogicException
from core.decorators import log_execution
import logging

logger = logging.getLogger(__name__)

# Import EasyOCR (will be installed)
try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    logger.warning("EasyOCR not available. OCR functionality will be limited.")


class OCRService:
    """
    Service for OCR processing of TOR documents.
    """
    
    # Pattern matching for TOR extraction
    SUBJECT_CODE_PATTERN = re.compile(r'^[A-Za-z]{1,}[ \-]*\d{1,4}[A-Za-z]?$')
    NUMBER_PATTERN = re.compile(r'^\d+(\.\d+)?$')
    YEAR_PATTERN = re.compile(r'^\d{4}-\d{4}$')
    
    # Grading keywords
    REMARKS_KEYWORDS = [
        'passed', 'failed', 'inc', 'incomplete',
        'dropped', 'withdrawn', 'drp', 'pas'
    ]
    
    # Semester keywords
    SEMESTER_KEYWORDS = ['first', 'second', 'summer']
    
    def __init__(self):
        """Initialize OCR service"""
        self.reader = None
        if EASYOCR_AVAILABLE:
            self.reader = easyocr.Reader(['en'])
            logger.info("EasyOCR reader initialized")
    
    @staticmethod
    def get_center(bbox: List[List[float]]) -> tuple:
        """Calculate center point of bounding box"""
        x_coords = [p[0] for p in bbox]
        y_coords = [p[1] for p in bbox]
        return (sum(x_coords) / 4, sum(y_coords) / 4)
    
    @staticmethod
    def average_text_height(annotated: List[Dict]) -> float:
        """Calculate average text height"""
        heights = [
            abs(item['bbox'][0][1] - item['bbox'][2][1])
            for item in annotated
        ]
        return sum(heights) / len(heights) if heights else 15
    
    def sort_ocr_results(self, results: List) -> List[List[Dict]]:
        """
        Sort OCR results into logical lines.
        
        Args:
            results: Raw OCR results
            
        Returns:
            List of lines, where each line is a list of word dictionaries
        """
        # Filter low confidence results
        annotated = [
            {
                "bbox": r[0],
                "text": r[1],
                "conf": r[2],
                "center": self.get_center(r[0])
            }
            for r in results if r[2] > 0.3
        ]
        
        # Calculate threshold for line grouping
        threshold = self.average_text_height(annotated) * 0.6
        
        # Sort by vertical position first
        annotated.sort(key=lambda x: x["center"][1])
        
        # Group into lines
        lines = []
        current_line = []
        
        for item in annotated:
            if not current_line:
                current_line.append(item)
                continue
            
            y_diff = abs(item["center"][1] - current_line[-1]["center"][1])
            
            if y_diff < threshold:
                current_line.append(item)
            else:
                lines.append(current_line)
                current_line = [item]
        
        if current_line:
            lines.append(current_line)
        
        # Sort words within each line by horizontal position
        for line in lines:
            line.sort(key=lambda x: x["center"][0])
        
        return lines
    
    def extract_fields_from_lines(
        self,
        lines: List[List[Dict]]
    ) -> Dict[str, any]:
        """
        Extract structured data from sorted OCR lines.
        
        Args:
            lines: Sorted OCR results
            
        Returns:
            Dictionary with student info and extracted entries
        """
        extracted_entries = []
        student_name = None
        school_name = None
        
        for line in lines:
            texts = [w["text"] for w in line]
            lower_texts = [t.lower() for t in texts]
            joined_line = " ".join(texts)
            
            # Detect student/school name
            if not student_name and "name" in joined_line.lower():
                student_name = joined_line.split(":")[-1].strip()
                continue
            
            if not school_name and any(
                k in joined_line.lower()
                for k in ["school", "university", "college"]
            ):
                school_name = joined_line
                continue
            
            # Initialize entry
            entry = {
                'subject_code': '',
                'subject_description': '',
                'student_year': '',
                'semester': '',
                'school_year_offered': '',
                'total_academic_units': 0.0,
                'final_grade': 0.0,
                'remarks': '',
                'pre_requisite': '',
                'co_requisite': '',
            }
            
            # Look for subject code
            for i, word in enumerate(texts):
                if self.SUBJECT_CODE_PATTERN.match(word):
                    entry['subject_code'] = word
                    
                    # Extract description and numbers
                    desc_parts = []
                    numeric_parts = []
                    
                    for j in range(i + 1, len(texts)):
                        if self.NUMBER_PATTERN.match(texts[j]):
                            numeric_parts.append(texts[j])
                        elif texts[j].lower() in self.REMARKS_KEYWORDS:
                            entry['remarks'] = texts[j].capitalize()
                        else:
                            desc_parts.append(texts[j])
                    
                    entry['subject_description'] = " ".join(desc_parts)
                    
                    # Assign units and grade
                    if len(numeric_parts) >= 2:
                        entry['total_academic_units'] = float(numeric_parts[0])
                        entry['final_grade'] = float(numeric_parts[1])
                    elif len(numeric_parts) == 1:
                        entry['final_grade'] = float(numeric_parts[0])
                    
                    break
            
            # Extract semester
            for word in lower_texts:
                for sem in self.SEMESTER_KEYWORDS:
                    if sem in word:
                        entry['semester'] = sem
                        break
            
            # Extract school year
            for word in texts:
                if self.YEAR_PATTERN.match(word):
                    entry['school_year_offered'] = word
            
            # Add entry if it has a subject code
            if entry['subject_code'] and entry['subject_description']:
                extracted_entries.append(entry)
        
        return {
            'student_name': student_name,
            'school_name': school_name,
            'entries': extracted_entries
        }
    
    @log_execution
    def process_image(self, image_file: UploadedFile) -> Dict[str, any]:
        """
        Process a single image and extract TOR data.
        
        Args:
            image_file: Uploaded image file
            
        Returns:
            Dictionary with extracted data
            
        Raises:
            ValidationException: If OCR is not available or processing fails
        """
        if not self.reader:
            raise ValidationException(
                "OCR service not available. Please ensure EasyOCR is installed."
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        try:
            # Run OCR
            logger.info(f"Processing image: {image_file.name}")
            results = self.reader.readtext(tmp_path)
            
            # Sort and extract
            lines = self.sort_ocr_results(results)
            structured = self.extract_fields_from_lines(lines)
            
            logger.info(
                f"Extracted {len(structured['entries'])} entries from {image_file.name}"
            )
            
            return {
                'file_name': image_file.name,
                'student_name': structured.get('student_name'),
                'school_name': structured.get('school_name'),
                'entries': structured.get('entries', [])
            }
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}", exc_info=True)
            raise BusinessLogicException(f"Failed to process image: {str(e)}")
        
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    @log_execution
    def process_images(
        self,
        images: List[UploadedFile],
        account_id: Optional[str] = None
    ) -> List[Dict]:
        """
        Process multiple images in order.
        
        Args:
            images: List of uploaded image files
            account_id: Optional account ID to associate with data
            
        Returns:
            List of extracted data dictionaries
        """
        all_results = []
        
        for image in images:
            result = self.process_image(image)
            
            if account_id:
                result['account_id'] = account_id
            
            all_results.append(result)
        
        return all_results