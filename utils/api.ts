
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

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  console.log('Submitting lead to:', CONFIG.API_ENDPOINT);
  
  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    return {
      success: true,
      message: data.message || 'Success'
    };
  } catch (error) {
    console.error('Lead submission failed:', error);
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : 'Could not connect to the construction server. Please try again in a moment.',
    };
  }
};
