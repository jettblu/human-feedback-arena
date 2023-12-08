from google.cloud import storage

# uploads file form local computer to google bucket

bucket_name = "snake-ai"
credentials_path = "backend/snake/serviceAccountCredentialsForRLHF.json"


def uploadFile(fileName, bucket_name=bucket_name):
    storage_client = storage.Client.from_service_account_json(
        json_credentials_path=credentials_path)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(fileName)
    blob.upload_from_filename(fileName)
    print("File uploaded to {}.".format(fileName))


def get_file_url(fileName, bucket_name=bucket_name):
    return "https://storage.googleapis.com/{}/{}".format(bucket_name, fileName)
