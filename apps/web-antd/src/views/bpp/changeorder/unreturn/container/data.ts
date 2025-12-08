import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
// import type { DescriptionItemSchema } from '#/components/description';

// import { h } from 'vue';
//
// import { Tag } from 'ant-design-vue';

// import { z } from '#/adapter/form';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { getRangePickerDefaultProps } from '#/utils';

const bppBaseDict = bppBaseDictStore();
// 预加载需要的字典数据
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};
loadDictData([
  'system_rate',
  'acceptance_plan_status',
  'payment_method',
  'import_export_type',
  'on_site_operation_node',
  'on_site_operation_category',
  'driving_source',
  'change_reason',
  'spreader_type',
  'actual_operation',
]).then();
// 定义受理状态选项配置
function getPlanStatusOptions(type: string) {
  const dictOptions = bppBaseDict.getBppBaseDictOptions(type) || [];

  // 将字典数据转换为 CellTag 需要的格式
  return dictOptions.map((option) => ({
    value: option.value,
    label: option.label,
    color: option.colorType,
  }));
}
function createDictFilter(dictType: string) {
  return ({ option, row, column }: { column: any; option: any; row: any }) => {
    if (option.data) {
      const searchText = option.data.toLowerCase();
      const dictOptions = bppBaseDict.getBppBaseDictOptions(dictType) || [];
      const cellValue = `${row[column.field]}`.toLowerCase();

      // 查找标签或值包含搜索文本的字典项
      const dictItem = dictOptions.find(
        (item) =>
          item.label.toLowerCase().includes(searchText) ||
          item.value.toLowerCase().includes(searchText),
      );

      // 如果找到字典项，使用字典值匹配；否则使用原始搜索文本匹配
      const matchValue = dictItem ? dictItem.value.toLowerCase() : searchText;
      return cellValue.includes(matchValue);
    }
    return true;
  };
}
// function renderTagDict(dictType: string, cellValue: string) {
//   const options = getPlanStatusOptions(dictType);
//   let color = '';
//   let label = '';
//   // eslint-disable-next-line array-callback-return
//   options.find((item) => {
//     if (item.value === cellValue) {
//       color = item.color;
//       label = item.label;
//     }
//   });
//   return h(Tag, { color }, () => label);
// }


export function planInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'person',
      label: '申请人',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '申请人电话',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'company',
      label: '货主单位',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'agentCompany',
      label: '货代单位',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'beizhu',
      label: '备注',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
  ]
}

export function payInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'payPerson',
      label: '付费人',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'payType',
      label: '付费方式',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'title',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        allowClear: true,
        disabled: true,
      },
      rules: 'required',
    },
  ]
}

/** 受理计划列表搜索栏 */
export function acceptancePlanSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'shipNo',
      label: '船名航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入船名航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'acceptancePlanNo',
      label: '受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'pickNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号，支持多条',
        allowClear: true,
      },
    },
    {
      fieldName: 'instructionNo',
      label: '运输指令号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运输指令号，支持多条',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱号，支持多条',
        allowClear: true,
      },
    },
  ]
}
/** 超限作业申请列表的搜索表单 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselName',
      label: '作业船名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselVoyage',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '申请单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请单位',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输箱号',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'conclusionTime',
      label: '审结时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 超限作业申请列表的字段 */
export function acceptancePlanOvrOprColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'acceptancePlanNo',
      title: '申请编号',
      minWidth: 120,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'acceptancePlanWebNo',
      title: '网上编号',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'applicantCompanyName',
      title: '申请单位',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'handlingPerson',
      title: '经办人',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
      sortable: true,
    },
    {
      field: 'vesselName',
      title: '作业船名',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'vesselVoyage',
      title: '作业航次',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'category',
      title: '进出口类别',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('import_export_type'),
      formatter: (value) => {
        const options =
          bppBaseDict.getBppBaseDictOptions('import_export_type') || [];
        const option = options.find((opt) => opt.value === value.cellValue);
        return option ? option.label : value.cellValue;
      },
    },
    {
      field: 'vesselCode',
      title: '作业船名代码',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'billNo',
      title: '提单号',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'cargoName',
      title: '货名',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'payerNameSea',
      title: '海侧缴费方',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'paymentTypeSea',
      title: '海侧缴费方式',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('payment_method'),
      formatter: (value) => {
        const options =
          bppBaseDict.getBppBaseDictOptions('payment_method') || [];
        const option = options.find((opt) => opt.value === value.cellValue);
        return option ? option.label : value.cellValue;
      },
    },
    {
      field: 'payerNameGate',
      title: '陆侧缴费方',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'paymentTypeGate',
      title: '陆侧缴费方式',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('payment_method'),
      formatter: (value) => {
        const options =
          bppBaseDict.getBppBaseDictOptions('payment_method') || [];
        const option = options.find((opt) => opt.value === value.cellValue);
        return option ? option.label : value.cellValue;
      },
    },
    {
      field: 'handlingPerson',
      title: '经办人',
      minWidth: 100,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'isSystemRate',
      title: '是否系统费率',
      minWidth: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('system_rate'),
      formatter: (value) => {
        const options = bppBaseDict.getBppBaseDictOptions('system_rate') || [];
        const option = options.find(
          (opt) => opt.value?.toString() === value.cellValue?.toString(),
        );
        return option ? option.label : value.cellValue;
      },
    },
    {
      field: 'planStatus',
      title: '受理状态',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: createDictFilter('acceptance_plan_status'),
      cellRender: {
        name: 'CellTagDict',
        options: getPlanStatusOptions('acceptance_plan_status'),
      },
    },
    {
      field: 'approvalWorkflowCurrentNode',
      title: '审批节点',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      field: 'conclusionTime',
      title: '审结时间',
      minWidth: 180,
      formatter: 'formatDateTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '',
          allowClear: true,
        },
      },
      filterMethod: ({ option, row, column }) => {
        if (option.data) {
          return `${row[column.field]}`.includes(option.data);
        }
        return true;
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}


