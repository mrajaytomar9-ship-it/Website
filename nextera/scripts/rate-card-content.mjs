/**
 * Every published item from "Nextera Solution — Complete Price Rate Card" v1.0.
 * ssr-smoke.jsx asserts each one actually renders on /services or /pricing, so
 * a content edit cannot silently drop something the founder has locked.
 * Strings are written post-entity-decode, except & which appears as &amp;.
 */
export const RATE_CARD = {
  '§1 Main packages': [
    'Basic / Starter', 'Business', 'Enterprise',
    '₹23,600', '₹41,300', '₹70,800',
    '₹20,000', '₹3,600', '₹35,000', '₹6,300', '₹60,000', '₹10,800',
    'Up to 5 pages', 'Mobile-responsive design', 'Contact and enquiry forms',
    'WhatsApp click-to-chat', 'Google Maps', 'Reviews and trust badges',
    'SEO-ready structure', 'Basic speed optimization', 'Hosting/domain configuration',
    'Deployment and testing', '1 month free support', '2 revision rounds',
    'Everything in Basic', 'Custom UI/design', 'CMS/database', 'Booking/enquiry system',
    'Basic analytics', 'Google Business Profile setup', 'Analytics and tracking setup',
    'Local SEO setup', 'Automated enquiry response', 'Appointment booking',
    '3 months free support', '3 revision rounds',
    'Everything in Business', 'WhatsApp automation', 'CRM setup',
    'Review generation system', 'Social media profile setup', 'Advanced reporting',
    'Follow-up automation', 'Priority support', 'Monthly strategy review',
    '6 months free support',
    'Enterprise pricing increases for multiple branches, complex CRM, custom applications and high-volume automation.',
  ],
  '§2 AI voice': [
    'AI Receptionist Lite', 'AI Business Caller', 'Enterprise AI Voice',
    '₹14,999', '₹4,999', '₹29,999', '₹9,999', '₹69,999', '₹19,999',
    'Business-hours call answering', 'Basic FAQs', 'Lead name and phone collection',
    'Call transfer', 'One phone number', 'One language', 'Up to 200 minutes/month',
    '₹8–₹10 per minute, GST included',
    '24/7 AI receptionist', 'Hindi and English', 'Missed-call callback',
    'Appointment requests', 'Limited follow-up calls', 'Lead qualification',
    'Basic CRM or Google Sheets integration', 'Up to 500 minutes/month',
    '₹7–₹8 per minute, GST included',
    'Inbound and outbound calling', 'Multiple call flows', 'CRM integration',
    'Appointment automation', 'Multiple languages', 'Multiple numbers or branches',
    'Up to 1,500 minutes/month', 'Monthly reports',
    'AI voice does not guarantee sales, bookings or conversions.',
    'Telephony and platform usage must be controlled through monthly minute limits.',
  ],
  '§3 Maintenance': [
    'Basic Care', 'Growth Care', 'Priority Care', '₹1,499', '₹2,999', '₹5,999',
    'Backup checks', 'Uptime monitoring', 'Security checks', 'Minor technical fixes',
    'Everything in Basic Care', 'Small content updates', 'Basic optimization',
    'Minor layout changes', 'Monthly maintenance check',
    'Everything in Growth Care', 'Faster support', 'Monthly performance report',
    'Priority bug fixing', 'Strategy review',
    'AI monthly fees are separate from website maintenance fees.',
  ],
  '§4 Marketing': [
    'Google Business Profile management', 'Local SEO Basic', 'Local SEO Growth',
    'Social media management', 'Google Ads management', 'Meta Ads management',
    'SEO + Google Business Profile', '₹7,999', '₹11,999',
    'Advertising budget is not included',
  ],
  '§5 Add-ons': [
    'Extra website page', '₹2,499', 'Landing page', '₹3,999', 'Logo and branding',
    'Website content writing', 'Local SEO initial setup', 'Booking system',
    '₹8,999', 'Basic automation', 'Team training', 'Ads account setup',
    'per page', 'per session', 'per platform', 'onwards',
  ],
  '§6 Core services': [
    'Website development', 'Customer experience automation',
    'Local SEO and online presence setup', 'WhatsApp automation and CRM',
    'AI voice receptionist', 'AI business calling',
    '₹14,999 setup + ₹4,999/month', '₹29,999 setup + ₹9,999/month',
    'These services can be sold separately or added to a package.',
  ],
  '§7 Examples': [
    'Basic website with AI receptionist', 'Business website with AI caller',
    'Enterprise system with AI voice', '₹38,599', '₹71,299', '₹1,40,799',
    'Initial project total', 'AI monthly service',
  ],
  '§8 Excluded': [
    'Domain registration and renewal', 'Hosting renewal', 'Premium plugins and software',
    'WhatsApp API charges', 'AI voice platform charges', 'Phone number rental',
    'Telephony charges', 'SMS charges', 'CRM subscriptions', 'Email marketing tools',
    'Payment gateway charges', 'Google/Meta advertising budget',
    'Stock images, photography and video production', 'Additional language work',
    'Major integrations',
    'Third-party tools, usage charges and advertising budgets are not included',
  ],
  '§9 Payment': [
    '50%', '30%', '20%', 'advance to start the project',
    'after design or system approval', 'before final launch',
    'Paid in advance every month', 'AI minutes do not carry forward',
    'Extra usage billed separately', 'New features and major changes quoted separately',
    'notice',
  ],
  '§10 GST': [
    'All displayed package prices include 18% GST where applicable.',
    'taxable value and GST breakup separately', 'Taxable value', 'GST @18%', 'Total',
  ],
}

export const RATE_CARD_ITEM_COUNT = Object.values(RATE_CARD).reduce(
  (n, list) => n + new Set(list).size,
  0,
)
