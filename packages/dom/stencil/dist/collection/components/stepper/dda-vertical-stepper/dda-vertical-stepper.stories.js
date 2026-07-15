import { html } from "lit-html";
export default {
    title: 'Components/Stepper/Vertical Stepper',
    tags: ['autodocs'],
    argTypes: {
        steps: {
            control: 'object',
            description: 'Steps for the stepper as an array of objects',
        },
        current_step: {
            control: 'number',
            description: 'Current active step index',
        },
        custom_class: {
            control: { type: 'text' },
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the vertical stepper',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-vertical-stepper\` component, pass the following props:

  \`\`\`html
<dda-vertical-stepper
    steps='[{"icon":"sentiment_satisfied","title":"Step 1","subtitle":"Subtitle 1","description":"Description 1"},{"icon":"sentiment_satisfied","title":"Step 2","subtitle":"Subtitle 2","description":"Description 2"},{"icon":"sentiment_satisfied","title":"Step 3","subtitle":"Subtitle 3","description":"Description 3"}]'
    current_step="1"
    custom_class='""'
    mode='"light"'
></dda-vertical-stepper>
  \`\`\`
  `,
            },
        },
    },
};
const Template = ({ steps, current_step, custom_class, component_mode }) => html `
<dda-vertical-stepper
  steps=${JSON.stringify(steps)}
  current_step=${current_step}
  custom_class=${custom_class}
  component_mode=${component_mode}
>
</dda-vertical-stepper>
`;
export const Default = Template.bind({});
Default.args = {
    steps: [
        { icon: 'sentiment_satisfied', title: 'Step 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { icon: 'sentiment_satisfied', title: 'Step 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { icon: 'sentiment_satisfied', title: 'Step 3', subtitle: 'Subtitle 3', description: 'Description 3' },
    ],
    current_step: 1,
    custom_class: '',
    component_mode: '',
};
//# sourceMappingURL=dda-vertical-stepper.stories.js.map
