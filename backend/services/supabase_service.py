from dotenv import load_dotenv
load_dotenv()

"""
Supabase client initialization — uses service key for backend operations.
"""

import os
from supabase import create_client, Client

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")


def get_supabase() -> Client:
    """Return a Supabase client using the service-role key."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


supabase: Client = get_supabase()
