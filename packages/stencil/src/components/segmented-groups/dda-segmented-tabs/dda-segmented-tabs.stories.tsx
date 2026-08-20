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
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Accessible name for the group (applied as aria-label on the role="group" container)',
    },
    selected_index: {
      control: { type: 'number' },
      description: 'Index of the segment selected by default (clamped to a valid item index; defaults to 0)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  Exactly one segment is selected at a time. Clicking a segment, or focusing it with
  Tab and activating it with Enter or Space, selects it and fires \`segmentChange\`
  with the newly-selected index. This is a group of mutually-exclusive toggle
  buttons (\`role="group"\` + \`aria-pressed\`), not the WAI tabs pattern — it has no
  associated tabpanels, so it does not claim \`role="tablist"\`/\`"tab"\`.

  To use the \`dda-segmented-tabs\` component, pass the following props:

  \`\`\`html
<dda-segmented-tabs
    radius_type="square"
    custom_class=""
    component_mode=""
    items='["All","Recent","Saved"]'
    button_name="button_name"
    aria_label="Filter results"
    selected_index="0"
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
  aria_label: 'Filter results',
  selected_index: 0,
};

export const IconItems = Template.bind({});
IconItems.args = {
  items: ['format_align_left', 'format_align_center', 'format_align_right'],
  radius_type: 'square',
  custom_class: '',
  component_mode: '',
  button_name: 'button',
  aria_label: 'Text alignment',
  selected_index: 0,
};
