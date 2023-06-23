<template>
  <div class="lang">
    <a-select v-model:value="locale" @change="handleLangChanged">
      <a-select-option value="cn">简体中文</a-select-option>
      <a-select-option value="en">English</a-select-option>
      <a-select-option value="jp">日本語</a-select-option>
    </a-select>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
const { proxy } = getCurrentInstance();
const { locale } = useI18n();
const handleLangChanged = () => {
  localStorage.setItem('lang', locale.value)
}
</script>

<style lang="less" scoped>
.lang {
  margin-left: 8px;
}
</style>