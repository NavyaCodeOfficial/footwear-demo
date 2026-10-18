import { MessageCircle } from 'lucide-react';
import { isWhatsAppConfigured, siteConfig } from '../../data/siteConfig';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

/** Floating help button. Hidden entirely until a real business number is configured. */
export function FloatingWhatsApp() {
  if (!isWhatsAppConfigured()) return null;
  const url = buildWhatsAppUrl(`Hello ${siteConfig.brandName}! I need help choosing footwear.`);
  if (!url) return null;
  return (
    <a className="fab glass" href={url} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={20} aria-hidden="true" />
      <span>Chat on WhatsApp</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
