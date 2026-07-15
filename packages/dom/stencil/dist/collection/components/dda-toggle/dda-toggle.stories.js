export default {
    title: 'Components/Toggle',
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        checked: {
            control: 'boolean',
            description: 'Checked state of the toggle',
        },
        label_on: {
            control: 'text',
            description: 'Label for the "On" state',
        },
        label_off: {
            control: 'text',
            description: 'Label for the "Off" state',
        },
        group_name: {
            control: 'text',
            description: 'default',
        },
        label_for: {
            control: 'text',
            description: 'default',
        },
        input_id: {
            control: 'text',
            description: 'default',
        },
        custom_class: {
            control: { type: 'text' },
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the toggle component',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the toggle component',
        },
        onchange: {
            control: { type: 'text' },
            description: 'onchange event for the toggle component',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-toggle\` component, pass the following props:

  \`\`\`html
<dda-toggle
    checked="false"
    label_on="On"
    label_off="Off"
    size="md"
    group_name="togglegroup1"
    input_id="testId"
    custom_class=""
    component_mode=""
    aria_label="toggle"
    onchange="console.log('changed')"
></dda-toggle>
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
    return `<dda-toggle ${attributes}></dda-toggle>`;
};
export const Default = Template.bind({});
Default.args = {
    checked: false,
    label_on: 'On',
    label_off: 'Off',
    size: 'md',
    group_name: 'togglegroup1',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    aria_label: 'toggle',
    onchange: '',
};
export const Checked = Template.bind({});
Checked.args = {
    checked: true,
    label_on: 'On',
    label_off: 'Off',
    size: 'md',
    group_name: 'togglegroup1',
    input_id: 'testId',
    custom_class: '',
    component_mode: '',
    on_toggled: () => void (0),
    aria_label: 'toggle',
    onchange: '',
};
//# sourceMappingURL=dda-toggle.stories.js.map
