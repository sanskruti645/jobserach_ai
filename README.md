# JobCipher - AI-Powered Job Aggregation Platform

## 📖 What Does JobCipher Do?

JobCipher is an intelligent job search platform that aggregates job listings from **LinkedIn, Naukri, Indeed, and Careerjet** into a single interface. It uses AI to analyze your resume, extract your skills, and automatically find matching jobs across all platforms.

**Key Features:**
- 🤖 AI-powered resume analysis using Groq/LLaMA
- 🔗 Scrapes 4 major job portals simultaneously
- 🎯 Smart job matching based on skills and preferences
- 📧 Automated email alerts for new jobs
- 💾 Cloud storage with AWS DynamoDB
- 🎨 Modern React dashboard

---

## 🏗️ How It Works

### Architecture Overview

```
User Interface (React)
        ↓
Backend (Python)
        ↓
┌────────┬────────┬────────┬────────┐
│LinkedIn│ Naukri │ Indeed │Careerjet│ (Scrapers)
└────────┴────────┴────────┴────────┘
        ↓
AWS (DynamoDB + S3)
```

### Process Flow

**1. Resume Analysis**
- User uploads PDF resume
- Groq AI (LLaMA 3) extracts skills, experience, and location
- System generates search parameters

**2. Multi-Platform Scraping**
- Four scrapers run in parallel (threading)
- **LinkedIn**: HTTP requests + BeautifulSoup parsing
- **Naukri**: Selenium for dynamic content + salary filters
- **Indeed**: Headless Chrome + date filters
- **Careerjet**: API-style scraping + radius search

**3. Data Processing**
- Aggregates all results
- Removes duplicates (by title, company, location)
- AI scores each job based on match percentage
- Ranks by relevance

**4. Display & Storage**
- Shows results in React dashboard
- Stores user data in DynamoDB
- Sends email alerts for new matches

---

## 🔧 Technical Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Vite + React Query

**Backend:**
- Python 3.8+
- Selenium + BeautifulSoup4
- Threading for parallel scraping

**AI/ML:**
- Groq API (LLaMA 3 70B)
- Skill extraction from resumes
- Job matching algorithm

**Cloud:**
- AWS DynamoDB (user data)
- AWS S3 (resume storage)
- AWS EC2 (hosting)
- Supabase (auth)

---

## � Project Structure

```
jobsearch_ai/
├── jobsearch/
│   ├── jobcipherbackend/
│   │   └── JobCipher/
│   │       ├── aws_deplyable.py                 # AWS Lambda deployment
│   │       ├── dynamo_db_store.py              # DynamoDB operations
│   │       ├── fetch_from_aws.py               # Retrieve stored data
│   │       ├── indeed.py                       # Indeed scraper
│   │       ├── linkedin.py                     # LinkedIn scraper
│   │       ├── naukri_selenium.py              # Naukri Selenium scraper
│   │       ├── naukri.py                       # Naukri API scraper
│   │       ├── test_resume_and_job_fetch_combine.py  # Integration tests
│   │       │
│   │       ├── careerjet/                      # Careerjet scraper module
│   │       │   ├── main.py
│   │       │   ├── real_time_main.py
│   │       │   └── url_generator.py
│   │       │
│   │       ├── groq_extracter/                 # AI Resume Parser
│   │       │   ├── skill_extracter.py          # Extract skills from resume
│   │       │   ├── text_extraction.py          # PDF text extraction
│   │       │   ├── aws_skill.py                # AWS integration
│   │       │   └── fetch_skills_from_aws.py
│   │       │
│   │       ├── Indeed/                         # Indeed scraper components
│   │       │   ├── Indeed_job_scraper.py
│   │       │   ├── Indeed_url_generator.py
│   │       │   ├── indeed.py
│   │       │   └── Ineed_driver_setup.py
│   │       │
│   │       ├── Job_alert/                      # Email alerts system
│   │       │   ├── job_alerts.py
│   │       │   ├── sending_emails.py
│   │       │   ├── dyanmodb_data_for_alerts.py
│   │       │   └── aws_credentials.py
│   │       │
│   │       ├── Linkedin/                       # LinkedIn scraper components
│   │       │   ├── linkedin_job_fetcher.py
│   │       │   ├── linkedin_job_parser.py
│   │       │   ├── linkedin_url_generator.py
│   │       │   └── linkedin.py
│   │       │
│   │       ├── Naukri/                         # Naukri scraper components
│   │       │   ├── Naukri_link_parser.py
│   │       │   ├── Naukri_selenium_customiser.py
│   │       │   └── naukri_selenium.py
│   │       │
│   │       ├── reviews_using_gemini/           # Company review analysis
│   │       ├── merged_website/                 # Static website version
│   │       └── Website_with_careerjet/         # Frontend prototype
│   │
│   └── jobsearchweb/                           # React Frontend
│       ├── package.json                        # Dependencies
│       ├── vite.config.ts                      # Vite configuration
│       ├── tailwind.config.ts                  # Tailwind CSS config
│       ├── next.config.js                      # Next.js config
│       ├── vercel.json                         # Vercel deployment
│       │
│       ├── src/
│       │   ├── App.tsx                         # Main app component
│       │   ├── main.tsx                        # Entry point
│       │   ├── config.ts                       # App configuration
│       │   ├── pages/                          # Page components
│       │   ├── components/                     # Reusable UI components
│       │   ├── services/                       # API services
│       │   ├── hooks/                          # React hooks
│       │   ├── integrations/                   # Third-party integrations
│       │   ├── lib/                            # Utility libraries
│       │   ├── utils/                          # Helper functions
│       │   └── themes/                         # UI themes
│       │
│       ├── supabase/                           # Supabase configuration
│       │   └── config.toml
│       │
│       └── public/                             # Static assets
│
├── README.md                                   # Original documentation
└── README_NEW.md                               # This file
```


## 📊 Data Flow

```
Resume Upload → AI Extraction → Build Search Query
                                        ↓
                    ┌───────────────────┴───────────────────┐
                    │                                       │
            [LinkedIn][Naukri][Indeed][Careerjet] (Parallel Scraping)
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        ↓
                        Aggregate + Deduplicate
                                        ↓
                            AI Match Scoring
                                        ↓
                        Store in DynamoDB
                                        ↓
                        Display in Dashboard
```

---

## 🎯 Core Components

### 1. **AI Resume Parser**
- Extracts skills, experience, location from PDF
- Uses Groq's LLaMA 3 model
- Returns structured JSON data

### 2. **Web Scrapers**
- **LinkedIn**: Scrapes job cards, company info, links
- **Naukri**: Handles CTC filters, experience levels
- **Indeed**: Date-based filtering, location search
- **Careerjet**: Radius search, company filtering

### 3. **Matching Algorithm**
```
Match Score = (Skills × 40%) + (Experience × 25%) + 
              (Location × 20%) + (Salary × 15%)
```

### 4. **Job Alerts**
- Scheduled checks every 6 hours
- Emails users with new matching jobs
- CSV attachments with job details

---

## 🚀 Deployment

```
Frontend: Vercel
    ↓
Backend: AWS EC2 (Python server)
    ↓
Data: DynamoDB + S3
```

---

## 💡 Why JobCipher?

**Problem:** Job seekers waste hours visiting multiple websites, manually filtering thousands of listings.

**Solution:** JobCipher automates everything:
- ✅ One upload instead of multiple profiles
- ✅ Search 4 platforms in seconds
- ✅ AI matches best jobs for you
- ✅ Get alerts for new opportunities
- ✅ All results in one dashboard

**Tech Highlight:** Uses threading to scrape all platforms simultaneously, reducing search time from ~5 minutes to ~30 seconds.

---

## 📝 Summary

JobCipher = **AI Resume Analysis** + **Multi-Platform Scraping** + **Smart Matching**

- Upload resume → AI extracts your profile
- System searches LinkedIn, Naukri, Indeed, Careerjet in parallel
- AI ranks jobs by match percentage
- View all results in one place
- Get automated alerts for new jobs

**Tech:** React + Python + Selenium + Groq AI + AWS
