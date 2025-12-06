# Credit Evaluation System

A comprehensive Django application for managing transfer credit evaluation and Transcript of Records (TOR) processing.

## Features

- 🎓 **Student Management**: Complete profile and account management
- 📄 **OCR Processing**: Automatic TOR extraction using EasyOCR
- 🔄 **Workflow System**: Three-stage request processing (Request → Pending → Final)
- 📊 **Curriculum Matching**: AI-powered subject matching with similarity scoring
- 🎯 **Credit Evaluation**: Standard and reverse grading systems
- 📈 **Analytics**: Comprehensive statistics and reporting
- 🔒 **Security**: Production-ready with proper authentication and authorization

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **OCR**: EasyOCR, OpenCV
- **Server**: Gunicorn, Nginx
- **Testing**: pytest, pytest-django
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Node.js 18+ (for frontend)

### Local Development Setup

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/credit-system.git
   cd credit-system
```

2. **Create virtual environment**
```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
```

4. **Set up environment variables**
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

5. **Set up database**
```bash
   createdb credit_system
   python manage.py migrate
   python manage.py setup_initial_data
```

6. **Create superuser**
```bash
   python manage.py createsuperuser
```

7. **Run development server**
```bash
   export DJANGO_ENV=development
   python manage.py runserver
```

8. **Access the application**
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

### Docker Setup

1. **Build and run with Docker Compose**
```bash
   docker-compose up -d
```

2. **Run migrations**
```bash
   docker-compose exec web python manage.py migrate
```

3. **Create superuser**
```bash
   docker-compose exec web python manage.py createsuperuser
```

## Project Structure