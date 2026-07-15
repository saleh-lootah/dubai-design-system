import { DdaButton } from '@dubai-design-system/components-react';

export default function App() {
  return (
    <div>
      <h1>DDA React sample</h1>
      <DdaButton
        button_color="default-primary"
        start_icon="sentiment_satisfied"
        end_icon="arrow_forward"
        button_id="button"
        aria_label="button"
      >
        Button
      </DdaButton>
    </div>
  );
}
