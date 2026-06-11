/// <reference types="vite/client" />
 
import { supabase } from './supabase';

 export interface LeadPayload {
   name: string;
   email: string;
   phone: string;
   zip: string;
   property: string;
   project: string;
   size: string;
   budget?: string;
   description?: string;
   preferred_date?: string; // ISO date (YYYY-MM-DD) selected on the booking calendar
   attachments?: string[]; // Array of public URLs
 }
 
 // Formspree endpoint that receives lead submissions (configured in the JAJD Formspree account).
 const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdaldnel';

 export const uploadLeadAttachment = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lead-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Attachment upload failed:', uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from('lead-attachments')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Attachment upload exception:', error);
      return null;
    }
 };
 
 export const submitLead = async (payload: LeadPayload): Promise<{ success: boolean; message: string }> => {
   try {
     const response = await fetch(FORMSPREE_ENDPOINT, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       body: JSON.stringify(payload),
     });
 
     const data = await response.json();

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
     console.error('Error submitting lead:', error);
     return {
       success: false,
       message: 'Failed to submit lead. Please try again.',
     };
   }
 };