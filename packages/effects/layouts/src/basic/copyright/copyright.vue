<script lang="ts" setup>

import {$t} from "@vben/locales";

interface Props {
  companyName?: string;
  companySiteLink?: string;
  date?: string;
  icp?: string;
  icpLink?: string;
}

defineOptions({
  name: 'Copyright',
});

withDefaults(defineProps<Props>(), {
  companyName: 'Vben Admin',
  companySiteLink: '',
  date: '2024',
  icp: '',
  icpLink: '',
});
</script>

<template>
  <div class="text-md flex-center">
    <!-- ICP Link -->
    <a
      v-if="icp"
      :href="icpLink || 'javascript:void(0)'"
      class="hover:text-primary-hover mx-1"
      target="_blank"
    >
      {{ icp }}
    </a>

    <!-- Copyright Text -->
    <!-- Copyright © 2022-2025 广西钦州保税港区宏港码头有限公司. -->
    Copyright © 2022 -
    {{ `${new Date().getFullYear()} ${$t('authentication.companyName')}` }}

    <!-- Company Link -->
<!--    <a-->
<!--      v-if="companyName"-->
    <!--      :href="companySiteLink || 'javascript:void(0)'"-->
    <!--      class="hover:text-primary-hover mx-1"-->
<!--      target="_blank"-->
<!--    >-->
<!--    </a>-->
  </div>
</template>
