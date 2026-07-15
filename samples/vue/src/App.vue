<script setup>
import { DdaButton } from '@dubai-design-system/components-vue';
</script>

<template>
  <div>
    <h1>DDA Vue sample</h1>
    <DdaButton
      button_color="default-primary"
      start_icon="sentiment_satisfied"
      end_icon="arrow_forward"
      button_id="button"
      aria_label="button"
    >Button</DdaButton>
  </div>
</template>
