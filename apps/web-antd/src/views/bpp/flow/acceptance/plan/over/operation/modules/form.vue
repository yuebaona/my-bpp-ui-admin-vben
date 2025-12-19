<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

import {
  createAcceptancePlanOverOperation,
  updateAcceptancePlanOverOperation,
} from '#/api/bpp/flow/acceptance/plan/over/operation';
import { $t } from '#/locales';
import AcceptancePlanForm from '#/views/bpp/flow/acceptance/plan/over/operation/components/acceptancePlanForm.vue';

const emit = defineEmits(['success']);

const formRef = ref<InstanceType<typeof AcceptancePlanForm>>();
const currentId = ref<string>(''); // 只需要管理id

const validateForm = async () => {
  if (!formRef.value) return false;
  return await formRef.value.validate();
};

const confirm = async () => {
  const isValid = await validateForm();
  if (!isValid) return;
  await debouncedSubmit();
};
const submitForm = async () => {
  const saveData: any = formRef.value!.getSaveData();
  try {
    await (currentId.value
      ? updateAcceptancePlanOverOperation(saveData)
      : createAcceptancePlanOverOperation(saveData));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    message.error(`操作失败${error}`);
  }
};

const debouncedSubmit = useDebounceFn(submitForm, 200);

const [Modal, modalApi] = useVbenModal({
  onConfirm: confirm,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      currentId.value = '';
      return;
    }

    modalApi.lock();
    const modalData = modalApi.getData();

    currentId.value = modalData?.id ?? '';

    modalApi.unlock();
  },
});

const modalTitle = computed(() => {
  return currentId.value
    ? $t('ui.actionTitle.edit', ['超限货物作业申请单'])
    : $t('ui.actionTitle.create', ['超限货物作业申请单']);
});
</script>

<template>
  <Modal :title="modalTitle">
    <AcceptancePlanForm
      :id="currentId"
      @success="emit('success')"
      ref="formRef"
    />
  </Modal>
</template>
