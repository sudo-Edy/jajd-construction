import { CONFIG } from '../config';

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  property: string;
  project: string;
  size: string;
}

// Determine API base URL based on environment
const getAPIBaseURL = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // Use local dev server
    return 'http://localhost:5001';
  } else {
    // Use full URL for production (from env variable)
    return process.env.VITE_API_URL || 'http://localhost:5001';
  }
};

const API_BASE_URL = getAPIBaseURL();

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const endpoint = `${API_BASE_URL}/api/lead`;
    console.log('🚀 Submitting lead to:', endpoint);
    console.log('📦 Payload:', payload);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📊 Response status:', response.status);
    
    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError);
      if (!response.ok) {
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`,
        };
      }
      return {
        success: true,
        message: 'Lead submitted successfully.',
      };
    }

    console.log('✅ Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to submit lead: ${response.status}`);
    }

    return {
      success: true,
      message: data.message || 'Lead submitted successfully. We will contact you within 24 hours.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit lead. Please try again.';
    console.error('❌ Error submitting lead:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};