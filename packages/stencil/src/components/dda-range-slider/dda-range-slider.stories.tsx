export default {
  title: 'Components/Range Slider',
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value of the range slider',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the range slider',
    },
    step: {
      control: 'number',
      description: 'Step value of the range slider',
    },
    initial_min: {
      control: 'number',
      description: 'Initial minimum value of the range slider',
    },
    initial_max: {
      control: 'number',
      description: 'Initial maximum value of the range slider',
    },
    tooltip_position: {
      control: { type: 'select' },
      options: ['top','bottom'],
      description: 'Tooltip position of the range slider',
    },
    custom_class: {
      control: { type: 'text' },
      description: 'Custom class for the range slider',
    },
    component_mode: {
      control: { type: 'check' },
      options: ['light-mode'],
      description: 'Mode of the range slider component',
    },
    left_input_id: {
      control: { type: 'text'},
      description: 'Input id for the left range slider',
    },
    right_input_id: {
      control: { type: 'text'},
      description: 'Input id for the right range slider',
    },
    left_aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the left input of the range slider',
    },
    right_aria_label: {
      control: { type: 'text' },
      description: 'Aria label for the right input of the range slider',
    },
    left_input_name: {
      control: { type: 'text' },
      description: 'Name for the left input of the range slider',
    },
    right_input_name: {
      control: { type: 'text' },
      description: 'Name for the right input of the range slider',
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
  To use the \`dda-range-slider\` component, pass the following props:

  \`\`\`html
<dda-range-slider
    min="0"
    max="100"
    step="1"
    initial_min="20"
    initial_max="80"
    custom_class=""
    component_mode=""
    left_input_id="left_input"
    right_input_id="right_input"
    left_aria_label="minimum-value"
    right_aria_label="maximum-value"
    left_input_name="left_input"
    right_input_name="right_input"
></dda-range-slider>
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

  return `<dda-range-slider ${attributes}></dda-range-slider>`;
};

export const Default = Template.bind({});
Default.args = {
  min: 0,
  max: 100,
  step: 1,
  initial_min: 20,
  initial_max: 80,
  custom_class: '',
  component_mode: '',
  left_input_id: 'left_input',
  right_input_id: 'right_input',
  left_aria_label: 'minimum-value',
  right_aria_label: 'maximum-value',
  left_input_name: 'left_input',
  right_input_name: 'right_input',
};

export const TooltipTop = Template.bind({});
TooltipTop.args = {
  min: 0,
  max: 100,
  step: 1,
  initial_min: 20,
  initial_max: 80,
  tooltip_position: 'top',
  custom_class: '',
  component_mode: '',
  left_input_id: 'left_input',
  right_input_id: 'right_input',
  left_aria_label: 'minimum-value',
  right_aria_label: 'maximum-value',
  left_input_name: 'left_input',
  right_input_name: 'right_input',
};

export const TooltipBottom = Template.bind({});
TooltipBottom.args = {
  min: 0,
  max: 100,
  step: 1,
  initial_min: 20,
  initial_max: 80,
  tooltip_position: 'bottom',
  custom_class: '',
  component_mode: '',
  left_input_id: 'left_input',
  right_input_id: 'right_input',
  left_aria_label: 'minimum-value',
  right_aria_label: 'maximum-value',
  left_input_name: 'left_input',
  right_input_name: 'right_input',
};
