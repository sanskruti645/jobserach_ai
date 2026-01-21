# import time
# import schedule
# import requests
# from datetime import datetime
# from sending_emails import send_email_with_job_tiles
# from dyanmodb_data_for_alerts import get_all_subscriptions
# from aws_credentials import get_aws_credentials
# from get_public_ip import get_public_ip
# import logging

# # Set up logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler("job_alerts.log"),
#         logging.StreamHandler()
#     ]
# )
# logger = logging.getLogger(__name__)

# def send_to_ec2_and_get_csv(keyword, location, ec2_url):
#     """Send job search request to EC2 instance and get CSV data back"""
#     try:
#         job_data = {
#             "name": "by job alert",
#             "college": "by job alert",
#             "branch": "by job alert",
#             "keyword": keyword,
#             "location": location,
#             "experience": 1,
#             "job_type": "fulltime",
#             "remote": "on-site",
#             "date_posted": "1 week",
#             "company": "",
#             "industry": "",
#             "ctc_filters": "",
#             "radius": "10",
#             "Job_Alert": True
#         }

#         logger.info(f"Sending request to EC2 for keyword: {keyword}, location: {location}")
#         response = requests.post(ec2_url, json=job_data)

#         if response.status_code == 200:
#             try:
#                 return True, response.json()  # return raw CSVs
#             except Exception as e:
#                 logger.error(f"Failed to parse EC2 response: {e}")
#                 return False, None
#         else:
#             logger.error(f"EC2 returned status code: {response.status_code}")
#             return False, None
#     except Exception as e:
#         logger.error(f"Exception when sending to EC2: {e}")
#         return False, None

# def process_job_alerts():
#     """Process all job alerts in DynamoDB and send emails"""
#     try:
#         logger.info("Starting job alerts processing")
        
#         # Get AWS credentials and EC2 details
#         aws_creds = get_aws_credentials()
#         access, secret, region, instance_id = aws_creds
#         table_name = 'Job_Alerts'
        
#         # Get public IP of EC2 instance
#         public_ip = get_public_ip(instance_id, region, access, secret)
#         ec2_url = f"http://{public_ip}:5000/job-search"
        
#         # Email configuration
#         email_user = 'fortestingpurpose4742@gmail.com'
#         app_password = 'cwqu wczo sbpr ehsr'
        
#         # Get all subscriptions from DynamoDB
#         subscriptions = get_all_subscriptions(aws_creds, table_name)
#         logger.info(f"Retrieved {len(subscriptions)} subscriptions from DynamoDB")
        
#         # Process each subscription
#         for subscription in subscriptions:
#             keyword = subscription.get('keyword')
#             location = subscription.get('location')
#             email = subscription.get('email')
            
#             if not keyword or not location or not email:
#                 logger.warning(f"Skipping subscription with missing data: {subscription}")
#                 continue
                
#             logger.info(f"Processing subscription for {email}: {keyword} in {location}")
            
#             # Get job data from EC2
#             ec2_success, csv_data = send_to_ec2_and_get_csv(keyword, location, ec2_url)
#             if not ec2_success:
#                 logger.error(f"Failed to retrieve job data for {email}: {keyword} in {location}")
#                 continue
                
#             # Send email with job data
#             email_success = send_email_with_job_tiles(email, keyword, location, csv_data, email_user, app_password)
            
#             if email_success:
#                 logger.info(f"Successfully sent email to {email}")
#             else:
#                 logger.error(f"Failed to send email to {email}")
                
#         logger.info("Completed job alerts processing")
        
#     except Exception as e:
#         logger.error(f"Error in process_job_alerts: {e}")

# def run_scheduler():
#     """Run the scheduler to process job alerts every 24 hours"""
#     logger.info("Starting job alert scheduler")
    
#     # Schedule the job alert processing to run every 24 hours
#     schedule.every(24).hours.do(process_job_alerts)
    
#     # Also run immediately on startup
#     logger.info("Running initial job alert processing")
#     process_job_alerts()
    
#     # Keep the script running
#     while True:
#         schedule.run_pending()
#         time.sleep(60)  # Check every minute if there are pending tasks

# if __name__ == "__main__":
#     run_scheduler()



import time
import schedule
import requests
from datetime import datetime
from sending_emails import send_email_with_job_tiles
from dyanmodb_data_for_alerts import get_all_subscriptions
from aws_credentials import get_aws_credentials
from get_public_ip import get_public_ip
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("job_alerts.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def send_to_ec2_and_get_csv(keyword, location, ec2_url):
    """Send job search request to EC2 instance and get CSV data back"""
    try:
        job_data = {
            "name": "by job alert",
            "college": "by job alert",
            "branch": "by job alert",
            "keyword": keyword,
            "location": location,
            "experience": 1,
            "job_type": "fulltime",
            "remote": "on-site",
            "date_posted": "1 week",
            "company": "",
            "industry": "",
            "ctc_filters": "",
            "radius": "10",
            "Job_Alert": True
        }

        logger.info(f"Sending request to EC2 for keyword: {keyword}, location: {location}")
        response = requests.post(ec2_url, json=job_data)

        if response.status_code == 200:
            try:
                return True, response.json()  # return raw CSVs
            except Exception as e:
                logger.error(f"Failed to parse EC2 response: {e}")
                return False, None
        else:
            logger.error(f"EC2 returned status code: {response.status_code}")
            return False, None
    except Exception as e:
        logger.error(f"Exception when sending to EC2: {e}")
        return False, None

def process_job_alerts():
    """Process all job alerts in DynamoDB and send emails"""
    try:
        logger.info("Starting job alerts processing")
        
        # Get AWS credentials and EC2 details
        aws_creds = get_aws_credentials()
        access, secret, region, instance_id = aws_creds
        table_name = 'Job_Alerts'
        
        # Get public IP of EC2 instance
        public_ip = get_public_ip(instance_id, region, access, secret)
        ec2_url = f"http://{public_ip}:5000/job-search"
        
        # Email configuration
        email_user = 'fortestingpurpose4742@gmail.com'
        app_password = 'hello'
        
        # Get all subscriptions from DynamoDB
        subscriptions = get_all_subscriptions(aws_creds, table_name)
        logger.info(f"Retrieved {len(subscriptions)} subscriptions from DynamoDB")
        
        # Process each subscription
        for subscription in subscriptions:
            keyword = subscription.get('keyword')
            location = subscription.get('location')
            email = subscription.get('email')
            
            if not keyword or not location or not email:
                logger.warning(f"Skipping subscription with missing data: {subscription}")
                continue
                
            logger.info(f"Processing subscription for {email}: {keyword} in {location}")
            
            # Get job data from EC2
            ec2_success, csv_data = send_to_ec2_and_get_csv(keyword, location, ec2_url)
            if not ec2_success:
                logger.error(f"Failed to retrieve job data for {email}: {keyword} in {location}")
                continue
                
            # Send email with job data
            email_success = send_email_with_job_tiles(email, keyword, location, csv_data, email_user, app_password)
            
            if email_success:
                logger.info(f"Successfully sent email to {email}")
            else:
                logger.error(f"Failed to send email to {email}")
                
        logger.info("Completed job alerts processing")
        
    except Exception as e:
        logger.error(f"Error in process_job_alerts: {e}")

def run_scheduler():
    """Run the scheduler to process job alerts at 12:00 PM every day"""
    logger.info("Starting job alert scheduler")
    
    # Schedule the job alert processing to run at 12:00 PM every day
    # schedule.every().day.at("12:00").do(process_job_alerts)
    
    # Schedule the job alert processing to run every selected hours
    schedule.every(4).hours.do(process_job_alerts)
    
    
#     # Also run immediately on startup
    logger.info("Running initial job alert processing")
    process_job_alerts()
    # Log next scheduled run
    next_run = schedule.next_run()
    logger.info(f"Next job alert processing scheduled for: {next_run}")
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute if there are pending tasks

if __name__ == "__main__":
    run_scheduler()