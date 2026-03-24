<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getContainerIsoListPage,
  getContainerOwnerListPage,
} from '#/api/bpp/common';
import { getVesselAndVoyage } from '#/api/bpp/empty/container/control';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import {
  acceptancePlanColumns,
  acceptancePlanSearchSchema,
} from '#/views/bpp/changeorder/unreturn/container/data';
import BundleBox from '#/views/bpp/changeorder/unreturn/container/modules/bundleBox.vue';
import Edit from '#/views/bpp/changeorder/unreturn/container/modules/edit.vue';
import LadingBill from '#/views/bpp/changeorder/unreturn/container/modules/ladingBill.vue';
import Return from '#/views/bpp/changeorder/unreturn/container/modules/return.vue';

const bppBaseDict = bppBaseDictStore();
// 编辑状态管理
const editingRow = ref<null | string>(null);

/** 获取内外贸字典选项 */
const tradeTypeOptions = computed(() => {
  const dictData = bppBaseDict.getBppBaseDictOptions('trade_type') || [];
  return dictData.map((item) => ({
    label: item.label,
    value: item.value,
  }));
});

const formData = reactive<any[]>([
  {
    id: 1,
    acptPlnNo: 'AP20240501001',
    transportOrdNo: 'TO20240501001',
    businessType: '进口',
    contNo: 'MSCU1234567',
    orderStatus: 'RESERVED',
    pickupNo: 'BOL20240501001',
    isLCL: '否',
    cargoName: '电子产品',
    vesselName: 'MSC OSCAR 001',
    dischargePort: '上海港',
    destinationPort: '苏州港',
    tradeType: 'DOMESTIC',
    owner: 'COS',
    size: '40',
    containerType: 'PF',
    containerHeight: '高箱',
    iso: '45G1',
    empty: '重箱',
    imdgCode: '非危',
    unNo: '1234',
    isRefrigerated: '否',
    refrigerationTemp: '',
    ventilationPort: '',
    sealNo: 'SEAL12345',
    contWeightKg: '20吨',
    contGrade: '一级',
    isDamaged: '否',
    damageGrade: '',
    isOog: '否',
    oogFront: '0cm',
    oogBack: '0cm',
    oogLeft: '0cm',
    oogRight: '0cm',
    isDirectLoadPick: '否',
    isPtiValid: '否',
    ptiExpiryDate: '',
    relatedBillNo: '',
    relatedToNo: '',
    returnTerminal: '上海港',
    payerCode: '货主',
    paymentType: '预付',
    invoiceTitle: '上海进出口有限公司',
    oldContNo: '',
    newContainerNo: '',
    isBand: '否',
    subContainer: '',
    remark: '正常货物',
  },
  {
    id: 2,
    acptPlnNo: 'AP20240501002',
    transportOrdNo: 'TO20240501002',
    businessType: '出口',
    contNo: 'CMAU7654321',
    orderStatus: 'RESERVED',
    pickupNo: 'BOL20240501002',
    isLCL: '是',
    cargoName: '服装',
    vesselName: 'CMA CGM ALEXANDRIA 002',
    dischargePort: '宁波港',
    destinationPort: '洛杉矶港',
    tradeType: 'FOREIGN',
    owner: 'CMA',
    size: '20',
    containerType: 'HD',
    containerHeight: '普箱',
    iso: '22G1',
    empty: '重箱',
    imdgCode: '非危',
    unNo: '4554',
    isRefrigerated: '否',
    refrigerationTemp: '4',
    ventilationPort: '',
    sealNo: 'SEAL67890',
    contWeightKg: '15吨',
    contGrade: '二级',
    isDamaged: '否',
    damageGrade: '',
    isOog: '否',
    oogFront: '0cm',
    oogBack: '0cm',
    oogLeft: '0cm',
    oogRight: '0cm',
    isDirectLoadPick: '是',
    isPtiValid: '否',
    ptiExpiryDate: '',
    relatedBillNo: 'BOL20240501003',
    relatedToNo: 'TO20240501003',
    returnTerminal: '宁波港',
    payerCode: '货代',
    paymentType: '到付',
    invoiceTitle: '宁波服装出口有限公司',
    oldContNo: '',
    newContainerNo: '',
    isBand: '是',
    subContainer: 'SUB001,SUB002',
    remark: '拼箱货物',
  },
]);

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

/** 持箱人搜索选择器 */
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

/** 箱尺寸搜索选择器 */
const {
  state: sizeState,
  search: sizeSearch,
  handleInput: handleSizeInput,
  handleCompositionStart: handleSizeCompositionStart,
  handleCompositionEnd: handleSizeCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 10,
      contLength: value,
      queryType: 'length',
    });
  },
  labelField: 'contLength',
  valueField: 'contLength',
  errorMessage: '获取ISO数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

/** 箱型搜索选择器 */
const {
  state: containerTypeState,
  search: containerTypeSearch,
  handleInput: handleContainerTypeInput,
  handleCompositionStart: handleContainerTypeCompositionStart,
  handleCompositionEnd: handleContainerTypeCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 10,
      contType: value,
      queryType: 'type',
    });
  },
  labelField: 'contType',
  valueField: 'contType',
  errorMessage: '获取箱型数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

/** ISO搜索选择器 */
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

const {
  state: vesselNameState,
  handleInput: handleVesselNameInput,
  handleCompositionStart: handleVesselNameCompositionStart,
  handleCompositionEnd: handleVesselNameCompositionEnd,
} = useSearchSelect({
  searchApi: async (value: string) => {
    return await getVesselAndVoyage({ condition: value });
  },
  errorMessage: '获取船名航次数据失败',
  toUpperCase: true,
  isStringArray: true,
  searchMode: 'input',
  minSearchLength: 2,
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
      enabled: false,
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
      trigger: 'manual',
      autoClear: false,
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

/** 删除TO */
function handleDeleteTO() {
  // formModalApi.setData(null).open();
}

const handleClickReturn = () => {
  returnModalApi.setData(null).open();
};

/** 编辑申请 */
function handleEdit(row: any) {
  editingRow.value = row.id;
  gridApi.grid?.setEditRow(row);
}

/** 保存编辑 */
function handleSave(row: any) {
  const index = formData.findIndex((item) => item.id === row.id);
  if (index !== -1) {
    Object.assign(formData[index], row);
  }
  gridApi.grid?.clearEdit();
  editingRow.value = null;
}

/** 取消编辑 */
function handleCancel(row: any) {
  gridApi.grid?.clearEdit(row);
  editingRow.value = null;
}

/** 处理点击提单号事件 */
const handleClickPickupNo = () => {
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
      <template #form-vesselName>
        <Select
          :options="vesselNameState.data"
          v-model="vesselNameState.value"
          style="width: 100%"
          placeholder="请输入船名或航次"
          :show-search="true"
          :filter-option="true"
          :list-height="150"
          allow-clear
          @change="
            (value) => gridApi.formApi.setFieldValue('vesselName', value)
          "
          @input="handleVesselNameInput"
          @compositionstart="handleVesselNameCompositionStart"
          @compositionend="handleVesselNameCompositionEnd"
        />
      </template>
      <template #owner_edit="{ row }">
        <div v-if="editingRow === row.id">
          <Select
            v-model:value="row.owner"
            style="width: 100%"
            placeholder="请输入持箱人"
            :show-search="true"
            :filter-option="false"
            :not-found-content="ownerState.fetching ? undefined : null"
            :options="ownerState.data"
            allow-clear
            @search="ownerSearch"
            @focus="ownerSearch('')"
            @input="handleOwnerInput"
            @compositionstart="handleOwnerCompositionStart"
            @compositionend="handleOwnerCompositionEnd"
          />
        </div>
      </template>
      <template #tradeType_edit="{ row }">
        <div v-if="editingRow === row.id">
          <Select
            v-model:value="row.tradeType"
            placeholder="请选择内外贸"
            style="width: 100%"
            allow-clear
            :options="tradeTypeOptions"
            @change="
              () => {
                if (editingRow === row.id) {
                  gridApi.grid?.setEditRow(row);
                }
              }
            "
            @mousedown.prevent
            @click.stop
          />
        </div>
      </template>
      <template #size_edit="{ row }">
        <div v-if="editingRow === row.id">
          <Select
            v-model:value="row.size"
            placeholder="请输入尺寸"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="sizeState.fetching ? undefined : null"
            :options="sizeState.data"
            @search="sizeSearch"
            allow-clear
            show-search
            @focus="sizeSearch('')"
            @input="handleSizeInput"
            @compositionstart="handleSizeCompositionStart"
            @compositionend="handleSizeCompositionEnd"
          />
        </div>
      </template>
      <template #containerType_edit="{ row }">
        <div v-if="editingRow === row.id">
          <Select
            v-model:value="row.containerType"
            placeholder="请输入箱型"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="containerTypeState.fetching ? undefined : null"
            :options="containerTypeState.data"
            @search="containerTypeSearch"
            allow-clear
            show-search
            @focus="containerTypeSearch('')"
            @input="handleContainerTypeInput"
            @compositionstart="handleContainerTypeCompositionStart"
            @compositionend="handleContainerTypeCompositionEnd"
          />
        </div>
      </template>
      <template #iso_edit="{ row }">
        <div v-if="editingRow === row.id">
          <Select
            v-model:value="row.iso"
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
        </div>
      </template>
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
      <template #pickupNoAction>
        <a-button type="primary" size="small" @click="handleClickPickupNo">
          提单信息管理
        </a-button>
      </template>
      <template #boxAction>
        <a-button type="primary" size="small" @click="handleClickSubBox">
          捆绑箱维护
        </a-button>
      </template>
    </Grid>
  </ACard>
</template>
