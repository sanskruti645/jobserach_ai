import boto3
import uuid
from datetime import datetime
from botocore.exceptions import ClientError


def get_all_subscriptions(aws_creds, table_name):
    """Retrieve all job alert subscriptions from DynamoDB."""
    aws_access_key, aws_secret_key, aws_region, instance_id = aws_creds
    
    # Verify credentials
    if not aws_access_key or not aws_secret_key:
        print("❌ AWS credentials are missing or empty")
        return []
    
    try:
        print(f"Connecting to AWS DynamoDB in region {aws_region}...")
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource(
            'dynamodb',
            region_name=aws_region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        # Use the table
        table = dynamodb.Table(table_name)
        
        # Scan all items in the table
        print(f"Scanning table {table_name} for all subscriptions...")
        response = table.scan()
        items = response.get('Items', [])
        
        # Handle pagination if there are more than 1MB of results
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
        
        print(f"✅ Retrieved {len(items)} subscriptions from DynamoDB")
        return items
    
    except ClientError as e:
        print(f"❌ DynamoDB error when retrieving subscriptions: {e}")
        error_code = getattr(e, 'response', {}).get('Error', {}).get('Code')
        if error_code == 'InvalidSignatureException':
            print("   This is likely due to incorrect AWS credentials")
        return []
    except Exception as e:
        print(f"❌ Error when retrieving subscriptions: {e}")
        return []



    """Delete a subscription from DynamoDB by ID."""
    aws_access_key, aws_secret_key, aws_region, instance_id = aws_creds
    
    # Verify credentials
    if not aws_access_key or not aws_secret_key:
        print("❌ AWS credentials are missing or empty")
        return False
    
    try:
        print(f"Connecting to AWS DynamoDB in region {aws_region}...")
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource(
            'dynamodb',
            region_name=aws_region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        # Use the table
        table = dynamodb.Table(table_name)
        
        # Delete the item
        print(f"Deleting subscription with ID: {subscription_id}...")
        table.delete_item(
            Key={
                'User_id': subscription_id
            }
        )
        
        print(f"✅ Subscription with ID {subscription_id} deleted successfully")
        return True
    
    except ClientError as e:
        print(f"❌ DynamoDB error when deleting subscription: {e}")
        return False
    except Exception as e:
        print(f"❌ Error when deleting subscription: {e}")
        return False


    """Update an existing subscription in DynamoDB."""
    aws_access_key, aws_secret_key, aws_region, instance_id = aws_creds
    
    # Verify credentials
    if not aws_access_key or not aws_secret_key:
        print("❌ AWS credentials are missing or empty")
        return False
    
    try:
        print(f"Connecting to AWS DynamoDB in region {aws_region}...")
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource(
            'dynamodb',
            region_name=aws_region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        # Use the table
        table = dynamodb.Table(table_name)
        
        # Prepare update expression and attribute values
        update_expression = "SET "
        expression_attribute_values = {}
        
        for key, value in update_data.items():
            if key not in ['User_id']:  # Don't update the primary key
                update_expression += f"{key} = :{key.replace('-', '_')}, "
                expression_attribute_values[f":{key.replace('-', '_')}"] = value
        
        # Remove trailing comma and space
        update_expression = update_expression[:-2]
        
        # Add updated timestamp
        update_expression += ", updated_at = :updated_at"
        expression_attribute_values[":updated_at"] = datetime.now().isoformat()
        
        # Update the item
        print(f"Updating subscription with ID: {subscription_id}...")
        table.update_item(
            Key={
                'User_id': subscription_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        
        print(f"✅ Subscription with ID {subscription_id} updated successfully")
        return True
    
    except ClientError as e:
        print(f"❌ DynamoDB error when updating subscription: {e}")
        return False
    except Exception as e:
        print(f"❌ Error when updating subscription: {e}")
        return False