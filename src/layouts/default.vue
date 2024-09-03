<template>
  <wd-config-provider :themeVars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160',
  inputCellLabelWidth: '8.5rem', // 无法覆盖默认样式
}
</script>

<style lang="scss">
// 通过important改动
:deep(.wd-input__label) {
  // width: 135px !important;
}
</style>
