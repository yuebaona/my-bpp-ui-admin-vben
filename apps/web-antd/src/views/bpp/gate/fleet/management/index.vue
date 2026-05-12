<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { FleetManagementApi } from '#/api/bpp/fleet/management';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFleetById, getFleetListPage } from '#/api/bpp/fleet/management';
import {
  fleetInfoColumns,
  fleetSearchSchema,
} from '#/views/bpp/gate/fleet/management/data';
import DetailForm from '#/views/bpp/gate/fleet/management/modules/detailForm.vue';
import EditForm from '#/views/bpp/gate/fleet/management/modules/editForm.vue';
import NewForm from '#/views/bpp/gate/fleet/management/modules/newForm.vue';

const [NewFormModal, newFormModalApi] = useVbenModal({
  connectedComponent: NewForm,
  destroyOnClose: true,
  draggable: true,
  onRegister: (modal) => {
    modal.$on('success', handleSuccess);
  },
});

// 更新成功,刷新表格
const handleSuccess = () => {
  gridApi?.reload();
};

const [DetailFormModal, detailFormModalApi] = useVbenModal({
  connectedComponent: DetailForm,
  destroyOnClose: true,
  draggable: true,
  footer: false,
  width: 1000,
});

const [EditFormModal, editFormModalApi] = useVbenModal({
  connectedComponent: EditForm,
  destroyOnClose: true,
  draggable: true,
});

// const [LogQueryModal, logQueryModalApi] = useVbenModal({
//   connectedComponent: LogQuery,
//   destroyOnClose: true,
//   footer: false,
//   closeOnClickModal: false,
// });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: fleetSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    resetButtonOptions: {
      onClick: () => {
        // // 清空自定义插槽绑定的状态
        // vslNameState.value = {
        //   value: '',
        //   label: '',
        // };
        // vslVoyState.value = {
        //   value: '',
        //   label: '',
        // };
        // applicantCompanyNameState.value = {
        //   value: '',
        //   label: '',
        // };
      },
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true, // 启用双击自适应列宽
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
      // remote: true,
    },
    columns: fleetInfoColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    printConfig: {
      enabled: true,
    },
    toolbarConfig: {
      search: true,
      print: true,
      custom: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
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
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          // await getDictDataList();
          const queryParam = { ...formValues };

          // return await getFleetListPage({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          //   ...queryParam,
          // });

          const res = await getFleetListPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });
          return res;
        },
      },
    },
  } as VxeTableGridOptions<FleetManagementApi.fleetVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
    filterChange: useDebounceFn(async ({ filterList }) => {
      const searchCont = filterList.reduce((obj, item) => {
        if (item.datas && item.datas.length > 0) {
          obj[item.field] = item.datas[0];
        }
        return obj;
      }, {});
      // 调用gridApi.query()刷新表格数据，实现实时筛选
      // await gridApi.query();
    }, 300),
    checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
      handleRowCheckboxChange({ records: rangeRecords });
    },
  },
});

/** 查看车队详情 */
const handleDetail = async (row: FleetManagementApi.fleetVO) => {
  const res = await getFleetById(row.id);
  detailFormModalApi.setData(res).open();
};

/** 编辑车队信息 */
const handleEdit = async (row: FleetManagementApi.fleetVO) => {
  const res = await getFleetById(row.id);
  editFormModalApi.setData(res).open();
};

/** 日志查询 */
function handleLogQuery() {
  // logQueryModalApi.open();
}

// 高级查询处理函数
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建新车队 */
function handleCreate() {
  newFormModalApi.setData(null).open();
}

/** 车队信息选中操作 */
const fleetIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  fleetIds.value = records.map((item) => item.id);
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <NewFormModal class="w-3/5" @success="handleRefresh" />
    <DetailFormModal class="w-full" @success="handleRefresh" />
    <EditFormModal class="w-3/5" @success="handleRefresh" />
    <!--    <LogQueryModal />-->
    <Grid table-title="车队信息列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['empty:container-control-main:create'],
              onClick: handleCreate,
            },
            {
              label: '日志查询',
              type: 'primary',
              icon: ACTION_ICON.VIEW,
              onClick: handleLogQuery,
              auth: ['empty:container-control-main-log:query'],
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '详情',
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['empty:container-control-main:update'],
              onClick: handleDetail.bind(null, row),
            },
            {
              label: '编辑',
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['empty:container-control-main:update'],
              onClick: handleEdit.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
