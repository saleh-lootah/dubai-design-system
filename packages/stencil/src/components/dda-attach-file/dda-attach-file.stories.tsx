export default {
    title: 'Components/Attach File',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: `
  To use the \`dda-attach-file\` component, pass the following props:
  
  \`\`\`html
<dda-attach-file
    label="Attach File"
    helper_text="Helper or footer text"
    error_message=""
    size="default"
    validation_type="normal"
    input_type="normal"
    custom_class=""
    component_mode=""
    input_id="input"
    button_id="button"
    aria_label="input"
    button_aria_label="button"
    button_name="button"
    input_name="input"
    onchange="console.log('changed')"
></dda-attach-file>
    \`\`\`
  `,
        },
      },
    },
  
    argTypes: {
      label: {
        control: 'text',
        description: 'Label for the attach file component',
      },
      helper_text: {
        control: 'text',
        description: 'Helper text for the attach file component',
      },
      error_message: {
        control: 'text',
        description: 'Error message displayed below the attach file component',
      },
      size: {
        control: { type: 'select' },
        options: ['default', 'small'],
        description: 'Size of the attach file component',
      },
      validation_type: {
        control: { type: 'select' },
        options: ['normal', 'error'],
        description: 'Validation type of the attach file component',
      },
      input_type: {
        control: { type: 'select' },
        options: ['normal', 'disabled'],
        description: 'Input type of the attach file component',
      },
      custom_class: {
        control: { type: 'text' },
        description: 'Custom class to be applied by the user',
      },
      component_mode: {
        control: { type: 'check' },
        options: ['light-mode'],
        description: 'Mode of the attach file component',
      },
      input_id: {
        control: 'text',
        description: 'Input id for the attach file component',
      },
      button_id: {
        control: 'text',
        description: 'Button id for the attach file component',
      },
      aria_label: {
        control: 'text',
        description: 'Aria label for accessibility',
      },
      button_aria_label: {
        control: 'text',
        description: 'Aria label for the upload button',
      },
      onchange:{
        control: 'text',
        description: 'onchange event for the attach file component',
      },
      button_name:{
        control: 'text',
        description: 'Name for the upload button',
      },
      input_name:{
        control: 'text',
        description: 'Name for the input field',
      }
    },
  };
  
  const Template = (args) => {
    const attributes = Object.entries(args)
      .filter(([key, value]) => value !== undefined && key !== 'text')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  
    return `<dda-attach-file ${attributes}></dda-attach-file>`;
  };
  
  export const Default = Template.bind({});
  Default.args = {
    label: 'Attach File',
    helper_text: 'Helper or footer text',
    error_message: '',
    size: 'default',
    validation_type: 'normal',
    input_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    button_id: 'button',
    aria_label: 'input',
    button_aria_label: 'button',
    onchange: '',
    button_name: 'button',
    input_name: 'input'
  };

  export const Small = Template.bind({});
  Small.args = {
    label: 'Attach File',
    helper_text: 'Helper or footer text',
    error_message: '',
    size: 'small',
    validation_type: 'normal',
    input_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    button_id: 'button',
    aria_label: 'input',
    button_aria_label: 'button',
    onchange: '',
    button_name: 'button',
    input_name: 'input'
  };
  
  export const ErrorState = Template.bind({});
  ErrorState.args = {
    label: 'Attach File',
    helper_text: '',
    error_message: 'Helper or footer text',
    size: 'default',
    validation_type: 'error',
    input_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    button_id: 'button',
    aria_label: 'input',
    button_aria_label: 'button',
    onchange: '',
    button_name: 'button',
    input_name: 'input'
  };
  
  export const Disabled = Template.bind({});
  Disabled.args = {
    label: 'Attach File',
    helper_text: 'Helper or footer text',
    error_message: '',
    size: 'default',
    validation_type: 'normal',
    input_type: 'disabled',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    button_id: 'button',
    aria_label: 'input',
    button_aria_label: 'button',
    onchange: '',
    button_name: 'button',
    input_name: 'input'
  };
  