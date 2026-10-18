import { ENQUIRY_TYPES } from './whatsapp';

export const LIMITS = { name: 60, phone: 20, product: 120, size: 12, message: 600 } as const;

export interface EnquiryFields {
  name: string;
  phone: string;
  product: string;
  size: string;
  type: string;
  message: string;
  consent: boolean;
  /** Honeypot: real users never fill this. */
  website: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

export function validateEnquiry(f: EnquiryFields): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  else if (f.name.length > LIMITS.name) e.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (f.phone.trim() && !/^[+\d][\d\s-]{6,18}$/.test(f.phone.trim())) {
    e.phone = 'Enter a valid number using digits, spaces or dashes (optional field).';
  }
  if (f.product.length > LIMITS.product) e.product = `Keep this under ${LIMITS.product} characters.`;
  if (f.size.length > LIMITS.size) e.size = `Keep this under ${LIMITS.size} characters.`;
  if (!(ENQUIRY_TYPES as readonly string[]).includes(f.type)) e.type = 'Please choose an enquiry type.';

  if (!f.message.trim()) e.message = 'Please write a short message.';
  else if (f.message.length > LIMITS.message) e.message = `Message must be ${LIMITS.message} characters or fewer.`;

  if (!f.consent) e.consent = 'Please confirm you understand how your message will be used.';
  return e;
}

export function isHoneypotTripped(f: EnquiryFields): boolean {
  return f.website.trim().length > 0;
}
