<script lang="ts" setup>
// import type { VbenFormSchema } from '#/adapter/form';
// import type { ChangeOrderUnreturnApi } from '#/api/bpp/changeorder/unreturn';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getContainerIsoListPage } from '#/api/bpp/common';
import { $t } from '#/locales';

import { editFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = reactive<any[]>({
  id: null,
  returnType: '',
  returnPort: '',
});

const isoState = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false, // 标记是否在中文输入法组合状态
  originalValue: [],
});

// ISO搜索函数
const isoSearch = async (value: string) => {
  isoState.fetching = true;
  try {
    const upperCaseValue = value.toUpperCase();
    const res = await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 10,
      contIso: upperCaseValue,
      queryType: 'ISO',
    });

    if (res) {
      isoState.data = res.map((item: any) => ({
        label: item.contIso,
        value: item.contIso,
        data: item,
      }));
    }
  } catch {
    message.error('获取ISO数据失败');
  } finally {
    isoState.fetching = false;
  }
};

// 处理ISO输入，将小写字母转换为大写
const handleIsoInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (isoState.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  isoSearch(target.value);
};

// 处理ISO中文输入法组合开始
const handleIsoCompositionStart = () => {
  isoState.isComposing = true;
};

// 处理ISO中文输入法组合结束（回车或选择候选词）
const handleIsoCompositionEnd = (e: CompositionEvent) => {
  isoState.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  isoSearch(target.value);
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      lass: 'w-full',
    },
    labelWidth: 170,
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
    <Form>
      <template #iso>
        <Select
          v-model:value="isoState.value"
          mode="multiple"
          placeholder="请输入ISO"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="isoState.fetching ? undefined : null"
          :options="isoState.data"
          @search="isoSearch"
          allow-clear
          show-search
          @focus="isoSearch('')"
          @input="handleIsoInput"
          @compositionstart="handleIsoCompositionStart"
          @compositionend="handleIsoCompositionEnd"
        />
      </template>
    </Form>
  </Modal>
</template>
