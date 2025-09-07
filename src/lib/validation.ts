// Validation utilities for forms

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Check for Gmail specifically
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email)) {
    return { isValid: false, message: 'Please use a Gmail address (example@gmail.com)' };
  }

  return { isValid: true, message: '' };
};

// Albanian phone number validation (+355)
export const validateAlbanianPhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Check if it starts with +355
  if (!cleanPhone.startsWith('+355')) {
    return { isValid: false, message: 'Phone number must start with +355 (Albanian country code)' };
  }

  // Check if it's exactly 13 characters (+355 + 9 digits)
  if (cleanPhone.length !== 13) {
    return { isValid: false, message: 'Phone number must be +355 followed by 9 digits' };
  }

  // Check if the part after +355 contains only digits
  const phoneDigits = cleanPhone.substring(4);
  if (!/^\d{9}$/.test(phoneDigits)) {
    return { isValid: false, message: 'Phone number must contain only digits after +355' };
  }

  // Check if the first digit after +355 is valid (Albanian mobile numbers start with 6, 7, or 8)
  const firstDigit = phoneDigits[0];
  if (!['6', '7', '8'].includes(firstDigit)) {
    return { isValid: false, message: 'Albanian mobile numbers must start with 6, 7, or 8 after +355' };
  }

  return { isValid: true, message: '' };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  if (name.trim().length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, message: '' };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 100) {
    return { isValid: false, message: 'Password must be less than 100 characters' };
  }

  return { isValid: true, message: '' };
};

// Format phone number for display
export const formatAlbanianPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.startsWith('+355') && cleanPhone.length === 13) {
    const digits = cleanPhone.substring(4);
    return `+355 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  
  return phone;
};

// Format phone number for input (remove formatting)
export const cleanPhoneInput = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};
