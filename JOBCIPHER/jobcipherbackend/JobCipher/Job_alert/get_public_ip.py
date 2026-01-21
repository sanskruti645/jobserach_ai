import boto3
from botocore.exceptions import NoCredentialsError, NoRegionError, ClientError



def get_public_ip(instance_id, region, access_key, secret_key):
    public_ip = None  # Initialize to None by default
    
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

    except NoRegionError:
        print("❌ AWS region not specified.")
    except NoCredentialsError:
        print("❌ AWS credentials not found.")
    except ClientError as e:
        print(f"❌ AWS Client Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        
    # Debug print to verify what's being returned
    print(f"DEBUG - Returning IP: {public_ip}")
    
    # Make sure this return is outside all try/except blocks
    return public_ip