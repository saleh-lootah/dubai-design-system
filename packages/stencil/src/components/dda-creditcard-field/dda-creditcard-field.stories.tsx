export default {
    title: 'Components/Credit Card Field',
    tags: ['autodocs'],
    argTypes: {
      placeholder: {
        control: 'text',
        description: 'Placeholder text for the input field',
      },
      label: {
        control: 'text',
        description: 'Label for the input field',
      },
      restrict_input: {
        control: 'boolean',
        description: 'Restrict the input field to 16 digits',
      },
      value: {
        control: 'text',
        description: 'Value of the input field',
      },
      card_icon: {
        control: 'text',
        description: 'URL of the card icon',
      },
      error_message: {
        control: 'text',
        description: 'Error message displayed below the input field',
      },
      validation_type: {
        control: { type: 'select' },
        options: ['normal', 'error'],
        description: 'Validation type of the input field',
      },
      size: {
        control: { type: 'select' },
        options: ['default', 'small',],
        description: 'Size of the input field',
      },
      input_type: {
        control: { type: 'select' },
        options: ['normal', 'disabled'],
        description: 'Input type of the input field',
      },
      helper_text: {
        control: 'text',
        description: 'Helper text displayed below the input field',
      },
      disabled: {
        control: 'boolean',
        description: 'Disables the input field',
      },
      custom_class: {
        control: { type: 'text' },
        description: 'Custom class for the input field',
      },
      component_mode: {
        control: { type: 'check' },
        options: ['light-mode'],
        description: 'Mode of the credit card field component',
      },
      input_id: {
        control: { type: 'text' },
        description: 'default',
      },
      aria_label: {
        control: { type: 'text' },
        description: 'Accessible label for the credit card field',
      },
      onchange:{
        control: { type: 'text' },
        description: 'onchange event for the credit card field',
      },
      input_name: {
        control: { type: 'text' },
        description: 'Name of the input field',
      }
    },
    parameters: {
      docs: {
        description: {
          component: `
  To use the \`dda-credit-card-field\` component, pass the following props:
  
  \`\`\`html
<dda-creditcard-field
    placeholder="0000 - 0000 - 0000 - 0000"
    label="Card Number"
    restrict_input="false"
    value=""
    card_icon="https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg"
    size="default"
    helper_text="Helper or footer text"
    error_message=""
    validation_type="normal"
    custom_class=""
    component_mode=""
    input_id="input"
    aria_label="credit-card-field"
    onchange="console.log('changed')"
    input_name="input"
></dda-creditcard-field>
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
  
    return `<dda-creditcard-field ${attributes}></dda-creditcard-field>`;
  };
  
  export const Default = Template.bind({});
  Default.args = {
    placeholder: '0000 - 0000 - 0000 - 0000',
    label: 'Card Number',
    restrict_input: false,
    value: '',
    card_icon: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'credit-card-field',
    onchange: '',
    input_name: 'input',
  };
  
  export const SmallSize = Template.bind({});
  SmallSize.args = {
    placeholder: '0000 - 0000 - 0000 - 0000',
    label: 'Card Number',
    restrict_input: false,
    value: '',
    card_icon: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    size: 'small',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'credit-card-field',
    onchange: '',
    input_name: 'input',
  };

  export const WithErrorMessage = Template.bind({});
  WithErrorMessage.args = {
    placeholder: '0000 - 0000 - 0000 - 0000',
    label: 'Card Number',
    restrict_input: false,
    value: '5464 - 5363 - 5363 - 6363',
    card_icon: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    size: 'default',
    helper_text: '',
    error_message: 'This is an error message',
    validation_type: 'error',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'credit-card-field',
    onchange: '',
    input_name: 'input',
  };
   
  export const Disabled = Template.bind({});
  Disabled.args = {
    placeholder: '0000 - 0000 - 0000 - 0000',
    label: 'Card Number',
    restrict_input: false,
    value: '',
    card_icon: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    disabled: true,
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'credit-card-field',
    onchange: '',
    input_name: 'input',
  };  