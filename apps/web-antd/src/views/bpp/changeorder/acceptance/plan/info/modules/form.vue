<script lang="ts" setup>
import type { AcceptancePlanApi } from '#/api/bpp/changeorder/acceptance/plan/info';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import { router } from '#/router';

import { useFormSchema } from '../data';

const formData = ref<AcceptancePlanApi.Plan>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['受理计划信息'])
    : $t('ui.actionTitle.create', ['受理计划信息']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    await router.push({
      name: 'acceptancePlanUpdate',

    });
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
