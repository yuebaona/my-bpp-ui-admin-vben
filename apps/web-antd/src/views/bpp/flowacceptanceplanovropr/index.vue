<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  FlowOverLimitWorkApi
} from "#/api/bpp/flowoverlimitwork";

import { ref, onMounted,watch  } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAcceptancePlanOverOperation,
  getAcceptancePlanOverOperationContainerPage,
  getAcceptancePlanOverOperationPage,
  getMachineSpreaderChangeRecordPage,
} from '#/api/bpp/flowoverlimitwork';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  machineSpreaderChangeRecordGridColumns,
  useBoxGridColumns,
} from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';
import OnSiteOperation from './modules/onSiteOperation.vue';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
interface OnSideOperation {
  overOperationContainerIds: string;
  initiationType: string;
  operationType: string;
  acceptancePlanNo: string;
  containerNo: string;
}
interface batchQueryConditionsVO{
  acceptancePlanNo: string;
  containerNo: string;
}
// 使用字典 store
const bppBaseDict = bppBaseDictStore();
const [AdvancedQueryModal, AdvancedQueryModalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});
// 现场操作确认弹框
const [OnSideOperationModal, OnSideOperationModalApi] = useVbenModal({
  connectedComponent: OnSiteOperation,
  destroyOnClose: true,
});
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建新申请 */
function handleCreate() {
  formModalApi.setData(null).open();
}
/** 查看详情 */
function handleViewDetail(row: OverLimitPlan) {
  message.info(`查看编号 ${row.acceptancePlanNo} 的详情`);
}
/** 查看详情 */
const handleDetail = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  const res = await getAcceptancePlanOverOperation(row.id);
  detailModalApi.setData(res).open();
};

/** 编辑申请 */
const handleEdit = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  const res = await getAcceptancePlanOverOperation(row.id);
  formModalApi.setData(res).open();
};
/** 现场操作确认 */
const handleOnSiteOperation = async () => {
  const data = ref<OnSideOperation>({
    overOperationContainerIds:'',
    initiationType:'',
    operationType:'',
    acceptancePlanNo:'',
    containerNo:''
  });
  if(!initiationTypeValue.value) {
    // 提示要选择发起类型
    message.error('请选择发起类型');
    return;
  }
  switch(bppBaseDict.getBppBaseDictData('initiation_type',initiationTypeValue.value).label){
    case '箱现场突发':
      break;
    case '舱盖板':
      data.value = {
        containerNo:'HATCH',
      };
      break;
    case '客户发起':
      if(!containerNos.value.length > 0){
        message.error('请选择要操作的箱');
        return;
      }
      if (boxAcceptancePlanNo.value.length > 1) {
        const uniqueNos = new Set(boxAcceptancePlanNo.value);
        if (uniqueNos.size > 1) {
          message.error('存在不同的受理编号，请检查');
          return;
        }
      }
      data.value = {
        overOperationContainerIds: containerIds,
        initiationType:initiationTypeValue.value,
        operationType:'DS_REV',
        acceptancePlanNo:boxAcceptancePlanNo.value[0],
        containerNo:containerNos.value.join(','),
      };
      break;
  }
  OnSideOperationModalApi.setData(data).open();
};
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
  boxGridApi.query();
}
/** 箱信息选中操作 */
const boxCheckedIds = ref<number[]>([]);
const boxAcceptancePlanNo = ref<string[]>([]);
const containerNos = ref<string[]>([]);
const containerIds = ref<number[]>([]);
const batchQueryConditions = ref<batchQueryConditionsVO[]>([]);
function boxHandleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[];
}) {
  boxCheckedIds.value = records.map((item) => item.id);
  boxAcceptancePlanNo.value = records.map((item) => item.acceptancePlanNo);
  containerNos.value = records.map((item) => item.containerNo);
  containerIds.value = records.map((item) => item.id);
  batchQueryConditions.value = records.map(item => ({
    acceptancePlanNo: item.acceptancePlanNo,
    containerNo: item.containerNo,
  }));
  machineSpreaderChangeRecordGridApi.query();
}
/** 获取字典数据 */
const getDictDataList = async () => {
  bppBaseDict.setBppBaseDictCacheByData((await getDictDataPage({
    dictType: 'initiation_type',
    pageNo: 1,
    pageSize: 100,
  })).list);
};
// 高级查询处理函数
function handleHighPriceQuery() {
  message.info('高级查询功能');
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanOvrOprFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
  },
  gridOptions: {
    columns: acceptancePlanOvrOprColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
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
      pageSize: 10,
      enabled: true,
    },
    // 禁用代理模式，确保不发送远程请求
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getAcceptancePlanOverOperationPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

// 箱列表表格配置
const [BoxGrid, boxGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useBoxGridColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    proxyConfig: {
      autoLoad: false,
      manual: true,
      ajax: {
        query: async ({ page }, formValues) => {
          if (acceptancePlanNo.value.length > 0) {
            formValues.acceptancePlanNos = acceptancePlanNo.value;
          }
          if (formValues?.acceptancePlanNos?.length > 0) {
            return await getAcceptancePlanOverOperationContainerPage({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
          }
          // 无参数时返回空数据（确保界面显示空）
          return { list: [], total: 0 };
        },
      },
    },
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>,
  gridEvents: {
    checkboxAll: boxHandleRowCheckboxChange,
    checkboxChange: boxHandleRowCheckboxChange,
  },
});

// 变更吊具记录表格配置
const [MachineSpreaderChangeRecordGrid, machineSpreaderChangeRecordGridApi] =
  useVbenVxeGrid({
    gridOptions: {
      columns: machineSpreaderChangeRecordGridColumns(),
      height: 'auto',
      keepSource: false,
      rowConfig: {
        keyField: 'id',
        isHover: true,
      },
      toolbarConfig: {
        refresh: false,
        search: false,
      },
      pagerConfig: {
        pageSize: 10,
        enabled: true,
      },
      proxyConfig: {
        autoLoad: false,
        manual: true,
        ajax: {
          query: async ({ page }, formValues) => {
            if (batchQueryConditions.value.length > 0) {
              formValues.batchQueryConditions = batchQueryConditions.value;
              console.log(formValues.batchQueryConditions);
            }
            if (formValues?.batchQueryConditions?.length > 0) {
              return await getMachineSpreaderChangeRecordPage({
                pageNo: page.currentPage,
                pageSize: page.pageSize,
                ...formValues,
              });
            }
            // 无参数时返回空数据（确保界面显示空）
            return { list: [], total: 0 };
          },
        },
      },
    } as VxeTableGridOptions<FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO>,
  });

const initiationTypeValue = ref(null);

const adcancedQueryModalOpen = () => {
  AdvancedQueryModalApi.open();
};
onMounted( async () => {
  await getDictDataList()
});
watch(() => bppBaseDict.getBppBaseDictOptions('initiation_type'), (options) => {
  if (options && options.length > 0 && !initiationTypeValue.value) {
    const customerInitiated = options.find(item => item.label === '客户发起');
    if (customerInitiated) {
      initiationTypeValue.value = customerInitiated.value;
    }
  }
}, { immediate: true });
</script>

<template>
  <Page auto-content-height>
    <FormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery />
    </AdvancedQueryModal>
    <DetailModal />
    <OnSideOperationModal class="w-1/2" @success="handleRefresh" />
    <!-- 超限作业申请列表 -->
    <div class="h-3/5 w-full">
      <Grid table-title="超限作业申请列表">
        <template #form-expand-before>
          <advancedButton @click="adcancedQueryModalOpen" />
        </template>
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['system:user:create'],
                onClick: handleCreate,
              },
              {
                label: '撤销',
                type: 'default',
                icon: ACTION_ICON.UNDO,
                onClick: handleHighPriceQuery,
              },
              {
                label: '撤销审核',
                type: 'default',
                icon: ACTION_ICON.UNDO,
                disabled: true,
                onClick: handleHighPriceQuery,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.LOG,
                onClick: handleHighPriceQuery,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '审核',
                type: 'link',
                icon: ACTION_ICON.AUDIT,
                onClick: handleViewDetail.bind(null, row),
              },
              {
                label: '修改',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['system:user:update'],
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '详情',
                type: 'link',
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>
    <div class="my-3 flex h-2/5 w-full">
      <div class="w-1/2">
        <!-- 箱列表表格 -->
        <BoxGrid table-title="箱列表">
          <template #toolbar-tools>
            <div class="mr-4">
              <a-radio-group name="radioGroup" v-model:value="initiationTypeValue">
                <a-radio :value="item.value" v-for="(item,index) in bppBaseDict.getBppBaseDictOptions('initiation_type')" :key="index">{{ item.label}}</a-radio>
              </a-radio-group>
            </div>
            <TableAction
              :actions="[
                {
                  label: '现场操作确认',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleOnSiteOperation,
                },
                {
                  label: '现场无此操作',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
                {
                  label: '无需变更道具',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
              ]"
            />
          </template>
        </BoxGrid>
      </div>
      <div class="ml-3 w-1/2">
        <!-- 变更吊具记录表格 -->
        <MachineSpreaderChangeRecordGrid table-title="变更吊具记录">
          <template #toolbar-tools>
            <TableAction
              :actions="[
                {
                  label: '日志查询',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
                {
                  label: '无变更作业',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
              ]"
            />
          </template>
          <template #actions>
            <TableAction
              :actions="[
                {
                  label: $t('common.edit'),
                  type: 'link',
                  icon: ACTION_ICON.EDIT,
                  auth: ['system:user:update'],
                },
                {
                  label: $t('common.delete'),
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  auth: ['system:user:delete'],
                  popConfirm: {
                    title: $t('ui.actionMessage.deleteConfirm'),
                  },
                },
              ]"
            />
          </template>
        </MachineSpreaderChangeRecordGrid>
      </div>
    </div>
  </Page>
</template>
