<script lang="ts" setup>
// import type { UploadProps } from 'ant-design-vue';

import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createSubPlan,
  getMainPlan,
  getStorageQuantity,
  getSubPlanIsoList,
  getSubPlanOwnerList,
  getVesselAndVoyage,
  updateSubPlan,
} from '#/api/bpp/empty/container/control';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';
import { $t } from '#/locales';
import { debounce } from '#/views/bpm/components/bpmn-process-designer/src/utils';

import { containerAreaRangeColumns, subPlanFormSchema } from '../data';
import ContainerArea from './containerSubAreaSelect.vue';

const emit = defineEmits(['success']);
const pickupPlanNoShow = ref(false);
const containerAreaModalVisible = ref(false);
const tradeTypeDisabled = ref(false);
const isSubmitting = ref(false);
const containerAreaParams = reactive({
  ownerCodeList: [],
  contIsoList: [],
  tradeType: '',
  selectedPositions: [] as Array<{ yardBay: string; yardRaw?: string }>,
});

const loadingMap = ref<Map<string, boolean>>(new Map());

const containerAreaData = reactive<any[]>([]);

// 存储每个堆场位置的可选列信息
const yardColumnsOptions = ref<
  Record<string, { label: string; value: string }[]>
>({});

// 存储主计划的 bayRangeList 映射：yardBay -> yardRaw
const mainPlanBayRangeMap = ref<Record<string, string>>({});

const dischargeVslSchedule = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false, // 标记是否在中文输入法组合状态
});

// 处理卸船船期输入，将英文部分转为大写，同时允许中文
const handleDischargeVslScheduleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (dischargeVslSchedule.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase();
  fetchDischargeVslSchedule(target.value);
};

// 处理卸船船期中文输入法组合开始
const handleDischargeVslScheduleCompositionStart = () => {
  dischargeVslSchedule.isComposing = true;
};

// 处理卸船船期中文输入法组合结束
const handleDischargeVslScheduleCompositionEnd = (e: CompositionEvent) => {
  dischargeVslSchedule.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase();
  fetchDischargeVslSchedule(target.value);
};

// ISO搜索选择器
const {
  state: isoState,
  search: isoSearch,
  handleInput: handleIsoInput,
  handleCompositionStart: handleIsoCompositionStart,
  handleCompositionEnd: handleIsoCompositionEnd,
} = useSearchSelect({
  searchApi: async () => {
    return await getSubPlanIsoList(formData.mainId);
  },
  labelField: 'contIso',
  valueField: 'contIso',
  errorMessage: '获取ISO数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

// 持箱人搜索选择器
const {
  state: ownerState,
  search: ownerSearch,
  handleInput: handleOwnerInput,
  handleCompositionStart: handleOwnerCompositionStart,
  handleCompositionEnd: handleOwnerCompositionEnd,
} = useSearchSelect({
  searchApi: async () => {
    return await getSubPlanOwnerList(formData.mainId);
  },
  labelField: 'ownerCode',
  valueField: 'ownerCode',
  errorMessage: '获取持箱人数据失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

const formData = reactive<EmptyContainerControlApi.subPlanVO>({
  id: '',
  ownerCodeList: [],
  contIsoList: [],
  isRelease: null,
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

const selectContainerArea = async () => {
  // 获取表单值
  const formValues = await formApi.getValues();
  const $grid = gridApi.grid;
  const currentGridData = $grid.getTableData().fullData;

  formData.bayRangeList = currentGridData.map((item) => ({
    yardBay: item.yardPosition,
    yardRaw: item.yardColumns,
    ...item,
  }));
  containerAreaParams.ownerCodeList = Array.isArray(formValues.ownerCodeList)
    ? formValues.ownerCodeList
    : [formValues.ownerCodeList];
  containerAreaParams.contIsoList = Array.isArray(formValues.contIsoList)
    ? formValues.contIsoList
    : [formValues.contIsoList];
  containerAreaParams.tradeType = formValues.tradeType || '';
  containerAreaParams.selectedPositions = formData.bayRangeList || [];
  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = async (
  positions: Array<{ yardBay: string; yardRaw?: string }>,
) => {
  gridApi.setLoading(true);
  containerAreaModalVisible.value = false;
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
    yardColumnsOptions.value = {};

    const newRows = positions.map((pos) => {
      const yardPosition = pos.yardBay;

      // 使用主计划的 bayRangeList 限制列选项
      const mainPlanYardRaw = mainPlanBayRangeMap.value[yardPosition];
      if (mainPlanYardRaw) {
        const allowedColumns = mainPlanYardRaw
          .split(',')
          .map((col) => col.trim());
        yardColumnsOptions.value[yardPosition] = allowedColumns.map((col) => ({
          label: col,
          value: col,
        }));
      } else {
        // 如果主计划也没有限制，使用默认的A-J列
        yardColumnsOptions.value[yardPosition] = [
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
        ];
      }

      if (existingRowsMap.has(yardPosition)) {
        const existingRow = existingRowsMap.get(yardPosition);
        // 确保已存在的行使用新的列选项
        return existingRow;
      }
      // 新行数据
      return {
        yardPosition,
        yardColumns: pos.yardRaw
          ? pos.yardRaw.split(',').map((col) => col.trim())
          : [],
        totalCount: 0,
        minDays: 0,
        maxDays: 0,
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

    // 一次性获取所有选中贝位的堆存数据
    const yardBayList = formData.bayRangeList.map((item) => ({
      yardBay: item.yardBay,
      yardRaw: item.yardRaw || null,
    }));

    const requestData = {
      baseInfo: {
        contIsoList: formData.contIsoList,
        ownerCodeList: formData.ownerCodeList,
        tradeType: formData.tradeType,
        dischargeVslSchedule: formData.dischargeVslSchedule,
      },
      yardBayList,
    };

    try {
      const response = await getStorageQuantity(requestData);
      const storageDataList = Array.isArray(response)
        ? response
        : response?.data || [];
      if (storageDataList.length > 0) {
        const storageMap = new Map<string, any>();
        storageDataList.forEach((item) => {
          if (item.yardBay) {
            storageMap.set(item.yardBay, item);
          }
        });

        // 更新表格数据
        containerAreaData.forEach((row) => {
          const storageData = storageMap.get(row.yardPosition);
          if (storageData) {
            row.totalCount = storageData.totalCount ?? 0;
            row.minDays = storageData.minDays ?? 0;
            row.maxDays = storageData.maxDays ?? 0;
          }
        });

        $grid.reloadData(containerAreaData);
      }
    } catch (error) {
      console.error('批量查询堆存数据失败:', error);
      message.warning('堆存查询失败或异常，请重试');
      gridApi.setLoading(false);
    }
    gridApi.setLoading(false);
  }
};

// 获取指定行的可选列选项
const getYardColumnsOptions = (row: any) => {
  if (!row.yardPosition) {
    return [
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
    ];
  }

  // 返回该位置的可选列，如果不存在则返回默认选项
  return (
    yardColumnsOptions.value[row.yardPosition] || [
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
    ]
  );
};

// 查询堆存情况
const getStorageConditionSearch = async (row: any) => {
  const $grid = gridApi.grid;
  if (!$grid) return;

  try {
    // 设置加载状态
    loadingMap.value.set(row.yardPosition, true);
    const rowIndex = $grid.getRowIndex(row);

    const originalBayRange =
      formData.bayRangeList && formData.bayRangeList[rowIndex];
    const originalYard = originalBayRange ? originalBayRange.yardRaw : '';
    const originalYardArray = originalYard
      ? originalYard.split(',').filter((item) => item.trim())
      : [];

    const newYard = Array.isArray(row.yardColumns) ? row.yardColumns : [];

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
        contIsoList: formData.contIsoList,
        ownerCodeList: formData.ownerCodeList,
        tradeType: formData.tradeType,
        dischargeVslSchedule: formData.dischargeVslSchedule,
      },
    };

    const response = await getStorageQuantity(requestData);
    if (response.length > 0) {
      row.totalCount = response[0].totalCount ?? 0;
      row.minDays = response[0].minDays ?? 0;
      row.maxDays = response[0].maxDays ?? 0;
    } else {
      // 当接口返回空数组时，将堆存天数设置为0
      row.totalCount = 0;
      row.minDays = 0;
      row.maxDays = 0;
    }
    const index = containerAreaData.findIndex(
      (item) => item.yardPosition === row.yardPosition,
    );
    if (index !== -1) {
      containerAreaData[index].totalCount = row.totalCount ?? 0;
      containerAreaData[index].minDays = row.minDays ?? 0;
      containerAreaData[index].maxDays = row.maxDays ?? 0;
    }
    await $grid.updateData(row);
  } catch (error) {
    console.log(error);
    message.warning('堆存查询失败或异常，请重试');
  } finally {
    loadingMap.value.set(row.yardPosition, false);
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  if ($grid) {
    await $grid.remove([row]);

    formData.bayRangeList = $grid.getTableData().fullData.map((item) => ({
      yardBay: item.yardPosition,
      yardRaw:
        item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
    }));
  }$grid.clearFilter();
};

// 获取卸船船期
const fetchDischargeVslSchedule = async (searchText: string) => {
  dischargeVslSchedule.fetching = true;
  try {
    if (!searchText || searchText.length < 2) {
      return;
    }
    const upperCaseValue = searchText.toUpperCase();
    const result = await getVesselAndVoyage({ condition: upperCaseValue });
    dischargeVslSchedule.data = result.map((item) => ({
      label: item,
      value: item,
    }));
  } catch {
    dischargeVslSchedule.data = [];
  } finally {
    dischargeVslSchedule.fetching = false;
  }
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
  schema: subPlanFormSchema(pickupPlanNoShow, tradeTypeDisabled.value),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values, changedValues) => {
    Object.assign(formData, values);
    const isChangeContIso =
      Array.isArray(changedValues) && changedValues[0] === 'contIsoList';
    const isChangeOwner =
      Array.isArray(changedValues) && changedValues[0] === 'ownerCodeList';
    const isChangePickupPlanNo =
      Array.isArray(changedValues) && changedValues[0] === 'pickupPlanNo';
    const isChangeIsRelease =
      Array.isArray(changedValues) && changedValues[0] === 'isRelease';
    const isChangeTradeType =
      Array.isArray(changedValues) && changedValues[0] === 'tradeType';

    // 根据是否放箱的初始值设置计划箱量字段状态
    if (isChangeIsRelease) {
      if (formData.isRelease === false) {
        formData.planQuantity = '';
        await formApi.setFieldValue('planQuantity', '');
        await formApi.updateSchema([
          { fieldName: 'planQuantity', componentProps: { disabled: true } },
        ]);
      } else if (formData.isRelease === true) {
        await formApi.updateSchema([
          { fieldName: 'planQuantity', componentProps: { disabled: false } },
        ]);
      }
    }
    if (
      (isChangeContIso || isChangeOwner || isChangePickupPlanNo) &&
      !formData.id
    ) {
      containerAreaData.splice(0);
      formData.bayRangeList = [];
      yardColumnsOptions.value = {};
      const $grid = gridApi.grid;
      if ($grid) {
        $grid.reloadData([]);
      }
    }
    if (isChangeTradeType && !tradeTypeDisabled.value) {
      formData.tradeType = values.tradeType || '';
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
    // data: containerAreaData,
  },
});

const debouncedConfirm = debounce(async () => {
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
      if (isNaN(quantity) || quantity <= 0) {
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
      formData.planType = 'SUB';
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

    const data: EmptyContainerControlApi.subPlanVO = {
      ...formData,
      bayRangeList,
      // 确保即使字段为空也能提交到后端
      dischargeVslSchedule: formData.dischargeVslSchedule || '',
      tradeType: formData.tradeType || '',
    } as EmptyContainerControlApi.subPlanVO;

    await (formData?.id ? updateSubPlan(data) : createSubPlan(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } finally {
    isSubmitting.value = false;
  }
}, 300);

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onConfirm: debouncedConfirm,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        ownerCodeList: [],
        contIsoList: [],
        isRelease: false,
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
      yardColumnsOptions.value = {};
      mainPlanBayRangeMap.value = {};
      isoState.data = [];
      ownerState.data = [];
      isoState.value = [];
      ownerState.value = [];
      return;
    }

    const data = await modalApi.getData<any>();

    if (data) {
      // 清空现有数据
      containerAreaData.splice(0);
      yardColumnsOptions.value = {};
      mainPlanBayRangeMap.value = {};

      const subPlanData = data.acceptancePlanRespVO || data;
      Object.assign(formData, subPlanData);

      if (data.planType) {
        formData.planType = data.planType;
      }
      if (data.mainId) {
        formData.mainId = data.mainId;
        // 优先使用传入的主计划 bayRangeList 数据，避免重复调用接口
        if (data.mainPlanBayRangeList && Array.isArray(data.mainPlanBayRangeList)) {
          data.mainPlanBayRangeList.forEach((item: any) => {
            if (item.yardBay && item.yardRaw) {
              mainPlanBayRangeMap.value[item.yardBay] = item.yardRaw;
            }
          });
        } else {
          // 如果没有传入，则通过接口获取（兼容旧逻辑）
          try {
            const mainPlanData = await getMainPlan(data.mainId);
            if (mainPlanData && mainPlanData.bayRangeList) {
              mainPlanData.bayRangeList.forEach((item: any) => {
                if (item.yardBay && item.yardRaw) {
                  mainPlanBayRangeMap.value[item.yardBay] = item.yardRaw;
                }
              });
            }
          } catch (error) {
            console.error('获取主计划数据失败：', error);
          }
        }
      }
      if (
        data.planType === 'SUB' &&
        data.mainPlanIsRelease !== null &&
        data.mainPlanIsRelease !== undefined
      ) {
        formData.isRelease = !data.mainPlanIsRelease;
      }
      if (data.planType === 'SUB') {
        const hasMainTradeType = !!(
          data.mainPlanTradeType || subPlanData.mainTradeType
        );

        if (hasMainTradeType) {
          formData.tradeType =
            data.mainPlanTradeType || subPlanData.mainTradeType;
          tradeTypeDisabled.value = true;
          formApi.updateSchema([{ fieldName: 'tradeType', disabled: true }]);
        } else {
          formData.tradeType = '';
          tradeTypeDisabled.value = false;
          formApi.updateSchema([{ fieldName: 'tradeType', disabled: false }]);
        }
      } else {
        // 非子计划情况
        if (!subPlanData?.id) {
          formData.tradeType = '';
        }
        tradeTypeDisabled.value = false;
        formApi.updateSchema([{ fieldName: 'tradeType', disabled: false }]);
      }
      if (data.planType === 'SUB' && data.mainPlanTradeType) {
        formData.tradeType =
          data.mainPlanTradeType === 'DOMESTIC' ? 'DOMESTIC' : 'FOREIGN';
      }
      if (data.pickupPlanNo) {
        pickupPlanNoShow.value = true;
      }

      if (subPlanData?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(subPlanData);
          if (subPlanData.ownerCodeList) {
            ownerState.value = subPlanData.ownerCodeList;
            ownerState.originalValue = subPlanData.ownerCodeList;
          }

          // 设置ISO选择值
          if (subPlanData.contIsoList) {
            isoState.value = subPlanData.contIsoList;
            isoState.originalValue = subPlanData.contIsoList;
          }

          if (subPlanData.dischargeVslSchedule) {
            dischargeVslSchedule.value = subPlanData.dischargeVslSchedule;
          }

          const $grid = gridApi.grid;
          if (
            $grid && // 设置箱区范围数据
            subPlanData.bayRangeList &&
            Array.isArray(subPlanData.bayRangeList)
          ) {
            for (const bayRange of subPlanData.bayRangeList) {
              const yardPosition = bayRange.yardBay || '';

              if (yardPosition) {
                const mainPlanYardRaw = mainPlanBayRangeMap.value[yardPosition];
                if (mainPlanYardRaw) {
                  const allowedColumns = mainPlanYardRaw
                    .split(',')
                    .map((col) => col.trim())
                    .filter(Boolean);
                  yardColumnsOptions.value[yardPosition] = allowedColumns.map(
                    (col) => ({
                      label: col,
                      value: col,
                    }),
                  );
                }
              }
              const yardColumns = bayRange.yardRaw
                ? bayRange.yardRaw
                  .split(',')
                  .map((col) => col.trim())
                  .filter(Boolean)
                : [];

              await $grid.insertAt(
                {
                  yardPosition,
                  yardColumns,
                  totalCount: bayRange.totalCount || 0,
                  minDays: bayRange.minDays || 0,
                  maxDays: bayRange.maxDays || 0,
                },
                -1,
              );
            }
          }
          // await updateStorageCondition();
        } finally {
          modalApi.unlock();
        }
      } else {
        await formApi.setValues(formData);
      }

      // 根据是否放箱的初始值设置计划箱量字段状态
      if (formData.isRelease === false) {
        formData.planQuantity = '';
        await formApi.updateSchema([
          { fieldName: 'planQuantity', componentProps: { disabled: true } },
        ]);
      } else {
        await formApi.updateSchema([
          {
            fieldName: 'planQuantity',
            componentProps: { disabled: false },
          },
        ]);
      }

      if (!data.planType) {
        formData.planType = 'SUB';
      }
    }
  },
});

const updateStorageCondition = async () => {
  const $grid = gridApi.grid;
  if ($grid) {
    const currentGridData = $grid.getTableData().fullData;
    for (const row of currentGridData) {
      await getStorageConditionSearch(row);
    }
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
    ? $t('ui.actionTitle.edit', ['子计划'])
    : $t('ui.actionTitle.create', ['子计划']);
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
          allow-clear
          show-search
          @change="isoStateChange"
          @input="handleIsoInput"
          @search="isoSearch"
          @focus="isoSearch('')"
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
          allow-clear
          show-search
          @change="ownerStateChange"
          @input="handleOwnerInput"
          @search="ownerSearch"
          @focus="ownerSearch('')"
          @compositionstart="handleOwnerCompositionStart"
          @compositionend="handleOwnerCompositionEnd"
        />
      </template>
      <template #dischargeVslSchedule>
        <Select
          :options="dischargeVslSchedule.data"
          v-model:value="dischargeVslSchedule.value"
          style="width: 100%"
          placeholder="请输入船名或航次"
          :show-search="true"
          :filter-option="true"
          :list-height="150"
          allow-clear
          @change="
            (value) => {
              // 确保清除时将值设置为空字符串而不是undefined
              const clearValue = value || '';
              dischargeVslSchedule.value = clearValue;
              formApi.setFieldValue('dischargeVslSchedule', clearValue);
            }
          "
          @input="handleDischargeVslScheduleInput"
          @compositionstart="handleDischargeVslScheduleCompositionStart"
          @compositionend="handleDischargeVslScheduleCompositionEnd"
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
                  :loading="loadingMap.get(row.yardPosition)"
                  :options="getYardColumnsOptions(row)"
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
      :main-id="formData.mainId"
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
