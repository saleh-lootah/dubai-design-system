export default {
  title: 'Components/Segments/Segmented Tabs',
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'array', // Changed to 'array' to handle array of items
      description: 'List of items (either text or icons)',
    },
    radius_type: {
      control: { type: 'select' },
      options: ['rounded', 'square'],
      description: 'Type of border radius (rounded or square)',
    },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom CSS class',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the segmented group',
    },
    button_name: {
      control: { type: 'text' },
      description: 'Button name',
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
  To use the \`dda-segmented-tabs\` component, pass the following props:

  \`\`\`html
<dda-segmented-tabs
    radius_type="square"
    custom_class=""
    component_mode=""
    items='["All","Recent","Saved"]'
    button_name="button_name"
></dda-segmented-tabs>
  \`\`\`
  `,
      },
    },
  },
};

const Template = (args) => {
  const attributes = Object.entries(args)
    .filter(([key, value]) => value !== undefined && key !== 'items')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const itemsArray = JSON.stringify(args.items); // Convert array to JSON string

  return `<dda-segmented-tabs ${attributes} items='${itemsArray}'></dda-segmented-tabs>`;
};

export const TextItems = Template.bind({});
TextItems.args = {
  items: ['All', 'Recent', 'Saved'],
  radius_type: 'square',
  custom_class: '',
  component_mode: '',
  button_name: 'button',
};

export const IconItems = Template.bind({});
IconItems.args = {
  items: ['format_align_left', 'format_align_center', 'format_align_right'],
  radius_type: 'square',
  custom_class: '',
  component_mode: '',
  button_name: 'button',
};
