import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Use absolute path so .env is always found regardless of working directory
_ENV_PATH = Path(__file__).parent / '.env'
load_dotenv(_ENV_PATH)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Public client (uses anon key — respects RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Admin client (uses service role key — bypasses RLS for admin operations)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
