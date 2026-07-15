export default {
    title: 'Components/Progress Bar',
    tags: ['autodocs'],
    argTypes: {
        progress: {
            control: 'number',
            description: 'Progress value',
            defaultValue: 0,
        },
        tooltip: {
            control: 'boolean',
            description: 'Show tooltip',
            defaultValue: false,
        },
        tooltip_position: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Tooltip position',
            defaultValue: 'top',
        },
        show_percentage_text: {
            control: 'boolean',
            description: 'Show percentage text',
            defaultValue: false,
        },
        custom_class: {
            control: { type: 'text' }, // Add control for custom class
            description: 'Custom class for the progress bar component',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the progress bar component',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-progressbar\` component, pass the following props:

\`\`\`html
<dda-progressbar
    progress="20"
    tooltip="false"
    tooltip_position="top"
    show_percentage_text="false"
    custom_class=""
    component_mode=""
></dda-progressbar>
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
    return `<dda-progressbar ${attributes}></dda-progressbar>`;
};
export const Default = Template.bind({});
Default.args = {
    progress: 20,
    tooltip: false,
    tooltip_position: 'top',
    show_percentage_text: false,
    custom_class: '',
    component_mode: '',
};
export const WithTooltip = Template.bind({});
WithTooltip.args = {
    progress: 50,
    tooltip: true,
    tooltip_position: 'top',
    show_percentage_text: false,
    custom_class: '',
    component_mode: '',
};
export const WithPercentageText = Template.bind({});
WithPercentageText.args = {
    progress: 75,
    tooltip: false,
    tooltip_position: 'top',
    show_percentage_text: true,
    custom_class: '',
    component_mode: '',
};
//# sourceMappingURL=dda-progressbar.stories.js.map
