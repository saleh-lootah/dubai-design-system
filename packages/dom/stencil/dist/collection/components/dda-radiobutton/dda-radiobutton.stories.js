export default {
    title: 'Components/Radio Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-radiobutton\` component, pass the following props:

\`\`\`html
<dda-radiobutton
    title_text="Radio Button Title"
    checked="false"
    size="md"
    variants="normal"
    supporting="Supporting Text"
    group_name="radiogroup"
    input_id="testId"
    custom_class=""
    component_mode=""
    aria_label="radio-button"
    onclick="console.log('clicked')"
></dda-radiobutton>
  \`\`\`
`,
            },
        },
    },
    argTypes: {
        title_text: {
            control: 'text',
            description: 'Title for the radiobutton',
        },
        supporting: {
            control: 'text',
            description: 'Supporting Text',
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
            description: 'Checked state of the radiobutton',
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg',],
        },
        variants: {
            control: { type: 'select' },
            options: ['normal', 'outlined', 'faded',],
        },
        custom_class: {
            control: { type: 'text' },
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the radio button component',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the radio button',
            radio_status: {
                control: { type: 'select' },
                options: ['normal', 'disabled'],
            },
            onclick: {
                control: { type: 'text' },
                description: 'event handler for radio button',
            }
        },
    }
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'text')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<dda-radiobutton ${attributes}></dda-radiobutton>`;
};
export const DefaultRadio = Template.bind({});
DefaultRadio.args = {
    title_text: 'Radio Button Title',
    checked: false,
    size: 'md',
    variants: 'normal',
    supporting: 'Supporting Text',
    group_name: 'radiogroup',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    aria_label: 'radio-button',
    onclick: '',
};
export const CheckedRadio = Template.bind({});
CheckedRadio.args = {
    title_text: 'Radio Button Title',
    checked: true,
    size: 'md',
    variants: 'normal',
    supporting: 'Supporting Text',
    group_name: 'radiogroup',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    aria_label: 'radio-button',
    onclick: '',
};
//# sourceMappingURL=dda-radiobutton.stories.js.map
