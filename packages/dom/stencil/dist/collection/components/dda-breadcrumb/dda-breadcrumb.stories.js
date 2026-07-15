var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
export default {
    title: 'Components/Breadcrumb',
    tags: ['autodocs'],
    argTypes: {
        design: {
            control: { type: 'select' },
            options: ['text', 'icon-text', 'icon'],
            description: 'Design of the breadcrumbs',
        },
        separator: {
            control: { type: 'select' },
            options: ['chevron_right', 'pen_size_2'],
            description: 'Separator style of the breadcrumbs',
        },
        custom_class: {
            control: { type: 'text' },
        },
        component_mode: {
            control: { type: 'check' },
            options: ['light-mode'],
            description: 'Mode of the breadcrumb component',
        }
    },
    parameters: {
        docs: {
            description: {
                component: `
To use the \`dda-breadcrumb\` component, pass the following props:

\`\`\`html
<dda-breadcrumb
    design="text"
    separator="chevron_right"
    custom_class=""
    component_mode=""
    data-breadcrumbs='[{"text":"Home","icon":"home","url":"/"},
                        {"text":"Library","icon":"menu_book","url":"/library"},
                        {"text":"Data","icon":"storage"}]'
></dda-breadcrumb>
  \`\`\`
`,
            },
        },
    },
};
const Template = (args) => {
    const { breadcrumbs } = args, otherArgs = __rest(args, ["breadcrumbs"]);
    const attributes = Object.entries(otherArgs)
        .filter(([key, value]) => value !== undefined && key !== 'text')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    const breadcrumbsData = JSON.stringify(breadcrumbs);
    return `<dda-breadcrumb ${attributes} data-breadcrumbs='${breadcrumbsData}'></dda-breadcrumb>`;
};
export const TextOnly = Template.bind({});
TextOnly.args = {
    design: 'text',
    separator: 'chevron_right',
    breadcrumbs: [
        { text: 'Home', icon: 'home', url: '/' },
        { text: 'Library', icon: 'menu_book', url: '/library' },
        { text: 'Datas', icon: 'storage' },
    ],
    custom_class: '',
    component_mode: '',
};
export const IconText = Template.bind({});
IconText.args = {
    design: 'icon-text',
    separator: 'chevron_right',
    breadcrumbs: [
        { text: 'Home', icon: 'home', url: '/' },
        { text: 'Library', icon: 'menu_book', url: '/library' },
        { text: 'Datas', icon: 'storage' },
    ],
    custom_class: '',
    component_mode: '',
};
export const IconOnly = Template.bind({});
IconOnly.args = {
    design: 'icon',
    separator: 'chevron_right',
    breadcrumbs: [
        { text: 'Home', icon: 'home', url: '/' },
        { text: 'Library', icon: 'menu_book', url: '/library' },
        { text: 'Data', icon: 'storage' },
    ],
    custom_class: '',
    component_mode: '',
};
//# sourceMappingURL=dda-breadcrumb.stories.js.map
