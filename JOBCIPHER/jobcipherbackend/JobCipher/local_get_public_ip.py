import boto3
from botocore.exceptions import NoCredentialsError, NoRegionError, ClientError

# === Your AWS credentials and settings ===
AWS_ACCESS_KEY = 'your_key'
AWS_SECRET_KEY = 'secret_key'
REGION = 'ap-south-1'
INSTANCE_ID = 'i-id'

def get_ip(instance_id, region, access_key, secret_key):
    try:
        ec2 = boto3.client(
            'ec2',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )

        response = ec2.describe_instances(InstanceIds=[instance_id])

        public_ip = response['Reservations'][0]['Instances'][0].get('PublicIpAddress')

        if public_ip:
            print(f"Public IP address of instance {instance_id}: {public_ip}")            
        else:
            print(f"Instance {instance_id} does not have a public IP address.")
        return public_ip
    except NoRegionError:
        print("❌ AWS region not specified.")
    except NoCredentialsError:
        print("❌ AWS credentials not found.")
    except ClientError as e:
        print(f"❌ AWS Client Error: {e}")
    

