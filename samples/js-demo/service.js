// Sample service flow, following the GOV.UK service patterns: start page, one group of
// questions per page, check your answers, confirmation. Nothing is sent.
// Each page has its own URL, service.html?id=<service id>&page=<page>, and is a full page load,
// so the browser back button, a reload and a shared link all work. Answers live in sessionStorage.
import { formatFee, services } from './services-data.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const service = services.find((item) => item.id === params.get('id'));

// The question pages in order, with the answers each one must have before the next page opens.
const QUESTIONS = [
  { page: 'contact', title: 'Your contact details', complete: (a) => a.name && a.email },
  { page: 'eid', title: 'What is your Emirates ID number?', complete: (a) => a.eid },
  { page: 'documents', title: 'Upload your documents', complete: (a) => a.docEid },
];
const PAGE_TITLES = {
  check: 'Check your answers',
  done: 'Application sent',
  ...Object.fromEntries(QUESTIONS.map((q) => [q.page, q.title])),
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A page restored from the back/forward cache does not run this script again, so the
// redirects below would not happen (for example, back to check answers after sending).
window.addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload();
});

if (!service) {
  showMissingService();
} else {
  showPage(service);
}

function showMissingService() {
  document.title = 'Service not found';
  $('service-missing').hidden = false;
  $('service-breadcrumb').hidden = false;
  $('service-breadcrumb').setAttribute('breadcrumbs', JSON.stringify([
    { text: 'Home', url: './' },
    { text: 'Services', url: 'services.html' },
  ]));
}

function showPage(service) {
  const storageKey = `dda-demo-application:${service.id}`;
  const answers = readAnswers();
  const urlFor = (page, extra = {}) => {
    const query = new URLSearchParams({ id: service.id, ...(page ? { page } : {}), ...extra });
    return `service.html?${query}`;
  };

  const requested = params.get('page') || 'start';
  const page = (requested in PAGE_TITLES || requested === 'start') ? requested : 'start';
  // "Change" links on the check page add return=check, so Continue and Back go back there.
  const returnToCheck = params.get('return') === 'check';

  // Send people to the right page when they arrive out of order, for example from a
  // bookmark or with the browser back button after sending.
  const redirect = redirectFor(page);
  if (redirect) {
    location.replace(redirect);
    return;
  }

  if (page === 'start' && answers.reference) {
    // A new visit to the start page after sending starts a new application.
    writeAnswers({});
  }

  const baseTitle = `${page === 'start' ? service.title : `${PAGE_TITLES[page]} – ${service.title}`} – DDA Demo Site`;
  document.title = baseTitle;
  document.querySelector(`.demo-page[data-page="${page}"]`).hidden = false;

  if (page === 'start') renderStart();
  else if (page === 'done') renderDone();
  else renderFormPage();

  function readAnswers() {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  }

  function writeAnswers(value) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Storage is blocked (private mode): the flow still works one page at a time.
    }
  }

  function redirectFor(page) {
    if (page === 'start') return null;
    if (page === 'done') return answers.reference ? null : urlFor();
    if (answers.reference) return urlFor('done');
    // The first question page that is not complete, before the requested page.
    const index = page === 'check' ? QUESTIONS.length : QUESTIONS.findIndex((q) => q.page === page);
    const missing = QUESTIONS.slice(0, index).find((q) => !q.complete(answers));
    return missing ? urlFor(missing.page) : null;
  }

  function renderStart() {
    const breadcrumb = $('service-breadcrumb');
    breadcrumb.hidden = false;
    breadcrumb.setAttribute('breadcrumbs', JSON.stringify([
      { text: 'Home', url: './' },
      { text: 'Services', url: `services.html?category=${encodeURIComponent(service.category)}` },
      { text: service.title },
    ]));
    $('service-name').textContent = service.title;
    document.querySelector('.demo-service-description').textContent = service.description;
    document.querySelector('.demo-service-fee').textContent = formatFee(service.fee);
    document.querySelector('.demo-service-time').textContent = service.time;
    $('start-now').setAttribute('href', urlFor(QUESTIONS[0].page));
  }

  function renderDone() {
    $('service-reference').textContent = answers.reference;
    $('next-steps').textContent = service.time === 'Immediately'
      ? 'We process your application straight away.'
      : `We will review your application and contact you within ${service.time}.`;
  }

  function renderFormPage() {
    const form = $('service-form');
    const index = QUESTIONS.findIndex((q) => q.page === page);
    const previous = returnToCheck ? 'check' : index > 0 ? QUESTIONS[index - 1].page : null;
    const next = returnToCheck ? 'check' : QUESTIONS[index + 1]?.page ?? 'check';

    form.hidden = false;
    const backLink = $('back-link');
    backLink.hidden = false;
    backLink.href = previous ? urlFor(previous) : urlFor();

    if (page === 'check') {
      renderCheck();
      $('form-submit').textContent = service.fee > 0 ? 'Accept and pay' : 'Accept and send';
    } else {
      fillFields();
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (page === 'check') {
        writeAnswers({ reference: `DDA-${Math.floor(100000 + Math.random() * 900000)}` });
        location.assign(urlFor('done'));
        return;
      }
      const errors = validate();
      showErrors(errors);
      if (errors.length) return;
      location.assign(urlFor(next));
    });

    // Error summary links move focus to the field, like GOV.UK Frontend does.
    $('error-summary-list').addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      event.preventDefault();
      const field = $(link.hash.slice(1));
      field?.focus({ preventScroll: true });
      field?.closest('dda-input, dda-phonefield, dda-attach-file')?.scrollIntoView({ block: 'center' });
    });
  }

  function renderCheck() {
    const shown = {
      service: service.title,
      fee: formatFee(service.fee),
      name: answers.name,
      email: answers.email,
      phone: answers.phone ? `${answers.phoneCode} ${answers.phone}`.trim() : 'Not given',
      eid: formatEid(answers.eid),
      docEid: answers.docEid,
      docSupport: answers.docSupport || 'Not given',
    };
    document.querySelectorAll('[data-answer]').forEach((cell) => {
      cell.textContent = shown[cell.dataset.answer] ?? '';
    });
    document.querySelectorAll('[data-change]').forEach((link) => {
      link.href = urlFor(link.dataset.change, { return: 'check' });
    });
  }

  // Puts saved answers back into the fields, for Change links and after a reload.
  function fillFields() {
    if (page === 'contact') {
      setInputValue('applicant-name', answers.name);
      setInputValue('applicant-email', answers.email);
      if (answers.phone) {
        // dda-phonefield has no value prop: type into it once it has rendered.
        // The country code goes back to its default.
        whenRendered('applicant-phone').then((input) => {
          input.value = answers.phone;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    }
    if (page === 'eid') setInputValue('applicant-eid', answers.eid);
    if (page === 'documents') {
      // Files cannot be kept between pages. A file sent earlier counts as uploaded.
      showCurrentFile('doc-eid', answers.docEid);
      showCurrentFile('doc-support', answers.docSupport);
    }
  }

  // Resolves with the element once a component has rendered it.
  async function whenRendered(id) {
    for (let frame = 0; frame < 300 && !$(id); frame++) {
      await new Promise(requestAnimationFrame);
    }
    return $(id);
  }

  function setInputValue(inputId, value) {
    if (value) document.querySelector(`dda-input[input_id="${inputId}"]`).setAttribute('value', value);
  }

  function showCurrentFile(inputId, fileName) {
    if (!fileName) return;
    const field = document.querySelector(`dda-attach-file[input_id="${inputId}"]`);
    field.setAttribute('helper_text', `Uploaded: ${fileName}. Choose another file to replace it.`);
  }

  /** Checks the fields on this page, saves the answers, and returns the errors in page order. */
  function validate() {
    const errors = [];
    const value = (inputId) => $(inputId)?.value.trim() ?? '';
    const check = (inputId, message) => message && errors.push({ inputId, message });

    if (page === 'contact') {
      const name = value('applicant-name');
      const email = value('applicant-email');
      const phone = value('applicant-phone').replace(/[\s-]/g, '');
      check('applicant-name', !name && 'Enter your full name');
      check('applicant-email', !email ? 'Enter your email address'
        : !EMAIL_PATTERN.test(email) && 'Enter an email address in the correct format, like name@example.com');
      check('applicant-phone', phone && !/^\d{6,14}$/.test(phone) && 'Enter a mobile number in the correct format, like 50 123 4567');
      // The country code is chosen in the field's own menu; its button shows the code.
      const phoneCode = document.querySelector('dda-phonefield .dda-dropdown-select')?.textContent.match(/\+\d+/)?.[0] ?? '';
      Object.assign(answers, { name, email, phone, phoneCode });
    }

    if (page === 'eid') {
      const eid = value('applicant-eid').replace(/[\s-]/g, '');
      check('applicant-eid', !eid ? 'Enter your Emirates ID number'
        : !/^784\d{12}$/.test(eid) && 'Enter your Emirates ID number in the correct format, like 784-1990-1234567-1');
      answers.eid = eid;
    }

    if (page === 'documents') {
      const eidFile = $('doc-eid')?.files?.[0];
      const supportFile = $('doc-support')?.files?.[0];
      check('doc-eid', !eidFile && !answers.docEid ? 'Select a copy of your Emirates ID' : fileError(eidFile, ['pdf', 'jpg', 'jpeg', 'png'], 'a PDF, JPG or PNG'));
      check('doc-support', fileError(supportFile, ['pdf'], 'a PDF'));
      if (eidFile) answers.docEid = eidFile.name;
      if (supportFile) answers.docSupport = supportFile.name;
    }

    // Only save answers that passed, so later pages never see a bad value.
    if (!errors.length) writeAnswers(answers);
    return errors;
  }

  function fileError(file, extensions, typeText) {
    if (!file) return null;
    if (!extensions.includes(file.name.split('.').pop().toLowerCase())) return `The selected file must be ${typeText}`;
    if (file.size > MAX_FILE_SIZE) return 'The selected file must be smaller than 5MB';
    return null;
  }

  // Shows each error at its field and in the error summary, which gets focus.
  function showErrors(errors) {
    const fields = document.querySelectorAll(`.demo-page[data-page="${page}"] :is(dda-input, dda-phonefield, dda-attach-file)`);
    fields.forEach((field) => {
      const id = field.getAttribute('input_id');
      const error = errors.find((e) => e.inputId === id);
      if (error) {
        field.setAttribute('error_message', error.message);
        field.setAttribute('validation_type', 'error');
      } else {
        field.removeAttribute('error_message');
        field.removeAttribute('validation_type');
      }
    });

    const summary = $('error-summary');
    const list = $('error-summary-list');
    list.replaceChildren(...errors.map(({ inputId, message }) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${inputId}`;
      link.textContent = message;
      item.append(link);
      return item;
    }));
    summary.hidden = errors.length === 0;
    document.title = errors.length ? `Error: ${baseTitle}` : baseTitle;
    if (errors.length) summary.focus();
  }
}

function formatEid(eid = '') {
  return eid.length === 15 ? `${eid.slice(0, 3)}-${eid.slice(3, 7)}-${eid.slice(7, 14)}-${eid.slice(14)}` : eid;
}

// Load setup.js only now, after the page content above is in place.
import('./setup.js');
