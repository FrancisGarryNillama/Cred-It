def is_likely_tor(lines):
    tor_keywords = ['transcript', 'records', 'subject', 'course', 'units', 'grade', 'school year', 'semester']
    text = " ".join(line.lower() for line in lines)
    return sum(1 for word in tor_keywords if word in text) >= 2
