// 进箱信息组件
<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useVbenModal, VbenButton } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  selectByFormKeyNameType,
  updateConfigForm,
} from '#/api/bpp/flow/custom/config/form';
import { $t } from '#/locales';
import FormConfigModal from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/components/FormConfigModal.vue';
import { inboxInfoFormSchema } from '#/views/bpp/changeorder/acceptance/plan/update/data';

const customFormInfo = ref({
  formKey: 'inbox_Info',
  formName: '进箱信息',
  formType: 'inboxInfo',
  formSchema: [],
  id: '',
});
/** 表格展示用的行数据原始数据*/
const localOriginalRows = ref<any[]>([]);
const [Form, FormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  schema: inboxInfoFormSchema(),
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: FormConfigModal,
});

const openModal = () => {
  modalApi.setData(FormApi.getState()?.schema).open();
};

const handleSuccess = async (resultData: []) => {
  customFormInfo.value.formSchema = JSON.stringify(resultData);
  FormApi.setState({ schema: resultData });
  await updateConfigForm(customFormInfo.value);
  message.success($t('ui.actionMessage.operationSuccess'));
};
onMounted(async () => {
  localOriginalRows.value = FormApi.getState()?.schema;

  const res = await selectByFormKeyNameType(customFormInfo.value);
  if (res?.id) {
    customFormInfo.value.id = res.id;
  }
  if (res?.formSchema) {
    const schema = JSON.parse(res.formSchema);

    schema.forEach((item: any) => {
      if (item.fieldName) {
        const originalItem = localOriginalRows.value.find(
          (original: any) => original.fieldName === item.fieldName,
        );

        // 如果找到且有 rules，则替换（避免复杂校验规则不生效）
        if (item?.rules) {
          item.rules = originalItem.rules;
        }
      }
    });
    FormApi.setState({ schema });
  }
});
</script>

<template>
  <Card title="进箱信息">
    <template #extra>
      <VbenButton @click="openModal">配置字段</VbenButton>
    </template>
    <Form />
  </Card>
  <Modal @success="handleSuccess" />
</template>
