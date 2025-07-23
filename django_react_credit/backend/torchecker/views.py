from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import easyocr
import cv2
import os
import numpy as np

from .tor_logic.verifier import is_likely_tor
from .tor_logic.parser import extract_subjects

@csrf_exempt
def upload_preview(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        path = default_storage.save(file.name, file)
        full_path = os.path.join(default_storage.location, path)

        # Run preview OCR
        reader = easyocr.Reader(['en'])
        img = cv2.imread(full_path)
        top_img = img[:min(300, img.shape[0]), :]  # top 300px
        preview_text = reader.readtext(top_img, detail=0)

        if is_likely_tor(preview_text):
            return JsonResponse({'status': 'valid', 'preview': preview_text})
        else:
            return JsonResponse({'status': 'invalid', 'message': 'Image is not a TOR. Please try again.'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def upload_full(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        path = default_storage.save(file.name, file)
        full_path = os.path.join(default_storage.location, path)

        reader = easyocr.Reader(['en'])
        result = reader.readtext(full_path, detail=0)
        extracted_lines = [line.strip() for line in result if isinstance(line, str)]

        # Perform parsing & subject detection
        subjects = extract_subjects(extracted_lines)

        return JsonResponse({'status': 'processed', 'subjects': subjects})
    return JsonResponse({'error': 'Invalid request'}, status=400)
