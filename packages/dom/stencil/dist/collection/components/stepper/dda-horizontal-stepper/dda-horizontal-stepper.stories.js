import { html } from "lit-html";
export default {
    title: 'Components/Stepper/Horizontal Stepper',
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
            description: 'Custom class of the horizontal stepper',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the horizontal stepper',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-horizontal-stepper\` component, pass the following props:
  
  \`\`\`html
<dda-horizontal-stepper
    steps='[{"title":"Step 1","subtitle":"Subtitle 1","description":"Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry."},{"title":"Step 2","subtitle":"Subtitle 2","description":"Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry."},{"title":"Step 3","subtitle":"Subtitle 3","description":"Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry."}]'
    current_step="1"
    custom_class=''
    mode='light'
></dda-horizontal-stepper>
    \`\`\`
  `,
            },
        },
    },
};
const Template = ({ steps, current_step, custom_class, component_mode }) => html `
    <dda-horizontal-stepper
      steps=${JSON.stringify(steps)}
      current_step=${current_step}
      custom_class=${custom_class}
      component_mode=${component_mode}
    >
    </dda-horizontal-stepper>
  `;
export const Default = Template.bind({});
Default.args = {
    steps: [
        { title: 'Step 1', subtitle: 'Subtitle 1', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { title: 'Step 2', subtitle: 'Subtitle 2', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { title: 'Step 3', subtitle: 'Subtitle 3', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    ],
    current_step: 1,
    custom_class: '',
    component_mode: ''
};
//# sourceMappingURL=dda-horizontal-stepper.stories.js.map
