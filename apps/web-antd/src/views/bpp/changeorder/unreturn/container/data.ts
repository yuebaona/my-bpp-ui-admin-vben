import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// import type { DescriptionItemSchema } from '#/components/description';
// import { h } from 'vue';
//
// import { Tag } from 'ant-design-vue';
// import { z } from '#/adapter/form';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
// import { getRangePickerDefaultProps } from '#/utils';

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
// function getPlanStatusOptions(type: string) {
//   const dictOptions = bppBaseDict.getBppBaseDictOptions(type) || [];
//
//   // 将字典数据转换为 CellTag 需要的格式
//   return dictOptions.map((option) => ({
//     value: option.value,
//     label: option.label,
//     color: option.colorType,
//   }));
// }
// function createDictFilter(dictType: string) {
//   return ({ option, row, column }: { column: any; option: any; row: any }) => {
//     if (option.data) {
//       const searchText = option.data.toLowerCase();
//       const dictOptions = bppBaseDict.getBppBaseDictOptions(dictType) || [];
//       const cellValue = `${row[column.field]}`.toLowerCase();
//
//       // 查找标签或值包含搜索文本的字典项
//       const dictItem = dictOptions.find(
//         (item) =>
//           item.label.toLowerCase().includes(searchText) ||
//           item.value.toLowerCase().includes(searchText),
//       );
//
//       // 如果找到字典项，使用字典值匹配；否则使用原始搜索文本匹配
//       const matchValue = dictItem ? dictItem.value.toLowerCase() : searchText;
//       return cellValue.includes(matchValue);
//     }
//     return true;
//   };
// }

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
        placeholder: '请输入申请人',
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '申请人电话',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入申请人电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'company',
      label: '货主单位',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入货主单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'agentCompany',
      label: '货代单位',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入货代单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      component: 'Textarea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
      formItemClass: 'w-full p-0 md:col-span-2',
    },
  ];
}

export function payInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'payer',
      label: '付费人',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入付费人',
      },
      rules: 'required',
    },
    {
      fieldName: 'payType',
      label: '付费方式',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入付费方式',
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
        placeholder: '请输入发票抬头',
      },
      rules: 'required',
    },
  ];
}

/** 受理计划列表搜索栏 */
export function acceptancePlanSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'vesselName',
      label: '船名航次',
      component: 'Select',
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
      fieldName: 'pickupNo',
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
  ];
}
/** 受理计划列表的字段 */
export function acceptancePlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'acceptancePlanNo',
      title: '受理计划号',
      minWidth: 120,
      sortable: true,
      fixed: 'left',
    },
    {
      field: 'transportOrdNo',
      title: '运输指令号',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'businessType',
      title: '业务类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'containerNo',
      title: '集装箱号',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'instructionStatus',
      title: '指令状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'pickupNoAction' },
    },
    {
      field: 'isLCL',
      title: '是否拼箱',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'cargo',
      title: '货名',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'vesselName',
      title: '船名航次',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'dischargePort',
      title: '卸货港',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'destinationPort',
      title: '目的港',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'tradeType',
      title: '内外贸',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'owner',
      title: '持箱人',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'size',
      title: '尺寸',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'containerType',
      title: '箱型',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'containerHeight',
      title: '箱高',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'empty',
      title: '空重',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'imdg',
      title: 'IMDG',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'unno',
      title: 'UNNO',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'isReefer',
      title: '是否打冷',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'temperature',
      title: '打冷温度',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'vent',
      title: '通风口',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'sealNo',
      title: '铅封号',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'weight',
      title: '箱重',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'containerLevel',
      title: '箱等级',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'damage',
      title: '是否残存',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'damageLevel',
      title: '残损等级',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'overLimit',
      title: '是否超限',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'front',
      title: '前超',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'rear',
      title: '后超',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'left',
      title: '左超',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'right',
      title: '右超',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'pickup',
      title: '直装直提',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'PTI',
      title: '是否PTI有效',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'PTITime',
      title: 'PTI有效期',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'relatePickupNo',
      title: '关联提单号',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'relateTO',
      title: '关联TO号',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'returnPort',
      title: '返厂码头',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'payer',
      title: '付费人',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'payment',
      title: '付费方式',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'title',
      title: '发票抬头',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'oldContainerNo',
      title: '旧箱号',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'newContainerNo',
      title: '新箱号',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'isBand',
      title: '是否捆绑',
      minWidth: 120,
      sortable: true,
      editRender: { name: 'input' },
    },
    {
      field: 'subContainer',
      title: '子箱号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'boxAction' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 提单信息管理表格列配置 */
export function ladingBillColumns(): VxeTableGridOptions['columns'] {
  return [
    { title: '序号',type: 'seq',field: 'serialNumber', width: 50, align: 'center' },
    { type: 'checkbox',field:'checkbox', width: 40, fixed: 'left' ,slots: { footer: 'checkbox' },},
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'cargo',
      title: '货名',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'packageWeight',
      title: '货件重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'quantity',
      title: '货件重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'totalWeight',
      title: '货总重',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'volume',
      title: '货体积',
      minWidth: 120,
      sortable: true,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 120,
      sortable: true,
      slots: { default: 'operationAction' },
    },
  ];
}

export function bundleBoxColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center' },
    { type: 'checkbox', width: 40 },
    {
      field: 'containerNo',
      title: '箱号',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'mainContainerNo',
      title: '母箱号',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'size',
      title: '尺寸',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'containerType',
      title: '箱型',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'containerHeight',
      title: '箱高',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'iso',
      title: '箱iso',
      minWidth: 120,
      editRender: {
        name: 'input',
      },
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 120,
      slots: { default: 'operationAction' },
    },
  ];
}

export function returnManageFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'returnType',
      label: '返场类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '返出口重箱', value: '返出口重箱' },
          { label: '返存储空箱', value: '返存储空箱' },
          { label: '返出口空箱', value: '返出口空箱' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'returnPort',
      label: '返场码头',
      component: 'Select',
      componentProps: {
        options: [
          { label: '自动化码头', value: '自动化码头' },
          { label: '人工码头', value: '人工码头' },
        ],
      },
      rules: 'required',
    },
  ];
}

export function editFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'vslName',
      label: '船名航次',
      component: 'Select',
      componentProps: {
        placeholder: '请输入船名航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'dischargePort',
      label: '卸货港',
      component: 'Input',
    },
    {
      fieldName: 'destinationPort',
      label: '目的港',
      component: 'Input',
    },
    {
      fieldName: 'pickupNo',
      label: '提单号',
      component: 'Input',
    },
    {
      fieldName: 'cargo',
      label: '货名',
      component: 'Input',
    },
    {
      fieldName: 'isLCL',
      label: '是否拼箱',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'holderCode',
      label: '持箱人',
      component: 'Select',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'tradeType',
      label: '内外贸',
      component: 'Input',
    },
    {
      fieldName: 'empty',
      label: '空重',
      component: 'Input',
    },
    {
      fieldName: 'contSize',
      label: '尺寸',
      component: 'Select',
      componentProps: {
        placeholder: '请输入尺寸',
        allowClear: true,
      },
    },
    {
      fieldName: 'contType',
      label: '箱型',
      component: 'Input',
    },
    {
      fieldName: 'contHeight',
      label: '箱高',
      component: 'Select',
      componentProps: {
        placeholder: '请输入箱高',
        allowClear: true,
      },
    },
    {
      fieldName: 'imdg',
      label: '危品等级（IMDG）',
      component: 'Input',
    },
    {
      fieldName: 'unno',
      label: '危品联合国代码（UNNO）',
      component: 'Input',
    },
    {
      fieldName: 'contIso',
      label: '箱ISO',
      component: 'Select',
      componentProps: {
        placeholder: '请输入ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'isReefer',
      label: '是否打冷',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'overLimit',
      label: '是否超限',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'transportType',
      label: '运输方式',
      component: 'Input',
    },
    {
      fieldName: 'temperature',
      label: '打冷温度',
      component: 'Input',
    },
    {
      fieldName: 'front',
      label: '前超',
      component: 'Input',
    },
    {
      fieldName: 'station',
      label: '火车站点',
      component: 'Input',
    },
    {
      fieldName: 'vent',
      label: '通风口',
      component: 'Input',
    },
    {
      fieldName: 'rear',
      label: '后超',
      component: 'Input',
    },
    {
      fieldName: '',
      label: '是否陆海贸易新通道',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'containerLevel',
      label: '箱等级',
      component: 'Input',
    },
    {
      fieldName: 'left',
      label: '左超',
      component: 'Input',
    },
    {
      fieldName: 'origin',
      label: '来源/流向',
      component: 'Input',
    },
    {
      fieldName: 'damage',
      label: '是否残损',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'right',
      label: '右超',
      component: 'Input',
    },
    {
      fieldName: 'customsType',
      label: '报关方式',
      component: 'Input',
    },
    {
      fieldName: 'damageLevel',
      label: '残损等级',
      component: 'Input',
    },
    {
      fieldName: 'overHeight',
      label: '超高',
      component: 'Input',
    },
    {
      fieldName: 'pickup',
      label: '是否直装',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'PTI',
      label: '是否PTI有效',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
    },
    {
      fieldName: 'PTITime',
      label: 'PTI有效期',
      component: 'Input',
    },
    {
      fieldName: 'returnPort',
      label: '返场码头',
      component: 'Input',
    },
    {
      fieldName: 'payer',
      label: '付费人',
      component: 'Input',
    },
    {
      fieldName: 'payment',
      label: '付费方式',
      component: 'Input',
    },
    {
      fieldName: 'title',
      label: '发票抬头',
      component: 'Input',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
      formItemClass: 'w-full p-0 md:col-span-3',
    },
  ];
}
