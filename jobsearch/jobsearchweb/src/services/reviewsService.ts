import { API_BASE_URL } from "@/config";

// Function to fetch and display company reviews
export async function getCompanyReviews(companyName: string): Promise<void> {
  if (!companyName.trim()) {
    alert("Please enter a company name for reviews.");
    return;
  }

  // Open a new tab and set up initial content
  const reviewTab = window.open("", "ReviewTab");
  if (!reviewTab) {
    alert("Unable to open a new tab. Please check your browser settings.");
    return;
  }
  reviewTab.document.open();
  reviewTab.document.write(`
    <html>
      <head>
        <title>Reviews for ${companyName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; max-width: 900px; margin: 0 auto; }
          h2 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          h3 { color: #2980b9; margin-top: 20px; }
          a { color: #27ae60; text-decoration: none; display: inline-block; margin-top: 10px; }
          a:hover { text-decoration: underline; }
          .review-source { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .loading { text-align: center; padding: 40px; color: #7f8c8d; }
          .error { color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="loading">Loading reviews for ${companyName}...</div>
      </body>
    </html>
  `);
  reviewTab.document.close();

  try {
    // Call your Flask API for reviews
    const response = await fetch(`${API_BASE_URL}:5002/get_reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name: companyName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (!data.review || typeof data.review !== "string") {
      reviewTab.document.body.innerHTML = "<h2 class='error'>Error: No review data found.</h2>";
      return;
    }

    // Parse review sources more reliably
    const reviewText = data.review;
    let htmlContent = `<h2>Reviews for ${companyName}</h2>`;

    // Parse sources using a more robust approach
    const sources = [
      { name: "AmbitionBox", regex: /AmbitionBox:(.*?)(?:Link:|$)/s },
      { name: "Glassdoor", regex: /Glassdoor:(.*?)(?:Link:|$)/s },
    ];

    // Extract links with a more flexible pattern that can handle both formats:
    // 1. Link: [text](url)
    // 2. Link: url
    const links: Record<string, string> = {};

    // First try to find markdown-style links: [text](url)
    const markdownLinkRegex = /Link:\s*\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
    let match;
    while ((match = markdownLinkRegex.exec(reviewText)) !== null) {
      links[match[1].toLowerCase()] = match[2];
    }

    // Then try to find plain URL links: Link: url
    const plainLinkRegex = /Link:\s*(https?:\/\/[^\s]+)/g;
    while ((match = plainLinkRegex.exec(reviewText)) !== null) {
      // For plain links, use the domain as the key
      const url = match[1];
      const domainMatch = url.match(/\/\/([^\/]+)/);
      if (domainMatch && domainMatch[1]) {
        const domain = domainMatch[1].replace("www.", "");
        links[domain] = url;
      }
    }

    // Process each review source
    sources.forEach((source) => {
      const contentMatch = reviewText.match(source.regex);
      if (contentMatch && contentMatch[1]) {
        const content = contentMatch[1].trim();

        // Find appropriate link
        let link = "";
        const sourceLower = source.name.toLowerCase();

        // First try exact match
        if (links[sourceLower]) {
          link = links[sourceLower];
        } else {
          // Then try partial match
          Object.keys(links).forEach((key) => {
            if (key.includes(sourceLower) || sourceLower.includes(key)) {
              link = links[key];
            }
          });
        }

        htmlContent += `
          <div class="review-source">
            <h3>${source.name}</h3>
            <p>${content}</p>
            ${link ? `<a href="${link}" target="_blank">Read more on ${source.name}</a>` : ""}
          </div>
        `;
      }
    });

    // Add a message if no reviews were found
    if (!htmlContent.includes("review-source")) {
      htmlContent += `<p>No structured review data found for ${companyName}.</p>`;
    }

    // Safely update content in the opened tab
    reviewTab.document.open();
    reviewTab.document.write(`
      <html>
        <head>
          <title>Reviews for ${companyName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; max-width: 900px; margin: 0 auto; }
            h2 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            h3 { color: #2980b9; margin-top: 20px; }
            a { color: #27ae60; text-decoration: none; display: inline-block; margin-top: 10px; }
            a:hover { text-decoration: underline; }
            .review-source { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .error { color: #e74c3c; text-align: center; padding: 40px; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    reviewTab.document.close();
  } catch (error: any) {
    reviewTab.document.open();
    reviewTab.document.write(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .error { color: #e74c3c; text-align: center; padding: 40px; }
          </style>
        </head>
        <body>
          <h2 class="error">Error fetching reviews: ${error.message}</h2>
        </body>
      </html>
    `);
    reviewTab.document.close();
    console.error("Review fetch error:", error);
  }
}