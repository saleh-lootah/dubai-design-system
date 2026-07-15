export default {
    title: 'Components/Home Banner',
    component: 'dda-home-banner',
    argTypes: {
        images: { control: 'array' },
        autoplay: { control: 'boolean' },
        interval: { control: 'number' },
    },
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-home-banner\` component, pass the following props:
  
  \`\`\`html
<dda-home-banner
    images='[
      { "src": "assets/img/home1.jpg", "title": "Welcome to Our Site", "subtitle": "Discover amazing features", "link": "#" },
      { "src": "assets/img/home2.jpg", "title": "Explore More", "subtitle": "Find what you need", "link": "#" },
      { "src": "assets/img/home3.jpg", "title": "Join Us Today", "subtitle": "Become part of our community", "link": "#" }
    ]'
    autoplay="true"
    interval="3000"
></dda-home-banner>
  \`\`\`
  `,
            },
        },
        controls: {
            expanded: true,
        },
    },
};
const Template = (args) => `<dda-home-banner images='${JSON.stringify(args.images)}' autoplay='${args.autoplay}' interval='${args.interval}'></dda-home-banner>`;
export const Default = Template.bind({});
Default.args = {
    images: [
        { src: 'https://images.pexels.com/photos/3680912/pexels-photo-3680912.jpeg', title: 'Welcome to Our Site', subtitle: 'Discover amazing features', link: '#' },
        { src: 'https://images.pexels.com/photos/3680912/pexels-photo-3680912.jpeg', title: 'Explore More', subtitle: 'Find what you need', link: '#' },
        { src: 'https://images.pexels.com/photos/3680912/pexels-photo-3680912.jpeg', title: 'Join Us Today', subtitle: 'Become part of our community', link: '#' }
    ],
    autoplay: true,
    interval: 3000,
};
// export const NoAutoplay = Template.bind({});
// NoAutoplay.args = {
//   images: [
//     { src: 'assets/img/home1.jpg', title: 'Welcome to Our Site', subtitle: 'Discover amazing features', link: '#' },
//     { src: 'assets/img/home2.jpg', title: 'Explore More', subtitle: 'Find what you need', link: '#' },
//     { src: 'assets/img/home3.jpg', title: 'Join Us Today', subtitle: 'Become part of our community', link: '#' }
//   ],
//   autoplay: false,
//   interval: 3000,
// };
// export const CustomInterval = Template.bind({});
// CustomInterval.args = {
//   images: [
//     { src: 'assets/img/home1.jpg', title: 'Welcome to Our Site', subtitle: 'Discover amazing features', link: '#' },
//     { src: 'assets/img/home2.jpg', title: 'Explore More', subtitle: 'Find what you need', link: '#' },
//     { src: 'assets/img/home3.jpg', title: 'Join Us Today', subtitle: 'Become part of our community', link: '#' }
//   ],
//   autoplay: true,
//   interval: 5000,
// };
//# sourceMappingURL=dda-home-banner.stories.js.map
