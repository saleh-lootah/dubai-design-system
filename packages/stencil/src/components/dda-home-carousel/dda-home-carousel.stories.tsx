const cards = [
  { banner_card_href: '#', image_src: '', banner_card_title: 'About us', banner_card_description: 'Who we are and what we do' },
  { banner_card_href: '#', image_src: '', banner_card_title: 'Open data', banner_card_description: 'Download public data sets' },
  { banner_card_href: '#', image_src: '', banner_card_title: 'Partnerships', banner_card_description: 'Public and private projects' },
  { banner_card_href: '#', image_src: '', banner_card_title: 'Maliyoun', banner_card_description: 'Finance careers programme' },
  { banner_card_href: '#', image_src: '', banner_card_title: 'Services', banner_card_description: 'All services in one place' },
];

export default {
  title: 'Components/Home Carousel',
  tags: ['autodocs'],
  component: 'dda-home-carousel',
  argTypes: {
    items_in_view: { control: { type: 'number', min: 1 }, description: 'Cards shown at once on wide screens' },
    aria_label: { control: 'text', description: 'Accessible name of the card list' },
  },
};

const Template = args => `
  <div class="home-intros" style="position: relative; height: 480px; background: #1d211b;">
    <div class="dda-home-quick-links-wrap"><div class="dda-home-quick-links">
      <dda-home-carousel items_in_view="${args.items_in_view}" aria_label="${args.aria_label}" bannercardlist='${JSON.stringify(cards)}'></dda-home-carousel>
    </div></div>
  </div>`;

export const Default = Template.bind({});
Default.args = { items_in_view: 4, aria_label: 'Quick links' };
