import { html } from 'lit-html';

export default {
  title: 'Components/Avatar',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['photo', 'icon', 'text'],
      description: 'Options like photo, icon and text',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Size of the avatar component',
    },
    design: {
      control: 'select',
      options: ['default', 'status', 'verified', 'live', 'notification'],
      description: 'Design of the avatar component',
    },
    rounded: {
      control: 'select',
      options: ['square', 'circle'],
      description: 'Options to display the avatar as square or circle',
    },
    options:{
      control: 'array',
      description: 'Dropdown options for the avatar dropdown'
    },
    src: { control: 'text', description: 'Path to the image' },
    icon: { control: 'text', description: 'Material Icons icon class for the avatar' },
    text: { control: 'text', description: 'Text inside the avatar' },
    notification_number: { control: 'number', description: 'Number of notifications' },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom class for the avatar component',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the avatar component',
    },
    button_id: {
      control: { type: 'text' },
      description: 'Button id for the avatar component',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the avatar component',
    },
    button_name: {
      control: { type: 'text' },
      description: 'Button name',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
To use the \`dda-avatar\` component, pass the following props:

\`\`\`html
<dda-avatar
    type="photo"
    size="md"
    design="default"
    rounded="circle"
    src="https://img.freepik.com/premium-vector/traditional-arabic-man-head-icon-vector-avatar_55610-6301.jpg"
    icon="sentiment_satisfied"
    text="AB"
    options='["Option 1","Option 2","Option 3"]'
    notification-number="20"
    custom_class=""
    component_mode=""
    aria_label="avatar"
    button_id="button"
    button_name=""
>
</dda-avatar>
  \`\`\`
`,
      },
    },
  },
};

const Template = ({ type, size, design, rounded, src, icon, text, notification_number, custom_class, options, component_mode, button_id, aria_label, button_name }) => html`
  <dda-avatar
    type=${type}
    size=${size}
    design=${design}
    rounded=${rounded}
    src=${src}
    icon=${icon}
    text=${text}
    options=${JSON.stringify(options)}
    notification_number=${notification_number}
    custom_class=${custom_class}
    component_mode=${component_mode}
    aria_label=${aria_label}
    button_id=${button_id}
    button_name=${button_name}
  >
  </dda-avatar>
`;



export const StatusPhoto = Template.bind({});
StatusPhoto.args = {
  type: 'photo',
  size: 'md',
  design: 'default',
  rounded: 'circle',
  text: 'AB',
  options: ['Option 1', 'Option 2', 'Option 3'],
  src: 'https://img.freepik.com/premium-vector/traditional-arabic-man-head-icon-vector-avatar_55610-6301.jpg',
  icon: 'material-icons',
  notification_number: '20',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label:"avatar",
  button_name:"button"
};

export const StatusIcon = Template.bind({});
StatusIcon.args = {
  type: 'icon',
  size: 'md',
  design: 'default',
  rounded: 'circle',
  text: 'AB',
  options: ['Option 1', 'Option 2', 'Option 3'],
  src: 'https://img.freepik.com/premium-vector/traditional-arabic-man-head-icon-vector-avatar_55610-6301.jpg',
  icon: 'material-icons',
  notification_number: '20',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label:"avatar",
  button_name:"button"
};

export const StatusText = Template.bind({});
StatusText.args = {
  type: 'text',
  size: 'md',
  design: 'default',
  rounded: 'circle',
  text: 'AB',
  options: ['Option 1', 'Option 2', 'Option 3'],
  src: 'https://img.freepik.com/premium-vector/traditional-arabic-man-head-icon-vector-avatar_55610-6301.jpg',
  icon: 'material-icons',
  notification_number: '20',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label:"avatar",
  button_name:"button"
};
