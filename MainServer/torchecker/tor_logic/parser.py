import re

def extract_subjects(lines):
    subjects = []
    code_pattern = r'[A-Z]{2,5}[0-9]{2,3}'
    unit_pattern = r'\b\d+(\.\d+)?\b'

    for line in lines:
        match_code = re.search(code_pattern, line)
        match_units = re.search(unit_pattern, line)

        if match_code:
            subject = {
                'subject_code': match_code.group(),
                'subject_description': line,
                'total_academic_units': float(match_units.group()) if match_units else None
            }
            subjects.append(subject)
    return subjects
