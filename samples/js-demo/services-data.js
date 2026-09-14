// Sample services, shared by the services page and the search results page.

export const categories = ['Transport', 'Identity and visas', 'Business', 'Housing and utilities', 'Health'];

// `fee` is in AED; `time` is how long the service takes after the application is sent.
export const services = [
  { id: 'traffic-fines', title: 'Pay traffic fines', description: 'Check and pay vehicle fines.', icon: 'directions_car', category: 'Transport', fee: 0, time: 'Immediately' },
  { id: 'vehicle-registration', title: 'Renew vehicle registration', description: 'Renew the registration of a car or motorcycle.', icon: 'directions_car', category: 'Transport', fee: 400, time: '1 working day' },
  { id: 'parking-permit', title: 'Apply for a parking permit', description: 'Get a resident or business parking permit.', icon: 'local_parking', category: 'Transport', fee: 150, time: '3 working days' },
  { id: 'emirates-id', title: 'Renew Emirates ID', description: 'Renew or replace an identity card.', icon: 'badge', category: 'Identity and visas', fee: 370, time: '5 working days' },
  { id: 'visa', title: 'Apply for a visa', description: 'Apply for a residence or visit visa.', icon: 'flight', category: 'Identity and visas', fee: 550, time: '10 working days' },
  { id: 'trade-licence', title: 'Renew trade licence', description: 'Renew a business trade licence.', icon: 'storefront', category: 'Business', fee: 1200, time: '2 working days' },
  { id: 'new-company', title: 'Register a new company', description: 'Choose a trade name and register a company.', icon: 'business_center', category: 'Business', fee: 2500, time: '7 working days' },
  { id: 'utility-bills', title: 'Pay utility bills', description: 'Pay electricity and water bills.', icon: 'receipt_long', category: 'Housing and utilities', fee: 0, time: 'Immediately' },
  { id: 'housing-assistance', title: 'Housing assistance', description: 'Apply for a housing loan or grant.', icon: 'home', category: 'Housing and utilities', fee: 0, time: '30 working days' },
  { id: 'tenancy-contract', title: 'Register a tenancy contract', description: 'Register a rental contract for a home or office.', icon: 'description', category: 'Housing and utilities', fee: 220, time: '1 working day' },
  { id: 'health-appointment', title: 'Book a health appointment', description: 'Book a visit at a public health centre.', icon: 'medical_services', category: 'Health', fee: 0, time: 'Immediately' },
  { id: 'health-card', title: 'Renew a health card', description: 'Renew the card for public health services.', icon: 'health_and_safety', category: 'Health', fee: 320, time: '3 working days' },
];

export const serviceUrl = (service) => `service.html?id=${encodeURIComponent(service.id)}`;

export const formatFee = (fee) => (fee === 0 ? 'Free' : `AED ${fee.toLocaleString('en')}`);

/** Makes a dda-ui-card that starts the service. setAttribute keeps the values as plain text. */
export function serviceCard(service) {
  const card = document.createElement('dda-ui-card');
  card.setAttribute('maintitle', service.title);
  card.setAttribute('subtitle', service.description);
  card.setAttribute('icon', service.icon);
  card.setAttribute('linktext', 'Start service');
  card.setAttribute('link', serviceUrl(service));
  return card;
}
