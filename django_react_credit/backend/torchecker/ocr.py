import easyocr
import numpy as np
import re
from pathlib import Path
 
# === Helper Functions ===
 
def get_center(bbox):
    x_coords = [p[0] for p in bbox]
    y_coords = [p[1] for p in bbox]
    return (sum(x_coords) / 4, sum(y_coords) / 4)
 
def average_text_height(annotated):
    heights = [abs(bbox[0][1] - bbox[2][1]) for bbox in [a['bbox'] for a in annotated]]
    return sum(heights) / len(heights) if heights else 15
 
def sort_ocr_results(results):
    # Filter and annotate
    annotated = [
        {"bbox": r[0], "text": r[1], "conf": r[2], "center": get_center(r[0])}
        for r in results if r[2] > 0.5
    ]
 
    # Dynamic vertical threshold
    threshold = average_text_height(annotated) * 0.6
 
    # Sort top-to-bottom
    annotated.sort(key=lambda x: x["center"][1])
 
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
 
    # Sort each line left-to-right
    for line in lines:
        line.sort(key=lambda x: x["center"][0])
 
    return lines
 
def print_cleaned_table(lines):
    print("\n===== OCR Structured Output =====\n")
    for line in lines:
        line_text = " ".join([w["text"] for w in line])
        print(line_text)
    print("\n=================================\n")
 
# === Categorization Logic ===
 
def extract_fields_from_lines(lines):
    extracted_entries = []
    student_name = None
    school_name = None
 
    # Define patterns
    subject_code_pattern = re.compile(r'^[A-Z]{2,}\d{1,3}[A-Z]?$')
    grade_pattern = re.compile(r'^\d+(\.\d+)?$')
    year_pattern = re.compile(r'^\d{4}-\d{4}$')
    remarks_keywords = ['passed', 'failed', 'inc', 'dropped', 'withdrawn']
    semester_keywords = ['first', 'second', 'summer']
 
    for line in lines:
        texts = [w["text"] for w in line]
        lower_texts = [t.lower() for t in texts]
 
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
 
        # Header parsing (assume student name and school name are near the top)
        joined_line = " ".join(texts)
        if not student_name and "name" in joined_line.lower():
            student_name = joined_line.split(":")[-1].strip()
            continue
        if not school_name and "school" in joined_line.lower():
            school_name = joined_line.split(":")[-1].strip()
            continue
 
        # Subject code detection
        for i, word in enumerate(texts):
            if subject_code_pattern.match(word):
                entry['subject_code'] = word
 
                # Assume description is following subject code
                desc = []
                for j in range(i+1, len(texts)):
                    if grade_pattern.match(texts[j]) or texts[j].lower() in remarks_keywords:
                        break
                    desc.append(texts[j])
                entry['subject_description'] = " ".join(desc)
                break
 
        # Look for semester
        for word in lower_texts:
            for sem in semester_keywords:
                if sem in word:
                    entry['semester'] = sem
                    break
 
        # School year detection
        for word in texts:
            if year_pattern.match(word):
                entry['school_year_offered'] = word
 
        # Units, grade, and remarks
        numbers = [float(w) for w in texts if grade_pattern.match(w)]
        if numbers:
            if len(numbers) >= 2:
                entry['total_academic_units'] = numbers[0]
                entry['final_grade'] = numbers[1]
            elif len(numbers) == 1:
                entry['final_grade'] = numbers[0]
 
        for word in lower_texts:
            if word in remarks_keywords:
                entry['remarks'] = word.capitalize()
 
        # Only consider valid rows
        if entry['subject_code'] and entry['subject_description']:
            extracted_entries.append(entry)
 
    return {
        'student_name': student_name,
        'school_name': school_name,
        'entries': extracted_entries
    }
 
# === Main Program ===
 
def main():
    image_path = Path("ImagetobeProcces/505607457_1112650400804534_1116098631852365272_ncropped.jpg")
 
    if not image_path.exists():
        print(f"❌ Image not found at: {image_path.resolve()}")
        return
 
    reader = easyocr.Reader(['en'])
    print("Running OCR...")
    results = reader.readtext(str(image_path))
    print(f"Total Raw Results: {len(results)}")
 
    lines = sort_ocr_results(results)
    print_cleaned_table(lines)
 
    structured = extract_fields_from_lines(lines)
 
    print(f"Student Name: {structured['student_name']}")
    print(f"School Name: {structured['school_name']}")
 
    print("\n=== Extracted Subject Entries ===\n")
    for entry in structured['entries']:
        for key, value in entry.items():
            print(f"{key}: {value}")
        print("-" * 40)
 
if __name__ == "__main__":
    main()