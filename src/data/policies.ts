/**
 * DRAFT POLICY TEXT. Not legal advice and not a guarantee of compliance.
 * Every [PLACEHOLDER] must be completed, and the owner (ideally with a qualified adviser)
 * must review each page before publication.
 */
export interface PolicySection { heading: string; body: string[] }
export interface PolicyDoc {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: PolicySection[];
}

const P = {
  business: '[BUSINESS LEGAL NAME]',
  address: '[BUSINESS ADDRESS]',
  email: '[BUSINESS EMAIL]',
  window: '[RETURN WINDOW IN DAYS, TO BE SET BY OWNER]',
  jurisdiction: '[GOVERNING LAW AND JURISDICTION, TO BE CONFIRMED BY OWNER]',
};

export const policies: PolicyDoc[] = [
  {
    slug: 'shipping-policy',
    title: 'Shipping and Delivery Policy',
    seoTitle: 'Shipping and Delivery Policy | Royal Footwear',
    seoDescription: 'Draft shipping and delivery information for Royal Footwear. Details are confirmed by the store on WhatsApp.',
    intro: 'Draft for owner review. Delivery terms below are placeholders until the business confirms them.',
    sections: [
      { heading: 'Business identity', body: [`${P.business}, ${P.address}. Contact: ${P.email}.`] },
      { heading: 'How orders are handled', body: ['Orders are requested through WhatsApp. An order is only accepted once the store confirms it with you.'] },
      { heading: 'Delivery areas and timelines', body: ['[DELIVERY AREAS AND ESTIMATED TIMELINES, TO BE SET BY OWNER]'] },
      { heading: 'Delivery charges', body: ['Delivery charges, if any, are confirmed by the store before you commit to an order. The subtotal shown on this website is indicative.'] },
      { heading: 'Delays and issues', body: ['[PROCESS FOR DELAYED OR DAMAGED DELIVERIES, TO BE SET BY OWNER]'] },
    ],
  },
  {
    slug: 'returns-policy',
    title: 'Returns, Refunds and Exchanges Policy',
    seoTitle: 'Returns, Refunds and Exchanges Policy | Royal Footwear',
    seoDescription: 'Draft returns, refunds and exchanges policy for Royal Footwear, pending owner review.',
    intro: 'Draft for owner review. No return window or guarantee has been decided yet.',
    sections: [
      { heading: 'Business identity', body: [`${P.business}, ${P.address}. Contact: ${P.email}.`] },
      { heading: 'Returns and exchanges', body: [`Return window: ${P.window}.`, '[CONDITIONS FOR RETURNS AND EXCHANGES, TO BE SET BY OWNER]'] },
      { heading: 'Refunds', body: ['[REFUND METHOD AND TIMELINE, TO BE SET BY OWNER]'] },
      { heading: 'Cancellations', body: ['[CANCELLATION TERMS, TO BE SET BY OWNER]'] },
      { heading: 'How to start a request', body: ['Message the store on WhatsApp with your product details. The store will explain the next steps.'] },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    seoTitle: 'Privacy Policy | Royal Footwear',
    seoDescription: 'Draft privacy policy for Royal Footwear describing what the website stores and how WhatsApp messages are prepared.',
    intro: 'Draft for owner review. This is a starting template, not legal advice.',
    sections: [
      { heading: 'Business identity', body: [`${P.business}, ${P.address}. Contact: ${P.email}.`] },
      { heading: 'What this website stores', body: ['Your cart is saved only in your own browser (local storage) so it is still there when you return. It is not sent to a server by this website.'] },
      { heading: 'Enquiry and order messages', body: ['Forms and carts prepare a message for you. Nothing is sent until you choose to send it in WhatsApp. Once sent, WhatsApp and the store handle that message under their own terms and policies.'] },
      { heading: 'Analytics and cookies', body: ['This website does not set advertising or analytics cookies. If analytics are added later, this policy and a consent mechanism must be updated first.'] },
      { heading: 'Your choices', body: ['You can clear your cart at any time and clear site data in your browser settings.', '[DATA REQUEST AND CONTACT PROCESS, TO BE SET BY OWNER]'] },
      { heading: 'Changes', body: ['[POLICY REVIEW DATE AND CHANGE PROCESS, TO BE SET BY OWNER]'] },
    ],
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    seoTitle: 'Terms and Conditions | Royal Footwear',
    seoDescription: 'Draft terms and conditions for the Royal Footwear website, pending owner review.',
    intro: 'Draft for owner review. This is a starting template, not legal advice.',
    sections: [
      { heading: 'Business identity', body: [`${P.business}, ${P.address}. Contact: ${P.email}.`] },
      { heading: 'Product information and pricing', body: ['Product details, images, sizes and prices on this website are subject to change and to confirmation by the store. Prices shown are indicative until confirmed.'] },
      { heading: 'Order requests', body: ['Submitting a WhatsApp message is a request, not a confirmed order. The store may accept or decline a request, for example if an item is unavailable.'] },
      { heading: 'Intellectual property', body: ['Website content, branding and images are the property of their respective owners and may not be reused without permission. [OWNER TO CONFIRM IMAGE LICENSING]'] },
      { heading: 'Limitation of liability', body: ['[LIABILITY TERMS, SUBJECT TO APPLICABLE LAW, TO BE CONFIRMED BY OWNER]'] },
      { heading: 'Disputes', body: [`[DISPUTE HANDLING PROCESS]. Governing law and jurisdiction: ${P.jurisdiction}.`] },
    ],
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    seoTitle: 'Cookie Policy | Royal Footwear',
    seoDescription: 'Draft cookie policy for the Royal Footwear website.',
    intro: 'Draft for owner review.',
    sections: [
      { heading: 'Current use', body: ['This website currently does not set advertising or analytics cookies. It uses your browser\'s local storage to remember your cart.'] },
      { heading: 'If this changes', body: ['If analytics or other cookies are added, this page and a consent mechanism must be updated before they are enabled.'] },
    ],
  },
];

export function getPolicy(slug: string): PolicyDoc | undefined {
  return policies.find((p) => p.slug === slug);
}
