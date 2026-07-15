export default {
    title: 'Components/Credit Card',
    tags: ['autodocs'],
    argTypes: {
        balance: {
            control: 'text',
            description: 'Current balance on the card',
        },
        name: {
            control: 'text',
            description: 'Name of the card holder',
        },
        card_number: {
            control: 'text',
            description: 'Card number (last 4 digits will be displayed)',
        },
        card_type: {
            control: 'text',
            description: 'URL of the card type icon',
        },
        design: {
            control: { type: 'select' },
            options: ['default', 'green', 'dark'],
            description: 'Design variation of the credit card',
        },
        custom_class: {
            control: { type: 'text' },
            description: 'Custom class for the credit card component',
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the credit card component',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-credit-card\` component, pass the following props:
  
  \`\`\`html
<dda-credit-card
    balance="$5,750.20"
    name="MARIA GOMEZ"
    card_number="1289"
    card_type="https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg"
    design="default"
    custom_class=""
    component_mode=""
></dda-credit-card>
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
    return `<dda-credit-card ${attributes}></dda-credit-card>`;
};
export const Default = Template.bind({});
Default.args = {
    balance: '$5,750.20',
    name: 'MARIA GOMEZ',
    card_number: '1289',
    card_type: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    design: 'default',
    custom_class: '',
    component_mode: '',
};
export const Green = Template.bind({});
Green.args = {
    balance: '$5,750.20',
    name: 'MARIA GOMEZ',
    card_number: '1289',
    card_type: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    design: 'green',
    custom_class: '',
    component_mode: '',
};
export const Dark = Template.bind({});
Dark.args = {
    balance: '$5,750.20',
    name: 'MARIA GOMEZ',
    card_number: '1289',
    card_type: 'https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg',
    design: 'dark',
    custom_class: '',
    component_mode: '',
};
//# sourceMappingURL=dda-credit-card.stories.js.map
