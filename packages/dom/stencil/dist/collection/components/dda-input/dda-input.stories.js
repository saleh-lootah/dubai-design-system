export default {
    title: 'Components/Input',
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['default', 'small'],
            description: 'Size of the input field',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input field',
        },
        label: {
            control: 'text',
            description: 'Label for the input field',
        },
        value: {
            control: 'text',
            description: 'Value of the input field',
        },
        type: {
            control: { type: 'select' },
            options: ['text', 'password', 'email', 'number', 'time', 'date', 'Witherror', 'disabled'],
            description: 'Type of the input field',
        },
        helper_text: {
            control: 'text',
            description: 'Helper or footer text',
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
        input_status: {
            control: { type: 'select' },
            options: ['normal', 'disabled'],
            description: 'Input status of the input field',
        },
        custom_class: {
            control: { type: 'text' }, // Add control for custom class
            description: 'Custom class for the input field',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the input component',
        },
        input_id: {
            control: { type: 'text' },
            description: 'default',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the input field',
        },
        onchange: {
            control: { type: 'text' },
            description: 'onchange event for the input field',
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
To use the \`dda-input\` component, pass the following props:

\`\`\`html
<dda-input
    placeholder="Enter text"
    label="Text Input"
    value=""
    type="text"
    size="default"
    helper_text="Helper or footer text"
    error_message=""
    validation_type="normal"
    custom_class=""
    component_mode=""
    input_id="input"
    aria_label="input"
    onchange="console.log('changed')"
    input_name=""
></dda-input>
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
    return `<dda-input ${attributes}></dda-input>`;
};
export const Text = Template.bind({});
Text.args = {
    placeholder: 'Enter text',
    label: 'Text Input',
    value: '',
    type: 'text',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    validation_type: 'normal',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Password = Template.bind({});
Password.args = {
    placeholder: 'Enter password',
    label: 'Password Input',
    value: '',
    type: 'password',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Email = Template.bind({});
Email.args = {
    placeholder: 'Enter email',
    label: 'Email Input',
    value: '',
    type: 'email',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Number = Template.bind({});
Number.args = {
    placeholder: 'Enter number',
    label: 'Number Input',
    value: '',
    type: 'number',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Date = Template.bind({});
Date.args = {
    placeholder: 'Enter Date',
    label: 'Date Input',
    value: '',
    type: 'date',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Time = Template.bind({});
Time.args = {
    placeholder: 'Enter Time',
    label: 'Time Input',
    value: '',
    type: 'time',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const Witherror = Template.bind({});
Witherror.args = {
    placeholder: 'Enter value',
    label: 'Input with Error',
    value: '',
    type: 'text',
    size: 'default',
    helper_text: '',
    error_message: 'Helper or footer text',
    validation_type: 'error',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
export const disabled = Template.bind({});
disabled.args = {
    placeholder: 'Enter number',
    label: 'Number Input',
    value: '',
    type: 'number',
    size: 'default',
    helper_text: 'Helper or footer text',
    error_message: '',
    input_status: 'disabled',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'input',
    onchange: '',
    input_name: 'input',
};
//# sourceMappingURL=dda-input.stories.js.map
