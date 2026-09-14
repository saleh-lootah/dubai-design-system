// Contact page: the sample form shows a success message and sends nothing.
import './setup.js';

const form = document.getElementById('contact-form');
const sent = document.getElementById('contact-sent');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  sent.hidden = false;
  sent.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
