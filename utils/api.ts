/// <reference types="vite/client" />

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  property: string;
  project: string;
  size: string;
}

// API base URL - Controlled by Environment Variable
// Falls back to production URL if env is missing (prevent hard crash)
// Replaced dynamic `process.env.VITE_API_URL` with hardcoded fallback only if needed
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'https://celebrated-beauty-production.up.railway.app';

// Log API configuration once on page load
if (typeof window !== 'undefined') {
  console.log('🔌 API_BASE:', API_BASE);
}

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const endpoint = `${API_BASE}/api/lead`;
    console.log('📨 Submitting lead to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Always try to parse response as text first to handle errors gracefully
    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log('📊 Response status:', response.status, 'Data:', data);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed: ${response.status}`);
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