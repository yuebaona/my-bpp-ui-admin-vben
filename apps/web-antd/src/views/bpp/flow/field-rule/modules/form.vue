<script lang="ts" setup>
import type { FieldEditRuleHeadApi } from '#/api/field/editrulehead';

import { computed, ref,onMounted } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createEditRuleHead, getEditRuleHead, updateEditRuleHead,getEditRuleHeadPage } from '#/api/bpp/flow/field-rule';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<FieldEditRuleHeadApi.EditRuleHead>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['业务字段规则校验'])
    : $t('ui.actionTitle.create', ['业务字段规则校验']);
});
const tableColumns = ref([]);
const tableDataSource = ref([]);
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as FieldEditRuleHeadApi.EditRuleHead;
    try {
      await (formData.value?.id ? updateEditRuleHead(data) : createEditRuleHead(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据,打开模态窗时传递的参数
    const data = modalApi.getData<FieldEditRuleHeadApi.EditRuleHead>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getEditRuleHead(data.id);
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  }
});
onMounted(async()=>{
  const list = await getEditRuleHeadPage({
    pageNum:1,
    pageSize:10
  })
  if(list){
    list.forEach(item=>{
      tableDataSource.value.push({
        key:item.id,
        name:item.name,
        operation:'operation'
      })
    });
  }
})
</script>

<template>
  <Modal :title="getTitle" class="w-2/3">
    <Form class="mx-4" />
    <a-table bordered :data-source="tableDataSource" :columns="tableColumns">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="onDelete(record.key)"
          >
            <a>Delete</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </Modal>
</template>
