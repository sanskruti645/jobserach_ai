// Parse CSV string into an array of arrays
export function parseCSV(csvString: string): string[][] {
    if (!csvString || csvString.trim() === "") return [];
    const lines = csvString.split(/\r?\n/).filter((line) => line.trim() !== "");
    return lines.map((line) =>
      line
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((cell) => cell.replace(/^"(.*)"$/, "$1"))
    );
  }
  
  // Display CSV data in a table
  export function displayCSV(csvString: string, tableElement: HTMLElement): void {
    tableElement.innerHTML = "";
    const rows = parseCSV(csvString);
    if (rows.length === 0) {
      tableElement.innerHTML = "<tr><td>No jobs found</td></tr>";
      return;
    }
  
    // Create header row
    const headerRow = document.createElement("tr");
    rows[0].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    tableElement.appendChild(headerRow);
  
    // Create data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell || "";
        tr.appendChild(td);
      });
      tableElement.appendChild(tr);
    }
  }
  
  // Debug logging function
  export function logMessage(message: string): void {
    const debugLog = document.getElementById("debug-log");
    if (debugLog) {
      const logEntry = document.createElement("div");
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      debugLog.appendChild(logEntry);
      // Scroll to bottom
      debugLog.scrollTop = debugLog.scrollHeight;
    }
    console.log(message);
  }
  
  // Extract resume info from API response
  export function extractResumeInfo(infoText: string): Record<string, string> {
    // Split text into lines that start with a number and a period.
    const lines = infoText.split("\n").filter((line) => /^\d+\.\s*/.test(line));
  
    // Helper function to remove the leading number and period.
    const cleanLine = (line: string): string => {
      let text = line.replace(/^\d+\.\s*/, "").trim();
      if (text.includes(":")) {
        const parts = text.split(":");
        return parts.slice(1).join(":").trim();
      }
      return text;
    };
  
    // Additional cleaning for branch: remove any text within parentheses.
    const cleanBranch = (branchText: string): string =>
      branchText.replace(/\(.*?\)/g, "").trim();
  
    // Cleaning for location: if the location contains a comma, only take the first part.
    const cleanLocation = (locationText: string): string => {
      const cleaned = locationText.trim();
      if (cleaned.includes(",")) {
        return cleaned.split(",")[0].trim();
      }
      return cleaned;
    };
  
    return {
      name: cleanLine(lines[0]) || "N/A",
      branch: cleanBranch(cleanLine(lines[1])) || "CSE",
      college: cleanLine(lines[2]) || "N/A",
      keyword: cleanLine(lines[3]) || "Python",
      location: cleanLocation(cleanLine(lines[4])) || "India",
    };
  }