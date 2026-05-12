<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from 'vue';

import { confirm, useVbenModal, VbenButton } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  selectByFormKeyNameType,
  updateConfigForm,
} from '#/api/bpp/flow/custom/config/form';
import { $t } from '#/locales';
import { changeOrderPlanInfoFormSchema } from '#/views/bpp/changeorder/acceptance/plan/update/data';
import FormConfigModal from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/components/FormConfigModal.vue';
// 定义 props
const props = withDefaults(defineProps<Props>(), {
  planType: () => [],
});
/**
 * 自己唯一的表单配置信息,formKey应该对应受理计划类型的字典类型值，formType对应受理计划字典数据的字典键值，formName应该是本组件的name，此处只是示例
 */
const customFormInfo = ref<any>({
  formKey: 'change_order_planInfo',
  formName: '改单计划信息',
  formType: '',
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
  schema: changeOrderPlanInfoFormSchema(),
});

// 初始化 formVisible 为 true
if (customFormInfo.value.formVisible === undefined) {
  customFormInfo.value.formVisible = true;
}

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: FormConfigModal,
});

const openModal = () => {
  modalApi.setData(FormApi.getState()?.schema).open();
};

const handleSuccess = async (resultData: any[]) => {
  customFormInfo.value.formSchema = JSON.stringify(resultData);
  FormApi.setState({ schema: resultData });
  await updateConfigForm(customFormInfo.value);
  message.success($t('ui.actionMessage.operationSuccess'));
  show.value = false;
};
const loadFormConfig = async () => {
  localOriginalRows.value = FormApi.getState()?.schema || [];

  const res = await selectByFormKeyNameType(customFormInfo.value);
  if (res?.id) {
    customFormInfo.value.id = res.id;
    customFormInfo.value.formVisible = res?.formVisible;
  }
  if (res?.formSchema) {
    const schema = JSON.parse(res.formSchema);
    if (schema.length > 0) {
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
      customFormInfo.value.formSchema = res.formSchema;
    } else {
      FormApi.setState({ schema: changeOrderPlanInfoFormSchema() });
    }
    show.value = false;
  } else {
    FormApi.setState({ schema: changeOrderPlanInfoFormSchema() });
    show.value = true;
  }
};
const initialData = (newVal: any) => {
  customFormInfo.value = {
    formKey: 'change_order_planInfo',
    formName: '改单计划信息',
    formType: '',
    formSchema: [],
    id: '',
    formVisible: true,
  };
  customFormInfo.value.formType = newVal;
  formKey.value++;
  loadFormConfig();
};
onActivated(() => {
  loadFormConfig();
});
onMounted(() => {
  initialData(props.planType);
});
// 监听 planType 变化
watch(
  () => props.planType,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      initialData(newVal);
    }
  },
  { deep: true },
);
const formKey = ref(0);
const show = ref(false);

const toggleFormVisibility = useDebounceFn(async () => {
  confirm({
    content: `您确定${customFormInfo.value.formVisible ? '隐藏' : '显示'}该表单吗？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        customFormInfo.value.formVisible = !customFormInfo.value.formVisible;
        await updateConfigForm(customFormInfo.value);
        message.success($t('ui.actionMessage.operationSuccess'));
        await loadFormConfig();
      } finally {
        hideLoading();
      }
    })
    .catch(() => {});
}, 300);
</script>

<template>
  <Card title="改单计划信息">
    <template #extra>
      <div class="flex items-center gap-2">
        <a-tag :bordered="false" color="warning" v-show="show">
          该类型字段还未配置请先进行配置
        </a-tag>
        <VbenButton @click="toggleFormVisibility">
          {{ customFormInfo.formVisible ? '隐藏表单' : '显示表单' }}
        </VbenButton>
        <VbenButton @click="openModal">配置字段</VbenButton>
      </div>
    </template>
    <Form :key="formKey" v-if="customFormInfo.formVisible" />
  </Card>
  <Modal @success="handleSuccess" />
</template>
