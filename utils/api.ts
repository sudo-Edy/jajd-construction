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

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit lead');
    }

    return {
      success: true,
      message: data.message || 'Lead submitted successfully.',
    };
  } catch (error) {
    console.error('Error submitting lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit lead. Please try again.',
    };
  }
};