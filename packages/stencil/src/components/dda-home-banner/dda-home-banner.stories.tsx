const IMG_1 = 'https://images.pexels.com/photos/3680912/pexels-photo-3680912.jpeg';
const IMG_2 = 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg';
const IMG_3 = 'https://images.pexels.com/photos/162031/dubai-tower-arab-emirates-162031.jpeg';

const slide = (src, alt, title, subtitle) => `
  <slide>
    <img src="${src}" alt="${alt}" />
    <div class="slide-wrap">
      <div class="slide-content">
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <dda-button button_color="default-primary" size="lg">Call to action</dda-button>
      </div>
    </div>
  </slide>`;

export default {
  title: 'Components/Home Banner',
  component: 'dda-home-banner',
  argTypes: {
    autoplay: { control: 'boolean', description: 'Advance through the slides automatically' },
    interval: { control: 'number', description: 'Milliseconds each slide is shown for when autoplay is on' },
    aria_label: { control: 'text', description: 'Accessible name for the carousel region' },
    previous_button_label: { control: 'text', description: 'Accessible name for the previous-slide button' },
    next_button_label: { control: 'text', description: 'Accessible name for the next-slide button' },
    pause_button_label: { control: 'text', description: 'Accessible name for the pause button' },
    play_button_label: { control: 'text', description: 'Accessible name for the play button' },
    slide_button_label: { control: 'text', description: 'Prefix for each dot’s accessible name' },
  },
  parameters: {
    docs: {
      description: {
        component: `
The banner is **slotted** — each slide must be a \`<slide>\` element. The component
collects slides with \`querySelectorAll('slide')\`, so \`<div>\` children are ignored.

\`\`\`html
<dda-home-banner autoplay="true" interval="5000">
  <slide>
    <img src="assets/img/home-banner.jpg" alt="Aerial view of Dubai at sunset" />
    <div class="slide-wrap">
      <div class="slide-content">
        <h2>Digitalizing Life In Dubai</h2>
        <p>Pioneering and accelerating the pace of digital transformation in the city</p>
      </div>
    </div>
  </slide>
</dda-home-banner>
\`\`\`

Layout CSS ships inside the component's own chunk and is injected when the element
upgrades — the global \`dda.css\` plus \`defineCustomElements()\` is all you need.
        `,
      },
    },
    controls: { expanded: true },
  },
};

const Template = args => `
  <dda-home-banner
    autoplay="${args.autoplay}"
    interval="${args.interval}"
    aria_label="${args.aria_label}"
    previous_button_label="${args.previous_button_label}"
    next_button_label="${args.next_button_label}"
    pause_button_label="${args.pause_button_label}"
    play_button_label="${args.play_button_label}"
    slide_button_label="${args.slide_button_label}"
  >
    ${slide(IMG_1, 'Aerial view of Dubai at sunset', 'Digitalizing Life In Dubai', 'Pioneering and accelerating the pace of digital transformation in the city')}
    ${slide(IMG_2, 'Dubai skyline at dusk', 'Explore More', 'Find the services you need')}
    ${slide(IMG_3, 'Burj Khalifa against a clear sky', 'Join Us Today', 'Become part of our community')}
  </dda-home-banner>`;

const defaultArgs = {
  autoplay: false,
  interval: 5000,
  aria_label: 'Highlights',
  previous_button_label: 'Previous slide',
  next_button_label: 'Next slide',
  pause_button_label: 'Pause slideshow',
  play_button_label: 'Play slideshow',
  slide_button_label: 'Go to slide',
};

export const Default = Template.bind({});
Default.args = { ...defaultArgs };

export const Autoplay = Template.bind({});
Autoplay.args = { ...defaultArgs, autoplay: true, interval: 5000 };
Autoplay.parameters = {
  docs: {
    description: {
      story:
        'With `autoplay` on, a pause/play button is rendered next to the slide dots (WCAG 2.2.2). ' +
        'Autoplay also suspends on hover and on keyboard focus, and is disabled entirely when ' +
        '`prefers-reduced-motion: reduce` is set.',
    },
  },
};
