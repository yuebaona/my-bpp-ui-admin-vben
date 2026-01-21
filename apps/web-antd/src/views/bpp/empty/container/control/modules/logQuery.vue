<script lang="ts" setup>
// import type { PageParam } from '@vben/request';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
// import type { EmptyContainerControlApi } from '#/api/bpp/emptycontainercontrol';
import type { LogQueryParams } from '#/api/bpp/empty/container/control';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getContainerIsoListPage,
  getContainerOwnerListPage,
} from '#/api/bpp/common';
import { getLogQueryPage } from '#/api/bpp/empty/container/control';

import ContainerAreaSelect from './containerAreaSelect.vue';
import { logQueryColumns, logQueryFormSchema } from '../data';

const formValues = reactive({});

// 控制箱区选择组件显隐藏
const containerAreaVisible = ref(false);

// 箱区范围值
const bayRangeListValue = ref('');

// 传给箱区选择组件的已选箱区
const selectedPositions = ref<string[]>([]);

// 持箱人搜索状态
const ownerState = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false,
});

// 箱区选择确认
const handleContainerAreaConfirm = async (positions: string[]) => {
  selectedPositions.value = [...positions];
  const value = positions && positions.length > 0 ? positions.join(',') : '';
  bayRangeListValue.value = value;
  await formApi.setValues({
    yardBay: value,
  });
  containerAreaVisible.value = false;
};

// 处理持箱人输入，将小写字母转换为大写
const handleOwnerInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (ownerState.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  ownerSearch(target.value);
};

// 处理持箱人中文输入法组合开始
const handleOwnerCompositionStart = () => {
  ownerState.isComposing = true;
};

// 处理持箱人中文输入法组合结束（回车或选择候选词）
const handleOwnerCompositionEnd = (e: CompositionEvent) => {
  ownerState.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  ownerSearch(target.value);
};

const isoState = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false,
});

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

// 持箱人搜索函数
const ownerSearch = async (value: string) => {
  ownerState.fetching = true;
  try {
    const res = await getContainerOwnerListPage({
      pageNo: 1,
      pageSize: 100,
      ownerCode: value.toUpperCase(),
    });

    if (res) {
      ownerState.data = res.map((item: any) => ({
        label: item.ownerCode,
        value: item.ownerCode,
        data: item,
      }));
    }
  } catch {
    message.error('获取持箱人数据失败');
  } finally {
    ownerState.fetching = false;
  }
};

// ISO搜索函数
const isoSearch = async (value: string) => {
  isoState.fetching = true;
  try {
    const upperCaseValue = value.toUpperCase();
    const res = await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 100,
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

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 80,
  },
  schema: logQueryFormSchema(),
  showDefaultActions: true,
  submitOnEnter: true,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  actionWrapperClass: 'col-span-1 text-right',
  handleValuesChange: (values) => {
    Object.assign(formValues, values);
    if (values.yardBay !== undefined) {
      if (values.yardBay) {
        selectedPositions.value = values.yardBay.split(',');
      } else {
        selectedPositions.value = [];
      }
    }
  },
  handleSubmit: async () => {
    await handleQuery();
  },
  handleReset: async () => {
    await formApi.resetForm();
    Object.assign(formValues, {});
    ownerState.value = [];
    ownerState.data = [];
    isoState.value = [];
    isoState.data = [];
    bayRangeListValue.value = '';
    selectedPositions.value = [];
    await formApi.setFieldValue('owner', undefined);
    await formApi.setFieldValue('iso', undefined);
    await formApi.setFieldValue('yardBay', undefined);
    await handleQuery();
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: logQueryColumns(),
    height: '500px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: {
      enabled: true,
      pageSize: 10,
    },
    toolbarConfig: {
      custom: false,
      refresh: false,
      zoom: false,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const data: LogQueryParams = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          };
          // 将 createTime 从字符串转换为时间戳
          if (data.createTime && data.createTime.length === 2) {
            data.createTime = [
              new Date(data.createTime[0]).getTime().toString(),
              new Date(data.createTime[1]).getTime().toString()
            ];
          }
          const res = await getLogQueryPage(data);
          return {
            list: res.list,
            total: res.total,
          };
        },
      },
    },
  } as VxeTableGridOptions<any>,
});

/** 查询处理函数 */
const handleQuery = async () => {
  try {
    await gridApi.query();
  } catch (error) {
    console.error('查询失败:', error);
  }
};

const [Modal, modalApi] = useVbenModal({
  title: '日志查询',
  fullscreen: false,
  class: 'w-[95vw] max-w-[1450px]',
  onOpened() {
    ownerState.value = [];
    isoState.value = [];
    bayRangeListValue.value = '';
    formApi.setFieldValue('owner', undefined);
    formApi.setFieldValue('iso', undefined);
    formApi.setFieldValue('yardBay', '');
    handleQuery();
  },
  onConfirm: () => {
    modalApi.close();
  },
});
</script>

<template>
  <Modal>
    <div class="flex flex-col gap-4 p-4">
      <Form>
        <template #owner>
          <Select
            v-model:value="ownerState.value"
            placeholder="请输入持箱人"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="ownerState.fetching ? undefined : null"
            :options="ownerState.data"
            @search="ownerSearch"
            allow-clear
            show-search
            @focus="ownerSearch('')"
            @change="(value) => formApi.setFieldValue('owner', value)"
            @input="handleOwnerInput"
            @compositionstart="handleOwnerCompositionStart"
            @compositionend="handleOwnerCompositionEnd"
          />
        </template>
        <template #iso>
          <Select
            v-model:value="isoState.value"
            placeholder="请输入ISO"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="isoState.fetching ? undefined : null"
            :options="isoState.data"
            @search="isoSearch"
            allow-clear
            show-search
            @change="(value) => formApi.setFieldValue('iso', value)"
            @input="handleIsoInput"
            @focus="isoSearch('')"
            @compositionstart="handleIsoCompositionStart"
            @compositionend="handleIsoCompositionEnd"
          />
        </template>
        <template #yardBay>
          <div class="flex w-full items-center">
            <Button
              type="default"
              style="width: 100%"
              @click="containerAreaVisible = true"
              :disabled="false"
              :title="bayRangeListValue || '选择箱区'"
            >
              {{ bayRangeListValue || '选择箱区' }}
            </Button>
            <Button
              v-if="bayRangeListValue"
              type="link"
              danger
              @click="
                bayRangeListValue = '';
                formApi.setValues({
                  yardBay: '',
                });
              "
            />
          </div>
        </template>
      </Form>
      <Grid />
      <ContainerAreaSelect
        v-model:visible="containerAreaVisible"
        trade-type=""
        :selected-positions="selectedPositions"
        @confirm="handleContainerAreaConfirm"
      />
    </div>
  </Modal>
</template>
