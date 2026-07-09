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

/** 重量配置的搜索表单 */
export function laneSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'laneCode',
      label: '闸口车道代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入闸口车道代码',
        allowClear: true,
      },
    },
    {
      fieldName: 'gateAccessType',
      label: '进出闸模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '空', value: 'empty' },
          { label: '重', value: 'heavy' },
        ],
      },
    },
    {
      fieldName: 'LaneDesc',
      label: '车道描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车道描述',
        allowClear: true,
      },
    },
  ];
}

/** 车队信息字段 */
export function laneInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40, fixed: 'left' },
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    {
      field: 'laneCode',
      title: '闸口车道代码',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入',
          clearable: true,
        },
      },
      editRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
    {
      field: 'gateAccessType',
      title: '进出闸模式',
      minWidth: 60,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '进', value: '进' },
            { label: '出', value: '出' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '进', value: '进' },
          { label: '出', value: '出' },
        ],
      },
    },
    {
      field: 'laneDesc',
      title: '车道描述',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入',
          clearable: true,
        },
      },
      editRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 60,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '空', value: '空' },
            { label: '重', value: '重' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {},
        options: [
          { label: '内贸', value: '内贸' },
          { label: '外贸', value: '外贸' },
          { label: '通用贸易类型', value: '通用贸易类型' },
        ],
      },
    },
    {
      field: 'customsCheckCode',
      title: '海关校验代码',
      minWidth: 80,
      filters: [{ data: [] }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入',
          clearable: true,
        },
      },
      editRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
    {
      field: 'customsCheckSwitch',
      title: '海关校验开关',
      minWidth: 80,
      filters: [{ data: [] }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
        },
        options: [
          { label: '普通箱', value: '普通箱' },
          { label: '冷藏箱', value: '冷藏箱' },
          { label: '开顶箱', value: '开顶箱' },
          { label: '框架箱', value: '框架箱' },
          { label: '罐箱', value: '罐箱' },
          { label: '通用', value: '通用' },
        ],
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '普通箱', value: '普通箱' },
          { label: '冷藏箱', value: '冷藏箱' },
          { label: '开顶箱', value: '开顶箱' },
          { label: '框架箱', value: '框架箱' },
          { label: '罐箱', value: '罐箱' },
          { label: '通用', value: '通用' },
        ],
      },
    },
    {
      field: 'gateType',
      title: '闸口类型',
      minWidth: 150,
      filters: [{ data: [] }],
      filterMethod: ({ option, row, column }) => {
        const selected = option.data;
        if (!selected || selected.length === 0) return true;
        return selected.includes(`${row[column.field]}`);
      },
      filterRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
          multiple: true,
        },
        options: [
          { label: '外闸主闸', value: '外闸主闸' },
          { label: '外闸控制闸', value: '外闸控制闸' },
          { label: '互托闸', value: '互托闸' },
          { label: '海铁闸', value: '海铁闸' },
          { label: '公铁闸', value: '公铁闸' },
          { label: '通用闸口', value: '通用闸口' },
        ],
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '外闸主闸', value: '外闸主闸' },
          { label: '外闸控制闸', value: '外闸控制闸' },
          { label: '互托闸', value: '互托闸' },
          { label: '海铁闸', value: '海铁闸' },
          { label: '公铁闸', value: '公铁闸' },
          { label: '通用闸口', value: '通用闸口' },
        ],
      },
    },
    {
      field: 'containerRuleList',
      title: '允许通过的送提箱类型规则',
      minWidth: 150,
      filters: [{ data: [] }],
      filterMethod: ({ option, row, column }) => {
        const selected = option.data;
        if (!selected || selected.length === 0) return true;
        return selected.includes(`${row[column.field]}`);
      },
      filterRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
          multiple: true,
        },
        options: [
          { label: '主闸规则', value: '主闸规则' },
          { label: '互拖规则', value: '互拖规则' },
          { label: '海铁规则', value: '海铁规则' },
          { label: '公铁规则', value: '公铁规则' },
          { label: '全部', value: '全部' },
        ],
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '主闸规则', value: '主闸规则' },
          { label: '互拖规则', value: '互拖规则' },
          { label: '海铁规则', value: '海铁规则' },
          { label: '公铁规则', value: '公铁规则' },
          { label: 'ALL', value: 'ALL' },
        ],
      },
    },
    {
      field: 'tosLaneCode',
      title: 'TOS接口车道代码',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
      editRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
  ];
}
