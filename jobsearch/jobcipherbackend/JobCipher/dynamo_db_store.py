# Function to store user data in DynamoDB
from datetime import datetime
import uuid
import boto3
import pytz  
# AWS Credentials (Replace with your actual keys)
AWS_ACCESS_KEY = "your_acess_key"
AWS_SECRET_KEY = "your_secret_key"
AWS_REGION = "ap-south-1"  # Change this if needed

# Initialize DynamoDB resource with credentials
dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)



# Select table
table = dynamodb.Table("Job_Cipher_Users")
def store_user_data(keyword,name,college,branch):
    User_id = str(uuid.uuid4())  # Generate a unique ID
    ist = pytz.timezone("Asia/Kolkata")
    timestamp = datetime.now(ist).isoformat()  # IST timestamp
    try:
        table.put_item(
            Item={
                "User_id": User_id,  # Use the exact key name as in DynamoDB
                "name": name,
                "branch": branch,
                "college": college,
                "keyword": keyword,
                "created_at": timestamp,
            }
        )
        print("User data successfully added to DynamoDB!")
    except Exception as e:
        print(f"Error storing data in DynamoDB: {e}")
