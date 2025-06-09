/**
 * Handles the resume download with a direct link approach
 * This works in most modern browsers including Firefox
 */
export const downloadResume = async () => {
  try {
    // Use the correct path for static assets in public directory
    const resumeUrl = '/GOKULANV.pdf'; // File is in public directory, so we can use relative path
    const filename = 'Gokulan_Resume.pdf';
    
    // Try to fetch the file first
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch resume: ${response.statusText}`);
    }
    
    // Convert the response to a blob
    const blob = await response.blob();
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Add to document and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
    
  } catch (error) {
    console.error('Error downloading resume:', error);
    // Fallback to opening in a new tab if download fails
    const fallbackUrl = process.env.PUBLIC_URL + '/GOKULANV.pdf';
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    
    // Also log the error to help with debugging
    if (error instanceof Error) {
      console.error('Detailed error:', error.message);
    }
  }
};
