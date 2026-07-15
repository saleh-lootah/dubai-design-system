export default {
    title: 'Components/Checkbox',
    tags: ['autodocs'],
    argTypes: {
        title_text: {
            control: 'text',
            description: 'Title for the checkbox',
        },
        supporting: {
            control: 'text',
            description: 'Supporting text for the checkbox',
        },
        group_name: {
            control: 'text',
            description: 'default',
        },
        labelfor: {
            control: 'text',
            description: 'default',
        },
        input_id: {
            control: 'text',
            description: 'default',
        },
        checked: {
            control: 'boolean',
            description: 'Checked state of the checkbox',
        },
        checkbox_status: {
            control: { type: 'select' },
            options: ['normal', 'disabled'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg',],
        },
        style_type: {
            control: { type: 'select' },
            options: ['square', 'rounded',],
        },
        custom_class: {
            control: { type: 'text' },
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the checkbox component',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the checkbox',
        },
        onclick: {
            control: { type: 'text' },
            description: 'Event handler for the checkbox component',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-checkbox\` component, pass the following props:

\`\`\`html
<dda-checkbox
    title_text="Checkbox Title"
    checked="false"
    size="md"
    style_type="square"
    supporting="Supporting Text"
    group_name="checkboxgroup"
    input_id="testId"
    custom_class=""
    component_mode=""
    aria_label="checkbox"
    onclick="console.log('Checkbox clicked')"
></dda-checkbox>
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
    return `<dda-checkbox ${attributes}></dda-checkbox>`;
};
export const checkboxSquare = Template.bind({});
checkboxSquare.args = {
    title_text: 'Checkbox Title',
    checked: false,
    size: 'md',
    style_type: 'square',
    supporting: 'Supporting Text',
    group_name: 'checkboxgroup',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    onclick: "",
};
export const checkboxRounded = Template.bind({});
checkboxRounded.args = {
    title_text: 'Checkbox Title',
    checked: false,
    size: 'md',
    style_type: 'rounded',
    supporting: 'Supporting Text',
    group_name: 'checkboxgroup',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    aria_label: 'checkbox',
    onclick: "",
};
//# sourceMappingURL=dda-checkbox.stories.js.map
