// 原计划与付费信息组件
<script setup lang="ts">
import { Card } from "ant-design-vue";

import { useVbenForm } from '#/adapter/form';
import {
  inboxInfoFormSchema,
  originalPlanPaymentInfoFormSchema
} from "#/views/bpp/changeorder/acceptance/plan/update/data";
import {
  selectByFormKeyNameType,
} from '#/api/bpp/flow/custom/config/form';
import { onActivated, onMounted, ref, watch } from "vue";
const customFormInfo = ref({
  formKey: 'original_play_paymentInfo',
  formName: '原计划与付费信息',
  formType: 'originalPlanPaymentInfo',
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
  schema: originalPlanPaymentInfoFormSchema(),
});
onActivated( () => {
  loadFormConfig()
});
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
          item.rules = originalItem?.rules;
        }
      }
    });
    FormApi.setState({ schema });
  }else{
    FormApi.setState({schema:originalPlanPaymentInfoFormSchema()})
  }
}
const initialData = (newVal)=>{
  customFormInfo.value = {
    formKey: 'original_play_paymentInfo',
    formName: '原计划与付费信息',
    formType: 'originalPlanPaymentInfo',
    formSchema: [],
    id: '',
  }
  customFormInfo.value.formType = newVal;
  formKey.value++;
  loadFormConfig()
}
onMounted(()=>{
  console.log(props.planType)
  initialData(props.planType)
})
// 监听 planType 变化
watch(() => props.planType, (newVal) => {
  console.log(newVal)
  if (newVal && newVal.length > 0) {
    initialData(newVal)
  }
}, { deep: true });
const formKey = ref(0)
</script>

<template>
  <Card title="原计划与付费信息">
    <Form />
  </Card>
</template>
