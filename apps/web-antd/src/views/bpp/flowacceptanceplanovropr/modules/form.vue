<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowacceptanceplanovropr';
import type { SystemUserProfileApi } from '#/api/system/user/profile';

import { computed, nextTick, reactive, ref, toRaw, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCustomerList } from '#/api/bpp/common';
import {
  createAcceptancePlanOverOperation,
  updateAcceptancePlanOverOperation,
  getAcceptancePlanOverOperation,
} from '#/api/bpp/flowacceptanceplanovropr';
import { getVVd } from '#/api/bpp/common'
import { getUserProfile } from '#/api/system/user/profile';
import { FileUpload } from '#/components/upload';
import { $t } from '#/locales';
import { bppBaseDictStore } from '#/store/bpp/base/dict';

import { acceptancePlanFormSchema, containerInfoColumns } from '../data.ts';

const emit = defineEmits(['success']);

const bppBaseDict = bppBaseDictStore();

const vesselCode = ref<string>();
const vesselNameState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const vesselVoyageState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const payerNameSeaState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const payerNameGateState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const originalData = ref<{
  containers: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[];
  form: FlowOverLimitWorkApi.AcceptancePlanFormVO | null;
}>({
  // 实现FlowOverLimitWorkApi.AcceptancePlanFormVO
  form: {
    id: '',
    acceptancePlanNo: '',
    acceptancePlanWebNo: '',
    applicantCompanyName: '',
    handlingPerson: '',
    handlingPhoneNumber: '',
    paymentTypeSea: '',
    payerCodeSea: '',
    paymentTypeGate: '',
    payerCodeGate: '',
    category: '',
    vesselName: '',
    vesselVoyage: '',
    plannedOperationTime: '',
    billNo: '',
    cargoName: '',
    attachmentFile: '',
    handlerRemark: '',
    handlerConfirmation: '',
    payerNameSea: '',
    payerNameGate: '',
  },
  containers: [],
});
const fieldsChang = ref([]);

/** 加载个人信息 */
const profile = ref<SystemUserProfileApi.UserProfileRespVO>();
async function loadProfile() {
  profile.value = await getUserProfile();
}
const fileList = ref<UploadProps['fileList']>([]);
// 箱信息数据
const containerData = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
const containerDataList = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
const formattedContainerTypes = computed(() => {
  const typeCountMap = new Map();

  // 统计每种箱型的数量
  containerDataList.forEach((item) => {
    if (item.containerType) {
      const count = typeCountMap.get(item.containerType) || 0;
      typeCountMap.set(item.containerType, count + 1);
    }
  });
  const result = [];
  for (const [type, count] of typeCountMap.entries()) {
    result.push(`${count}×${type}`);
  }
  return result.join('\n'); // 用换行符连接
});
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
  payerNameSea: '',
  payerNameGate: '',
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
    // 回显箱型
    containerDataList.splice(0);
    [...gridApi.grid.getInsertRecords()].map((record) => {
      return containerDataList.push(toRaw(record));
    });
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
  handleValuesChange: async (values: any, fieldsChanged: any) => {
    Object.assign(formData, values);
    fieldsChang.value = fieldsChanged;
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
        containerSize: formattedContainerTypes, // 剩余6列合并区域的内容（第2列字段）
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
    data.acceptancePlanBillMessageSaveReqVO.billNo = formData.billNo;
    data.acceptancePlanBillMessageSaveReqVO.cargoName = formData.cargoName;
    // 将箱id 置空
    data.acceptancePlanOverOperationContainerSaveReqVOs.forEach((item) => {
      // 判断id 是row开头去掉
      if (item.id && String(item.id).startsWith('row_')) {
        item.id = item.id.replace('row_', '');
      }
    });
    data.acceptancePlanSaveReqVO.vesselCode = vesselCode.value;
    data.acceptancePlanOverOperationSaveReqVO.isUpdate =
      fieldsChanges.value.length > 0;
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
    modalApi.lock();
    // 加载数据
    const modalData = modalApi.getData();
    if (modalData?.id) {
      const data = await getAcceptancePlanOverOperation(modalData.id);
      originalData.value = {
        form: data.acceptancePlanRespVO,
        containers: data.acceptancePlanOverOperationContainerRespVOS,
      };
      if (originalData.value?.form) {
        originalData.value.form.billNo =
          data?.acceptancePlanBillMessageRespVO?.billNo;
        originalData.value.form.cargoName =
          data?.acceptancePlanBillMessageRespVO?.cargoName;
      }
      originalData.value.containers =
        data.acceptancePlanOverOperationContainerRespVOS;

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
          fileList.value = JSON.parse(
            data.acceptancePlanRespVO?.attachmentFile,
          );
          for (const item of data?.acceptancePlanOverOperationContainerRespVOS) {
            const $grid = gridApi.grid;
            if ($grid) {
              await $grid.insertAt(item, -1);
            }
          }
          // 箱信息
          for (const item of data.acceptancePlanOverOperationContainerRespVOS) {
            containerDataList.push(item);
          }
          if (data.acceptancePlanRespVO.vesselName) {
            vesselNameState.value = {
              label: data.acceptancePlanRespVO.vesselName,
              value: data.acceptancePlanRespVO.vesselName,
            };

            // 同时查询对应的航次列表
            const voyageRes = await getVVd({
              condition: data.acceptancePlanRespVO.vesselName,
              queryType: 'VOYAGE',
            });
            if (voyageRes) {
              vesselVoyageState.data = voyageRes.map((item: any) => ({
                label: item.vieVoy,
                value: item.vieVoy,
              }));
            }
          }
          if (data.acceptancePlanRespVO.vesselVoyage) {
            vesselVoyageState.value = {
              label: data.acceptancePlanRespVO.vesselVoyage,
              value: data.acceptancePlanRespVO.vesselVoyage,
            };
          }
          if (data.acceptancePlanRespVO.vesselCode) {
            vesselCode.value = data.acceptancePlanRespVO.vesselCode;
          }
          if (data?.acceptancePlanRespVO?.payerCodeSea) {
            payerNameSeaState.value = {
              label: data.acceptancePlanRespVO.payerNameSea,
              value: data.acceptancePlanRespVO.payerNameSea,
            };
          }
          if (data?.acceptancePlanRespVO?.payerCodeGate) {
            payerNameGateState.value = {
              label: data.acceptancePlanRespVO.payerNameGate,
              value: data.acceptancePlanRespVO.payerNameGate,
            };
          }
        } finally {
        }
      }
    } else {
      await loadProfile();
      await formApi.setFieldValue('handlingPerson', profile.value.nickname);
      await formApi.setFieldValue(
        'handlingPhoneNumber',
        profile.value.mobile,
      );
    }
    modalApi.unlock();
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
const getPopupContainer = (triggerNode) => {
  return triggerNode.parentNode;
};
const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
const handleVesselSearch = async (value: any) => {
  if (!value) return;
  vesselNameState.data = [];
  vesselNameState.fetching = true;
  const res = await getVVd({
    condition: value,
  });
  if (res) {
    vesselNameState.data = res.map((item: any) => ({
      label: item.vieVslCName,
      value: item.vieVslCName,
      data: item,
    }));
    vesselNameState.fetching = false;
  }
};
const vesselNameSelect = async (value: any, option: any) => {
  // 赋值到表单
  await formApi.setFieldValue('vesselName', value.label);
  vesselCode.value = option?.data?.vieVslCd;

  vesselVoyageState.fetching = true;

  // 查航次列表
  const res = await getVVd({
    condition: value.label,
    queryType: 'VOYAGE',
  });

  if (res) {
    vesselVoyageState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
    vesselVoyageState.fetching = false;

    // 重要：在数据加载完成后再清空当前选择的航次值
    vesselVoyageState.value = [];
    await formApi.setFieldValue('vesselVoyage', '');
  }
};

const vesselNameChange = async () => {
  await formApi.setFieldValue('vesselName', '');
  await formApi.setFieldValue('vesselVoyage', '');

  // 清空航次数据
  vesselVoyageState.value = [];
  vesselVoyageState.data = [];
  selectKey.value++;
};
// 赋值到表单
const vesselVoyageSelect = async (value: any) => {
  console.log('vesselVoyageSelect', value);
  await formApi.setFieldValue('vesselVoyage', value.label);
};
const payerNameSeaSearch = async (value: any) => {
  if (!value) return;
  payerNameSeaState.data = [];
  payerNameSeaState.fetching = true;
  const res = await getCustomerList({
    page: 1,
    pageSize: 100,
    customerName: value,
  });
  if (res) {
    payerNameSeaState.data = res.map((item: any) => ({
      label: item.customerName,
      value: item.customerName,
      data: item,
    }));
    payerNameSeaState.fetching = false;
  }
};
const payerNameSeaChange = async () => {
  await formApi.setFieldValue('payerCodeSea', '');
  await formApi.setFieldValue('payerNameSea', '');
};
const payerNameSeaSelect = async (value: any, option: any) => {
  await formApi.setFieldValue('payerCodeSea', option.data.customerCode);
  await formApi.setFieldValue('payerNameSea', value.label);
};
const payerNameGateSearch = async (value: any) => {
  if (!value) return;
  payerNameGateState.data = [];
  payerNameGateState.fetching = true;
  const res = await getCustomerList({
    page: 1,
    pageSize: 100,
    customerName: value,
  });
  if (res) {
    payerNameGateState.data = res.map((item: any) => ({
      label: item.customerName,
      value: item.customerName,
      data: item,
    }));
  }
  payerNameGateState.fetching = false;
};
const payerNameGateSelect = async (value: any, option: any) => {
  await formApi.setFieldValue('payerCodeGate', option.data.customerCode);
  await formApi.setFieldValue('payerNameGate', value.label);
};
const payerNameGateChange = async () => {
  await formApi.setFieldValue('payerCodeGate', '');
  await formApi.setFieldValue('payerNameGate', '');
};
watch(vesselNameState.value, () => {
  vesselNameState.data = [];
  vesselNameState.fetching = false;
});
watch(vesselVoyageState.value, () => {
  vesselVoyageState.data = [];
  vesselVoyageState.fetching = false;
});
watch(payerNameSeaState.value, () => {
  payerNameSeaState.data = [];
  payerNameSeaState.fetching = false;
});
watch(payerNameGateState.value, () => {
  payerNameGateState.data = [];
  payerNameGateState.fetching = false;
});
// 深度监听主表单数据
watch(
  () => ({ ...formData }), // 创建新对象触发深度监听
  (newVal) => {
    if (originalData.value.form && formData.id) {
      if (
        originalData.value.form[fieldsChang.value[0]] ===
        newVal[fieldsChang.value[0]]
      ) {
        fieldsChanges.value = fieldsChanges.value.filter(
          (item) => item !== fieldsChang.value[0],
        );
      } else {
        if (fieldsChang.value[0] === 'containerInfo') {
          const newArr = [];
          [...gridApi.grid.getInsertRecords()].map((record) => {
            const rawRecord = toRaw(record) as any;
            const { serialNumber, ...recordWithoutSerial } = rawRecord;
            return newArr.push(recordWithoutSerial);
          });
          if (
            JSON.stringify(newArr) !==
            JSON.stringify(originalData.value.containers)
          ) {
            fieldsChanges.value.push(fieldsChang.value[0]);
          }
        } else {
          if (!fieldsChanges.value.includes(fieldsChang.value[0])) {
            fieldsChanges.value.push(fieldsChang.value[0]);
          }
        }
      }
    }
    console.log('fieldsChanges', fieldsChanges.value);
  },
  { deep: true, immediate: false },
);
const fieldsChanges = ref([]);
const selectKey = ref(0);
</script>

<template>
  <Modal :title="modalTitle">
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
              <!--              <template #containerSizeEdit="{ row, index }">-->
              <!--                <Select :options="bppBaseDict.getBppBaseDictOptions(-->
              <!--                    'initiation_type',-->
              <!--                  )" v-model:value="row.containerSize"style="width: 100%"-->
              <!--                        :getPopupContainer="getPopupContainer" :showSearch="true"-->
              <!--                        :filterOption="filterOption"/>-->
              <!--              </template>-->
            </Grid>
          </div>
        </div>
      </template>
      <template #payerNameSea>
        <Select
          v-model:value="payerNameSeaState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入缴费方（海侧）"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="payerNameSeaState.fetching ? undefined : null"
          :options="payerNameSeaState.data"
          @search="payerNameSeaSearch"
          allow-clear
          @select="payerNameSeaSelect"
          @change="payerNameSeaChange"
        />
      </template>
      <template #payerNameGate>
        <Select
          v-model:value="payerNameGateState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入缴费方（陆侧）"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="payerNameGateState.fetching ? undefined : null"
          :options="payerNameGateState.data"
          @search="payerNameGateSearch"
          allow-clear
          @select="payerNameGateSelect"
          @change="payerNameGateChange"
        />
      </template>
      <template #vesselName>
        <Select
          v-model:value="vesselNameState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入作业船名"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="vesselNameState.fetching ? undefined : null"
          :options="vesselNameState.data"
          @search="handleVesselSearch"
          allow-clear
          @select="vesselNameSelect"
          @change="vesselNameChange"
        />
      </template>
      <template #vesselVoyage>
        <Select
          v-model:value="vesselVoyageState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入船名航次"
          style="width: 100%"
          :filter-option="true"
          :not-found-content="vesselVoyageState.fetching ? undefined : null"
          :options="vesselVoyageState.data"
          allow-clear
          @select="vesselVoyageSelect"
          :key="selectKey"
        />
      </template>

      <template #attachmentFile>
        <div class="flex flex-col">
          <FileUpload
            :multiple="true"
            :accept="[
              'doc',
              'docx',
              'xls',
              'xlsx',
              'pdf',
              'jpg',
              'jpeg',
              'png',
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
    </Form>
  </Modal>
</template>
