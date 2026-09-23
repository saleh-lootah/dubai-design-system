// Sample popups for the sticky footer's Happiness and 04 links. dda-sticky-footer renders each
// icon as a plain link, so the page opens its own popup from a click on that link.
// The popups are placeholders: a real site loads the Happiness Meter and the 04 platform here.

// The sticky footer links point at these hashes (see setup.js). Without JavaScript they do nothing.
export const HAPPINESS_HREF = '#happiness';
export const PLATFORM_04_HREF = '#platform-04';

const closeButton = `
  <button type="button" class="sample-popup-close" aria-label="Close" data-close>
    <i class="material-icons material-symbols-outlined" aria-hidden="true">close</i>
  </button>`;

const happinessPopup = `
  <dialog class="sample-popup" id="happiness-popup" aria-labelledby="happiness-popup-title">
    ${closeButton}
    <h2 id="happiness-popup-title">How was your experience?</h2>
    <p>Sample popup. A real site shows the Happiness Meter here.</p>
    <div class="sample-popup-faces" data-step="ask">
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_very_satisfied</i>Happy
      </button>
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_neutral</i>Neutral
      </button>
      <button type="button" class="dda-btn btn-color-default-secondary btn-size-md" data-answer>
        <i class="material-icons material-symbols-outlined" aria-hidden="true">sentiment_dissatisfied</i>Unhappy
      </button>
    </div>
    <p class="sample-popup-status" role="status"></p>
  </dialog>`;

const platform04Popup = `
  <dialog class="sample-popup" id="platform-04-popup" aria-labelledby="platform-04-popup-title">
    ${closeButton}
    <h2 id="platform-04-popup-title">04 platform</h2>
    <p>Sample popup. A real site opens the 04 platform here, to send a suggestion, a complaint or a question.</p>
    <form data-step="ask">
      <label for="platform-04-message">Your message</label>
      <textarea id="platform-04-message" name="message" rows="4" required></textarea>
      <button type="submit" class="dda-btn btn-color-default-primary btn-size-md">Send</button>
    </form>
    <p class="sample-popup-status" role="status"></p>
  </dialog>`;

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
  document.body.insertAdjacentHTML('beforeend', happinessPopup + platform04Popup);
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
        showThanks(happiness, 'Thank you for your feedback. This sample does not send it.'),
      ),
    );
  platform04.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    showThanks(platform04, 'Thank you. This sample does not send your message.');
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
