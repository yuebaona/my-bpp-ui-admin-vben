// 提单信息组件
<script setup lang="ts">
import { Card } from "ant-design-vue";
import { useVbenForm } from '#/adapter/form';
import {
  changeOrderPaymentInfoFormSchema,
  pickupBoxInfoFormSchema
} from "#/views/bpp/changeorder/acceptance/plan/update/data";
import { onMounted, ref, onActivated, watch } from "vue";
import {
  selectByFormKeyNameType,
} from '#/api/bpp/flow/custom/config/form';
const customFormInfo = ref({
  formKey: 'bill_of_ladingInfo',
  formName: '提箱信息',
  formType: 'billOfLadingInfo',
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
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  schema: pickupBoxInfoFormSchema(),
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
          item.rules = originalItem.rules;
        }
      }
    });
    FormApi.setState({ schema });
  }else{
    FormApi.setState({schema:pickupBoxInfoFormSchema()})
  }
}
const initialData = (newVal)=>{
  customFormInfo.value = {
    formKey: 'bill_of_ladingInfo',
    formName: '提箱信息',
    formType: 'billOfLadingInfo',
    formSchema: [],
    id: '',
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
</script>

<template>
  <Card title="提箱信息">
    <Form />
  </Card>
</template>
