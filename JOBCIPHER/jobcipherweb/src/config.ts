const API_BASE_IP = "13.203.209.210"; // Define the IP address as a constant
const API_BASE_URL = `http://${API_BASE_IP}`; // Use the IP address to construct the base URL


// Default filters
const DEFAULT_FILTERS = {
  experience: 0,
  job_type: "Full-time",
  remote: "on-site",
  date_posted: "week",
  company: "",
  industry: "",
  ctc_filters: "",
  radius: "10",
  keyword: "",
  location: "",
};

// CareerJet proxy options
const PROXY_OPTIONS = [
  { name: "allorigins.win", url: "https://api.allorigins.win/raw?url=" },
  { name: "corsproxy.io", url: "https://corsproxy.io/?" },
  { name: "codetabs.com", url: "https://api.codetabs.com/v1/proxy?quest=" },
  { name: "cors-anywhere (requires access)", url: "https://cors-anywhere.herokuapp.com/" },
  { name: "No proxy (direct request)", url: "" },
];

export { API_BASE_URL, DEFAULT_FILTERS, PROXY_OPTIONS };