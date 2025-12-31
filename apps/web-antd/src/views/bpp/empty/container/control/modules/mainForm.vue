<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getContainerIsoListPage,
  getContainerOwnerListPage,
} from '#/api/bpp/common';
import {
  createMainPlan,
  getStorageQuantity,
  updateMainPlan,
} from '#/api/bpp/empty/container/control';
import { $t } from '#/locales';
import { debounce } from '#/views/bpm/components/bpmn-process-designer/src/utils';

import { containerAreaRangeColumns, mainPlanFormSchema } from '../data';
import ContainerArea from './containerAreaSelect.vue';

const emit = defineEmits(['success']);

const containerAreaModalVisible = ref(false);
const isSubmitting = ref(false);

const containerAreaParams = reactive({
  ownerCodeList: [],
  contIsoList: [],
  tradeType: '',
  selectedPositions: [],
});

const isoState = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false, // 标记是否在中文输入法组合状态
  originalValue: [],
});

// 处理ISO输入，将小写字母转换为大写
const handleIsoInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (isoState.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  isoSearch(target.value);
};

// 处理ISO中文输入法组合开始
const handleIsoCompositionStart = () => {
  isoState.isComposing = true;
};

// 处理ISO中文输入法组合结束（回车或选择候选词）
const handleIsoCompositionEnd = (e: CompositionEvent) => {
  isoState.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  isoSearch(target.value);
};

const ownerState = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false, // 标记是否在中文输入法组合状态
  originalValue: [],
});

// 处理持箱人输入，将小写字母转换为大写
const handleOwnerInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (ownerState.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  ownerSearch(target.value);
};

// 处理持箱人中文输入法组合开始
const handleOwnerCompositionStart = () => {
  ownerState.isComposing = true;
};

// 处理持箱人中文输入法组合结束（回车或选择候选词）
const handleOwnerCompositionEnd = (e: CompositionEvent) => {
  ownerState.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  ownerSearch(target.value);
};

const containerAreaData = reactive<any[]>([]);

const formData = reactive<EmptyContainerControlApi.mainPlanVO>({
  id: '',
  ownerCodeList: [],
  contIsoList: [],
  isRelease: undefined,
  pickupPlanNo: '',
  dischargeVslSchedule: '',
  tradeType: '',
  planQuantity: '',
  completedReleaseQuantity: '',
  bayRangeList: [],
  planType: '',
  mainId: '',
  planNo: '',
});

// 将字符串转为数组
const transformStringToArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.toString().trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/[,，]/)
      .map((item: string) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const selectContainerArea = async () => {
  // 获取表单值
  const formValues = await formApi.getValues();

  const selectedPositions: string[] = [];
  if (formData.bayRangeList && Array.isArray(formData.bayRangeList)) {
    formData.bayRangeList.forEach((item) => {
      if (item.yardBay) {
        selectedPositions.push(item.yardBay);
      }
    });
  }
  containerAreaParams.ownerCodeList = Array.isArray(formValues.ownerCodeList)
    ? formValues.ownerCodeList
    : [formValues.ownerCodeList];
  containerAreaParams.contIsoList = Array.isArray(formValues.contIsoList)
    ? formValues.contIsoList
    : [formValues.contIsoList];
  containerAreaParams.tradeType = formValues.tradeType || '';
  containerAreaParams.selectedPositions = selectedPositions;
  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = async (positions: string[]) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const existingRowsMap = new Map<string, any>();
    const currentGridData = $grid.getTableData();

    currentGridData.fullData.forEach((row) => {
      if (row.yardPosition) {
        existingRowsMap.set(row.yardPosition, row);
      }
    });
    containerAreaData.splice(0);
    const newRows = positions.map((pos) => {
      const yardPosition = `${pos}`;
      if (existingRowsMap.has(yardPosition)) {
        return existingRowsMap.get(yardPosition);
      }
      return {
        yardPosition,
        yardColumns: [],
        totalCount: '',
        minDays: '',
        maxDays: '',
        isNew: true,
      };
    });

    containerAreaData.push(...newRows);
    $grid.reloadData(containerAreaData);
    formData.bayRangeList = containerAreaData.map((item) => ({
      yardBay: item.yardPosition,
      yardRaw:
        item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
      ...item,
    }));

    // 只查询新添加的行的堆存数据
    for (const row of containerAreaData) {
      if (row.isNew) {
        await getStorageConditionSearch(row);
      }
    }
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const currentGridData = $grid.getTableData().fullData;

    containerAreaData.splice(0);
    const dataIndex = currentGridData.findIndex(
      (item) => item.yardPosition === row.yardPosition,
    );
    if (dataIndex !== -1) {
      currentGridData.splice(dataIndex, 1);
    }

    containerAreaData.push(...currentGridData);
    $grid.reloadData(containerAreaData);
    formData.bayRangeList = containerAreaData.map((item) => ({
      yardBay: item.yardPosition,
      yardRaw:
        item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
      ...item,
    }));

    $grid.clearFilter();
  }
};

// ISO搜索函数
const isoSearch = async (value: string) => {
  isoState.fetching = true;
  try {
    const upperCaseValue = value.toUpperCase();
    const res = await getContainerIsoListPage({
      pageNo: 1,
      pageSize: 10,
      contIso: upperCaseValue,
      queryType: 'ISO',
    });

    if (res) {
      isoState.data = res.map((item: any) => ({
        label: item.contIso,
        value: item.contIso,
        data: item,
      }));
    }
  } catch {
    message.error('获取ISO数据失败');
  } finally {
    isoState.fetching = false;
  }
};

// 初始化ISO数据
// const initIsoData = async () => {
//   await isoSearch('');
// };

// 持箱人搜索函数
const ownerSearch = async (value: string) => {
  ownerState.fetching = true;
  try {
    const upperCaseValue = value.toUpperCase();
    const res = await getContainerOwnerListPage({
      pageNo: 1,
      pageSize: 10,
      ownerCode: upperCaseValue,
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

// 初始化持箱人数据
// const initOwnerData = async () => {
//   await ownerSearch('');
// };

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: mainPlanFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values, changedValues) => {
    Object.assign(formData, values);
    const isChangeContIso =
      Array.isArray(changedValues) && changedValues[0] === 'contIsoList';
    const isChangeOwner =
      Array.isArray(changedValues) && changedValues[0] === 'ownerCodeList';
    const isChangeTradeType =
      Array.isArray(changedValues) && changedValues[0] === 'tradeType';
    const isChangeIsRelease =
      Array.isArray(changedValues) && changedValues[0] === 'isRelease';

    // 根据是否放箱的初始值设置计划箱量字段状态
    if (isChangeIsRelease) {
      if (formData.isRelease === false) {
        formData.planQuantity = '';
        await formApi.setFieldValue('planQuantity', '');
        formApi.updateSchema([
          { fieldName: 'planQuantity', componentProps: { disabled: true } },
        ]);
      } else if (formData.isRelease === true) {
        formApi.updateSchema([
          { fieldName: 'planQuantity', componentProps: { disabled: false } },
        ]);
      }
    }

    if (
      (isChangeContIso || isChangeOwner || isChangeTradeType) &&
      !formData.id
    ) {
      containerAreaData.splice(0);
      formData.bayRangeList = [];
      const $grid = gridApi.grid;
      if ($grid) {
        $grid.reloadData([]);
      }
    }
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
      // yardPosition: [{ required: true, message: '必须填写' }],
      // yardColumns: [{ required: true, message: '必须选择堆场列' }],
      // totalCount: [{ required: true, message: '必须填写' }],
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

// 表单提交实现防抖
const debouncedConfirm = debounce(async () => {
  // if (containerAreaData.length === 0) {
  //   message.warning('请至少添加一条箱区范围数据');
  //   return;
  // }
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;

  try {
    // 根据是否放箱状态决定计划箱量的验证规则
    if (formData.isRelease) {
      if (!formData.planQuantity) {
        message.warning('若“是否放箱”选择“是”，计划箱量为必填项', 3);
        return;
      }
      const quantity = Number(formData.planQuantity);
      if (Number.isNaN(quantity) || quantity <= 0) {
        message.warning('计划箱量必须大于0');
        return;
      }
    }

    const { valid } = await formApi.validate();
    const gridValid: boolean = await gridApi.grid.validate(true);

    if (!valid || gridValid) {
      return;
    }

    // Object.assign(formData, await formApi.getValues());
    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);
    if (!formData.planType) {
      formData.planType = 'MAIN';
    }

    if (!Array.isArray(formData.ownerCodeList)) {
      formData.ownerCodeList = [formData.ownerCodeList];
    }
    if (!Array.isArray(formData.contIsoList)) {
      formData.contIsoList = [formData.contIsoList];
    }

    const $grid = gridApi.grid;
    const gridData = $grid ? $grid.getTableData().fullData : containerAreaData;
    const bayRangeList = gridData.map((row: any) => ({
      yardBay: row.yardPosition || '',
      yardRaw: row.yardColumns ? row.yardColumns.join(',') : '',
    }));

    const data: EmptyContainerControlApi.mainPlanVO = {
      ...formData,
      bayRangeList,
      tradeType: formData.tradeType ?? '',
    } as EmptyContainerControlApi.mainPlanVO;

    await (formData?.id ? updateMainPlan(data) : createMainPlan(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } finally {
    isSubmitting.value = false;
  }
}, 300);

const [Modal, modalApi] = useVbenModal({
  onConfirm: debouncedConfirm,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        ownerCodeList: [],
        contIsoList: [],
        isRelease: undefined,
        pickupPlanNo: '',
        tradeType: '',
        planQuantity: '',
        completedReleaseQuantity: '',
        dischargeVslSchedule: '',
        bayRangeList: [],
        planType: '',
        mainId: '',
        planNo: '',
      });
      containerAreaData.splice(0);
      // initIsoData();
      // initOwnerData();
    }
    const data = await modalApi.getData<any>();

    if (data) {
      // 清空现有数据
      containerAreaData.splice(0);

      const mainPlanData = data.acceptancePlanRespVO || data;
      Object.assign(formData, mainPlanData);

      if (data.planType) {
        formData.planType = data.planType;
      }
      if (data.mainId) {
        formData.mainId = data.mainId;
      }

      if (mainPlanData?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(mainPlanData);
          if (mainPlanData.ownerCodeList) {
            ownerState.value = mainPlanData.ownerCodeList;
            ownerState.originalValue = mainPlanData.ownerCodeList;
          }
          if (mainPlanData.contIsoList) {
            isoState.value = mainPlanData.contIsoList;
            isoState.originalValue = mainPlanData.contIsoList;
          }
          // 根据是否放箱的初始值设置计划箱量字段状态
          if (formData.isRelease === false) {
            formData.planQuantity = '';
            formApi.updateSchema([
              { fieldName: 'planQuantity', componentProps: { disabled: true } },
            ]);
          } else {
            formApi.updateSchema([
              {
                fieldName: 'planQuantity',
                componentProps: { disabled: false },
              },
            ]);
          }
          const $grid = gridApi.grid;
          if (
            $grid &&
            mainPlanData.bayRangeList &&
            Array.isArray(mainPlanData.bayRangeList)
          ) {
            const tableData = mainPlanData.bayRangeList.map(
              (bayRange: any) => ({
                yardPosition: bayRange.yardBay || '',
                yardColumns: bayRange.yardRaw
                  ? bayRange.yardRaw.split(',')
                  : [],
                totalCount: bayRange.totalCount || '',
                minDays: bayRange.minDays || '',
                maxDays: bayRange.maxDays || '',
                isNew: false,
              }),
            );
            $grid.reloadData(tableData);
            // containerAreaData.push(...tableData);
            // $grid.reloadData(containerAreaData);
          }
        } finally {
          modalApi.unlock();
        }
      } else {
        formData.planType = 'MAIN';
      }
    }
  },
});

// 查询堆存情况
const getStorageConditionSearch = async (row: any) => {
  const $grid = gridApi.grid;
  const rowIndex = $grid.getRowIndex(row);

  const originalBayRange =
    formData.bayRangeList && formData.bayRangeList[rowIndex];
  const originalYard = originalBayRange ? originalBayRange.yardRaw : '';
  const originalYardArray = originalYard
    ? originalYard.split(',').filter((item) => item.trim())
    : [];

  const newYard = Array.isArray(row.yardColumns) ? row.yardColumns : [];

  try {
    // 清空上次查询结果
    row.totalCount = undefined;
    row.minDays = undefined;
    row.maxDays = undefined;

    if (!row.yardPosition) {
      message.warning('请先填写堆场位置');
      return;
    }

    if (formData.id && originalYardArray.length > 0) {
      const removedItems = originalYardArray.filter(
        (item) => !newYard.includes(item),
      );

      if (removedItems.length > 0) {
        const allValues = [...originalYardArray];
        newYard.forEach((item) => {
          if (!allValues.includes(item)) {
            allValues.push(item);
          }
        });

        row.yardColumns = allValues;
        message.warning(`不能删除已存在的堆场列: ${removedItems.join(', ')}`);
        await $grid.updateData();
        return;
      }
    }

    // 构建接口请求参数
    const requestData = {
      yardBayList: [
        {
          yardBay: row.yardPosition,
          yardRaw: row.yardColumns ? row.yardColumns.join(',') : '',
        },
      ],
      baseInfo: {
        contIsoList: transformStringToArray(formData.contIsoList),
        ownerCodeList: transformStringToArray(formData.ownerCodeList),
        tradeType: formData.tradeType,
        dischargeVslSchedule: formData.dischargeVslSchedule,
      },
    };

    const response = await getStorageQuantity(requestData);
    if (response.length > 0) {
      row.totalCount = response[0].totalCount || 0;
      row.minDays = response[0].minDays || 0;
      row.maxDays = response[0].maxDays || 0;
    } else {
      message.warning(`无可用量`);
    }
  } catch (error) {
    console.log(error);
    message.warning('堆存查询失败或异常，请重试');
  }
};

const ownerStateChange = async (value: any) => {
  if (
    ownerState.originalValue &&
    ownerState.originalValue.length > 0 &&
    checkIfTryingToRemoveOriginalData(value, ownerState.originalValue, '持箱人')
  ) {
    // 恢复原来的值
    ownerState.value = [...ownerState.originalValue];
    await formApi.setFieldValue('ownerCodeList', ownerState.value);
    await formApi.validateField('ownerCodeList');
    return;
  }
  // 更新值和表单字段
  ownerState.value = value;
  await formApi.setFieldValue('ownerCodeList', value);
  await formApi.validateField('ownerCodeList');
};
const isoStateChange = async (value: any) => {
  if (
    isoState.originalValue &&
    isoState.originalValue.length > 0 &&
    checkIfTryingToRemoveOriginalData(value, isoState.originalValue, 'ISO')
  ) {
    // 恢复原来的值
    isoState.value = [...isoState.originalValue];
    await formApi.setFieldValue('contIsoList', isoState.value);
    await formApi.validateField('contIsoList');
    return;
  }
  isoState.value = value;
  await formApi.setFieldValue('contIsoList', value);
  await formApi.validateField('contIsoList');
};
const checkIfTryingToRemoveOriginalData = (
  newValue: any[],
  originalValue: any[],
  fieldName: string,
): boolean => {
  if (!originalValue || originalValue.length === 0) {
    return false;
  }

  // 找出被删除的原始值
  const removedItems = originalValue.filter((item) => !newValue.includes(item));
  if (removedItems.length > 0) {
    message.warning(`不能删除已存在的${fieldName}: ${removedItems.join(', ')}`);
    return true;
  }

  return false;
};
const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['主计划'])
    : $t('ui.actionTitle.create', ['主计划']);
});
</script>

<template>
  <Modal :title="modalTitle">
    <Form>
      <template #contIsoList>
        <Select
          v-model:value="isoState.value"
          mode="multiple"
          placeholder="请输入ISO"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="isoState.fetching ? undefined : null"
          :options="isoState.data"
          @search="isoSearch"
          allow-clear
          show-search
          @change="isoStateChange"
          @focus="isoSearch('')"
          @input="handleIsoInput"
          @compositionstart="handleIsoCompositionStart"
          @compositionend="handleIsoCompositionEnd"
        />
      </template>
      <template #ownerCodeList>
        <Select
          v-model:value="ownerState.value"
          mode="multiple"
          placeholder="请输入持箱人"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="ownerState.fetching ? undefined : null"
          :options="ownerState.data"
          @search="ownerSearch"
          allow-clear
          show-search
          @focus="ownerSearch('')"
          @change="ownerStateChange"
          @input="handleOwnerInput"
          @compositionstart="handleOwnerCompositionStart"
          @compositionend="handleOwnerCompositionEnd"
        />
      </template>
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
                  :show-search="false"
                  @change="
                    (value) => {
                      row.yardColumns = [...value].sort();
                      getStorageConditionSearch(row);
                    }
                  "
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
    </Form>
    <!-- 添加箱区选择弹窗组件 -->
    <ContainerArea
      v-model:visible="containerAreaModalVisible"
      :owner-code-list="containerAreaParams.ownerCodeList"
      :cont-iso-list="containerAreaParams.contIsoList"
      :trade-type="containerAreaParams.tradeType"
      :selected-positions="containerAreaParams.selectedPositions"
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
