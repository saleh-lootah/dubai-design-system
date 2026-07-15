import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components to work
import { DIRECTIVES } from './stencil-generated';

@NgModule({
  imports: [CommonModule, ...DIRECTIVES], // Import standalone components instead of declaring them
  exports: [...DIRECTIVES],
})
export class ComponentLibraryModule {}