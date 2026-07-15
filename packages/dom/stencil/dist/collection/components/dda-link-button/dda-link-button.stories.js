export default {
    title: 'Components/Link Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-link-button\` component, pass the following props:

\`\`\`html
<dda-link-button
    button_color="default-primary"
    start_icon="sentiment_satisfied"
    end_icon="arrow_forward"
    custom_class=""
    href=""
    component_mode=""
    button_id="link-button"
    aria_label="link-Button"
    >Button
</dda-link-button>
  \`\`\`
`,
            },
        },
    },
    argTypes: {
        button_color: {
            control: { type: 'select' },
            options: [
                'default-primary', 'default-secondary', 'default-tertiary', 'default-link',
                'error-primary', 'error-secondary', 'error-tertiary', 'error-link',
                'onsurface-primary', 'onsurface-secondary', 'onsurface-tertiary', 'onsurface-link',
                'secondary', 'success', 'warning', 'surface', 'surface-variant', 'disabled',
            ],
            description: 'Selection of the color of the button',
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
            description: 'Size of the link button',
        },
        button_shape: {
            control: { type: 'select' },
            options: ['default', 'circle',],
            description: 'Options to display the button as square or circle',
        },
        icon_button_shape: {
            control: { type: 'select' },
            options: ['default', 'circle',],
            description: 'Options to display the icon as square or circle',
        },
        gap: {
            control: { type: 'select' },
            options: ['1', '2'],
        },
        custom_class: {
            control: { type: 'text' }, // Add control for custom class
            description: 'Custom class for the link button component',
        },
        href: {
            control: { type: 'text' }, // Add control for custom class
            description: 'Href to point to when the button is clicked',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the link button component',
        },
        button_id: {
            control: { type: 'text' },
            description: 'Button id for the link button component',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for accessibility',
        }
    },
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'text')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<dda-link-button ${attributes}>${args.text}</dda-link-button>`;
};
export const DefaultPrimary = Template.bind({});
DefaultPrimary.args = {
    button_color: 'default-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '', // Example: Add custom class here
    href: '',
    component_mode: '',
    button_id: 'link-button',
    aria_label: 'link-Button',
};
export const ErrorPrimary = Template.bind({});
ErrorPrimary.args = {
    button_color: 'error-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    href: '',
    component_mode: '',
    button_id: 'link-button',
    aria_label: 'link-Button',
};
export const SurfacePrimary = Template.bind({});
SurfacePrimary.args = {
    button_color: 'onsurface-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    href: '',
    component_mode: '',
    button_id: 'link-button',
    aria_label: 'link-Button',
};
export const Disabled = Template.bind({});
Disabled.args = {
    button_color: 'disabled',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    href: '',
    component_mode: '',
    button_id: 'link-button',
    aria_label: 'link-Button',
};
export const IconButton = Template.bind({});
IconButton.args = {
    button_color: 'default-primary',
    icon_button_shape: "default",
    start_icon: 'sentiment_satisfied',
    text: '',
    custom_class: '',
    href: '',
    component_mode: '',
    button_id: 'link-button',
    aria_label: 'link-Button',
};
//# sourceMappingURL=dda-link-button.stories.js.map
