<script lang="ts" setup>
import { ref,computed } from 'vue';
import { useVbenModal } from '@vben/common-ui';
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

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!formRef.value) return;

    // 直接调用表单组件的验证方法
    const isValid = await formRef.value.validate();
    if (!isValid) return;

    // 获取保存数据并提交
    const saveData = formRef.value.getSaveData();

    try {
      await (currentId.value
        ? updateAcceptancePlanOverOperation(saveData)
        : createAcceptancePlanOverOperation(saveData));

      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } catch {
      message.error('保存失败');
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      currentId.value = '';
      return;
    }

    modalApi.lock();
    const modalData = modalApi.getData();

    if (modalData?.id) {
      currentId.value = modalData.id;
    } else {
      currentId.value = '';
    }

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
    <AcceptancePlanForm :id="currentId" @success="emit('success')" ref="formRef" />
  </Modal>
</template>
