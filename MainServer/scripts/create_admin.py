"""
Script to create admin user interactively.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings')
django.setup()

from django.contrib.auth import get_user_model
from getpass import getpass


def main():
    User = get_user_model()
    
    print("\n" + "="*60)
    print("CREATE ADMIN USER")
    print("="*60 + "\n")
    
    email = input("Email: ").strip()
    
    if not email:
        print("Error: Email is required")
        return
    
    if User.objects.filter(email=email).exists():
        print(f"Error: User with email {email} already exists")
        return
    
    password = getpass("Password: ")
    password_confirm = getpass("Confirm password: ")
    
    if password != password_confirm:
        print("Error: Passwords do not match")
        return
    
    if len(password) < 8:
        print("Error: Password must be at least 8 characters")
        return
    
    first_name = input("First name (optional): ").strip()
    last_name = input("Last name (optional): ").strip()
    
    # Create user
    user = User.objects.create_superuser(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    print(f"\n✓ Admin user created successfully!")
    print(f"  Email: {email}")
    print(f"  Name: {user.get_full_name() or 'N/A'}")


if __name__ == '__main__':
    main()