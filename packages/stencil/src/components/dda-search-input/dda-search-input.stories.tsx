export default {
  title: 'Components/Search Input',
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search field',
    },
    label: {
      control: 'text',
      description: 'Label for the search field',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'small'],
      description: 'Size of the search field',
    },
    helper_text: {
      control: 'text',
      description: 'Helper or footer text',
    },
    error_message: {
      control: 'text',
      description: 'Error message displayed below the search field',
    },
    show_button: {
      control: 'boolean',
      description: 'Show or hide the search button',
    },
    input_status: {
      control: { type: 'select' },
      options: ['normal','disabled'],
      description: 'Status of the search field',
    },
    has_error: {
      control: 'boolean',
      description: 'Error state of the search field',
    },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom class for the search field',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the search field',
    },
    button_id: {
      control: { type: 'text'},
      description: 'default',
    },
    aria_label: {
      control: { type: 'text'},
      description: 'Aria label for the search input',
    },
    button_aria_label: {
      control: { type: 'text' },
      describe: 'Aria label for the clear button',
    },
    onchange:{
      control: { type: 'text' },
      description: 'onchange event for the search field',
    },
    search_input_name: {
      control: { type: 'text' },
      description: 'Name for the search input field',
    },
    close_button_name: {
      control: { type: 'text' },
      description: 'Name for the close button',
    },
    search_button_name:{
      control: { type: 'text' },
      description: 'Name for the search button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  To use the \`dda-search-input\` component, pass the following props:

  \`\`\`html
<dda-search-input
    placeholder="Search"
    label="Search"
    size="default"
    helper_text="Helper or footer text"
    error_message=""
    show_button="false"
    has_error="false"
    custom_class=""
    component_mode=""
    button_id="button"
    aria_label="search-input"
    button_aria_label="clear-search"
    onchange="console.log('changed')"
    search_input_name="search-input"
    close_button_name="close-button"
    search_button_name="search-button"
></dda-search-input>
  \`\`\`
  `,
      },
    },
  },
};

const Template = (args) => {
  const attributes = Object.entries(args)
    .filter(([key, value]) => value !== undefined && key !== 'text')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `<dda-search-input ${attributes}></dda-search-input>`;
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Search',
  label: 'Search',
  size: 'default',
  helper_text: 'Helper or footer text',
  error_message: '',
  show_button: false,
  has_error: false,
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'search-input',
  button_aria_label: 'clear-search',
  onchange: '',
  search_input_name: "search-input",
  close_button_name: "close-button",
  search_button_name: "search-button",
};

export const WithButton = Template.bind({});
WithButton.args = {
  placeholder: 'Search',
  label: 'Search',
  size: 'default',
  helper_text: 'Helper or footer text',
  error_message: '',
  show_button: true,
  has_error: false,
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'search-input',
  button_aria_label: 'clear-search',
  onchange: '',
  search_input_name: "search-input",
  close_button_name: "close-button",
  search_button_name: "search-button",
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Search',
  label: 'Search',
  size: 'default',
  error_message: 'Helper or footer text',
  show_button: false,
  has_error: true,
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'search-input',
  button_aria_label: 'clear-search',
  onchange: '',
  search_input_name: "search-input",
  close_button_name: "close-button",
  search_button_name: "search-button",
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Search',
  label: 'Search',
  size: 'default',
  input_status: 'disabled',
  helper_text: 'Helper or footer text',
  show_button: false,
  has_error: false,
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'search-input',
  button_aria_label: 'clear-search',
  onchange: '',
  search_input_name: "search-input",
  close_button_name: "close-button",
  search_button_name: "search-button",
};