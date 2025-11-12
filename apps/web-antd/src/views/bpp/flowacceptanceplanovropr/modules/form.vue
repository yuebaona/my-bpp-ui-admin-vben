<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowoverlimitwork';

import { computed, nextTick, reactive, ref, toRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAcceptancePlanOverOperation,
  updateAcceptancePlanOverOperation,
} from '#/api/bpp/flowoverlimitwork';
import { FileUpload } from '#/components/upload';
import { $t } from '#/locales';

import { acceptancePlanFormSchema, containerInfoColumns } from '../data.ts';

const emit = defineEmits(['success']);
const fileList = ref<UploadProps['fileList']>([]);
// 箱信息数据
const containerData = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
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
// 新增一行方法
const addNewRow = async () => {
  const $grid = gridApi.grid;
  if ($grid) {
    const record = {
      containerNo: '',
    };
    const { row: newRow } = await $grid.insertAt(record, -1);
    await nextTick();
    // 激活并自动聚焦
    await $grid.setEditRow(newRow, true);
  }
};

// 删除行方法
const deleteRow = async (
  row: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO,
) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
};
// 保存行方法
const saveRow = async (
  row: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO,
) => {
  const $grid = gridApi.grid;
  if (!$grid) {
    return;
  }
  const errMap = await $grid.validate(row);
  if (errMap) {
    message.warning('校验不通过');
  } else {
    const newRecord = {};
    // 取消编辑状态
    await $grid.clearEdit(row);
    // 更新行数据并重置为初始状态
    await $grid.reloadRow(row, newRecord);
    message.success('数据保存成功');
  }
};
// 将 mergeFooterItems 改为计算属性
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: acceptancePlanFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values) => {
    // 直接使用Object.assign合并值，避免创建新的响应式对象
    Object.assign(formData, values);
  },
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: containerInfoColumns(),
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
      trigger: 'click',
    },
    editRules: {
      containerNo: [
        { required: true, message: '必须填写' },
        { pattern: /^[A-Z]{4}\d{7}$/i, message: '请输入正确的箱号格式' },
      ],
      containerSize: [{ required: true, message: '必须填写' }],
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
    data: containerData,
    showFooter: true,
    // 重点：完善合并规则
    mergeFooterItems: [
      { row: 0, col: 0, rowspan: 1, colspan: 9 },
      { row: 1, col: 0, rowspan: 1, colspan: 2 },
      { row: 1, col: 2, rowspan: 1, colspan: 7 },
    ],
    // // 页脚数据：两行数据
    footerData: [
      // 第一行：全列合并的内容（由第0列字段决定）
      {
        serialNumber: 'BUTTON',
        // 其他字段留空，不影响显示
        containerNo: '',
        containerSize: '',
        containerType: '',
        cargoWeight: '',
        totalWeight: '',
        cargoSize: '',
        overLimitDetail: '',
      },
      // 第二行：分区域合并的内容
      {
        serialNumber: '箱量 x 箱型', // 前两列合并区域的内容
        containerNo: '', // 被合并，留空
        containerSize: '', // 剩余6列合并区域的内容（第2列字段）
        containerType: '',
        cargoWeight: '',
        totalWeight: '',
        cargoSize: '',
        overLimitDetail: '',
      },
    ],
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    // 首先验证containerInfo表格中是否有数据
    const containerDataArray = [...gridApi.grid.getInsertRecords()].map(
      (record) => toRaw(record),
    );

    // 自定义校验：检查表格是否至少有一行数据
    if (containerDataArray.length === 0) {
      // 设置自定义错误信息到表单
      await formApi.setFieldValue('containerInfo', '');
      await formApi.validate();
      return;
    } else {
      await formApi.setFieldValue('containerInfo', 1);
    }
    const { valid } = await formApi.validate();
    const gridValid: boolean = await gridApi.grid.validate(true);

    if (!valid || gridValid) {
      return;
    }
    // 获取表单数据
    Object.assign(formData, await formApi.getValues());
    const data: FlowOverLimitWorkApi.OverLimitWorkSaveReqVO = {
      acceptancePlanSaveReqVO: {
        ...formData,
      } as FlowOverLimitWorkApi.AcceptancePlanVO,
      acceptancePlanOverOperationSaveReqVO: {
        ...acceptancePlanOverOperationRespVO,
      } as FlowOverLimitWorkApi.AcceptancePlanOverOperationVO,
      acceptancePlanOverOperationContainerSaveReqVOs: containerDataArray,
      acceptancePlanBillMessageSaveReqVO: {
        ...acceptancePlanBillMessageVO,
      } as FlowOverLimitWorkApi.AcceptancePlanBillMessageVO,
    };
    data.acceptancePlanOverOperationSaveReqVO.processInstanceId = '1111';
    data.acceptancePlanBillMessageSaveReqVO.billNo = formData.billNo;
    data.acceptancePlanBillMessageSaveReqVO.cargoName = formData.cargoName;
    // 将箱id 置空
    if (!formData?.id) {
      data.acceptancePlanOverOperationContainerSaveReqVOs.forEach((item) => {
        item.id = '';
      });
    }
    data.acceptancePlanSaveReqVO.vesselCode = 'dafafa';
    // 调用API保存数据
    await (formData?.id
      ? updateAcceptancePlanOverOperation(data)
      : createAcceptancePlanOverOperation(data));
    // 关闭并提示
    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      // 重置formData为初始值，而不是设置为undefined
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
      return;
    }
    // 加载数据
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
          // 设置到formApi中
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

// 修复modalTitle为普通计算属性，移除异步操作
const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['超限货物作业申请单'])
    : $t('ui.actionTitle.create', ['超限货物作业申请单']);
});
const handleUpload = async (data: any) => {
  fileList.value = data;
  // 校验form数据
  await formApi.setFieldValue('attachmentFile', JSON.stringify(fileList.value));
  await formApi.validateField('attachmentFile');
};
</script>

<template>
  <Modal :title="modalTitle" width="1200px">
    <Form>
      <template #containerInfo>
        <div class="mt-4 w-full">
          <!-- 表格容器 -->
          <div class="table-container">
            <!-- 表格 -->
            <Grid>
              <template #actions="{ row }">
                <!-- 普通行显示保存和删除按钮 -->
                <TableAction
                  :actions="[
                    {
                      label: '保存',
                      type: 'link',
                      onClick: () => saveRow(row),
                    },
                    {
                      label: '删除',
                      type: 'link',
                      danger: true,
                      onClick: () => deleteRow(row),
                    },
                  ]"
                />
              </template>
              <template #serialNumber="{ row }">
                <Button
                  type="dashed"
                  @click="addNewRow"
                  v-if="row.serialNumber === 'BUTTON'"
                  class="w-full"
                >
                  <template #icon>
                    <IconifyIcon icon="si:add-fill" style="font-size: 16px" />
                  </template>
                  新增一行
                </Button>
                <span v-if="row.serialNumber !== 'BUTTON'">箱量 x 箱型</span>
              </template>
            </Grid>
          </div>
        </div>
      </template>
      <template #attachmentFile>
        <div class="flex flex-col">
          <FileUpload
            :multiple="true"
            :accept="[
              '.doc',
              '.docx',
              '.xls',
              '.xlsx',
              '.pdf',
              '.jpg',
              '.jpeg',
              '.png',
              'JPG',
            ]"
            :show-description="true"
            @change="handleUpload"
            :value="fileList"
          />
        </div>
      </template>
      <template #handlingPersonLast>
        <span class="text-gray-600" v-if="formData && formData.handlingPerson">
          {{ formData.handlingPerson }}
        </span>
      </template>
      <template #handlerConfirmTime>
        <span
          class="jus flex text-gray-600"
          v-if="formData && formData.plannedOperationTime"
          >{{
            dayjs(formData.plannedOperationTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </span>
      </template>
    </Form>
  </Modal>
</template>
