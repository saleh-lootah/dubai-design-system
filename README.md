# Dubai Design System

The Dubai Design System pattern library for a unified and accessible user experience across the web platform
## Documentation

Documentation is a Storybook app in `packages/stencil` (component docs, color system,
typography, grid, and framework integration guides). Run it locally:

```bash
cd packages/stencil
npm run storybook   # opens on http://localhost:6006
```

## Packages

- **Icons** - [Material Icons](https://fonts.google.com/icons) (see the Storybook "Foundations/Iconography" page)
- **Editor** - [Quill Editor](https://quilljs.com/) (see the Storybook textarea rich-editor story)


# Setup with npm

To get started with the project, follow these setup steps using `npm` and related tools:

1. **Install dependencies at the root**:
   <div className="code-block">
     <code>npm i</code>
   </div>

2. **Navigate to the packages folder**
   <div className="code-block">
     <code>cd packages</code>
   </div>

3. **Navigate to the stencil folder**
   <div className="code-block">
     <code>cd stencil</code>
   </div>

4. **Install dependencies in the stencil folder:**
   <div className="code-block">
     <code>npm i</code>
   </div>

5. **Watch for Stencil changes**:
   <div className="code-block">
     <code>npx stencil build</code>
   </div>
   <p className="text">This command watches for any changes in your Stencil components and automatically rebuilds the project when files are updated.</p>

6. **Run Storybook**:
   <div className="code-block">
     <code>npm run storybook</code>
   </div>
   <p className="text">Launch Storybook, an environment for developing and testing UI components in isolation.</p>


7. **Build Storybook**:
   <div className="code-block">
     <code>npm run build-storybook</code>
   </div>
   <p className="text">This command builds Storybook as a static site, preparing it for deployment or further use.</p>

8. **Run Lerna build**:
   <div className="code-block">
     <code>lerna run build</code>
   </div>
   <p className="text">Lerna helps manage multi-package repositories. This command runs the build process for all packages in the repo.</p>

9. **Publish using Lerna**:
   <div className="code-block">
     <code>npx lerna publish</code>
   </div>
   <p className="text">Publish all updated packages in the repository using Lerna, with a forced publish to ensure updates are deployed.</p>
<!-- 
10. **Release**:
   <div className="code-block">
     <code>npm run release</code>
   </div>
   <p className="text">This command handles versioning, changelogs, and tagging for releasing new versions of the project.</p> -->

Following these steps will set up your development environment for building, testing, and deploying the project.

## License

Copyright (c) 2018-2026 Digital Dubai. All rights reserved. An open-source license is
under review and will be announced in a future release.
