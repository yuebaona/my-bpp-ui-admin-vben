import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { z } from '#/adapter/form';
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

/** 车辆管理列表的搜索表单 */
export function truckSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'trkNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
        allowClear: true,
      },
    },
    {
      fieldName: 'trailerNo',
      label: '挂车车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入挂车车牌号',
        allowClear: true,
      },
    },
    {
      fieldName: 'fltCd',
      label: '车辆代码/中文名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆代码/名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'isRstr',
      label: '是否限制',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
      },
    },
    {
      fieldName: 'rstrReason',
      label: '限制代码/描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入限制代码/描述',
        allowClear: true,
      },
    },
    {
      fieldName: 'annRevFlag',
      label: '是否年审',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是（Y）', value: true },
          { label: '否（N）', value: false },
        ],
      },
    },
  ];
}

/** 车辆信息表格字段 */
export function truckInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    {
      field: 'licensePlate',
      title: '车牌号',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车牌号',
        },
      },
    },
    {
      field: 'rfidNo',
      title: 'RFID',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入RFID',
        },
      },
    },
    {
      field: 'lastGateInDt',
      title: '最后进场时间',
      minWidth: 120,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'lastGateOutDt',
      title: '最后出场时间',
      minWidth: 120,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
                       option,
                       row,
                       column,
                     }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'fleetCode',
      title: '车队代码',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车队代码',
        },
      },
    },
    {
      field: 'fleetName',
      title: '车队中文名',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车辆名称',
        },
      },
    },
    {
      field: 'fleetRestricted',
      title: '所属车队是否被限制',
      minWidth: 150,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'trkRstrCount',
      title: '已限制次数',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
          placeholder: '请输入次数',
        },
      },
    },
    {
      field: 'isRstr',
      title: '是否限制',
      minWidth: 100,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'rstrRsn',
      title: '限制原因代码及描述',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入限制原因',
        },
      },
    },
    {
      field: 'dataSrc',
      title: '限制信息来源',
      minWidth: 120,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
        },
      },
    },
    {
      field: 'currentTrkRstrStartDt',
      title: '限制开始时间',
      minWidth: 120,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'currentTrkRstrEndDt',
      title: '限制结束时间',
      minWidth: 120,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'latestRstrDays',
      title: '最近一次限制时间合计',
      minWidth: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
        },
      },
    },
    {
      field: 'trailerPlate',
      title: '挂车车牌号',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入挂车车牌号',
        },
      },
    },
    {
      field: 'engNo',
      title: '发动机编号',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入发动机编号',
        },
      },
    },
    {
      field: 'licExpDt',
      title: '行驶证有效期',
      minWidth: 150,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'trkWtKg',
      title: '车辆自重(kg)',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          placeholder: '请输入重量',
          clearable: true,
        },
      },
    },
    {
      field: 'isAnnualInspe',
      title: '是否年审',
      minWidth: 90,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'inspDt',
      title: '年审时间',
      minWidth: 150,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'inspBy',
      title: '年审员',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入年审员',
          clearable: true,
        },
      },
    },
    {
      field: 'autoFlg',
      title: '是否自动化码头',
      minWidth: 130,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'newFlg',
      title: '是否新能源车',
      minWidth: 120,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'maxLoadWTKg',
      title: '最大载重(kg)',
      width: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入载重',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkLenM',
      title: '长度',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          placeholder: '请输入长度',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkWidM',
      title: '宽度',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          placeholder: '请输入宽度',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkColor',
      title: '车头颜色',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入颜色',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkOwnrNm',
      title: '车主姓名',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入车主姓名',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkOwnrPh',
      title: '车主电话',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入车主电话',
          allowClear: true,
        },
      },
    },
    {
      field: 'trkOwnrId',
      title: '车主身份证',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入身份证号',
          allowClear: true,
        },
      },
    },
    {
      field: 'hazLic',
      title: '危险品许可证',
      minWidth: 130,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入许可证号',
        },
      },
    },
    {
      field: 'trkLicNo',
      title: '行驶证档案编号',
      minWidth: 130,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入档案编号',
        },
      },
    },
    {
      field: 'trailerLicNo',
      title: '挂车行驶证号',
      minWidth: 130,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入行驶证号',
        },
      },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入备注',
        },
      },
    },
    {
      field: 'tmlRm',
      title: '码头备注',
      minWidth: 180,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入码头备注',
        },
      },
    },
    {
      field: 'etcNo',
      title: '车辆ETC号',
      minWidth: 100,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入ETC号',
        },
      },
    },
    {
      field: 'affiliationStartTime',
      title: '开始挂靠时间',
      minWidth: 130,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'enableFlg',
      title: '是否停用',
      minWidth: 100,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
    {
      field: 'dataSrc',
      title: '创建源',
      minWidth: 120,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
          placeholder: '请选择',
        },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 150,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      field: 'enableFlg',
      title: '是否有效',
      minWidth: 100,
      filters: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          options: [
            { label: '是（Y）', value: 1 },
            { label: '否（N）', value: 0 },
          ],
        },
      },
      formatter: ({ cellValue }) =>
        cellValue === 1 || cellValue === '1' ? '是' : '否',
    },
  ];
}

/** 车辆详情表单（底部详情栏） */
export function detailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'licensePlate',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rfidNo',
      label: 'RFID',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'lastEntryTime',
      label: '最后进场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastExitTime',
      label: '最后出场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择时间',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'enableFlg',
      label: '是否有效',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'fltCd',
      label: '车队代码',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltNm',
      label: '所属车队中文名',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'fltIsRstr',
      label: '所属车队是否被限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rstrCnt',
      label: '已限制次数',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'isRstr',
      label: '是否限制',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rstrDataSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'lastRstrDt',
      label: '最近一次限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'trailer',
      label: '挂车车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'engNo',
      label: '发动机编号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trailerLicNo',
      label: '挂车行驶证号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'licExpDt',
      label: '行驶证有效期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'trkLicNo',
      label: '行驶证档案编号',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
        type: 'number',
      },
    },
    {
      fieldName: 'trkWtKg',
      label: '车辆自重(kg)',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'maxLoadWtKg',
      label: '最大载重(kg)',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'isAnnualInspe',
      label: '是否年审',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'inspDt',
      label: '年审时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择年审时间',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'inspBy',
      label: '年审员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入年审员',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'etcNo',
      label: '车辆ETC号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆ETC号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkLenM',
      label: '长度',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkWidM',
      label: '宽度',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkColor',
      label: '车头颜色',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车头颜色',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkOwnrNm',
      label: '车主姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车主姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'trkOwnrPh',
      label: '车主电话',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: z.string().regex(/^\d{11}$/, { message: '请输入11位有效数字' }),
    },
    {
      fieldName: 'trkOwnrId',
      label: '车主身份证',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车主身份证',
        allowClear: true,
      },
      rules: z
        .string()
        .regex(/^\d{17}[\dX]$/i, { message: '请输入18位有效身份证号' }),
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'autoFlg',
      label: '是否自动化码头',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'newFlg',
      label: '是否新能源车',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'hazLic',
      label: '危险品许可证',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'rstrRsn',
      label: '限制原因代码及描述',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'affiliationStartTime',
      label: '开始挂靠时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始挂靠时间',
        allowClear: true,
        showTime: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        allowClear: true,
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'tmlRm',
      label: '码头备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入码头备注',
        allowClear: true,
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'dataSrc',
      label: '创建源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
}

/** 已限制明细表格字段 */
export function restrictionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 40,
    },
    {
      title: '车队中文名',
      field: 'fleetName',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车队',
        },
      },
      editRender: { name: 'input' },
    },
    {
      title: '限制代码：描述',
      field: 'rstrRsn',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入限制代码',
        },
      },
      editRender: { name: 'input' },
    },
    {
      title: '车牌号',
      field: 'trkNo',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入车牌号',
        },
      },
      editRender: { name: 'input' },
    },
    {
      title: '司机姓名',
      field: 'driverNm',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入司机姓名',
        },
      },
      editRender: { name: 'input' },
    },
    {
      title: '限制开始时间',
      field: 'rstrStartDt',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      title: '限制结束时间',
      field: 'rstrEndDt',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      title: '限制时间合计',
      field: 'lastRstrDt',
      minWidth: 150,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
          placeholder: '请输入天数',
        },
      },
    },
    {
      title: '创建时间',
      field: 'createTime',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      title: '解除限制时间',
      field: 'releaseTime',
      minWidth: 150,
      sortable: true,
      formatter: 'formatDateTime',
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: { type: 'date', clearable: true, placeholder: '请选择日期' },
        events: {
          input: ({ $grid, column }: any) =>
            $grid.saveFilterByEvent('input', column.field),
        },
      },
      filterMethod: ({
        option,
        row,
        column,
      }: {
        column: any;
        option: any;
        row: any;
      }) => {
        const date = dayjs(row[column.field]);
        if (!date) return false;
        if (option.data)
          return date.format('YYYY-MM-DD HH:mm:ss').includes(option.data);
        return true;
      },
    },
    {
      title: '限制信息来源',
      field: 'dataSrc',
      minWidth: 150,
      sortable: true,
      filters: [
        { label: '北港网', value: '北港网' },
        { label: '业务处理平台', value: '业务处理平台' },
      ],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          allowClear: true,
          dropdownStyle: { zIndex: 8001 },
          options: [
            { label: '北港网', value: '北港网' },
            { label: '业务处理平台', value: '业务处理平台' },
          ],
        },
      },
    },
    {
      title: '创建账号',
      field: 'creator',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          clearable: true,
          placeholder: '请输入创建账号',
        },
      },
    },
  ];
}
/** 已限制明细表单字段 */
export function restrictionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'fleetName',
      label: '车队中文名',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入车队代码',
        allowClear: true,
      },
    },
    {
      fieldName: 'rstrRsn',
      label: '限制代码：描述',
      component: 'slot',
      rules: 'required',
    },
    {
      fieldName: 'trailerPlate',
      label: '车牌号',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入车牌号',
        allowClear: true,
      },
    },
    {
      fieldName: 'driverNm',
      label: '司机姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入司机姓名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'rstrStartDt',
      label: '限制开始时间',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        placeholder: '请选择限制开始时间',
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        popupStyle: { zIndex: 8001 },
      },
    },
    {
      fieldName: 'rstrEndDt',
      label: '限制结束时间',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        placeholder: '请选择限制结束时间',
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        popupStyle: { zIndex: 8001 },
      },
    },
    {
      fieldName: 'lastRstrDt',
      label: '限制时间合计',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'divider',
      label: '',
      component: 'Divider',
      componentProps: {
        style: { display: 'none' },
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'releaseTime',
      label: '解除限制时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择解除限制时间',
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        popupStyle: { zIndex: 8001 },
      },
    },
    {
      fieldName: 'dataSrc',
      label: '限制信息来源',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createUser',
      label: '创建账号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'relDriverFlg',
      label: '是否关联限制司机',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        popupStyle: { zIndex: 9001 },
      },
    },
  ];
}
