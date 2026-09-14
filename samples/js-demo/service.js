// Sample service flow: details, documents, review and pay, confirmation. Nothing is sent.
// Opened from a service card as service.html?id=<service id>.
import { formatFee, services } from './services-data.js';

const $ = (id) => document.getElementById(id);
const service = services.find((item) => item.id === new URLSearchParams(location.search).get('id'));
const breadcrumbs = [
  { text: 'Home', url: './' },
  { text: 'Services', url: 'services.html' },
];

if (!service) {
  $('service-title').textContent = 'Service not found';
  $('service-flow').hidden = true;
  $('service-missing').hidden = false;
  $('service-breadcrumb').setAttribute('breadcrumbs', JSON.stringify(breadcrumbs));
} else {
  document.title = `${service.title} – Apply`;
  breadcrumbs[1].url = `services.html?category=${encodeURIComponent(service.category)}`;
  $('service-breadcrumb').setAttribute('breadcrumbs', JSON.stringify([...breadcrumbs, { text: service.title }]));
  $('service-title').textContent = service.title;
  $('service-description').textContent = service.description;
  $('service-fee').textContent = formatFee(service.fee);
  $('service-time').textContent = service.time;
  $('service-category').textContent = service.category;
  startFlow(service);
}

function startFlow(service) {
  const form = $('service-form');
  const stepper = $('service-stepper');
  const steps = [...form.querySelectorAll('.demo-step')];
  const [DETAILS, DOCUMENTS, REVIEW, CONFIRMATION] = [0, 1, 2, 3];
  let current = DETAILS;

  const inputValue = (id) => $(id)?.value.trim() ?? '';

  function goTo(step, { moveFocus = true } = {}) {
    current = step;
    steps.forEach((section, index) => {
      section.hidden = index !== step;
    });
    // setAttribute works before and after the stepper component has loaded.
    stepper.setAttribute('current_step', String(step));
    $('step-back').hidden = step === DETAILS || step === CONFIRMATION;
    $('step-next').hidden = step >= REVIEW;
    $('step-pay').hidden = step !== REVIEW;

    if (step === REVIEW) {
      $('review-service').textContent = service.title;
      $('review-name').textContent = inputValue('applicant-name');
      $('review-email').textContent = inputValue('applicant-email');
      $('review-eid').textContent = inputValue('applicant-eid') || 'Not given';
      $('review-fee').textContent = formatFee(service.fee);
    }

    if (moveFocus) {
      stepper.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      steps[step].querySelector('h2').focus({ preventScroll: true });
    }
  }

  /** Shows or clears a field error. Returns true when the field has a value. */
  function requireField(inputId, message) {
    const field = $(inputId).closest('dda-input');
    const ok = inputValue(inputId) !== '';
    if (ok) field.removeAttribute('error_message');
    else field.setAttribute('error_message', message);
    return ok;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (current === DETAILS) {
      const nameOk = requireField('applicant-name', 'Enter your full name.');
      const emailOk = requireField('applicant-email', 'Enter your email address.');
      if (!nameOk || !emailOk) return;
    }

    if (current === REVIEW) {
      const confirmed = $('review-confirm')?.checked === true;
      $('review-confirm-error').hidden = confirmed;
      if (!confirmed) return;
      $('service-reference').textContent = `DDA-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    goTo(current + 1);
  });

  $('step-back').addEventListener('click', () => goTo(current - 1));

  // Clear the confirm error as soon as the box is checked.
  form.addEventListener('change', (event) => {
    if (event.target.id === 'review-confirm' && event.target.checked) $('review-confirm-error').hidden = true;
  });

  goTo(DETAILS, { moveFocus: false });
}

// Load setup.js only now, after the page content above is in place.
import('./setup.js');
