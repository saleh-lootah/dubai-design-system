export default {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the textarea field',
        },
        label: {
            control: 'text',
            description: 'Label for the textarea field',
        },
        max_characters: {
            control: 'number',
            description: 'Maximum number of characters allowed in the textarea field',
        },
        value: {
            control: 'text',
            description: 'Value of the textarea field',
        },
        error_message: {
            control: 'text',
            description: 'Error message displayed below the textarea field',
        },
        validation_type: {
            control: { type: 'select' },
            options: ['normal', 'error'],
            description: 'Validation type of the textarea field',
        },
        input_status: {
            control: { type: 'select' },
            options: ['normal', 'disabled'],
            description: 'Status of the textarea field',
        },
        helper_text: {
            control: 'text',
            description: 'Helper or footer text',
        },
        custom_class: {
            control: { type: 'text' }, // Add control for custom class
            description: 'Custom class for the textarea field',
        },
        enable_rich_editor: {
            control: { type: 'boolean' },
            description: 'Enable rich text editor',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the textarea component',
        },
        input_id: {
            control: { type: 'text' },
            description: 'default',
        },
        aria_label: {
            control: { type: 'text' },
            description: 'Aria label for the textarea field'
        },
        onchange: {
            control: { type: 'text' },
            description: 'onchange event for the textarea field',
        },
        textarea_name: {
            control: { type: 'text' },
            description: 'Name of the textarea field',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-textarea\` component, pass the following props:

  \`\`\`html
<dda-textarea
    placeholder="Enter description"
    label="Description"
    max_characters="200"
    value=""
    helper_text="This is a helper text"
    error_message=""
    custom_class=""
    component_mode=""
    input_id="input"
    aria_label="textarea"
    onchange="console.log('changed')"
    textarea_name="textarea-name"
></dda-textarea>
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
    return `<dda-textarea ${attributes}></dda-textarea>`;
};
export const Default = Template.bind({});
Default.args = {
    placeholder: 'Enter description',
    label: 'Description',
    max_characters: 200,
    value: '',
    helper_text: 'This is a helper text',
    error_message: '',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'textarea',
    onchange: '',
    textarea_name: "textarea-name",
};
export const WithErrorMessage = Template.bind({});
WithErrorMessage.args = {
    placeholder: 'Enter description',
    label: 'Description',
    max_characters: 200,
    value: '',
    error_message: 'This is an error message',
    validation_type: 'error',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'textarea',
    onchange: '',
    textarea_name: "textarea-name",
};
export const Disabled = Template.bind({});
Disabled.args = {
    placeholder: 'Enter description',
    label: 'Description',
    max_characters: 200,
    value: '',
    input_status: 'disabled',
    helper_text: 'This is a helper text',
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'textarea',
    onchange: '',
    textarea_name: "textarea-name",
};
export const RichEditorEnabled = Template.bind({});
RichEditorEnabled.args = {
    placeholder: 'Enter rich text',
    label: 'Rich Text Editor',
    max_characters: 200,
    value: '',
    helper_text: 'This is a helper text',
    enable_rich_editor: true,
    custom_class: '',
    component_mode: '',
    input_id: 'input',
    aria_label: 'textarea',
    onchange: '',
    textarea_name: "textarea-name",
};
//# sourceMappingURL=dda-textarea.stories.js.map
