// Sample services, shared by the home page, the services page, the search results page and the
// service pages. Ids are the same in every language; titles and descriptions are per language.
import { createT, locale } from './i18n.js';

const t = createT({
  en: {
    free: 'Free',
    fee: 'AED {amount}',
    immediately: 'Immediately',
    workingDays: { one: '{count} working day', other: '{count} working days' },
    startService: 'Start service',
  },
  ar: {
    free: 'مجاناً',
    fee: '{amount} درهم',
    immediately: 'فوراً',
    // Arabic counts: 1 and 2 have their own forms, 3 to 10 take a plural, 11 and up a singular.
    workingDays: {
      zero: '{count} يوم عمل',
      one: 'يوم عمل واحد',
      two: 'يوما عمل',
      few: '{count} أيام عمل',
      many: '{count} يوم عمل',
      other: '{count} يوم عمل',
    },
    startService: 'ابدأ الخدمة',
  },
});

const local = (text) => text[locale] ?? text.en;

// `id` is used in URLs (services.html?category=transport), so it does not change with the language.
export const categories = [
  { id: 'transport', name: { en: 'Transport', ar: 'النقل' } },
  { id: 'identity-visas', name: { en: 'Identity and visas', ar: 'الهوية والتأشيرات' } },
  { id: 'business', name: { en: 'Business', ar: 'الأعمال' } },
  { id: 'housing-utilities', name: { en: 'Housing and utilities', ar: 'السكن والمرافق' } },
  { id: 'health', name: { en: 'Health', ar: 'الصحة' } },
].map((category) => ({ id: category.id, name: local(category.name) }));

// `fee` is in AED; `days` is how many working days the service takes after the application is
// sent, and 0 means it is done at once.
export const services = [
  {
    id: 'traffic-fines', icon: 'directions_car', category: 'transport', fee: 0, days: 0,
    title: { en: 'Pay traffic fines', ar: 'دفع المخالفات المرورية' },
    description: { en: 'Check and pay vehicle fines.', ar: 'استعلم عن مخالفات مركبتك وادفعها.' },
  },
  {
    id: 'vehicle-registration', icon: 'directions_car', category: 'transport', fee: 400, days: 1,
    title: { en: 'Renew vehicle registration', ar: 'تجديد ترخيص المركبة' },
    description: { en: 'Renew the registration of a car or motorcycle.', ar: 'جدّد ترخيص سيارة أو دراجة نارية.' },
  },
  {
    id: 'parking-permit', icon: 'local_parking', category: 'transport', fee: 150, days: 3,
    title: { en: 'Apply for a parking permit', ar: 'طلب تصريح مواقف' },
    description: { en: 'Get a resident or business parking permit.', ar: 'احصل على تصريح مواقف للسكان أو للأعمال.' },
  },
  {
    id: 'emirates-id', icon: 'badge', category: 'identity-visas', fee: 370, days: 5,
    title: { en: 'Renew Emirates ID', ar: 'تجديد الهوية الإماراتية' },
    description: { en: 'Renew or replace an identity card.', ar: 'جدّد بطاقة الهوية أو استبدلها.' },
  },
  {
    id: 'visa', icon: 'flight', category: 'identity-visas', fee: 550, days: 10,
    title: { en: 'Apply for a visa', ar: 'طلب تأشيرة' },
    description: { en: 'Apply for a residence or visit visa.', ar: 'قدّم طلب تأشيرة إقامة أو زيارة.' },
  },
  {
    id: 'trade-licence', icon: 'storefront', category: 'business', fee: 1200, days: 2,
    title: { en: 'Renew trade licence', ar: 'تجديد الرخصة التجارية' },
    description: { en: 'Renew a business trade licence.', ar: 'جدّد الرخصة التجارية لنشاطك.' },
  },
  {
    id: 'new-company', icon: 'business_center', category: 'business', fee: 2500, days: 7,
    title: { en: 'Register a new company', ar: 'تسجيل شركة جديدة' },
    description: { en: 'Choose a trade name and register a company.', ar: 'اختر اسماً تجارياً وسجّل شركتك.' },
  },
  {
    id: 'utility-bills', icon: 'receipt_long', category: 'housing-utilities', fee: 0, days: 0,
    title: { en: 'Pay utility bills', ar: 'دفع فواتير الكهرباء والمياه' },
    description: { en: 'Pay electricity and water bills.', ar: 'ادفع فواتير الكهرباء والمياه.' },
  },
  {
    id: 'housing-assistance', icon: 'home', category: 'housing-utilities', fee: 0, days: 30,
    title: { en: 'Housing assistance', ar: 'الدعم السكني' },
    description: { en: 'Apply for a housing loan or grant.', ar: 'قدّم طلب قرض سكني أو منحة سكنية.' },
  },
  {
    id: 'tenancy-contract', icon: 'description', category: 'housing-utilities', fee: 220, days: 1,
    title: { en: 'Register a tenancy contract', ar: 'تسجيل عقد إيجار' },
    description: { en: 'Register a rental contract for a home or office.', ar: 'سجّل عقد إيجار لمسكن أو مكتب.' },
  },
  {
    id: 'health-appointment', icon: 'medical_services', category: 'health', fee: 0, days: 0,
    title: { en: 'Book a health appointment', ar: 'حجز موعد صحي' },
    description: { en: 'Book a visit at a public health centre.', ar: 'احجز زيارة في مركز صحي حكومي.' },
  },
  {
    id: 'health-card', icon: 'health_and_safety', category: 'health', fee: 320, days: 3,
    title: { en: 'Renew a health card', ar: 'تجديد البطاقة الصحية' },
    description: { en: 'Renew the card for public health services.', ar: 'جدّد بطاقة الخدمات الصحية الحكومية.' },
  },
].map((service) => ({ ...service, title: local(service.title), description: local(service.description) }));

export const categoryName = (id) => categories.find((category) => category.id === id)?.name ?? id;

export const serviceUrl = (service) => `service.html?id=${encodeURIComponent(service.id)}`;

export const formatFee = (fee) => (fee === 0 ? t('free') : t('fee', { amount: fee }));

/** How long the service takes: "Immediately", "1 working day", "5 working days". */
export const formatTime = (service) => (service.days === 0 ? t('immediately') : t('workingDays', { count: service.days }));

/** "5 working days" for any number of days, for totals. */
export const formatDays = (count) => t('workingDays', { count });

/**
 * Makes a dda-ui-card that starts the service. setAttribute keeps the values as plain text.
 * `headingLevel` is the level of the card title, one below the heading the cards sit under.
 */
export function serviceCard(service, headingLevel = 3) {
  const card = document.createElement('dda-ui-card');
  card.setAttribute('heading_level', String(headingLevel));
  card.setAttribute('maintitle', service.title);
  card.setAttribute('subtitle', service.description);
  card.setAttribute('icon', service.icon);
  card.setAttribute('linktext', t('startService'));
  card.setAttribute('link', serviceUrl(service));
  return card;
}
