// Builds a docs page's API section from the tables Stencil generates into a component readme,
// so the documented props and events always match the component source after a build.
const API_SECTIONS = ['Properties', 'Events', 'Methods', 'Slots', 'Shadow Parts', 'CSS Custom Properties'];

export function componentApi(readme) {
  const generated = readme.split('<!-- Auto Generated Below -->')[1] ?? '';
  const sections = generated
    .split(/^## /m)
    .slice(1)
    .filter(section => API_SECTIONS.includes(section.split('\n')[0].trim()))
    // Drop Stencil's "Built with StencilJS" footer, which follows the last section.
    .map(section => `### ${section.replace(/^-{10,}[\s\S]*$/m, '').trim()}`);

  return sections.length ? sections.join('\n\n') : '_This component has no public properties or events._';
}
