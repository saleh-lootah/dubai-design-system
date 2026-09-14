export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  argTypes: {
    total_pages: {
      control: 'number',
      description: 'Total number of pages',
    },
    current_page: {
      control: 'number',
      description: 'Current page number',
    },
    type: {
      control: { type: 'select' },
      options: ['simple-slider', 'buttons', 'text', 'text-pages', 'button-text', 'buttons-pages', 'full'],
      description: 'Type of pagination design',
    },
    custom_class: {
      control: { type: 'text' }, // Add control for custom class
      description: 'Custom class for the pagination component',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the pagination component',
    },
    simple_slider_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is simple-slider',
    },
    simple_slider_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is simple-slider',
    },
    buttons_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is buttons',
    },
    buttons_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is buttons',
    },
    text_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is text',
    },
    text_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is text',
    },
    text_pages_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is text-pages',
    },
    text_pages_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is text-pages',
    },
    button_text_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is button-text',
    },
    button_text_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is button-text',
    },
    buttons_pages_prev_button: {
      control: { type: 'text' },
      description: '`name` of the previous button when type is buttons-pages',
    },
    buttons_pages_next_button: {
      control: { type: 'text' },
      description: '`name` of the next button when type is buttons-pages',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
To use the \`dda-pagination\` component, pass the following props:

\`\`\`html
<dda-pagination
    total_pages="8"
    current_page="1"
    type="simple-slider"
    custom_class=""
    component_mode=""
    simple_slider_prev_button=""
    simple_slider_next_button=""
    buttons_prev_button=""
    buttons_next_button=""
    text_prev_button=""
    text_next_button=""
    text_pages_prev_button=""
    text_pages_next_button=""
    button_text_prev_button=""
    button_text_next_button=""
    buttons_pages_prev_button=""
    buttons_pages_next_button=""
></dda-pagination>
  \`\`\`
`,
      },
    },
  },  
};

const Template = (args) => {
  const attributes = Object.entries(args)
    .filter(([key, value]) => value !== undefined  && key !== 'text')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `<dda-pagination ${attributes}></dda-pagination>`;
};

export const SimpleSlider = Template.bind({});
SimpleSlider.args = {
  total_pages: 8,
  current_page: 1,
  type: 'simple-slider',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const Buttons = Template.bind({});
Buttons.args = {
  total_pages: 8,
  current_page: 1,
  type: 'buttons',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const Text = Template.bind({});
Text.args = {
  total_pages: 8,
  current_page: 1,
  type: 'text',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const TextPages = Template.bind({});
TextPages.args = {
  total_pages: 8,
  current_page: 1,
  type: 'text-pages',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const ButtonText = Template.bind({});
ButtonText.args = {
  total_pages: 8,
  current_page: 1,
  type: 'button-text',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const ButtonsPages = Template.bind({});
ButtonsPages.args = {
  total_pages: 8,
  current_page: 1,
  type: 'buttons-pages',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};

export const Full = Template.bind({});
Full.args = {
  total_pages: 8,
  current_page: 1,
  type: 'full',
  custom_class: '',
  component_mode: '',
  simple_slider_prev_button: "",
  simple_slider_next_button: "",
  buttons_prev_button: "",
  buttons_next_button: "",
  text_prev_button: "",
  text_next_button: "",
  text_pages_prev_button: "",
  text_pages_next_button: "",
  button_text_prev_button: "",
  button_text_next_button: "",
  buttons_pages_prev_button: "",
  buttons_pages_next_button: "",
};
