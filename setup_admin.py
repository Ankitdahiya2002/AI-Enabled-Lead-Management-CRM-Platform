#!/usr/bin/env python3
"""
TFU CRM — Setup Helper
Run this ONCE to create the first admin user in Supabase.
Usage: python setup_admin.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

from supabase_client import supabase_admin

def create_admin():
    print("=" * 50)
    print("  TFU CRM — Admin Setup")
    print("=" * 50)

    name  = input("Admin full name: ").strip()
    email = input("Admin email: ").strip()
    pwd   = input("Admin password (min 8 chars): ").strip()

    if not all([name, email, pwd]):
        print("❌ All fields are required.")
        return

    if len(pwd) < 8:
        print("❌ Password must be at least 8 characters.")
        return

    try:
        print("\n⏳ Creating auth user in Supabase...")
        auth_resp = supabase_admin.auth.admin.create_user({
            "email": email,
            "password": pwd,
            "email_confirm": True,
        })
        user_id = str(auth_resp.user.id)
        print(f"✅ Auth user created: {user_id}")

        print("⏳ Inserting profile...")
        supabase_admin.table('profiles').insert({
            'id': user_id,
            'name': name,
            'email': email,
            'role': 'admin',
        }).execute()

        print(f"\n✅ Admin created successfully!")
        print(f"   Name:  {name}")
        print(f"   Email: {email}")
        print(f"   Role:  admin")
        print(f"\n👉 You can now log in at http://localhost:5000")

    except Exception as e:
        error_str = str(e)
        if 'already been registered' in error_str or 'already exists' in error_str:
            print(f"⚠️  Email {email} already registered. Checking profile...")
            try:
                # Try to find existing user and create profile
                users_resp = supabase_admin.auth.admin.list_users()
                existing = next((u for u in users_resp if u.email == email), None)
                if existing:
                    supabase_admin.table('profiles').upsert({
                        'id': str(existing.id),
                        'name': name,
                        'email': email,
                        'role': 'admin',
                    }).execute()
                    print(f"✅ Profile created/updated for existing user.")
                    print(f"👉 Log in at http://localhost:5000")
            except Exception as e2:
                print(f"❌ Error: {e2}")
        else:
            print(f"❌ Error creating admin: {e}")

if __name__ == '__main__':
    create_admin()
