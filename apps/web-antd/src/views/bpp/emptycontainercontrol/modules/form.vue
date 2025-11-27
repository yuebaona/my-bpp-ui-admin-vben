<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowoverlimitwork';

import { computed, nextTick, reactive, ref, toRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAcceptancePlanOverOperation,
  updateAcceptancePlanOverOperation,
} from '#/api/bpp/flowoverlimitwork';

import { $t } from '#/locales';

import { subPlanFormSchema, containerAreaRangeColumns } from '../data';
import ContainerAreaModal from './containerarea.vue';

const emit = defineEmits(['success']);
const fileList = ref<UploadProps['fileList']>([]);

const containerAreaModalVisible = ref(false);

const containerAreaData = reactive<any[]>([
  {
    id: 'row_1',
    yardPosition: 'A01-01-01',
    yardColumns: ['A', 'B'],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_2',
    yardPosition: 'A02-01-01',
    yardColumns: [],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_3',
    yardPosition: 'B01-01-01',
    yardColumns: ['A', 'B', 'H'],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_4',
    yardPosition: 'B02-01-01',
    yardColumns: [],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
]);

const formData = reactive<FlowOverLimitWorkApi.AcceptancePlanVO>({
  id: '',
  acceptancePlanNo: '',
  acceptancePlanWebNo: '',
  applicantCode: '',
  applicantCompanyName: '',
  applicantPlanCount: 0,
  applicantPlanEnd: '',
  applicantPlanStart: '',
  applicantPlanType: '',
  applicantType: '',
  attachmentFile: '',
  cargoAgentCode: '',
  cargoOwnerCode: '',
  category: '',
  conclusionTime: '',
  dataSource: '',
  handlerConfirmTime: '',
  handlerConfirmation: '',
  handlerRemark: '',
  handlingPerson: '',
  invoiceTitle: '',
  isSystemRate: false,
  payerCodeGate: '',
  payerCodeSea: '',
  paymentTypeGate: '',
  paymentTypeSea: '',
  planStatus: '',
  plannedOperationTime: '',
  submissionTime: '',
  vesselCode: '',
  vesselName: '',
  vesselVoyage: '',
});

const acceptancePlanOverOperationRespVO =
  reactive<FlowOverLimitWorkApi.AcceptancePlanOverOperationVO>({
    id: 0,
    isAllowedStacking: false,
    plannedMachineryType: '',
    plannedSpreaderType: '',
    acceptancePlanNo: '',
    processInstanceId: '',
  });

const acceptancePlanBillMessageVO =
  reactive<FlowOverLimitWorkApi.AcceptancePlanBillMessageVO>({
    id: 0,
    acceptancePlanNo: '',
    billNo: '',
    cargoType: '',
    cargoName: '',
    cargoCount: 0,
    billType: '',
  });

const selectContainerArea = () => {
  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = (positions: string[]) => {
  const $grid = gridApi.grid;
  if ($grid) {
    // 清空现有数据
    containerAreaData.splice(0);

    // 添加新选择的数据
    const newRows = positions.map((pos, index) => ({
      id: `row_${Date.now()}_${index}`,
      yardPosition: `${pos}-01`, // 假设默认层号为01
      yardColumns: [],
      totalCount: '',
      minStorageDays: '',
      maxStorageDays: '',
    }));

    containerAreaData.push(...newRows);
    $grid.reloadData(containerAreaData);
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: subPlanFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: containerAreaRangeColumns(),
    height: '300px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      trigger: 'manual',
    },
    editRules: {
      yardPosition: [{ required: true, message: '必须填写' }],
      yardColumns: [{ required: true, message: '必须选择堆场列' }],
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data: containerAreaData,
  } as VxeTableGridOptions<any>,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const containerAreaArray = [...gridApi.grid.getInsertRecords()].map(
      (record) => toRaw(record),
    );

    if (containerAreaArray.length === 0) {
      message.warning('请至少添加一条箱区范围数据');
      return;
    }

    const { valid } = await formApi.validate();
    const gridValid: boolean = await gridApi.grid.validate(true);

    if (!valid || gridValid) {
      return;
    }

    Object.assign(formData, await formApi.getValues());
    const data: FlowOverLimitWorkApi.OverLimitWorkSaveReqVO = {
      acceptancePlanSaveReqVO: {
        ...formData,
      } as FlowOverLimitWorkApi.AcceptancePlanVO,
      acceptancePlanOverOperationSaveReqVO: {
        ...acceptancePlanOverOperationRespVO,
      } as FlowOverLimitWorkApi.AcceptancePlanOverOperationVO,
      acceptancePlanOverOperationContainerSaveReqVOs: containerAreaArray,
      acceptancePlanBillMessageSaveReqVO: {
        ...acceptancePlanBillMessageVO,
      } as FlowOverLimitWorkApi.AcceptancePlanBillMessageVO,
    };
    data.acceptancePlanOverOperationSaveReqVO.processInstanceId = '1111';
    data.acceptancePlanBillMessageSaveReqVO.billNo = formData.billNo;
    data.acceptancePlanBillMessageSaveReqVO.cargoName = formData.cargoName;

    data.acceptancePlanOverOperationContainerSaveReqVOs.forEach((item) => {
      if (item.id && String(item.id).startsWith('row_')) {
        item.id = item.id.replace('row_', '');
      }
    });
    data.acceptancePlanSaveReqVO.vesselCode = 'dafafa';

    await (formData?.id
      ? updateAcceptancePlanOverOperation(data)
      : createAcceptancePlanOverOperation(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        acceptancePlanNo: '',
        acceptancePlanWebNo: '',
        applicantCode: '',
        applicantCompanyName: '',
        applicantPlanCount: 0,
        applicantPlanEnd: '',
        applicantPlanStart: '',
        applicantPlanType: '',
        applicantType: '',
        attachmentFile: '',
        cargoAgentCode: '',
        cargoOwnerCode: '',
        category: '',
        conclusionTime: '',
        dataSource: '',
        handlerConfirmTime: '',
        handlerConfirmation: '',
        handlerRemark: '',
        handlingPerson: '',
        invoiceTitle: '',
        isSystemRate: false,
        payerCodeGate: '',
        payerCodeSea: '',
        paymentTypeGate: '',
        paymentTypeSea: '',
        planStatus: '',
        plannedOperationTime: '',
        submissionTime: '',
        vesselCode: '',
        vesselName: '',
        vesselVoyage: '',
      });
      containerAreaData.splice(0);
      return;
    }

    const data =
      await modalApi.getData<FlowOverLimitWorkApi.AcceptancePlanVO>();

    if (data) {
      Object.assign(formData, data.acceptancePlanRespVO);
      Object.assign(
        acceptancePlanOverOperationRespVO,
        data.acceptancePlanOverOperationRespVO,
      );
      Object.assign(
        acceptancePlanBillMessageVO,
        data.acceptancePlanBillMessageRespVO,
      );
      if (data?.acceptancePlanRespVO?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(data.acceptancePlanRespVO);
          await formApi.setFieldValue(
            'billNo',
            data?.acceptancePlanBillMessageRespVO?.billNo,
          );
          await formApi.setFieldValue(
            'cargoName',
            data?.acceptancePlanBillMessageRespVO?.cargoName,
          );
          fileList.value = JSON.parse(data.acceptancePlanRespVO.attachmentFile);

          for (const item of data.acceptancePlanOverOperationContainerRespVOS) {
            const $grid = gridApi.grid;
            if ($grid) {
              await $grid.insertAt(item, -1);
            }
          }
        } finally {
          modalApi.unlock();
        }
      }
    }
  },
});

const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['子计划'])
    : $t('ui.actionTitle.create', ['子计划']);
});

const handleUpload = async (data: any) => {
  fileList.value = data;
  await formApi.setFieldValue('attachmentFile', JSON.stringify(fileList.value));
  await formApi.validateField('attachmentFile');
};
</script>

<template>
  <Modal :title="modalTitle">
    <Form>
      <!-- 箱区范围表格部分 -->
      <template #containerAreaRange>
        <div class="mt-4 w-full">
          <div class="mb-2 flex items-center gap-2">
            <span class="font-medium">箱区范围</span>
            <Button type="primary" @click="selectContainerArea">
              选择箱区范围
            </Button>
          </div>
          <div class="table-container">
            <Grid>
              <!-- 堆场列下拉多选组件 -->
              <template #yardColumns="{ row }">
                <Select
                  v-model:value="row.yardColumns"
                  mode="multiple"
                  placeholder="请选择堆场列"
                  :options="[
                    { label: 'A', value: 'A' },
                    { label: 'B', value: 'B' },
                    { label: 'C', value: 'C' },
                    { label: 'D', value: 'D' },
                    { label: 'E', value: 'E' },
                    { label: 'F', value: 'F' },
                    { label: 'G', value: 'G' },
                    { label: 'H', value: 'H' },
                    { label: 'I', value: 'I' },
                    { label: 'J', value: 'J' },
                  ]"
                  style="width: 100%"
                  :max-tag-count="3"
                  :show-search="false"
                />
              </template>
              <template #actions="{ row }">
                <TableAction
                  :actions="[
                    {
                      label: '删除',
                      type: 'link',
                      danger: true,
                      onClick: () => deleteRow(row),
                    },
                  ]"
                />
              </template>
            </Grid>
          </div>
        </div>
      </template>
      <template #handlingPersonLast>
        <span class="text-gray-600" v-if="formData && formData.handlingPerson">
          {{ formData.handlingPerson }}
        </span>
      </template>
    </Form>
    <!-- 添加箱区选择弹窗组件 -->
    <ContainerAreaModal
      v-model:visible="containerAreaModalVisible"
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
