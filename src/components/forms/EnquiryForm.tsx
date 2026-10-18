import { useId, useState } from 'react';
import { siteConfig, isWhatsAppConfigured } from '../../data/siteConfig';
import { LIMITS, isHoneypotTripped, validateEnquiry, type EnquiryErrors, type EnquiryFields } from '../../utils/validation';
import { ENQUIRY_TYPES, buildEnquiryMessage, buildWhatsAppUrl } from '../../utils/whatsapp';
import { Link } from 'react-router-dom';

interface Props {
  /** Pre-filled product of interest for product-specific enquiries. */
  product?: string;
  defaultType?: string;
  heading?: string;
}

const empty = (product = '', type = 'Product availability'): EnquiryFields => ({
  name: '', phone: '', product, size: '', type, message: '', consent: false, website: '',
});

export function EnquiryForm({ product = '', defaultType = 'Product availability', heading }: Props) {
  const uid = useId();
  const [values, setValues] = useState<EnquiryFields>(() => empty(product, defaultType));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [prepared, setPrepared] = useState(false);
  const configured = isWhatsAppConfigured();

  const id = (n: string) => `${uid}-${n}`;
  const set = <K extends keyof EnquiryFields>(k: K, v: EnquiryFields[K]) => setValues((p) => ({ ...p, [k]: v }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPrepared(false);
    if (isHoneypotTripped(values)) return; // silently ignore bots
    const found = validateEnquiry(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(id(firstKey))?.focus();
      return;
    }
    const url = buildWhatsAppUrl(
      buildEnquiryMessage({
        name: values.name.trim(), phone: values.phone.trim() || undefined, product: values.product.trim() || undefined,
        size: values.size.trim() || undefined, type: values.type, message: values.message.trim(),
      }),
    );
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
    setPrepared(true);
  }

  const err = (k: keyof EnquiryFields) => (errors[k] ? `${id(k)}-err` : undefined);
  const errorCount = Object.keys(errors).length;

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-labelledby={heading ? id('h') : undefined}>
      {heading && <h2 id={id('h')}>{heading}</h2>}
      <p className="small muted">Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>

      {errorCount > 0 && (
        <div className="notice notice--error" role="alert">
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below.
        </div>
      )}

      <div className="field">
        <label htmlFor={id('name')}>Your name <span aria-hidden="true">*</span></label>
        <input id={id('name')} value={values.name} maxLength={LIMITS.name} autoComplete="name" required aria-required="true"
          aria-invalid={Boolean(errors.name)} aria-describedby={err('name')} onChange={(e) => set('name', e.target.value)} />
        {errors.name && <p className="field-error" id={err('name')}>{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor={id('phone')}>Contact number (optional)</label>
        <input id={id('phone')} type="tel" value={values.phone} maxLength={LIMITS.phone} autoComplete="tel" inputMode="tel"
          aria-invalid={Boolean(errors.phone)} aria-describedby={err('phone')} onChange={(e) => set('phone', e.target.value)} />
        {errors.phone && <p className="field-error" id={err('phone')}>{errors.phone}</p>}
      </div>

      <div className="field">
        <label htmlFor={id('type')}>Enquiry type <span aria-hidden="true">*</span></label>
        <select id={id('type')} value={values.type} required aria-required="true" aria-invalid={Boolean(errors.type)}
          aria-describedby={err('type')} onChange={(e) => set('type', e.target.value)}>
          {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.type && <p className="field-error" id={err('type')}>{errors.type}</p>}
      </div>

      <div className="field">
        <label htmlFor={id('product')}>Product of interest (optional)</label>
        <input id={id('product')} value={values.product} maxLength={LIMITS.product}
          aria-invalid={Boolean(errors.product)} aria-describedby={err('product')} onChange={(e) => set('product', e.target.value)} />
        {errors.product && <p className="field-error" id={err('product')}>{errors.product}</p>}
      </div>

      <div className="field">
        <label htmlFor={id('size')}>Preferred size (optional)</label>
        <input id={id('size')} value={values.size} maxLength={LIMITS.size}
          aria-invalid={Boolean(errors.size)} aria-describedby={err('size')} onChange={(e) => set('size', e.target.value)} />
        {errors.size && <p className="field-error" id={err('size')}>{errors.size}</p>}
      </div>

      <div className="field">
        <label htmlFor={id('message')}>Message <span aria-hidden="true">*</span></label>
        <textarea id={id('message')} rows={5} value={values.message} maxLength={LIMITS.message} required aria-required="true"
          aria-invalid={Boolean(errors.message)} aria-describedby={[err('message'), id('count')].filter(Boolean).join(' ')}
          onChange={(e) => set('message', e.target.value)} />
        <p className="field-hint" id={id('count')}>{values.message.length} / {LIMITS.message}</p>
        {errors.message && <p className="field-error" id={err('message')}>{errors.message}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input id={id('website')} tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="field field--check">
        <input id={id('consent')} type="checkbox" checked={values.consent} aria-invalid={Boolean(errors.consent)}
          aria-describedby={err('consent')} onChange={(e) => set('consent', e.target.checked)} />
        <label htmlFor={id('consent')}>
          I understand this prepares a WhatsApp message that I will review and send myself, and that the details I enter
          will be shared with {siteConfig.brandName} only if I send it. See the <Link to="/privacy-policy/">privacy policy</Link>.
        </label>
        {errors.consent && <p className="field-error" id={err('consent')}>{errors.consent}</p>}
      </div>

      {!configured && (
        <p className="notice notice--warn" role="note">
          WhatsApp is not set up yet, so this form cannot open WhatsApp. The store number must be added in the site settings first.
        </p>
      )}

      <button type="submit" className="btn btn--primary" aria-disabled={!configured} disabled={!configured}>
        Prepare WhatsApp message
      </button>

      {prepared && (
        <p className="notice notice--info" role="status">
          WhatsApp should have opened with your message. Nothing has been sent yet: please review it and press send in WhatsApp.
        </p>
      )}
    </form>
  );
}
