from email.mime.text import MIMEText
import smtplib
from email.mime.multipart import MIMEMultipart
import csv
import io
from email.mime.application import MIMEApplication

def extract_top_results(csv_content, n=5):
    """Extract top n rows from a CSV content string."""
    try:
        csv_file = io.StringIO(csv_content)
        csv_reader = csv.reader(csv_file)
        
        # Get headers and top n rows
        headers = next(csv_reader)
        top_rows = []
        for i, row in enumerate(csv_reader):
            if i < n:
                top_rows.append(row)
            else:
                break
                
        return headers, top_rows
    except Exception as e:
        print(f"Error extracting CSV data: {e}")
        return [], []

def format_job_tile_html(job_row, headers, source):
    """Format a single job as an HTML tile based on the source format (LinkedIn or Naukri)."""
    # Create a dictionary of header:value pairs for easier access
    job_data = dict(zip(headers, job_row))
    
    # Extract data based on the source format
    if source.lower() == 'linkedin':
        title = job_data.get('Job Title', 'Position')
        company = job_data.get('Company', 'Company Name')
        company_link = job_data.get('Company Link', '#')
        location = job_data.get('Location', 'Location')
        time_posted = job_data.get('Time Posted', '')
        job_link = job_data.get('Job Posting Link', '#')
        
        # Additional info to display
        additional_info = f"Posted: {time_posted}" if time_posted else ""
        
    elif source.lower() == 'naukri':
        title = job_data.get('Job Title', 'Position')
        company = job_data.get('Company Name', 'Company')
        rating = job_data.get('Rating', '')
        experience = job_data.get('Experience', '')
        location = job_data.get('Location', 'Location')
        tech_stack = job_data.get('Tech Stack', '')
        job_link = job_data.get('Job link', '#')
        company_link = '#'  # Naukri doesn't have company link in the headers
        
        # Additional info to display
        additional_info_parts = []
        if rating:
            additional_info_parts.append(f"Rating: {rating}")
        if experience:
            additional_info_parts.append(f"Experience: {experience}")
        if tech_stack:
            additional_info_parts.append(f"Skills: {tech_stack}")
        additional_info = " • ".join(additional_info_parts)
        
    else:
        # Generic fallback
        title = job_data.get('title', job_data.get('Job Title', 'Position'))
        company = job_data.get('company', job_data.get('Company', job_data.get('Company Name', 'Company')))
        location = job_data.get('location', job_data.get('Location', 'Location'))
        job_link = job_data.get('link', job_data.get('url', job_data.get('Job link', job_data.get('Job Posting Link', '#'))))
        company_link = '#'
        additional_info = ""
    
    # HTML for a single job tile
    job_tile = f"""
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <div style="font-size: 18px; font-weight: bold; color: #0a66c2; margin-bottom: 8px;">{title}</div>
        <div style="font-size: 16px; margin-bottom: 4px;">
            <a href="{company_link}" style="color: #0a66c2; text-decoration: none; font-weight: 500;">{company}</a>
        </div>
        <div style="color: #666666; margin-bottom: 8px;">{location}</div>
        {f'<div style="color: #666666; font-size: 14px; margin-bottom: 16px;">{additional_info}</div>' if additional_info else ''}
        <a href="{job_link}" style="background-color: #0a66c2; color: white; padding: 8px 16px; text-decoration: none; border-radius: 24px; display: inline-block; font-weight: 600;">Apply Now</a>
    </div>
    """
    return job_tile

def send_email_with_job_tiles(recipient_email, keyword, location, csv_data, email_user, app_password):
    """Send an HTML email using Gmail with job listing tiles similar to LinkedIn."""
    try:
        # Create message
        message = MIMEMultipart('alternative')
        message['From'] = "JOBCIPHER <{}>".format(email_user)  # Display name "JOBCIPHER" with email in brackets
        message["To"] = recipient_email
        message["Subject"] = f"Job Alerts: {keyword} in {location}"
        
        # Start building HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; background-color: #f3f2ef; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; }}
                .linkedin-logo {{ width: 80px; margin-bottom: 15px; }}
                .jobs-section {{ background-color: #ffffff; border-radius: 8px; padding: 20px; margin-top: 20px; }}
                .section-title {{ font-size: 18px; font-weight: 600; margin-bottom: 16px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background-color: white; padding: 20px; border-radius: 8px;">
                    <h1 style="color: #0a66c2; margin-bottom: 5px;">Job Alerts</h1>
                    <p style="color: #666;">Your personalized matches for <strong>{keyword}</strong> in <strong>{location}</strong></p>
                </div>
        """
        
        # Add job tiles for each CSV file
        for csv_name, csv_content in csv_data.items():
            headers, top_rows = extract_top_results(csv_content)
            
            if headers and top_rows:
                # Determine the source based on CSV name or headers
                source = 'linkedin' if 'linkedin' in csv_name.lower() or 'Company Link' in headers else 'naukri' if 'naukri' in csv_name.lower() or 'Rating' in headers else 'unknown'
                
                html_content += f"""
                <div class="jobs-section">
                    <div class="section-title">Top matches from {csv_name.replace('.csv', '').title()}</div>
                """
                
                # Add each job as a tile
                for row in top_rows:
                    html_content += format_job_tile_html(row, headers, source)
                
                html_content += "</div>"
        
        # Close the HTML
        html_content += """
                <div class="footer">
                    <p>You received this email because you set up job alerts.<br>
                    To manage your alerts or unsubscribe, click <a href="#" style="color: #0a66c2;">here</a>.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version as fallback
        plain_text = f"""
        Job Alerts for {keyword} in {location}
        
        Here are your top job matches. To view details and apply, please view this email in an HTML email client.
        """
        
        # Attach both versions to the email
        message.attach(MIMEText(plain_text, 'plain'))
        message.attach(MIMEText(html_content, 'html'))
        
        # Send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            print("Attempting to log in to Gmail...")
            server.login(email_user, app_password)
            print("Login successful!")
            server.send_message(message)

        print("✅ HTML job alert email sent successfully!")
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        if hasattr(e, 'smtp_code'):
            print(f"SMTP Code: {e.smtp_code}")
        if hasattr(e, 'smtp_error'):
            print(f"SMTP Error: {e.smtp_error}")
        return False