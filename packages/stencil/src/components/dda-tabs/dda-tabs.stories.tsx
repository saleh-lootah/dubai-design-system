export default {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'text-icon'],
      description: 'Type of the tabs',
    },
    hover_style: {
      control: { type: 'select' },
      options: ['dda-tab-default', 'dda-tab-filed', 'dda-tab-underline', 'dda-tab-underline-filled'],
      description: 'Hover style of the tabs',
    },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom class for the tabs',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the tabs component',
    },
    button_id: {
      control: { type: 'text' },
      description: 'Button ID for accessibility',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the tabs component',
    },
    tab_texts: {
      control: { type: 'array' },
      description: 'Array of tab labels',
    },
    onTabClick: {
      action: 'tab-clicked',
      description: 'Callback function when a tab is clicked',
    },
    button_name: { 
      control: { type: 'text' },
      description: 'Button name for the tabs',
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
  To use the \`dda-tabs\` component, pass the following props:

  \`\`\`html
    <dda-tabs
      type="text"
      hover_style="dda-tab-default"
      custom_class=""
      component_mode=""
      button_id="button"
      aria_label="tabs"
      tab_texts='["Tab 1", "Tab 2", "Tab 3"]'
      onTabClick="handleTabClick"
      button_name="button"
    ></dda-tabs>

    <script>
      function handleTabClick(index) {
        console.log('Clicked Tab:', index);
      }
    </script>
  \`\`\`
  `,
      },
    },
  },
};

const Template = (args) => {
  const attributes = Object.entries(args)
    .filter(([key, value]) => value !== undefined && key !== 'text')
    .map(([key, value]) =>
      Array.isArray(value) ? `${key}='${JSON.stringify(value)}'` : `${key}="${value}"`
    )
    .join(' ');

  return `<dda-tabs ${attributes}></dda-tabs>`;
};

export const TextTabs = Template.bind({});
TextTabs.args = {
  type: 'text',
  hover_style: 'dda-tab-default',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'tabs',
  tab_texts: ['Tab 1', 'Tab 2', 'Tab 3'],
  onTabClick: (index) => alert(`Tab ${index + 1} clicked!`), // Example event
  button_name: 'button',
};

export const TextIconTabs = Template.bind({});
TextIconTabs.args = {
  type: 'text-icon',
  hover_style: 'dda-tab-default',
  custom_class: '',
  component_mode: '',
  button_id: 'button',
  aria_label: 'tabs',
  tab_texts: ['Tab 1', 'Tab 2', 'Tab 3'],
  onTabClick: (index) => alert(`Tab ${index + 1} clicked!`), // Example event
  button_name: 'button',
};
