<script lang="ts" setup>
// import type { VbenFormSchema } from '#/adapter/form';
// import type { ChangeOrderUnreturnApi } from '#/api/bpp/changeorder/unreturn';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  getContainerIsoListPage,
  getContainerOwnerListPage,
} from '#/api/bpp/common';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { $t } from '#/locales';

import { editFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = reactive<any[]>({
  id: null,
  returnType: '',
  returnPort: '',
});

const {
  state: isoState,
  search: isoSearch,
  handleInput: handleIsoInput,
  handleCompositionStart: handleIsoCompositionStart,
  handleCompositionEnd: handleIsoCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 10,
      contIso: value,
      queryType: 'ISO',
    });
  },
  labelField: 'contIso',
  valueField: 'contIso',
  errorMessage: '获取ISO数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

// 持箱人搜索选择器
const {
  state: ownerState,
  search: ownerSearch,
  handleInput: handleOwnerInput,
  handleCompositionStart: handleOwnerCompositionStart,
  handleCompositionEnd: handleOwnerCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getContainerOwnerListPage({
      pageNo: 1,
      pageSize: 10,
      ownerCode: value,
    });
  },
  labelField: 'ownerCode',
  valueField: 'ownerCode',
  errorMessage: '获取持箱人数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

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
      <template #owner>
        <Select
          v-model:value="ownerState.value"
          mode="multiple"
          placeholder="请输入持箱人"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="ownerState.fetching ? undefined : null"
          :options="ownerState.data"
          @search="ownerSearch"
          allow-clear
          show-search
          @focus="ownerSearch('')"
          @input="handleOwnerInput"
          @compositionstart="handleOwnerCompositionStart"
          @compositionend="handleOwnerCompositionEnd"
        />
      </template>
    </Form>
  </Modal>
</template>
