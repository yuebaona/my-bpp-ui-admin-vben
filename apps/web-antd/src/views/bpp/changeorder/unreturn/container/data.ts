import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';

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
  'empty_container_control_main_status',
  'empty_container_control_sub_status',
  'trade_type',
  'empty_container_control_main_operation_type',
]);

export function planInfoFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'person',
      label: '申请人',
      component: 'Select',
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
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请输入货主单位',
      },
      rules: 'required',
    },
    {
      fieldName: 'agentCompany',
      label: '货代单位',
      component: 'Select',
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
      component: 'Select',
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
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '自动同步付费人信息',
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
      fieldName: 'acptPlnNo',
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
      field: 'acptPlnNo',
      title: '受理计划号',
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'transportOrdNo',
      title: '运输指令号',
      minWidth: 120,
    },
    {
      field: 'businessType',
      title: '业务类型',
      minWidth: 120,
    },
    {
      field: 'contNo',
      title: '集装箱号',
      minWidth: 120,
    },
    {
      field: 'loadOrPick',
      title: '进/提',
      minWidth: 120,
    },
    {
      field: 'orderStatus',
      title: '指令状态',
      minWidth: 120,
    },
    {
      field: 'pickupNo',
      title: '提单号',
      minWidth: 120,
      slots: { default: 'pickupNoAction' },
    },
    {
      field: 'isLCL',
      title: '是否拼箱',
      minWidth: 120,
    },
    {
      field: 'cargoName',
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
      editRender: { name: 'input' },
    },
    {
      field: 'destinationPort',
      title: '目的港',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'tradeType',
      title: '内外贸',
      minWidth: 120,
      slots: { edit: 'tradeType_edit' },
      editRender: { name: '$input' },
      formatter: ({ cellValue }) => {
        const map = { DOMESTIC: '内贸', FOREIGN: '外贸' };
        return map[cellValue as keyof typeof map] || cellValue;
      },
    },
    {
      field: 'owner',
      title: '持箱人',
      minWidth: 120,
      slots: { edit: 'owner_edit' },
      editRender: { name: '$input' },
    },
    {
      field: 'size',
      title: '尺寸',
      minWidth: 120,
      slots: { edit: 'size_edit' },
      editRender: { name: '$input' },
    },
    {
      field: 'containerType',
      title: '箱型',
      minWidth: 120,
      slots: { edit: 'containerType_edit' },
      editRender: { name: '$input' },
    },
    {
      field: 'containerHeight',
      title: '箱高',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 120,
      slots: { edit: 'iso_edit' },
      editRender: { name: '$input' },
    },
    {
      field: 'empty',
      title: '空重',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'flowCategory',
      title: '流向类别',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'imdgCode',
      title: 'IMDG',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'unNo',
      title: 'UNNO',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isRefrigerated',
      title: '是否打冷',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'refrigerationTemp',
      title: '打冷温度',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'ventilationPort',
      title: '通风口',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'sealNo',
      title: '铅封号',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'contWeightKg',
      title: '箱重',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'contGrade',
      title: '箱等级',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isDamaged',
      title: '是否残存',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'damageGrade',
      title: '残损等级',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isOog',
      title: '是否超限',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'oogFront',
      title: '前超',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'oogBack',
      title: '后超',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'oogLeft',
      title: '左超',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'oogRight',
      title: '右超',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isDirectLoadPick',
      title: '直装直提',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isPtiValid',
      title: '是否PTI有效',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'ptiExpiryDate',
      title: 'PTI有效期',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'relatedBillNo',
      title: '关联提单号',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'relatedToNo',
      title: '关联TO号',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'returnTerminal',
      title: '返场码头',
      minWidth: 120,
    },
    {
      field: 'payerCode',
      title: '付费人',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'paymentType',
      title: '付费方式',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'invoiceTitle',
      title: '发票抬头',
      minWidth: 120,
    },
    {
      field: 'oldContNo',
      title: '旧箱号',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'newContainerNo',
      title: '新箱号',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'isBand',
      title: '是否捆绑',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      field: 'subContainer',
      title: '子箱号',
      minWidth: 120,
      slots: { default: 'boxAction' },
    },
    {
      field: 'appointmentVehicle',
      title: '预约车辆',
      minWidth: 120,
    },
    {
      field: 'appointmentStartTime',
      title: '预约开始时间',
      minWidth: 120,
    },
    {
      field: 'appointmentEndTime',
      title: '预约结束时间',
      minWidth: 120,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 120,
      editRender: { name: 'input' },
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
    {
      title: '序号',
      type: 'seq',
      field: 'serialNumber',
      width: 50,
      align: 'center',
    },
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 40,
      fixed: 'left',
      slots: { footer: 'checkbox' },
    },
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
      component: 'Select',
      componentProps: {
        placeholder: '请选择内外贸',
        allowClear: true,
      },
    },
    {
      fieldName: 'empty',
      label: '空重',
      component: 'Input',
      componentProps: {
        allowClear: true,
        disabled: true,
        placeholder: '请输入空重',
      },
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
      componentProps: {
        disabled: true,
        placeholder: '请输入返场码头',
      },
    },
    {
      fieldName: 'payer',
      label: '付费人',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请输入付费人',
      },
    },
    {
      fieldName: 'payment',
      label: '付费方式',
      component: 'Input',
    },
    {
      fieldName: 'title',
      label: '发票抬头',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '自动同步付费人信息',
      },
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
