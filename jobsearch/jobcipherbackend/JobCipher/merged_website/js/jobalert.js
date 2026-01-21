import { API_BASE_URL,API_JOB_ALERT_URL }from './config.js';
import { logMessage } from './utils.js';

/**
 * Function to create a job alert by sending data to the backend
 * @param {Object} alertData - Object containing keyword, location, and email
 * @returns {Promise} - Promise resolving to the API response
 */
async function createJobAlert(alertData) {
  try {
    logMessage(`Creating job alert for ${alertData.email} with keyword "${alertData.keyword}" in ${alertData.location}`);
    
    const response = await fetch(`${API_JOB_ALERT_URL}:5004/subscribe-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const result = await response.json();
    logMessage(`Job alert created successfully: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    logMessage(`Error creating job alert: ${error.message}`);
    throw error;
  }
}

/**
 * Handle job alert form submission
 * @param {Event} event - The form submission event
 */
function handleJobAlertSubmission(event) {
  event.preventDefault();
  
  const alertKeyword = document.getElementById('alertKeyword').value.trim();
  const alertLocation = document.getElementById('alertLocation').value.trim();
  const alertEmail = document.getElementById('alertEmail').value.trim();
  const alertStatus = document.getElementById('alertStatus');
  
  // Validate form data
  if (!alertKeyword || !alertLocation || !alertEmail) {
    showAlertStatus('Please fill in all fields.', 'error');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(alertEmail)) {
    showAlertStatus('Please enter a valid email address.', 'error');
    return;
  }
  
  // Clear previous status
  alertStatus.textContent = '';
  alertStatus.className = '';
  
  // Show loading state
  showAlertStatus('Creating your job alert...', '');
  
  // Create alert data object
  const alertData = {
    keyword: alertKeyword,
    location: alertLocation,
    email: alertEmail,
    created_at: new Date().toISOString()
  };
  
  // Send request to create job alert
  createJobAlert(alertData)
    .then(response => {
      showAlertStatus('Job alert created successfully! You will receive daily job updates at 12:00 PM.', 'success');
      
      // Reset form
      document.getElementById('jobAlertForm').reset();
    })
    .catch(error => {
      showAlertStatus(`Failed to create job alert: ${error.message}`, 'error');
    });
}

/**
 * Display status message for the job alert form
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success', 'error', or '')
 */
function showAlertStatus(message, type) {
  const alertStatus = document.getElementById('alertStatus');
  alertStatus.textContent = message;
  alertStatus.className = type;
}

/**
 * Initialize job alert functionality
 */
function initJobAlerts() {
  const jobAlertForm = document.getElementById('jobAlertForm');
  if (jobAlertForm) {
    jobAlertForm.addEventListener('submit', handleJobAlertSubmission);
    logMessage('Job alert form initialized');
  }
}

export { initJobAlerts, createJobAlert };