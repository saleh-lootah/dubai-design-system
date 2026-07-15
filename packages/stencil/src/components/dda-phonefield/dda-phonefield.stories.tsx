export default {
  title: 'Components/Phone Field',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the phone field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for the phone field',
    },
    helper_text: {
      control: 'text',
      description: 'Helper text to display below the phone field',
    },
    error_message: {
      control: 'text',
      description: 'Error message to display below the phone field',
    },
    validation_type: {
      control: { type: 'select' },
      options: ['normal','error'],
      description: 'Validation type of the phone field',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the phone field',
    },
    size: {
      control: { type: 'select' },
      options: ['default','small'],
      description: 'Size of the phone field',
    },
    custom_class: {
      control: { type: 'text' }, // Add control for custom class
      description: 'Custom class for the phone field',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the phone field component',
    },
    input_id: {
      control: {type: 'text'},
      description: 'Input id for the phone field',
    },
    button_id:{ 
      control: {type: 'text'},
      description: 'Button id for the phone field',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the phone field',
    },
    button_aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the button inside the phone field',
    },
    onchange: {
      control: { type: 'text' },
      description: 'onchange event for the phone field',
    },
    toggle_button_name: {
      control: { type: 'text' },
      description: 'Name for the toggle button',
    },
    country_select_button_name: {
      control: { type: 'text' },
      description: 'Name for the country select button',
    },
    phone_input_name: {
      control: { type: 'text' },
      description: 'Name for the phone input field',
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
To use the \`dda-phonefield\` component, pass the following props:

\`\`\`html
<dda-phonefield
    label="Phone Number"
    placeholder="00 000 0000"
    helper_text="Helper or footer text"
    error_message=""
    disabled="false"
    custom_class=""
    component_mode=""
    input_id="input"
    button_id="button"
    aria_label="phone-field"
    button_aria_label="phone-button"
    onchange="console.log('changed')"
    toggle_button_name="toggle-button"
    country_select_button_name="country-select-button"
    phone_input_name="phone-input"
    
></dda-phonefield>
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

  return `<dda-phonefield ${attributes}></dda-phonefield>`;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Phone Number',
  placeholder: '00 000 0000',
  helper_text: 'Helper or footer text',
  error_message: '',
  disabled: false,
  custom_class: '',
  component_mode: '',
  input_id: 'input',
  button_id: 'button',
  aria_label: 'phone-field',
  button_aria_label: 'phone-button',
  onchange: '',
  toggle_button_name: "toggle-button",
  country_select_button_name: "country-select-button",
  phone_input_name: "phone-input",
};

export const FocusFilled = Template.bind({});
FocusFilled.args = {
  label: 'Phone Number',
  placeholder: 'Enter phone number',
  helper_text: 'Helper or footer text',
  error_message: '',
  disabled: false,
  phone_number: '',
  isFocused: true,
  custom_class: 'dda-input-focus',
  component_mode: '',
  input_id: 'input',
  button_id: 'button',
  aria_label: 'phone-field',
  button_aria_label: 'phone-button',
  onchange: '',
  toggle_button_name: "toggle-button",
  country_select_button_name: "country-select-button",
  phone_input_name: "phone-input",
};

export const Filled = Template.bind({});
Filled.args = {
  label: 'Phone Number',
  placeholder: 'Enter phone number',
  helper_text: 'Helper or footer text',
  error_message: '',
  disabled: false,
  phone_number: '56 546 0000',
  custom_class: '',
  component_mode: '',
  input_id: 'input',
  button_id: 'button',
  aria_label: 'phone-field',
  button_aria_label: 'phone-button',
  onchange: '',
  toggle_button_name: "toggle-button",
  country_select_button_name: "country-select-button",
  phone_input_name: "phone-input",
};

export const Error = Template.bind({});
Error.args = {
  label: 'Phone Number',
  placeholder: 'Enter phone number',
  helper_text: '',
  error_message: 'This is an error message',
  validation_type: 'error',
  disabled: false,
  custom_class: '',
  component_mode: '',
  input_id: 'input',
  button_id: 'button',
  aria_label: 'phone-field',
  button_aria_label: 'phone-button',
  onchange: '',
  toggle_button_name: "toggle-button",
  country_select_button_name: "country-select-button",
  phone_input_name: "phone-input",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Phone Number',
  placeholder: 'Enter phone number',
  helper_text: 'Helper or footer text',
  error_message: '',
  disabled: true,
  custom_class: '',
  component_mode: '',
  input_id: 'input',
  button_id: 'button',
  aria_label: 'phone-field',
  button_aria_label: 'phone-button',
  onchange: '',
  toggle_button_name: "toggle-button",
  country_select_button_name: "country-select-button",
  phone_input_name: "phone-input",
};
