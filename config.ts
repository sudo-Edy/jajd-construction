// Company Configuration - Update with your real information
export const CONFIG = {
  COMPANY_NAME: "JAJD Construction",
  PHONE: "(380) 239-5307",           // Your actual phone number
  PHONE_RAW: "3802395307",            // Phone without formatting (digits only)
  SMS_BODY: "Hi JAJD! I'd like a free estimate. I'll text a photo of my project.",
  EMAIL: "jajdconstruction@gmail.com",  // Display email (for footer/header)
  ADDRESS: "Omaha, NE", // Your actual address
  API_ENDPOINT: "/api/lead",
  // Paste your Google "write a review" link here so the Reviews section can send
  // happy customers straight to it. Find it in Google Business Profile →
  // "Ask for reviews". Leave as "#" to hide the button until it's real.
  GOOGLE_REVIEW_URL: "#",
  SOCIALS: {
    INSTAGRAM: "#",
    FACEBOOK: "#",
    LINKEDIN: "#",
    TWITTER: "#"
  }
};

// Prefilled "click to text" link. Opens the visitor's messaging app with the
// number and message ready to go (iOS, Android, and macOS Messages).
export const SMS_LINK = `sms:+1${CONFIG.PHONE_RAW}?body=${encodeURIComponent(CONFIG.SMS_BODY)}`;