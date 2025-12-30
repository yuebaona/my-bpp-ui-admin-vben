<script lang="ts" setup>
// import type { VbenFormSchema } from '#/adapter/form';
// import type { ChangeOrderUnreturnApi } from '#/api/bpp/changeorder/unreturn';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { editFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = reactive<any[]>({
  id: null,
  returnType: '',
  returnPort: '',
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
  schema: editFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);

    // 构建符合接口格式的数据
    // const data: ChangeOrderUnreturnApi.ReturnManageVO = {
    //   ...formData,
    // } as ChangeOrderUnreturnApi.ReturnManageVO;

    // 这里需要根据实际情况调用API，暂时注释
    // await (formData?.id ? updateReturnManage(data) : createReturnManage(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        returnType: '',
        returnPort: '',
      });
      return;
    }

    const data = await modalApi.getData<any>();

    if (data) {
      const returnData = data.returnManageRespVO || data;
      Object.assign(formData, returnData);

      if (returnData?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(returnData);
        } finally {
          modalApi.unlock();
        }
      }
    }
  },
});
</script>

<template>
  <Modal title="批量修改">
    <Form />
  </Modal>
</template>
