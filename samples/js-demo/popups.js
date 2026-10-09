// Sample popups for the sticky footer's Happiness and 04 links. dda-sticky-footer renders each
// icon as a plain link, so the page opens its own popup from a click on that link.
// The popups are placeholders: a real site loads the Happiness Meter and the 04 platform here.

import { createT } from './i18n.js';

const t = createT({
  en: {
    close: 'Close',
    happinessTitle: 'How was your experience?',
    happinessDescription: 'Sample popup. A real site shows the Happiness Meter here.',
    happy: 'Happy',
    neutral: 'Neutral',
    unhappy: 'Unhappy',
    thankYouHappiness: 'Thank you for your feedback. This sample does not send it.',
    platformTitle: '04 platform',
    platformDescription: 'Sample popup. A real site opens the 04 platform here, to send a suggestion, a complaint or a question.',
    yourMessage: 'Your message',
    send: 'Send',
    thankYouPlatform: 'Thank you. This sample does not send your message.',
  },
  ar: {
    close: 'إغلاق',
    happinessTitle: 'كيف كانت تجربتك؟',
    happinessDescription: 'نافذة تجريبية. في الموقع الحقيقي يظهر هنا مؤشر السعادة.',
    happy: 'سعيد',
    neutral: 'محايد',
    unhappy: 'غير سعيد',
    thankYouHappiness: 'شكراً لك على ملاحظاتك. هذا الموقع التجريبي لا يرسلها.',
    platformTitle: 'منصة 04',
    platformDescription: 'نافذة تجريبية. في الموقع الحقيقي تفتح هنا منصة 04 لإرسال اقتراح أو شكوى أو استفسار.',
    yourMessage: 'رسالتك',
    send: 'إرسال',
    thankYouPlatform: 'شكراً لك. هذا الموقع التجريبي لا يرسل رسالتك.',
  },
});

// The sticky footer links point at these hashes (see setup.js). Without JavaScript they do nothing.
export const HAPPINESS_HREF = '#happiness';
export const PLATFORM_04_HREF = '#platform-04';

function createCloseButton() {
  return `
  <button type="button" class="sample-popup-close" aria-label="${t('close')}" data-close>
    <i class="material-icons material-symbols-outlined" aria-hidden="true">close</i>
  </button>`;
}

function createHappinessPopup() {
  return `
  <dialog class="sample-popup" id="happiness-popup" aria-labelledby="happiness-popup-title">
    ${createCloseButton()}
    <h2 id="happiness-popup-title">${t('happinessTitle')}</h2>
    <p>${t('happinessDescription')}</p>
    <div class="sample-popup-faces" data-step="ask">
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_very_satisfied</i>${t('happy')}
      </button>
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_neutral</i>${t('neutral')}
      </button>
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_dissatisfied</i>${t('unhappy')}
      </button>
    </div>
    <p class="sample-popup-status" role="status"></p>
  </dialog>`;
}

function createPlatform04Popup() {
  return `
  <dialog class="sample-popup" id="platform-04-popup" aria-labelledby="platform-04-popup-title">
    ${createCloseButton()}
    <h2 id="platform-04-popup-title">${t('platformTitle')}</h2>
    <p>${t('platformDescription')}</p>
    <form data-step="ask">
      <label for="platform-04-message">${t('yourMessage')}</label>
      <textarea id="platform-04-message" name="message" rows="4" required></textarea>
      <button type="submit" class="dda-btn btn-color-default-primary btn-size-md">${t('send')}</button>
    </form>
    <p class="sample-popup-status" role="status"></p>
  </dialog>`;
}

function showThanks(dialog, text) {
  dialog.querySelector('[data-step="ask"]').hidden = true;
  dialog.querySelector('.sample-popup-status').textContent = text;
  dialog.querySelector('[data-close]').focus();
}

// Each time a popup opens, it starts again at the question.
function reset(dialog) {
  dialog.querySelector('[data-step="ask"]').hidden = false;
  dialog.querySelector('.sample-popup-status').textContent = '';
  dialog.querySelector('form')?.reset();
}

export function setupPopups() {
  document.body.insertAdjacentHTML('beforeend', createHappinessPopup() + createPlatform04Popup());
  const happiness = document.getElementById('happiness-popup');
  const platform04 = document.getElementById('platform-04-popup');

  for (const dialog of [happiness, platform04]) {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    // A click on the backdrop lands on the <dialog> itself, outside its content box.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
  happiness
    .querySelectorAll('[data-answer]')
    .forEach((button) =>
      button.addEventListener('click', () =>
        showThanks(happiness, t('thankYouHappiness')),
      ),
    );
  platform04.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    showThanks(platform04, t('thankYouPlatform'));
  });

  const popups = {
    [HAPPINESS_HREF]: happiness,
    [PLATFORM_04_HREF]: platform04,
  };
  // One listener on the document: the footer renders its links after this runs.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.(`a[href="${HAPPINESS_HREF}"], a[href="${PLATFORM_04_HREF}"]`);
    if (!link) return;
    event.preventDefault();
    const dialog = popups[link.getAttribute('href')];
    reset(dialog);
    dialog.showModal();
  });
}
