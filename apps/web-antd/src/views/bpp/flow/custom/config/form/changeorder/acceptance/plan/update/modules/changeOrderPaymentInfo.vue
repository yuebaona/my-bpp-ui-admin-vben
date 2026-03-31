// 改单付费信息组件
<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from "vue";

import { useVbenModal, VbenButton } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  selectByFormKeyNameType,
  updateConfigForm,
} from '#/api/bpp/flow/custom/config/form';
import { $t } from '#/locales';
import FormConfigModal from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/components/FormConfigModal.vue';
import {
  changeOrderPaymentInfoFormSchema,
  changeOrderPlanInfoFormSchema
} from "#/views/bpp/changeorder/acceptance/plan/update/data";

const customFormInfo = ref({
  formKey: 'change_order_paymentInfo',
  formName: '改单付费信息',
  formType: '',
  formSchema: [],
  id: '',
});
/** 表格展示用的行数据原始数据*/
const localOriginalRows = ref<any[]>([]);
// 定义 props 接口
interface Props {
  // 接收 planType
  planType?: any;
}
// 定义 props
const props = withDefaults(defineProps<Props>(), {
  planType: () => [],
});
const [Form, FormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: changeOrderPaymentInfoFormSchema(),
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
  show.value = false;
};
const loadFormConfig = async ()=>{
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
    show.value = false
  }else{
    FormApi.setState({schema:changeOrderPaymentInfoFormSchema()})
    show.value = true
  }
}
const initialData = (newVal)=>{
  customFormInfo.value = {
    formKey: 'change_order_paymentInfo',
    formName: '改单付费信息',
    formType: '',
    formSchema: [],
    id: '',
  }
  customFormInfo.value.formType = newVal;
  formKey.value++;
  loadFormConfig()
}
onActivated( () => {
  loadFormConfig()
});
onMounted(()=>{
  initialData(props.planType)
})
// 监听 planType 变化
watch(() => props.planType, (newVal) => {
  if (newVal && newVal.length > 0) {
    initialData(newVal)
  }
}, { deep: true });
const formKey = ref(0)
const show = ref(false)
</script>

<template>
  <Card title="改单付费信息">
    <template #extra>
      <div class="flex items-center">
        <a-tag :bordered="false" color="warning" v-show="show">该类型字段还未配置请先进行配置</a-tag>
        <VbenButton @click="openModal">配置字段</VbenButton>
      </div>
    </template>
    <Form />
  </Card>
  <Modal @success="handleSuccess" />
</template>
