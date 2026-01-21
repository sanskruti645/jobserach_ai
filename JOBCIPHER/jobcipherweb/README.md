# JobCipher 🔍

> Your AI-Powered Career Companion - Simplifying Job Search Across Multiple Platforms

JobCipher is a comprehensive full-stack job aggregation platform that intelligently scrapes and aggregates job listings from multiple job portals including LinkedIn, Naukri, Indeed, and Careerjet. The platform uses AI to match job seekers with relevant opportunities based on their resumes and preferences.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)

## 🌟 Features

### Core Functionality
- **🤖 AI-Powered Resume Analysis**: Extract skills and experience from resumes using Groq/LLaMA models
- **🔗 Multi-Platform Job Scraping**: Aggregate jobs from LinkedIn, Naukri, Indeed, and Careerjet
- **🎯 Smart Job Matching**: Intelligent matching based on skills, location, experience, and preferences
- **📧 Job Alerts**: Automated email notifications for new matching job postings
- **💾 Cloud Storage**: DynamoDB integration for scalable data storage
- **🎨 Modern UI**: Responsive React-based frontend with Tailwind CSS and shadcn/ui components
- **🔐 Secure Authentication**: User authentication and profile management
- **📊 Dashboard**: Personalized job search dashboard with filters and preferences

### Advanced Features
- Real-time job scraping with Selenium
- Customizable search filters (location, experience, salary, job type, remote/hybrid/on-site)
- AWS deployment ready with EC2 integration
- Company and industry-specific filtering
- Date-posted filters for fresh job listings
- Radius-based location search

## 🏗️ Project Structure

```
JOBCIPHER/
├── jobcipherbackend/          # Python backend services
│   └── JobCipher/
│       ├── Linkedin/          # LinkedIn scraper module
│       ├── Naukri/            # Naukri scraper module
│       ├── Indeed/            # Indeed scraper module
│       ├── careerjet/         # Careerjet scraper module
│       ├── groq_extracter/    # AI-powered resume skill extraction
│       ├── Job_alert/         # Email alert system
│       ├── dynamo_db_store.py # AWS DynamoDB integration
│       └── aws_deplyable.py   # AWS deployment script
│
└── jobcipherweb/              # React TypeScript frontend
    ├── src/
    │   ├── pages/             # Application pages
    │   ├── components/        # Reusable UI components
    │   ├── services/          # API services
    │   └── themes/            # UI themes
    └── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

**Frontend:**
- Node.js 16.x or higher
- npm or yarn or bun

**Backend:**
- Python 3.8+
- pip
- Chrome/Chromium browser (for Selenium)

### Installation

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd JOBCIPHER
```

#### 2. Frontend Setup
```bash
cd jobcipherweb
npm install
# or
bun install
```

#### 3. Backend Setup
```bash
cd jobcipherbackend/JobCipher
pip install -r requirements.txt
```

**Required Python packages:**
```
selenium
beautifulsoup4
requests
boto3
groq
webdriver-manager
tabulate
pytz
```

#### 4. Environment Configuration

**Backend - AWS Credentials:**

Update the following files with your AWS credentials:
- `dynamo_db_store.py`
- `local_get_public_ip.py`
- `Job_alert/aws_credentials.py`

```python
AWS_ACCESS_KEY = "your_access_key"
AWS_SECRET_KEY = "your_secret_key"
AWS_REGION = "ap-south-1"
```

**Backend - Groq API:**

Update `groq_extracter/skill_extracter.py`:
```python
api_key = 'your_groq_api_key'
```

**Frontend - API Configuration:**

Update `src/config.ts` or relevant service files with your backend API endpoint.

### 🏃 Running the Application

#### Development Mode

**Frontend:**
```bash
cd jobcipherweb
npm run dev
# Application will run on http://localhost:5173
```

**Backend (AWS Deployable):**
```bash
cd jobcipherbackend/JobCipher
python aws_deplyable.py
```

**Backend (Job Alerts):**
```bash
cd jobcipherbackend/JobCipher/Job_alert
python job_alerts.py
```

#### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.x
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Material-UI
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Backend Integration**: Supabase, AWS SDK

### Backend
- **Language**: Python 3.8+
- **Web Scraping**: Selenium, BeautifulSoup4
- **AI/ML**: Groq (LLaMA 3), Gemini
- **Cloud Services**: AWS (DynamoDB, EC2)
- **Data Processing**: pandas, PyPDF2
- **HTTP Client**: requests
- **Automation**: schedule (for job alerts)

### Infrastructure
- **Database**: AWS DynamoDB
- **Hosting**: AWS EC2
- **Storage**: AWS S3 (for resume files)
- **Email Service**: SMTP (for job alerts)

## 📋 Key Modules

### Job Scrapers

#### LinkedIn Scraper (`Linkedin/linkedin.py`)
- Scrapes job listings from LinkedIn
- Filters by experience, job type, remote work, company, industry
- Extracts detailed job information including company links

#### Naukri Scraper (`Naukri/naukri_selenium.py`)
- Selenium-based scraping for Naukri.com
- CTC (salary) filtering
- Location-based and experience-based filtering
- Custom URL generation

#### Indeed Scraper (`Indeed/indeed.py`)
- Headless Chrome scraping for Indeed India
- Date-posted filters
- Location and keyword-based search

#### Careerjet Scraper (`careerjet/real_time_main.py`)
- Real-time job aggregation from Careerjet
- Radius-based location search
- Company and contract type filtering

### AI Resume Parser
- **Module**: `groq_extracter/skill_extracter.py`
- Extracts skills, location, and experience from PDF resumes
- Uses Groq's LLaMA 3 70B model
- Returns structured skill data for job matching

### Job Alerts System
- **Module**: `Job_alert/job_alerts.py`
- Scheduled job alerts via email
- DynamoDB integration for user subscriptions
- Automated CSV generation and email delivery

## 🔧 Configuration

### Job Search Parameters

The platform supports extensive filtering options:

```python
{
    "keyword": "python developer",
    "location": "India",
    "experience": 2,
    "job_type": "fulltime",
    "remote": "on-site",  # on-site, hybrid, remote
    "date_posted": "1 week",  # 24 hours, 1 week, 1 month
    "company": "",  # Optional company filter
    "industry": "Software",
    "ctc_filters": "5-10,10-15",  # Salary ranges in LPA
    "radius": "10"  # Search radius in km
}
```

## 🌐 API Endpoints

### Job Search
```
POST /job-search
```

**Request Body:**
```json
{
  "name": "User Name",
  "college": "College Name",
  "branch": "Branch",
  "keyword": "software engineer",
  "location": "Bangalore",
  "experience": 2,
  "job_type": "fulltime",
  "remote": "hybrid",
  "date_posted": "1 week",
  "company": "",
  "industry": "Technology",
  "ctc_filters": "8-15",
  "radius": "25"
}
```

## 📊 Database Schema (DynamoDB)

### Job_Cipher_Users Table
- `User_id` (Primary Key): UUID
- `name`: User name
- `branch`: Educational branch
- `college`: College/University name
- `keyword`: Job search keywords
- `created_at`: ISO timestamp

## 🚀 Deployment

### AWS EC2 Deployment

1. Launch an EC2 instance (Ubuntu/Amazon Linux)
2. Install Python and dependencies
3. Install Chrome and ChromeDriver
4. Configure security groups to allow traffic on port 5000
5. Update `aws_deplyable.py` with production settings
6. Run the Flask/FastAPI server

```bash
# Install Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb

# Install ChromeDriver
pip install webdriver-manager
```

### Frontend Deployment

Deploy to Vercel (recommended):
```bash
npm run build
vercel deploy
```

Or deploy to Netlify, AWS Amplify, or any static hosting service.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues & Limitations

- Web scraping may break if job portal HTML structures change
- Rate limiting may occur with excessive requests
- Some features require AWS credentials and Groq API keys
- Selenium-based scrapers require Chrome/Chromium

## 🔮 Future Enhancements

- [ ] Add more job portals (Monster, Glassdoor, etc.)
- [ ] Implement machine learning for better job matching
- [ ] Add mobile application (React Native)
- [ ] Real-time notifications via WebSocket
- [ ] Advanced analytics dashboard
- [ ] Resume builder and optimizer
- [ ] Interview preparation resources
- [ ] Application tracking system
- [ ] Salary insights and trends

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- Groq for AI inference
- AWS for cloud infrastructure
- All job portals for providing valuable job data

## 📧 Contact

For questions or support, please open an issue on GitHub or contact [your-email@example.com]

---

**⭐ Star this repository if you find it helpful!**
