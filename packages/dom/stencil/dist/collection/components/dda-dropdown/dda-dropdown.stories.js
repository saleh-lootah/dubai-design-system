export default {
    title: 'Components/Dropdown',
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['default', 'small'],
            description: 'Size of the dropdown field',
        },
        type: {
            control: { type: 'select' },
            options: ['bg-transparent', 'bg-white'],
            description: 'Type of the dropdown field',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the dropdown field',
        },
        label: {
            control: 'text',
            description: 'Label for the dropdown field',
        },
        selected: {
            control: 'text',
            description: 'Selected value of the dropdown field',
        },
        disabled: {
            control: 'boolean',
            description: 'Disabled state of the dropdown field',
        },
        error: {
            control: 'text',
            description: 'Error message displayed below the dropdown field',
        },
        helper_text: {
            control: 'text',
            description: 'Helper text displayed below the dropdown field',
        },
        options: {
            control: 'array', // Use 'array' to handle array input
            description: 'Array of options for the select',
        },
        icon_mode: {
            control: 'boolean',
            description: 'Enable or disable icon mode',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class for the dropdown component',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the dropdown component',
        },
        button_id: {
            control: { type: 'text' },
            description: 'Button id for the dropdown field',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the dropdown field',
        },
        arrow_button_name: {
            control: { type: 'text' },
            description: 'Name for the arrow button',
        },
        dropdown_button_name: {
            control: { type: 'text' },
            description: 'Name for the dropdown button',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-dropdown\` component, pass the following props:

\`\`\`html
<dda-dropdown
    label="Headline"
    selected=""
    disabled="false"
    error=""
    helper_text=""
    type="bg-white"
    size="default"
    icon_mode="false"
    custom_class=""
    component_mode=""
    button_id="dropdown"
    aria_label="dropdown"
    options='["Option 1","Option 2","Option 3"]'
    arrow_button_name="arrow-button"
    dropdown_button_name="dropdown-button"
></dda-dropdown>
  \`\`\`
`,
            },
        },
    },
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'options')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    const optionsAttribute = `options='${JSON.stringify(args.options)}'`;
    return `<dda-dropdown ${attributes} ${optionsAttribute}></dda-dropdown>`;
};
export const Default = Template.bind({});
Default.args = {
    label: 'Headline',
    selected: '',
    disabled: false,
    error: '',
    helper_text: '',
    type: 'bg-white',
    size: 'default',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7'],
    icon_mode: false,
    custom_class: '',
    component_mode: '',
    button_id: 'dropdown',
    aria_label: 'dropdown',
    arrow_button_name: 'arrow-button',
    dropdown_button_name: 'dropdown-button',
};
export const Small = Template.bind({});
Small.args = {
    label: 'Headline',
    selected: '',
    disabled: false,
    error: '',
    helper_text: '',
    type: 'bg-white',
    size: 'small',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    icon_mode: false,
    custom_class: '',
    component_mode: '',
    button_id: 'dropdown',
    aria_label: 'dropdown',
    arrow_button_name: 'arrow-button',
    dropdown_button_name: 'dropdown-button',
};
export const Transparent = Template.bind({});
Transparent.args = {
    label: '',
    selected: '',
    disabled: false,
    error: '',
    helper_text: '',
    type: 'bg-transparent',
    size: 'default',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    icon_mode: false,
    custom_class: '',
    component_mode: '',
    button_id: 'dropdown',
    aria_label: 'dropdown',
    arrow_button_name: 'arrow-button',
    dropdown_button_name: 'dropdown-button',
};
export const icon_mode = Template.bind({});
icon_mode.args = {
    label: '',
    selected: '',
    disabled: false,
    error: '',
    helper_text: '',
    type: 'bg-white',
    size: 'default',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    icon_mode: true,
    custom_class: '',
    component_mode: '',
    button_id: 'dropdown',
    aria_label: 'dropdown',
    arrow_button_name: 'arrow-button',
    dropdown_button_name: 'dropdown-button',
};
//# sourceMappingURL=dda-dropdown.stories.js.map
