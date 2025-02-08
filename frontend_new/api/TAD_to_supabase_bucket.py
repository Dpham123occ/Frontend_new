import os
import urllib.request
from supabase import create_client, Client

VITE_SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
VITE_SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")

file_key = "Parcels_GeoDatabase.zip"
file_url = "https://www.tad.org/content/gis-data/Parcels_GeoDatabase.zip"

# Initialize Supabase client
supabase: Client = create_client(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)


def handler(request):
    try:
        # Download the file
        req = urllib.request.Request(file_url)
        with urllib.request.urlopen(req) as response:
            file_data = response.read()

        # Upload to Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).upload(file_key, file_data)

        # Check if the upload was successful
        if response:
            return {
                "statusCode": 200,
                "body": f"File successfully uploaded to Supabase bucket: {BUCKET_NAME}/{file_key}."
            }
        else:
            return {
                "statusCode": 500,
                "bodyCode": "Upload to Supabase failed."
            }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }