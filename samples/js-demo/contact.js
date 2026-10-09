// Contact page: the sample form shows a success message and sends nothing.
import { createT, isolate } from './i18n.js';
import './setup.js';

const t = createT({
  en: {
    thankYouBasic: 'Thank you. This is a sample form, so nothing was sent.',
    thankYouWithTopic: 'Thank you. Topic: {topic} (id "{topicId}"). This is a sample form, so nothing was sent.',
  },
  ar: {
    thankYouBasic: 'شكراً لك. هذا نموذج تجريبي، لذلك لم يُرسل شيء.',
    thankYouWithTopic: 'شكراً لك. الموضوع: {topic} (المعرّف «{topicId}»). هذا نموذج تجريبي، لذلك لم يُرسل شيء.',
  },
});

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
    ? t('thankYouWithTopic', { topic: isolate(topic.text), topicId: topic.id })
    : t('thankYouBasic');
  sent.hidden = false;
  sent.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
