// 改单付费信息组件
<script setup lang="ts">
import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  changeOrderPaymentInfoFormSchema,
  changeOrderPlanInfoFormSchema
} from "#/views/bpp/changeorder/acceptance/plan/update/data";
import {
  selectByFormKeyNameType,
} from '#/api/bpp/flow/custom/config/form';
import { onActivated, onMounted, ref, watch } from "vue";
// 定义 props
const props = withDefaults(defineProps<Props>(), {
  planType: () => [],
});
const emit = defineEmits<{
  (e: 'visible-change', visible: boolean): void;
}>();
const customFormInfo = ref({
  formKey: 'change_order_paymentInfo',
  formName: '改单付费信息',
  formType: 'changeOrderPaymentInfo',
  formSchema: [],
  id: '',
  formVisible: true,
});
/** 表格展示用的行数据原始数据*/
const localOriginalRows = ref<any[]>([]);
// 定义 props 接口
interface Props {
  // 接收 planType
  planType?: any;
}
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
onActivated( () => {
  loadFormConfig()
});
const loadFormConfig = async ()=>{
  localOriginalRows.value = FormApi.getState()?.schema;

  const res = await selectByFormKeyNameType(customFormInfo.value);
  console.log('res', res);
  if (res?.id) {
    customFormInfo.value.id = res.id;
    customFormInfo.value.formVisible = res.formVisible;
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
          item.rules = originalItem?.rules;
        }
      }
    });
    FormApi.setState({ schema });
  }else{
    FormApi.setState({schema:changeOrderPaymentInfoFormSchema()})
  }
}
const initialData = (newVal)=>{
  customFormInfo.value = {
    formKey: 'change_order_paymentInfo',
    formName: '改单付费信息',
    formType: 'changeOrderPaymentInfo',
    formSchema: [],
    id: '',
    formVisible: true,
  }
  customFormInfo.value.formType = newVal;
  formKey.value++;
  loadFormConfig()
}
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
watch(
  () => customFormInfo.value.formVisible,
  (newVal) => {
    emit('visible-change', newVal);
  },
);
</script>

<template>
  <Card title="改单付费信息" v-if="customFormInfo.formVisible">
    <Form />
  </Card>
</template>
