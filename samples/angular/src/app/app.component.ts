import { Component } from '@angular/core';
import { ComponentLibraryModule } from '@dubai-design-system/components-angular';

@Component({
  selector: 'app-root',
  imports: [ComponentLibraryModule],
  template: `
    <h1>DDA Angular sample</h1>
    <dda-button
      button_color="default-primary"
      start_icon="sentiment_satisfied"
      end_icon="arrow_forward"
      button_id="button"
      aria_label="button">
      Button
    </dda-button>
  `,
})
export class AppComponent {}
