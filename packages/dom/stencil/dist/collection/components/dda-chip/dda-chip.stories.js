export default {
    title: 'Components/Chip',
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
            description: 'Text to display inside the chip',
        },
        bg_color: {
            control: { type: 'select' },
            options: ['grey', 'primary', 'green', 'yellow', 'red', 'purple'],
            description: 'Background color of the chip',
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
            description: 'Select the size of the chip',
        },
        icon: {
            control: 'text',
            description: 'Material Icons icon class to display at the start of the chip',
        },
        show_close_icon: {
            control: 'boolean',
            description: 'Whether to show a close icon at the end of the chip',
        },
        rounded: {
            control: { type: 'select' },
            options: ['sm', 'circle'],
            description: 'Define the roundedness of the chip',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class for the chip',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the chip component',
        },
        onclick: {
            control: { type: 'text' },
            description: 'Function triggered when the close icon is clicked',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-chip\` component, pass the following props:

\`\`\`html
<dda-chip
    bg_color="grey"
    icon="sentiment_satisfied"
    show_close_icon="true"
    custom_class=""
    component_mode=""
    onclick="console.log("clicked!")"
    >Label
</dda-chip>
  \`\`\`
`,
            },
        },
    },
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'text' && key !== 'onCloseClick')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `
    <dda-chip ${attributes}>${args.text}
    </dda-chip>
  `;
};
export const Grey = Template.bind({});
Grey.args = {
    text: 'Label',
    bg_color: 'grey',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    onclick: "console.log('clicked')",
};
export const Primary = Template.bind({});
Primary.args = {
    text: 'Label',
    bg_color: 'primary',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    custom_class: '',
    component_mode: '',
    onclick: "alert('Close icon clicked!')",
};
export const Green = Template.bind({});
Green.args = {
    text: 'Label',
    bg_color: 'green',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    custom_class: '',
    component_mode: '',
    onclick: "() => alert('Close icon clicked!')",
};
export const Yellow = Template.bind({});
Yellow.args = {
    text: 'Label',
    bg_color: 'yellow',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    custom_class: '',
    component_mode: '',
    onclick: "() => alert('Close icon clicked!')",
};
export const Red = Template.bind({});
Red.args = {
    text: 'Label',
    bg_color: 'red',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    custom_class: '',
    component_mode: '',
    onclick: "() => alert('Close icon clicked!')",
};
export const Purple = Template.bind({});
Purple.args = {
    text: 'Label',
    bg_color: 'purple',
    icon: 'sentiment_satisfied',
    show_close_icon: true,
    custom_class: '',
    component_mode: '',
    onclick: "() => alert('Close icon clicked!')",
};
//# sourceMappingURL=dda-chip.stories.js.map
