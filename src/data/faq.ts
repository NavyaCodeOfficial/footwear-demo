import type { FaqItem } from '../types';

/**
 * FAQ wording is intentionally generic and makes no promises about delivery times,
 * return windows or guarantees. The owner must review and complete these before launch.
 */
export const faqs: FaqItem[] = [
  {
    question: 'How do I place an order?',
    answer:
      'Choose a product, size and colour, then tap the WhatsApp order button. A message is prepared for you; review it and send it yourself. The store replies to confirm availability and the next steps.',
  },
  {
    question: 'Is my order confirmed when WhatsApp opens?',
    answer:
      'No. Opening WhatsApp only prepares a message. Your order is not placed or confirmed until you send the message and the store confirms it with you.',
  },
  {
    question: 'Can I pay on this website?',
    answer: 'No. This website does not take payments or card details. Payment options, if any, are discussed with the store on WhatsApp.',
  },
  {
    question: 'How do I find the right size?',
    answer: 'Use the Size assistance option on the contact page or message the store on WhatsApp, and mention the product you are interested in.',
  },
  {
    question: 'What are the delivery charges and timelines?',
    answer: 'Delivery details are confirmed by the store when you message them. See the Shipping and Delivery page for the current draft policy.',
  },
  {
    question: 'Can I return or exchange a pair?',
    answer: 'Return and exchange terms are set by the store. See the Returns page for the current draft policy and confirm the details before ordering.',
  },
];
