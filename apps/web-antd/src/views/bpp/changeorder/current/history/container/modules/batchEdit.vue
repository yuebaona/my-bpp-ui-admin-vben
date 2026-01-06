<script lang="ts" setup>
// import type { VbenFormSchema } from '#/adapter/form';
// import type { ChangeOrderCurrentHistoryApi } from '#/api/bpp/changeorder/current/history/container/index.ts';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { batchEditFormSchema } from '../data';

const emit = defineEmits(['success']);

const selectedIds = ref<number[] | string[]>([]);
const formData = reactive<any>({
  vesselName: '',
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-3/4',
    },
    labelWidth: 180,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: batchEditFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const formValues = await formApi.getValues();
    // Object.assign(formData, formValues);

    // 过滤空字段，只保留修改字段
    const updateFields = Object.fromEntries(
      Object.entries(formValues).filter(
        ([_, value]) => value !== '' && value !== undefined && value !== null,
      ),
    );

    if (selectedIds.value.length === 0) {
      message.error('没有选中要修改的记录');
      return;
    }

    if (Object.keys(updateFields).length === 0) {
      message.error('请至少修改一个字段');
      return;
    }

    // 构建批量修改的数据
    const batchData = {
      selectedIds: selectedIds.value,
      updateFields,
    };

    console.log('批量修改数据:', batchData);
    // await batchUpdateRecords(batchData);

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.keys(formData).forEach((key) => {
        formData[key] = '';
      });
      selectedIds.value = [];
      return;
    }
    const data = await modalApi.getData<number[] | string[]>();
    if (data && Array.isArray(data)) {
      selectedIds.value = data;
    }
  },
});
</script>

<template>
  <Modal title="批量修改">
    <Form />
  </Modal>
</template>
