export default {
  title: 'Components/Scroll Icon',
  tags: ['autodocs'],
  component: 'dda-scroll-icon',
  argTypes: {
    scroll_icon_size: { control: 'select', options: ['sm', 'lg'], description: 'Size of the icon' },
    scroll_icon_color: { control: 'select', options: ['white', 'black'], description: 'Colour of the icon' },
  },
};

const Template = args => `
  <div style="padding: 24px; background: ${args.scroll_icon_color === 'white' ? '#1d211b' : '#ffffff'};">
    <dda-scroll-icon scroll_icon_size="${args.scroll_icon_size}" scroll_icon_color="${args.scroll_icon_color}"></dda-scroll-icon>
  </div>`;

export const Default = Template.bind({});
Default.args = { scroll_icon_size: 'sm', scroll_icon_color: 'white' };

export const LargeBlack = Template.bind({});
LargeBlack.args = { scroll_icon_size: 'lg', scroll_icon_color: 'black' };
