import { PROXY_OPTIONS } from "@/config";
import { logMessage } from "@/utils/logger";

// Store current jobs from CareerJet
let currentCareerJetJobs: any[] = [];

// Function to generate CareerJet URL
function generateCareerjetUrl(
  keyword = "",
  location = "",
  contractType = "",
  workingHours = "",
  company = "",
  datePosted = "",
  radius = ""
): string {
  const baseUrl = "https://www.careerjet.co.in/jobs?";

  // Convert all inputs to lowercase
  keyword = keyword.toLowerCase();
  location = location.toLowerCase();
  contractType = contractType.toLowerCase();
  workingHours = workingHours.toLowerCase();
  company = company.toLowerCase();
  datePosted = datePosted.toLowerCase();
  radius = "25";

  // Mapping based on provided values
  const contractTypeMap: Record<string, string> = { internship: "i", contract: "c", permanent: "p" };
  const workingHoursMap: Record<string, string> = { "full-time": "f", "part-time": "p" };
  const datePostedMap: Record<string, string> = { "24 hours": "1", "1 week": "7", "1 month": "30" };

  // Convert user input to corresponding values
  contractType = contractTypeMap[contractType] || "";
  workingHours = workingHoursMap[workingHours] || "";
  datePosted = datePostedMap[datePosted] || "";

  // Replace spaces in keyword with "+"
  keyword = keyword.replace(/ /g, "+");

  // Parameters dictionary
  const params = {
    s: keyword,
    l: location,
    ct: contractType,
    cp: workingHours,
    cmp: company,
    nw: datePosted,
    radius: radius,
  };

  // Build query string
  const queryString = Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return baseUrl + queryString;
}

// Function to search CareerJet jobs
async function searchCareerJetJobs(keyword: string, location: string, radius = "10"): Promise<any[]> {
  const careerjetListings = document.getElementById("careerjet-listings");
  const careerjetCount = document.getElementById("careerjet-count");

  if (!careerjetListings) return []; // Exit if CareerJet elements don't exist

  careerjetListings.innerHTML = "";
  if (careerjetCount) careerjetCount.innerHTML = "";

  // Generate CareerJet URL
  const targetUrl = generateCareerjetUrl(keyword, location, "", "", "", "", radius);
  logMessage(`Generated URL: ${targetUrl}`);

  // Try each proxy in sequence
  for (const proxy of PROXY_OPTIONS) {
    try {
      const url = proxy.url ? `${proxy.url}${encodeURIComponent(targetUrl)}` : targetUrl;
      logMessage(`Requesting: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/html",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      logMessage(`Received ${html.length} bytes of HTML`);

      // Parse the HTML and extract job listings
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const jobElements = doc.querySelectorAll("article.job.clicky");
      logMessage(`Found ${jobElements.length} job elements`);

      if (jobElements.length > 0) {
        const extractedJobs = Array.from(jobElements).map((job) => {
          const titleElement = job.querySelector("h2 a");
          const companyElement = job.querySelector("p.company");
          const locationElement = job.querySelector("ul.location li");
          const summaryElement = job.querySelector("div.desc");

          return {
            title: titleElement?.textContent?.trim() || "N/A",
            company: companyElement?.textContent?.trim() || "N/A",
            location: locationElement?.textContent?.trim() || "N/A",
            summary: summaryElement?.textContent?.trim() || "N/A",
            url: titleElement?.getAttribute("href")?.startsWith("http")
              ? titleElement.getAttribute("href")
              : `https://www.careerjet.co.in${titleElement?.getAttribute("href")}`,
          };
        });

        currentCareerJetJobs = extractedJobs;
        return extractedJobs;
      }
    } catch (error) {
      logMessage(`Error with proxy ${proxy.name}: ${error.message}`);
    }
  }

  return [];
}

// Function to download CareerJet jobs as CSV
function downloadCSV(): void {
  if (currentCareerJetJobs.length === 0) return;

  const headers = ["Title", "Company", "Location", "Summary", "Job URL"];
  const csvContent =
    headers.join(",") +
    "\n" +
    currentCareerJetJobs
      .map((job) =>
        [
          `"${job.title.replace(/"/g, '""')}"`,
          `"${job.company.replace(/"/g, '""')}"`,
          `"${job.location.replace(/"/g, '""')}"`,
          `"${job.summary.replace(/"/g, '""')}"`,
          `"${job.url}"`,
        ].join(",")
      )
      .join("\n");

  const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `careerjet-jobs-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { searchCareerJetJobs, downloadCSV, currentCareerJetJobs };