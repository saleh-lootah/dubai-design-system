export default {
  title: 'Components/Select',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default','small'],
      description: 'Size of the select',
    },
    label: {
      control: 'text',
      description: 'Label for the select',
    },
    options: {
      control: 'array', // Use 'array' to handle array input
      description: 'Array of options for the select',
    },
    selected: {
      control: 'text',
      description: 'Selected option',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    error: {
      control: { type: 'select' },
      options: ['normal','error'],
      description: 'Error state of the select',
    },
    error_message: {
      control: 'text',
      description: 'Error message to display',
    },
    helper_text: {
      control: 'text',
      description: 'Helper or footer text',
    },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom class for the select',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the select component',
    },
    button_id: {
      control: { type: 'text' },
      description: 'default',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the select element',
    },
    toggle_button_name:  {
      control: { type: 'text' },
      description: 'Name for the toggle button',
    },
    option_select_button_name: {
      control: { type: 'text' },
      description: 'Name for the option select button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  To use the \`dda-select\` component, pass the following props:

  \`\`\`html
<dda-select
    label="Select an option"
    selected="Option 1"
    disabled="false"
    helper_text="Helper or footer text"
    error_message=""
    size="default"
    custom_class=""
    component_mode=""
    button_id="button"
    aria_label="select"
    options='["Option 1","Option 2","Option 3"]'
    toggle_button_name="toggle_button_name"
    option_select_button_name="option_select_button_name"
></dda-select>
  \`\`\`
  `,
      },
    },
  },
};

const Template = (args) => {
  const attributes = Object.entries(args)
    .filter(([key, value]) => value !== undefined && key !== 'text' && key !== 'options')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const optionsAttribute = `options='${JSON.stringify(args.options)}'`;

  return `<dda-select ${attributes} ${optionsAttribute}></dda-select>`;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Select an option',
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: 'Option 1',
  disabled: false,
  helper_text: 'Helper or footer text',
  error_message: '',
  size: 'default',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'select',
  toggle_button_name: "toggle_button_name",
  option_select_button_name: "option_select_button_name",
};

export const Small = Template.bind({});
Small.args = {
  label: 'Select an option',
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: 'Option 1',
  disabled: false,
  helper_text: 'Helper or footer text',
  error_message: '',
  size: 'small',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'select',
  toggle_button_name: "toggle_button_name",
  option_select_button_name: "option_select_button_name",
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Select an option',
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: 'Option 1',
  disabled: false,
  error: 'error',
  error_message: 'This is an error message',
  size: 'default',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'select',
  toggle_button_name: "toggle_button_name",
  option_select_button_name: "option_select_button_name",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Select an option',
  options: ['Option 1', 'Option 2', 'Option 3'],
  selected: 'Option 1',
  disabled: true,
  error_message: 'Helper or footer text',
  size: 'default',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'select',
  toggle_button_name: "toggle_button_name",
  option_select_button_name: "option_select_button_name",
};


