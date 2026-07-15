export default {
    title: 'Components/Tooltip',
    tags: ['autodocs'],
    argTypes: {
        title_text: {
            control: 'text',
            description: 'Title of the tooltip',
        },
        description: {
            control: 'text',
            description: 'Description of the tooltip',
        },
        position: {
            control: { type: 'select' },
            options: ['top', 'bottom', 'left', 'right'],
            description: 'Position of the tooltip',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class for the tooltip',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the tooltip',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-tooltip\` component, pass the following props:

  \`\`\`html
<dda-tooltip
    title_text="Tooltip"
    description="This is a tooltip description."
    position="top"
    custom_class=""
    component_mode=""
    ><!---->
    <button>Hover me</button>
</dda-tooltip>
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
    return `<dda-tooltip ${attributes}>
            <button>Hover me</button>
          </dda-tooltip>`;
};
export const Top = Template.bind({});
Top.args = {
    title_text: 'Tooltip',
    description: 'This is a tooltip description.',
    position: 'top',
    custom_class: '',
    component_mode: '',
};
export const Bottom = Template.bind({});
Bottom.args = {
    title_text: 'Tooltip',
    description: 'This is a tooltip description.',
    position: 'bottom',
    component_mode: '',
};
export const Left = Template.bind({});
Left.args = {
    title_text: 'Tooltip',
    description: 'This is a tooltip description.',
    position: 'left',
    component_mode: '',
};
export const Right = Template.bind({});
Right.args = {
    title_text: 'Tooltip',
    description: 'This is a tooltip description.',
    position: 'right',
    component_mode: '',
};
//# sourceMappingURL=dda-tooltip.stories.js.map
