export default {
    title: 'Components/Accordion',
    tags: ['autodocs'],
    argTypes: {
        design: {
            control: { type: 'select' },
            options: ['bg-border', 'no-border'],
            description: 'Choice of design between two options: bg-border and no-border.',
        },
        header_text: {
            control: 'text',
            description: 'Header text of the accordion',
        },
        body_description: {
            control: 'text',
            description: 'Body description of the accordion',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class to be applied to the accordion',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the accordion component',
        },
        accordion_icon: {
            control: 'text',
            description: 'Material icon to display in the header',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-accordion\` component, pass the following props:

\`\`\`html
<dda-accordion 
  design="bg-border" 
  header_text="Accordion Header" 
  body_description="This is the accordion body content." 
  custom_class="" 
  component_mode=""
  accordion_icon="info">
</dda-accordion>
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
    return `<dda-accordion ${attributes}></dda-accordion>`;
};
export const BgBorder = Template.bind({});
BgBorder.args = {
    design: 'bg-border',
    header_text: 'Accordion Header',
    body_description: 'This is the accordion body content.',
    custom_class: '',
    component_mode: '',
    accordion_icon: 'info',
};
export const NoBorder = Template.bind({});
NoBorder.args = {
    design: 'no-border',
    header_text: 'Accordion Header',
    body_description: 'This is the accordion body content.',
    custom_class: '',
    component_mode: '',
    accordion_icon: 'info',
};
//# sourceMappingURL=dda-accordion.stories.js.map
