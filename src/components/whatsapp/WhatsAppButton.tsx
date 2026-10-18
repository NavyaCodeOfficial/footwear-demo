import { useId } from 'react';
import { MessageCircle } from 'lucide-react';
import { isWhatsAppConfigured } from '../../data/siteConfig';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface Props {
  message: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Extra reason to disable (e.g. variant not chosen). */
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  onOpened?: () => void;
}

/**
 * Opens WhatsApp only on a deliberate click/tap. When the business number is not configured
 * the button is disabled and explains why; it never opens a fake number.
 */
export function WhatsAppButton({ message, label, variant = 'primary', disabled, disabledReason, className = '', onOpened }: Props) {
  const reasonId = useId();
  const configured = isWhatsAppConfigured();
  const blocked = !configured || Boolean(disabled);
  const reason = !configured
    ? 'WhatsApp ordering is not active yet: the store number has not been set up.'
    : disabledReason;

  const handleClick = () => {
    if (blocked) return;
    const url = buildWhatsAppUrl(message);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
    onOpened?.();
  };

  return (
    <div className="wa-wrap">
      <button
        type="button"
        className={`btn btn--${variant} ${className}`}
        onClick={handleClick}
        aria-disabled={blocked}
        data-blocked={blocked}
        aria-describedby={blocked && reason ? reasonId : undefined}
      >
        <MessageCircle size={18} aria-hidden="true" />
        {label}
      </button>
      {blocked && reason && (
        <p className="field-hint" id={reasonId} role="note">
          {reason}
        </p>
      )}
    </div>
  );
}
