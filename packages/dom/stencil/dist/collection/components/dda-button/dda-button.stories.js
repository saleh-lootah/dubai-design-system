export default {
    title: 'Components/Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-button\` component, pass the following props:

\`\`\`html
<dda-button
    button_color="default-primary"
    start_icon="sentiment_satisfied"
    end_icon="arrow_forward"
    custom_class=""
    component_mode=""
    button_id="button"
    aria_label="button"
    onclick="console.log('clicked')"
    button_name="button"
    >Button
</dda-button>
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
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
        },
        button_shape: {
            control: { type: 'select' },
            options: ['default', 'circle',],
        },
        icon_button_shape: {
            control: { type: 'select' },
            options: ['default', 'circle',],
        },
        gap: {
            control: { type: 'select' },
            options: ['1', '2'],
        },
        custom_class: {
            control: { type: 'text' }, // Add control for custom class
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the button component',
        },
        button_id: {
            control: 'text',
            description: 'default',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the button',
        },
        onclick: {
            control: { type: 'text' },
            description: 'event handler for button',
        },
        button_name: {
            control: { type: 'text' },
            description: 'Name of the button',
        }
    },
};
const Template = (args) => {
    const attributes = Object.entries(args)
        .filter(([key, value]) => value !== undefined && key !== 'text')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<dda-button ${attributes}>${args.text}</dda-button>`;
};
export const DefaultPrimary = Template.bind({});
DefaultPrimary.args = {
    button_color: 'default-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '', // Example: Add custom class here
    component_mode: '',
    button_id: 'button',
    aria_label: 'button',
    onclick: "console.log('clicked')",
    button_name: 'button',
};
export const ErrorPrimary = Template.bind({});
ErrorPrimary.args = {
    button_color: 'error-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    component_mode: '',
    button_id: 'button',
    aria_label: 'button',
    onclick: "alert('Hello! I am an alert box!!')",
    button_name: 'button',
};
export const SurfacePrimary = Template.bind({});
SurfacePrimary.args = {
    button_color: 'onsurface-primary',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    component_mode: '',
    button_id: 'button',
    aria_label: 'button',
    onclick: "console.log('clicked')",
    button_name: 'button',
};
export const Disabled = Template.bind({});
Disabled.args = {
    button_color: 'disabled',
    start_icon: 'sentiment_satisfied',
    end_icon: 'arrow_forward',
    text: 'Button',
    custom_class: '',
    component_mode: '',
    button_id: 'button',
    aria_label: 'button',
    onclick: "console.log('clicked')",
    button_name: 'button',
};
export const IconButton = Template.bind({});
IconButton.args = {
    button_color: 'default-primary',
    icon_button_shape: "default",
    start_icon: 'sentiment_satisfied',
    text: '',
    custom_class: '',
    component_mode: '',
    button_id: 'button',
    aria_label: 'button',
    onclick: "console.log('clicked')",
    button_name: 'button',
};
//# sourceMappingURL=dda-button.stories.js.map
