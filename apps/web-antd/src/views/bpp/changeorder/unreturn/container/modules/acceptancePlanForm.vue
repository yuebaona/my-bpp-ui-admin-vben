<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  acceptancePlanColumns,
  acceptancePlanSearchSchema,
} from '#/views/bpp/changeorder/unreturn/container/data';
import BundleBox from '#/views/bpp/changeorder/unreturn/container/modules/bundleBox.vue';
import Edit from '#/views/bpp/changeorder/unreturn/container/modules/edit.vue';
import LadingBill from '#/views/bpp/changeorder/unreturn/container/modules/ladingBill.vue';
import Return from '#/views/bpp/changeorder/unreturn/container/modules/return.vue';

const formData = reactive<any[]>([
  {
    id: 1,
    acceptancePlanNo: 'AP20240501001',
    transportOrdNo: 'TO20240501001',
    businessType: '进口',
    containerNo: 'MSCU1234567',
    instructionStatus: '已受理',
    pickupNo: 'BOL20240501001',
    isLCL: '否',
    cargo: '电子产品',
    vesselName: 'MSC OSCAR 001',
    dischargePort: '上海港',
    destinationPort: '苏州港',
    tradeType: '外贸',
    owner: 'MSC',
    size: '40尺',
    containerType: '干货箱',
    containerHeight: '高箱',
    iso: '45G1',
    empty: '重箱',
    imdg: '非危',
    unno: '',
    isReefer: '否',
    temperature: '',
    vent: '',
    sealNo: 'SEAL12345',
    weight: '20吨',
    containerLevel: '一级',
    damage: '否',
    damageLevel: '',
    overLimit: '否',
    front: '0cm',
    rear: '0cm',
    left: '0cm',
    right: '0cm',
    pickup: '否',
    PTI: '否',
    PTITime: '',
    relatePickupNo: '',
    relateTO: '',
    returnPort: '上海港',
    payer: '货主',
    payment: '预付',
    title: '上海进出口有限公司',
    oldContainerNo: '',
    newContainerNo: '',
    isBand: '否',
    subContainer: '',
    remark: '正常货物',
  },
  {
    id: 2,
    acceptancePlanNo: 'AP20240501002',
    transportOrdNo: 'TO20240501002',
    businessType: '出口',
    containerNo: 'CMAU7654321',
    instructionStatus: '已完成',
    pickupNo: 'BOL20240501002',
    isLCL: '是',
    cargo: '服装',
    vesselName: 'CMA CGM ALEXANDRIA 002',
    dischargePort: '宁波港',
    destinationPort: '洛杉矶港',
    tradeType: '外贸',
    owner: 'CMA',
    size: '20尺',
    containerType: '干货箱',
    containerHeight: '普箱',
    iso: '22G1',
    empty: '重箱',
    imdg: '非危',
    unno: '',
    isReefer: '否',
    temperature: '',
    vent: '',
    sealNo: 'SEAL67890',
    weight: '15吨',
    containerLevel: '二级',
    damage: '否',
    damageLevel: '',
    overLimit: '否',
    front: '0cm',
    rear: '0cm',
    left: '0cm',
    right: '0cm',
    pickup: '是',
    PTI: '否',
    PTITime: '',
    relatePickupNo: 'BOL20240501003',
    relateTO: 'TO20240501003',
    returnPort: '宁波港',
    payer: '货代',
    payment: '到付',
    title: '宁波服装出口有限公司',
    oldContainerNo: '',
    newContainerNo: '',
    isBand: '是',
    subContainer: 'SUB001,SUB002',
    remark: '拼箱货物',
  },
]);

// 编辑状态管理
const editingRow = ref<null | string>(null);

// 提单信息管理模态框
const [LadingBillModal, ladingBillModalApi] = useVbenModal({
  connectedComponent: LadingBill,
  destroyOnClose: true,
});

// 捆绑箱维护弹窗
const [BundleBoxModal, bundleBoxModalApi] = useVbenModal({
  connectedComponent: BundleBox,
  destroyOnClose: true,
});

// 返场信息管理弹窗
const [ReturnModal, returnModalApi] = useVbenModal({
  connectedComponent: Return,
  destroyOnClose: true,
});

// 批量编辑
const [EditModal, editModalApi] = useVbenModal({
  connectedComponent: Edit,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    height: '700px',
    columns: acceptancePlanColumns(),
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      trigger: 'click',
    },
    toolbarConfig: {
      export: true,
      custom: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    data: formData,
    // 禁用代理模式，确保不发送远程请求
    // proxyConfig: {
    //   ajax: {
    //     query: async ({ page }, formValues) => {
    //       return await getAcceptancePlanOverOperationPage({
    //         pageNo: page.currentPage,
    //         pageSize: page.pageSize,
    //         ...formValues,
    //       });
    //     },
    //   },
    // },
  } as VxeTableGridOptions<any>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

/** 超限作业申请选中操作 */
const checkedIds = ref<number[]>([]);
const acceptancePlanNo = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  acceptancePlanNo.value = records.map((item) => item.acceptancePlanNo);
}

function batchEdit() {
  editModalApi.setData(null).open();
}

/** 创建新申请 */
function handleDeleteTO() {
  formModalApi.setData(null).open();
}

const handleClickReturn = () => {
  returnModalApi.setData(null).open();
};

/** 编辑申请 */
function handleEdit(row: any) {
  editingRow.value = row.id;
  gridApi.grid?.setEditRow(row);
}

// 保存编辑
function handleSave(row: any) {
  gridApi.grid
    ?.commitEditRow(row.id)
    .then(() => {
      editingRow.value = null;
      message.success('保存成功');
    })
    .catch(() => {
      message.error('保存失败');
    });
}

// 取消编辑
function handleCancel(row: any) {
  gridApi.grid?.clearActived(row);
  editingRow.value = null;
}

/** 处理点击提单号事件 */
const handleClickPickupNo = () => {
  // message.info('查看提单号信息');
  ladingBillModalApi.setData(null).open();
};

const handleClickSubBox = () => {
  bundleBoxModalApi.setData(null).open();
};

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}
</script>

<template>
  <ACard title="受理计划列表" :body-style="{ padding: '2px 16px' }">
    <LadingBillModal class="w-3/4" @success="handleRefresh" />
    <BundleBoxModal class="w-3/4" @success="handleRefresh" />
    <ReturnModal class="w-1/4" @success="handleRefresh" />
    <EditModal class="w-3/4" @success="handleRefresh" />
    <Grid>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '批量修改',
              type: 'primary',
              icon: ACTION_ICON.EDIT,
              onClick: batchEdit,
            },
            {
              label: '删除TO',
              type: 'default',
              icon: ACTION_ICON.DELETE,
              onClick: handleDeleteTO,
            },
            {
              label: '返场信息管理',
              type: 'primary',
              icon: ACTION_ICON.BRIEFCASE,
              onClick: handleClickReturn,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <template v-if="editingRow === row.id">
          <TableAction
            :actions="[
              {
                label: '保存',
                type: 'link',
                onClick: handleSave.bind(null, row),
              },
              {
                label: '取消',
                type: 'link',
                onClick: handleCancel.bind(null, row),
              },
            ]"
          />
        </template>
        <template v-else>
          <TableAction
            :actions="[
              {
                label: '编辑',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                onClick: handleEdit.bind(null, row),
              },
            ]"
          />
        </template>
      </template>
      <template #pickupNoAction="{ row }">
        <a-button type="primary" size="small" @click="handleClickPickupNo">
          提单信息管理
        </a-button>
      </template>
      <template #boxAction="{ row }">
        <a-button type="primary" size="small" @click="handleClickSubBox">
          捆绑箱维护
        </a-button>
      </template>
    </Grid>
  </ACard>
</template>
