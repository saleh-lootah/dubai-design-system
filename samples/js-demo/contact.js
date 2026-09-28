// Contact page: the sample form shows a success message and sends nothing.
import './setup.js';

const form = document.getElementById('contact-form');
const sent = document.getElementById('contact-sent');
const topicSelect = document.getElementById('contact-topic-select');

// selectChanged sends the option the page passed in, so the form gets the topic id.
let topic = null;
topicSelect.addEventListener('selectChanged', (event) => {
  topic = event.detail;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  sent.description = topic
    ? `Thank you. Topic: ${topic.text} (id "${topic.id}"). This is a sample form, so nothing was sent.`
    : 'Thank you. This is a sample form, so nothing was sent.';
  sent.hidden = false;
  sent.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
