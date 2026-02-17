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
 
 const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdaldnel';

export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('📨 Submitting lead to Formspree...');
    
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('📊 Response:', data);

    if (response.ok) {
      return {
        success: true,
        message: 'Lead submitted successfully!',
      };
    } else {
      return {
        success: false,
        message: data.errors?.map((e: any) => e.message).join(', ') || 'Submission failed.',
      };
    }
  } catch (error) {
    console.error('❌ Error submitting lead:', error);
    return {
      success: false,
      message: 'Failed to submit lead. Please try again.',
    };
  }
};