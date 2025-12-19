<!-- AcceptancePlanForm.vue -->
<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';
import type { SystemUserProfileApi } from '#/api/system/user/profile';

import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getContainerIsoList, getCustomerList, getVVd } from '#/api/bpp/common';
import { getAcceptancePlanOverOperation } from '#/api/bpp/flow/acceptance/plan/over/operation';
import { getUserProfile } from '#/api/system/user/profile';
import { FileUpload } from '#/components/upload';

import { acceptancePlanFormSchema, containerInfoColumns } from '../data';

interface Props {
  id?: string; // 只需要传递id
}

const props = defineProps<Props>();

const emit = defineEmits(['success', 'validate']);
const vesselCode = ref<string>();
const vieVoyType = ref<string>();

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
const isoTypeState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const isoLengthState = reactive({
  data: [],
  value: [],
  fetching: false,
});

const profile = ref<SystemUserProfileApi.UserProfileRespVO>();
const fileList = ref<string[]>([]);
const containerData = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
const containerDataList = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
const fieldsChang = ref([]);
const fieldsChanges = ref<string[]>([]);
const selectKey = ref(0);

// 主表单数据
const formData = reactive<FlowOverLimitWorkApi.AcceptancePlanVO>({
  cargoName: '',
  handlingPhoneNumber: '',
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
  vieVoyType:'',
  vesselVoyageIn:'',
});

const acceptancePlanOverOperationRespVO = reactive({
  id: 0,
  isAllowedStacking: false,
  plannedMachineryType: '',
  plannedSpreaderType: '',
  acceptancePlanNo: '',
  processInstanceId: '',
});

const acceptancePlanBillMessageVO = reactive({
  id: 0,
  acceptancePlanNo: '',
  billNo: '',
  cargoType: '',
  cargoName: '',
  cargoCount: 0,
  billType: '',
});

// 计算属性
const formattedContainerTypes = computed(() => {
  const typeCountMap = new Map();
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
  return result.join('\n');
});

const isEditMode = computed(() => !!props.id);

// 表单初始化
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
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
    handleFieldsChange(fieldsChanged);
  },
});

// 表格初始化
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
        {
          pattern: /^[A-Z]{4}\d{7}$/i,
          message: '箱号格式（前四位为英文，后七位数字）',
        },
      ],
      containerSize: [{ required: true, message: '必须填写' }],
      containerType: [{ required: true, message: '必须填写' }],
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
    mergeFooterItems: [
      { row: 0, col: 0, rowspan: 1, colspan: 9 },
      { row: 1, col: 0, rowspan: 1, colspan: 2 },
      { row: 1, col: 2, rowspan: 1, colspan: 7 },
    ],
    footerData: [
      {
        serialNumber: 'BUTTON',
        containerNo: '',
        containerSize: '',
        containerType: '',
        cargoWeight: '',
        totalWeight: '',
        cargoSize: '',
        overLimitDetail: '',
      },
      {
        serialNumber: '箱量 x 箱型',
        containerNo: '',
        containerSize: formattedContainerTypes,
        containerType: '',
        cargoWeight: '',
        totalWeight: '',
        cargoSize: '',
        overLimitDetail: '',
      },
    ],
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>,
});

// 方法定义
const addNewRow = async () => {
  const $grid = gridApi.grid;
  if ($grid) {
    const record = { containerNo: '' };
    const { row: newRow } = await $grid.insertAt(record, null);
    await nextTick();
    await $grid.setEditRow(newRow, true);
  }
};

const deleteRow = async (
  row: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO,
) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
  updateContainerDataList();
};

const saveRow = async (
  row: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO,
) => {
  const $grid = gridApi.grid;
  if (!$grid) return;

  const errMap = await $grid.validate(row);
  if (errMap) {
    message.warning('校验不通过');
  } else {
    await $grid.clearEdit(row);
    await $grid.reloadRow(row, {});
    updateContainerDataList();
    await formApi.setFieldValue('containerInfo', 1);
    await formApi.validate();
    message.success('数据保存成功');
  }
};

const updateContainerDataList = () => {
  containerDataList.splice(0);
  // eslint-disable-next-line array-callback-return
  [...gridApi.grid.getInsertRecords()].map((record) => {
    containerDataList.push(toRaw(record));
  });
};

const loadProfile = async () => {
  profile.value = await getUserProfile();
  if (!isEditMode.value) {
    await formApi.setFieldValue('handlingPerson', profile.value.nickname);
    await formApi.setFieldValue('handlingPhoneNumber', profile.value.mobile);
  }
};

const loadFormData = async () => {
  if (!props.id) return;

  try {
    const data = await getAcceptancePlanOverOperation(props.id);

    // 设置主表单数据
    if (data.acceptancePlanRespVO) {
      Object.assign(formData, data.acceptancePlanRespVO);
      await formApi.setValues(data.acceptancePlanRespVO);

      // 设置提单号和货名
      if (data.acceptancePlanBillMessageRespVO) {
        await formApi.setFieldValue(
          'billNo',
          data.acceptancePlanBillMessageRespVO.billNo,
        );
        await formApi.setFieldValue(
          'cargoName',
          data.acceptancePlanBillMessageRespVO.cargoName,
        );
        formData.billNo = data.acceptancePlanBillMessageRespVO.billNo;
        formData.cargoName = data.acceptancePlanBillMessageRespVO.cargoName;
      }
      // 解析 JSON
      const fileListData = JSON.parse(
        data.acceptancePlanRespVO.attachmentFile || '[]',
      );

      fileList.value = fileListData.map((item) => {
        const parts = item.split('?');

        return parts[0];
      });

      // 设置船舶信息
      if (data.acceptancePlanRespVO.vesselName) {
        vesselNameState.value = {
          label: data.acceptancePlanRespVO.vesselName,
          value: data.acceptancePlanRespVO.vesselName,
        };

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

        vesselCode.value = data.acceptancePlanRespVO.vesselCode;
        vieVoyType.value = data.acceptancePlanRespVO?.vesselVoyageIn?'IN':'OUT';
      }

      if (data.acceptancePlanRespVO.vesselVoyage) {
        vesselVoyageState.value = {
          label: data.acceptancePlanRespVO.vesselVoyage,
          value: data.acceptancePlanRespVO.vesselVoyage,
        };
      }

      // 设置缴费方
      if (data.acceptancePlanRespVO.payerCodeSea) {
        payerNameSeaState.value = {
          label: data.acceptancePlanRespVO.payerNameSea,
          value: data.acceptancePlanRespVO.payerNameSea,
        };
      }

      if (data.acceptancePlanRespVO.payerCodeGate) {
        payerNameGateState.value = {
          label: data.acceptancePlanRespVO.payerNameGate,
          value: data.acceptancePlanRespVO.payerNameGate,
        };
      }
    }

    // 设置箱信息
    if (data.acceptancePlanOverOperationContainerRespVOS) {
      const $grid = gridApi.grid;
      for (const item of data.acceptancePlanOverOperationContainerRespVOS) {
        await $grid.insertAt(item, -1);
        containerDataList.push(item);
        tempInputMap.value[item.id] = item.containerType;
      }
    }

    // 设置其他VO数据
    Object.assign(
      acceptancePlanOverOperationRespVO,
      data.acceptancePlanOverOperationRespVO,
    );
    Object.assign(
      acceptancePlanBillMessageVO,
      data.acceptancePlanBillMessageRespVO,
    );
  } catch (error) {
    console.error('加载表单数据失败:', error);
    message.error('加载数据失败');
  }
};

const handleUpload = async (data: any) => {
  fileList.value = data;
  await formApi.setFieldValue('attachmentFile', JSON.stringify(fileList.value));
  await formApi.validateField('attachmentFile');
};

const isoTypeSearch = async () => {
  isoTypeState.fetching = true;
  try {
    const [lengthRes, typeRes] = await Promise.all([
      getContainerIsoList('length'),
      getContainerIsoList('type'),
    ]);

    if (lengthRes) {
      isoLengthState.data = lengthRes.map((item: any) => ({
        label: item.containerLength,
        value: item.containerLength,
      }));
    }

    if (typeRes) {
      isoTypeState.data = typeRes.map((item: any) => ({
        label: item.containerType,
        value: item.containerType,
      }));
    }
  } finally {
    isoTypeState.fetching = false;
  }
};

const handleFieldsChange = (fieldsChanged: any) => {
  // 这里可以处理字段变化逻辑，如果需要的话
  fieldsChanges.value = fieldsChanged;
};

// 表单验证方法
const validate = async (): Promise<boolean> => {
  // 验证箱信息表格是否有数据
  const containerDataArray = [...gridApi.grid.getInsertRecords()].map(
    (record) => toRaw(record),
  );

  if (containerDataArray.length === 0) {
    await formApi.setFieldValue('containerInfo', '');
    await formApi.validate();
    return false;
  } else {
    await formApi.setFieldValue('containerInfo', 1);
  }

  // 验证表单
  const formValid = await formApi.validate();
  if (!formValid.valid) {
    emit('validate', false);
    return false;
  }

  // 验证表格
  const gridValid = await gridApi.grid.validate(true);
  if (gridValid) {
    emit('validate', false);
    return false;
  }

  emit('validate', true);
  return true;
};

// 获取保存数据
const getSaveData = () => {
  const containerDataArray = [...gridApi.grid.getInsertRecords()].map(
    (record) => toRaw(record),
  );

  return {
    acceptancePlanSaveReqVO: {
      ...formData,
      vesselCode: vesselCode.value,
      vieVoyType: vieVoyType.value
    },
    acceptancePlanOverOperationSaveReqVO: {
      ...acceptancePlanOverOperationRespVO,
      isUpdate: fieldsChanges.value.length > 0,
    },
    acceptancePlanOverOperationContainerSaveReqVOs: containerDataArray.map(
      (item) => ({
        ...item,
        id:
          item.id && String(item.id).startsWith('row_')
            ? String(item.id).replace('row_', '')
            : item.id,
      }),
    ),
    acceptancePlanBillMessageSaveReqVO: {
      ...acceptancePlanBillMessageVO,
      billNo: formData?.billNo,
      cargoName: formData?.cargoName,
    },
  };
};

// 选择器相关方法
const getPopupContainer = (triggerNode: any) => triggerNode.parentNode;

const handleVesselSearch = async (value: string) => {
  if (!value) return;
  // if (value.length < 2) {
  //   message.warning('请输入至少两个字符');
  //   return;
  // }
  vesselNameState.fetching = true;
  const res = await getVVd({ condition: value });
  if (res) {
    vesselNameState.data = res.map((item: any) => ({
      label: item.vieVslName,
      value: item.vieVslName,
      data: item,
    }));
  }
  vesselNameState.fetching = false;
};

const vesselNameSelect = async (value: any, option: any) => {
  await formApi.setFieldValue('vesselName', value.label);
  vesselCode.value = option?.data?.vieVslCd;
  vieVoyType.value = option?.data?.vieVoyType;

  vesselVoyageState.fetching = true;
  const res = await getVVd({ condition: value.label, queryType: 'VOYAGE' });

  if (res) {
    vesselVoyageState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
  }

  vesselVoyageState.value = [];
  await formApi.setFieldValue('vesselVoyage', '');
  vesselVoyageState.fetching = false;
};

const vesselNameChange = async () => {
  await formApi.setFieldValue('vesselName', '');
  await formApi.setFieldValue('vesselVoyage', '');
  vesselVoyageState.value = [];
  vesselVoyageState.data = [];
  selectKey.value++;
};

const vesselVoyageSelect = async (value: any) => {
  await formApi.setFieldValue('vesselVoyage', value.label);
};

const payerNameSeaSearch = async (value: string) => {
  if (!value) return;
  payerNameSeaState.fetching = true;
  const res = await getCustomerList({
    pageNo: 1,
    pageSize: 100,
    customerName: value,
  });
  if (res) {
    payerNameSeaState.data = res.map((item: any) => ({
      label: item.customerName,
      value: item.customerName,
      data: item,
    }));
  }
  payerNameSeaState.fetching = false;
};

const payerNameSeaSelect = async (value: any, option: any) => {
  await formApi.setFieldValue('payerCodeSea', option.data.customerCode);
  await formApi.setFieldValue('payerNameSea', value.label);
};

const payerNameSeaChange = async () => {
  await formApi.setFieldValue('payerCodeSea', '');
  await formApi.setFieldValue('payerNameSea', '');
};

const payerNameGateSearch = async (value: string) => {
  if (!value) return;
  payerNameGateState.fetching = true;
  const res = await getCustomerList({
    pageNo: 1,
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
const tempInputMap = ref<Record<number | string, string>>({});
const handleContainerTypeInput = async (val: string, row: any) => {
  const $grid = gridApi.grid;
  const rowKey = row.key || row.id; // 取行唯一标识
  delete tempInputMap.value[rowKey];
  row.containerType = '';
  if (val) {
    tempInputMap.value[rowKey] = val.toUpperCase();
  }
  await $grid.validateField(row, 'containerType');
};
const containerTypeSelect = async (val: string, row: any) => {
  const $grid = gridApi.grid;
  const rowKey = row.key || row.id;
  row.containerType = val ? val.toUpperCase() : '';
  tempInputMap.value[rowKey] = row.containerType;
  await $grid.validateField(row, 'containerType');
};
const vesselVoyageChange = async () => {
  await formApi.setFieldValue('vesselVoyage', '');
};
// 暴露方法给父组件（如果需要）
defineExpose({
  validate,
  getSaveData,
});

// 生命周期
onMounted(async () => {
  await isoTypeSearch();
  await loadProfile();

  if (props.id) {
    await loadFormData();
  }
});

// 监听id变化
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadFormData();
    } else {
      loadProfile(); // 重新加载用户信息用于新建
    }
  },
);
</script>

<template>
  <Form>
    <template #containerInfo>
      <div class="mt-4 w-full">
        <div class="table-container">
          <Grid>
            <template #actions="{ row }">
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
              <span v-else>箱量 x 箱型</span>
            </template>
            <template #containerLengthEdit="{ row }">
              <Select
                :options="isoLengthState.data"
                v-model:value="row.containerSize"
                style="width: 100%"
                :get-popup-container="getPopupContainer"
                :list-height="100"
              />
            </template>
            <template #containerTypeEdit="{ row }">
              <Select
                :options="isoTypeState.data"
                mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
                v-model:value="tempInputMap[row.id]"
                style="width: 100%"
                :get-popup-container="getPopupContainer"
                :show-search="true"
                :filter-option="true"
                :list-height="100"
                @search="(val) => handleContainerTypeInput(val, row)"
                @select="(val) => containerTypeSelect(val, row)"
              />
            </template>
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
        @change = "vesselVoyageChange"
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
      <span class="text-gray-600" v-if="formData.handlingPerson">
        {{ formData.handlingPerson }}
      </span>
    </template>
  </Form>
</template>
