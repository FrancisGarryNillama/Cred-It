"""
Management command to set up initial data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from creditapp.models import CreditAccount
from curriculum.models import CitTorContent


class Command(BaseCommand):
    help = 'Set up initial data for the system'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-superuser',
            action='store_true',
            help='Skip superuser creation',
        )
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up initial data...'))
        
        # Create superuser if not exists
        if not options['skip_superuser']:
            self.create_superuser()
        
        # Create sample CIT content
        self.create_sample_curriculum()
        
        self.stdout.write(self.style.SUCCESS('Initial data setup complete!'))
    
    def create_superuser(self):
        """Create default superuser"""
        User = get_user_model()
        
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                email='admin@example.com',
                password='admin123'
            )
            self.stdout.write(
                self.style.SUCCESS('✓ Created superuser (admin@example.com / admin123)')
            )
        else:
            self.stdout.write(
                self.style.WARNING('⚠ Superuser already exists')
            )
    
    def create_sample_curriculum(self):
        """Create sample CIT curriculum content"""
        sample_subjects = [
            {
                'subject_code': 'CS101',
                'description': ['Introduction to Computer Science', 'Intro to CS'],
                'prerequisite': [],
                'units': 3
            },
            {
                'subject_code': 'CS102',
                'description': ['Data Structures and Algorithms', 'Data Structures'],
                'prerequisite': ['CS101'],
                'units': 3
            },
            {
                'subject_code': 'MATH101',
                'description': ['College Algebra', 'Algebra'],
                'prerequisite': [],
                'units': 3
            },
        ]
        
        created = 0
        for subject in sample_subjects:
            obj, created_now = CitTorContent.objects.get_or_create(
                subject_code=subject['subject_code'],
                defaults=subject
            )
            if created_now:
                created += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'✓ Created {created} sample curriculum entries')
        )
