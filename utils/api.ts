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

// Use /api proxy for local dev, or direct URL for production
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? '/api' 
  : (process.env.VITE_API_URL || 'http://localhost:5001');

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const endpoint = `${API_BASE_URL}/lead`;
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
    const data = await response.json();
    console.log('✅ Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to submit lead: ${response.status}`);
    }

    return {
      success: true,
      message: data.message || 'Lead submitted successfully. Check your email for confirmation.',
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