<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
const logoDark = computed(() => preferences.logo.sourceDark);
const companyLogo = '/companyLogo.png';
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="companyLogo"
    :logo-dark="logoDark"
    :page-description="$t('authentication.companyDesc')"
    :page-title="$t('authentication.companyName')"
    slogan-image="/logo.png"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
