
/**
 * Utility function to track the origin of leads by capturing UTM parameters
 * or referrer information from the URL
 */
export const trackLeadOrigin = () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for common tracking parameters
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const ref = urlParams.get('ref');
  
  // Determine the origin from parameters, with priority order
  const origin = utmSource || ref || 'acesso-direto';
  
  // Store in localStorage for future use
  localStorage.setItem('lead_origem', origin);
  
  // Return the origin for immediate use if needed
  return origin;
};

/**
 * Get the stored lead origin from localStorage
 */
export const getLeadOrigin = (): string => {
  return localStorage.getItem('lead_origem') || 'acesso-direto';
};

/**
 * Clear the stored lead origin from localStorage
 */
export const clearLeadOrigin = (): void => {
  localStorage.removeItem('lead_origem');
};
