<script lang="ts" setup>
// import type { PageParam } from '@vben/request';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
// import type { EmptyContainerControlApi } from '#/api/bpp/emptycontainercontrol';
import type { LogQueryParams } from '#/api/bpp/empty/container/control';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getContainerIsoList, getContainerOwnerList } from '#/api/bpp/common';
import { getLogQueryPage } from '#/api/bpp/empty/container/control';

import {
  logQueryColumns,
  logQueryFormSchema,
  // STATIC_MASTER_PLAN_QUERY_DATA,
} from '../data';

const formValues = reactive({});

// 持箱人搜索状态
const ownerState = reactive({
  data: [],
  value: [],
  fetching: false,
});

const isoState = reactive({
  data: [],
  value: [],
  fetching: false,
});

// 持箱人搜索函数
const ownerSearch = async (value: string) => {
  ownerState.fetching = true;
  try {
    const res = await getContainerOwnerList({
      pageNo: 1,
      pageSize: 10,
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
    const res = await getContainerIsoList({
      pageNo: 1,
      pageSize: 10,
      containerIso: upperCaseValue,
      queryType: 'ISO',
    });

    if (res) {
      isoState.data = res.map((item: any) => ({
        label: item.containerIso,
        value: item.containerIso,
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
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  actionWrapperClass: 'col-span-1 text-right',
  handleValuesChange: (values) => {
    Object.assign(formValues, values);
  },
  handleSubmit: async () => {
    await handleQuery();
  },
  handleReset: async () => {
    formApi.resetForm();
    Object.assign(formValues, {});
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
          const params: LogQueryParams = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          };
          const res = await getLogQueryPage(params);
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
    formApi.setFieldValue('owner', undefined);
    formApi.setFieldValue('iso', undefined);
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
            @change="(value) => formApi.setFieldValue('owner', value)"
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
          />
        </template>
      </Form>
      <Grid />
    </div>
  </Modal>
</template>
