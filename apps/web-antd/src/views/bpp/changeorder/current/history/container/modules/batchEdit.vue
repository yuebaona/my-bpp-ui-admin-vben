<script lang="ts" setup>
// import type { VbenFormSchema } from '#/adapter/form';
// import type { ChangeOrderCurrentHistoryApi } from '#/api/bpp/changeorder/current/history/container/index.ts';

import { reactive, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import {message, Select} from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import { batchEditFormSchema } from '../data';
import LadingBill from './ladingBill.vue';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { getVesselAndVoyage} from '#/api/bpp/common';
const emit = defineEmits(['success']);

const selectedIds = ref<number[] | string[]>([]);
const formData = reactive<any>({
  vesselName: '',
});

const showLadingBillModal = ref(false);

// 打开提单号选择弹窗
const openLadingBillModal = () => {
  showLadingBillModal.value = true;
};

// 提单号选择成功回调
const handleLadingBillSuccess = (data: any) => {
  showLadingBillModal.value = false;
  formApi.setFieldValue('pickupNo', data.pickupNo || 'BL001');
};

const schema = batchEditFormSchema();
schema.find(
  (item: any) => item.fieldName === 'pickupNo',
).componentProps.onClick = openLadingBillModal;

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-3/4',
    },
    labelWidth: 180,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const formValues = await formApi.getValues();
    // Object.assign(formData, formValues);

    // 过滤空字段，只保留修改字段
    const updateFields = Object.fromEntries(
      Object.entries(formValues).filter(
        ([_, value]) => value !== '' && value !== undefined && value !== null,
      ),
    );

    if (selectedIds.value.length === 0) {
      message.error('没有选中要修改的记录');
      return;
    }

    if (Object.keys(updateFields).length === 0) {
      message.error('请至少修改一个字段');
      return;
    }

    // 构建批量修改的数据
    const batchData = {
      selectedIds: selectedIds.value,
      updateFields,
    };

    console.log('批量修改数据:', batchData);
    // await batchUpdateRecords(batchData);

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.keys(formData).forEach((key) => {
        formData[key] = '';
      });
      selectedIds.value = [];
      return;
    }
    const data = await modalApi.getData<number[] | string[]>();
    if (data && Array.isArray(data)) {
      selectedIds.value = data;
    }
  },
});

// 进口船名航次搜索选择器
const {
  state: importVesselAndVoyage,
  search: importVVDSearch,
  handleInput: handleImportVVDInput,
  handleCompositionStart: handleImportVVDCompositionStart,
  handleCompositionEnd: handleImportVVDCompositionEnd,
} = useSearchSelect({
  searchApi: async (searchText: string) => {
    try {
      const data = await getVesselAndVoyage({ condition: searchText });
      if (Array.isArray(data)) {
        return data.map(item => ({
          importVesselName: item
        }));
      }
      return [];
    } catch (error) {
      console.error('船名航次搜索失败:', error);
      return [];
    }
  },
  labelField: 'importVesselName',
  valueField: 'importVesselName',
  errorMessage: '获取船名航次数据失败',
  toUpperCase: true,
  searchMode: 'input',
  minSearchLength: 2,
});

// 出口船名航次搜索选择器
const {
  state: exportVesselAndVoyage,
  search: exportVVDSearch,
  handleInput: handleExportVVDInput,
  handleCompositionStart: handleExportVVDCompositionStart,
  handleCompositionEnd: handleExportVVDCompositionEnd,
} = useSearchSelect({
  searchApi: async (searchText: string) => {
    try {
      const data = await getVesselAndVoyage({ condition: searchText });
      if (Array.isArray(data)) {
        return data.map(item => ({
          exportVesselName: item
        }));
      }
      return [];
    } catch (error) {
      console.error('船名航次搜索失败:', error);
      return [];
    }
  },
  labelField: 'exportVesselName',
  valueField: 'exportVesselName',
  errorMessage: '获取船名航次数据失败',
  toUpperCase: true,
  searchMode: 'input',
  minSearchLength: 2,
});
</script>

<template>
  <Modal title="批量修改">
    <Form>
      <template #importVesselName>
        <Select
          v-model:value="importVesselAndVoyage.value"
          placeholder="请输入船名或航次"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="importVesselAndVoyage.fetching ? undefined : null"
          :options="importVesselAndVoyage.data"
          @search="importVVDSearch"
          allow-clear
          show-search
          @input="handleImportVVDInput"
          @compositionstart="handleImportVVDCompositionStart"
          @compositionend="handleImportVVDCompositionEnd"
        />
      </template>
      <template #exportVesselName>
        <Select
          v-model:value="exportVesselAndVoyage.value"
          placeholder="请输入船名或航次"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="exportVesselAndVoyage.fetching ? undefined : null"
          :options="exportVesselAndVoyage.data"
          @search="exportVVDSearch"
          allow-clear
          show-search
          @input="handleExportVVDInput"
          @compositionstart="handleExportVVDCompositionStart"
          @compositionend="handleExportVVDCompositionEnd"
        />
      </template>
    </Form>
    <LadingBill
      v-model:visible="showLadingBillModal"
      @success="handleLadingBillSuccess"
    />
  </Modal>
</template>
