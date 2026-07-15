export default {
    title: 'Components/Number Field',
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['default', 'small'],
            description: 'Size of the number field',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the number field',
        },
        label: {
            control: 'text',
            description: 'Label for the number field',
        },
        value: {
            control: 'text',
            description: 'Value of the number field',
        },
        currencies: {
            control: 'array',
            description: 'Array of currencies for the number field',
        },
        helper_text: {
            control: 'text',
            description: 'Helper or footer text',
        },
        error_message: {
            control: 'text',
            description: 'Error message displayed below the number field',
        },
        validation_type: {
            control: { type: 'select' },
            options: ['normal', 'error'],
            description: 'Validation type of the number field',
        },
        input_status: {
            control: { type: 'select' },
            options: ['normal', 'disabled'],
            description: 'Input status of the number field',
        },
        selected_currency: {
            control: 'text',
            description: 'Selected currency for the number field',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class for the number field',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the number field component',
        },
        input_id: {
            control: { type: 'text' },
            description: 'default',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the number field',
        },
        onchange: {
            control: { type: 'text' },
            description: 'onchange event for the number field',
        },
        input_name: {
            control: { type: 'text' },
            description: 'Name of the input field',
        },
        toggle_button_name: {
            control: { type: 'text' },
            description: 'Name of the toggle button',
        },
        currency_button_name: {
            control: { type: 'text' },
            description: 'Name of the currency selector',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-number-field\` component, pass the following props:
  
  \`\`\`html
<dda-number-field
    label="Amount"
    value=""
    placeholder="Enter amount"
    helper_text="Helper or footer text"
    error_message=""
    validation_type="normal"
    size="medium"
    input_status="normal"
    selected_currency="USD"
    custom_class=""
    component_mode=""
    input_id="input"
    aria_label="input"
    currencies='["USD","EUR","GBP","AED","PKR"]'
    onchange="console.log('changed')"
></dda-number-field>
    \`\`\`
  `,
            },
        },
    },
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'currencies')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    const currenciesAttribute = `currencies='${JSON.stringify(args.currencies)}'`;
    return `<dda-number-field ${attributes} ${currenciesAttribute}></dda-number-field>`;
};
export const Default = Template.bind({});
Default.args = {
    label: 'Amount',
    value: '',
    placeholder: 'Enter amount',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    size: 'medium',
    input_status: 'normal',
    currencies: ['USD', 'EUR', 'GBP', 'AED', 'PKR'],
    selected_currency: 'USD',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
    toggle_button_name: 'toggle-button',
    currency_button_name: 'currency-button',
};
export const Small = Template.bind({});
Small.args = {
    label: 'Amount',
    value: '',
    placeholder: 'Enter amount',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    size: 'small',
    input_status: 'normal',
    currencies: ['USD', 'EUR', 'GBP', 'AED', 'PKR'],
    selected_currency: 'USD',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
    toggle_button_name: 'toggle-button',
    currency_button_name: 'currency-button',
};
export const Error = Template.bind({});
Error.args = {
    label: 'Amount',
    value: '',
    placeholder: 'Enter amount',
    error_message: 'This is an error message',
    validation_type: 'error',
    size: 'medium',
    input_status: 'normal',
    currencies: ['USD', 'EUR', 'GBP', 'AED', 'PKR'],
    selected_currency: 'USD',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
    toggle_button_name: 'toggle-button',
    currency_button_name: 'currency-button',
};
export const Disabled = Template.bind({});
Disabled.args = {
    label: 'Amount',
    value: '',
    placeholder: 'Enter amount',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    size: 'medium',
    input_status: 'disabled',
    currencies: ['USD', 'EUR', 'GBP', 'AED', 'PKR'],
    selected_currency: 'USD',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
    toggle_button_name: 'toggle-button',
    currency_button_name: 'currency-button',
};
//# sourceMappingURL=dda-number-field.stories.js.map
