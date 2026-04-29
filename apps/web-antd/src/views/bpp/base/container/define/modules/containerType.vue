<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  containerTypeColumns,
  containerTypeSearchSchema,
} from '#/views/bpp/base/container/define/data';

const [Grid, GridApi] = useVbenVxeGrid({
  formOptions: {
    schema: containerTypeSearchSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    // border: true,
    columns: containerTypeColumns(),
    height: 'auto',
    virtualYConfig: {
      enabled: true,
      gt: 100,
    },
    keepSource: true,
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    rowConfig: {
      // keyField: 'id',
      isHover: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      showStatus: true,
      trigger: 'dblclick',
      autoClear: false,
    },
    editRules: {
      businessCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{7}$/, message: '请填写7位大写字母' },
      ],
      businessName: [{ required: true, message: '必填项' }],
      plnValidDays: [
        { required: true, message: '必填项' },
        { pattern: /^\d+$/, message: '请填写数字' },
      ],
      mappingCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{6}$/, message: '、请填写6位大写字母' },
      ],
      isValid: [{ required: true, message: '必填项' }],
      pickupLocation: [{ required: true, message: '必填项' }],
      deliveryLocation: [{ required: true, message: '必填项' }],
    },
    mouseConfig: {
      selected: true, // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true, // 支持上下左右键移动单元格
      isEnter: true, // 支持回车键保存或移动
      isTab: true, // 支持Tab键切换单元格
      isEsc: true, // 支持Esc键退出编辑
      isEdit: true, // 开启单元格选中编辑功能
    },
    toolbarConfig: {
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 20,
      enabled: true,
      pageSizes: [
        {
          label: '20',
          value: 20,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
    // proxyConfig: {
    //   ajax: {
    //     // query: async ({ page }, formValues) => {
    //     //   const res = await getGateInOutTypePage({
    //     //     ...formValues,
    //     //     pageNo: page.currentPage,
    //     //     pageSize: page.pageSize,
    //     //   });
    //     //   return {
    //     //     list: res.list,
    //     //     total: res.total,
    //     //   };
    //     // },
    //   },
    // },
  },
});
</script>

<template>
  <Page auto-content-height>
    <div class="mb-3 h-full w-full">
      <Grid>
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '保存',
                type: 'primary',
              },
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
              },
              {
                label: '删除',
                type: 'default',
                icon: ACTION_ICON.DELETE,
              },
            ]"
          />
        </template>
      </Grid>
    </div>
  </Page>
</template>
