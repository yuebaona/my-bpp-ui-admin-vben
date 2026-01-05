<script lang="ts" setup>
import {Button, message, Space, Textarea} from 'ant-design-vue';
import {confirm, VbenLoading} from '@vben/common-ui';
import {nextTick, onMounted, reactive, ref} from 'vue'
import type {VxeTablePropTypes} from '#/adapter/vxe-table';
import {VxeColumn, VxeTable} from '#/adapter/vxe-table';
import {createEditRuleHead, getEditRuleHeadList} from "#/api/bpp/flow/field-rule";
import {getEditRuleDetailByRuleTableId} from "#/api/bpp/flow/field-rule/detail";
import dayjs from "dayjs";
import { useUserStore } from '@vben/stores';

const useUser = useUserStore();
const loading = ref(false);
const newColIndex = ref(0);
const newColname = ref('newColumn');
const tableRef = ref();
const tableData = ref([])

const columnConfig = reactive<VxeTablePropTypes.ColumnConfig>({
  drag: true,
  resizable: true
})
const textareaRef = ref(null)
// 表头数据
const columnList = ref([])
// 记录删除的列数据，后端处理
const deleteColumnList = ref([])
// 记录删除的表格数据，后端处理
const deleteRowList = ref([])
const resultEvent = () => {
  const $grid = tableRef.value
  if ($grid) {
    const tableColumn = $grid.getFullColumns()
    const tableData = $grid.getFullData()
    console.log('列：', tableColumn)
    console.log('数据：', tableData)
  }
}
// 保存
const saveEvent = async () => {
  loading.value = true;
  const $grid = tableRef.value
  if ($grid) {
    const tableColumn = $grid.getFullColumns()
    const newColumn = [];
    for (let col of tableColumn) {
      if (col.title === '操作') {
        continue;
      }
      const column = columnList.value.find(item => item.field === col.field)
      newColumn.push({
        id: column.id,
        ruleCode: col.field,
        ruleName: col.title,
        editRender: JSON.stringify(col.editRender),
        headEdit: col.headEdit,
        width: col.width,
      })
    }
    await createEditRuleHead({
      rowValueList: tableData.value,
      columnList: newColumn,
      deleteColumnList: deleteColumnList.value,
      deleteRowList: deleteRowList.value,
    }).then(() => {
      message.success('保存成功');
      deleteColumnList.value = []
      refreshEvent();
    }).finally(() => {
      loading.value = false;
    });
  }
}
// 导出
const exportEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.exportData({
      original: true
    })
  }
}
// 刷新
const refreshEvent = async () => {
  loading.value = true;
  await initColumnData();
  await initTableData();
  loading.value = false;
}
// 列操作，前面添加列
const addBeforeCol = (columns) => {
  newColIndex.value++;
  const columnIndex = columns.columnIndex;
  doAddCol(columnIndex);
}
// 列操作，后面添加列
const addAfterCol = (columns) => {
  newColIndex.value++;
  const columnIndex = columns.columnIndex + 1;
  doAddCol(columnIndex);
}
const doAddCol = (columnIndex) => {
  const colIndex = dayjs().format('YYYYMMDDHHmmss') + `_${newColIndex.value}`;
  const newColumn = {
    field: newColname.value + colIndex,
    title: newColname.value + newColIndex.value,
    width: 120,
    editRender: '{\n' +
      '  "name": "select",\n' +
      '  "options": [\n' +
      '    {"label": "", "value": ""},\n' +
      '    {"label": "是", "value": "是"},\n' +
      '    {"label": "否", "value": "否"}\n' +
      '  ]\n' +
      '}',
  }
  columnList.value.splice(columnIndex, 0, newColumn);
}
// 列操作,删除列
const deleteCol = (columns) => {
  const columnIndex = columns.columnIndex;
  if (columnIndex === 0 && columnList.value.length == 1) {
    message.error('第一列不能删除');
    return;
  }
  confirm({
    content: `确定此列吗？`,
  }).then(async () => {
    // 记录删除的列数据，后端处理
    deleteColumnList.value.push(columnList.value[columnIndex]);
    columnList.value.splice(columnIndex, 1);
  })
}
// 行操作，添加行
const addRow = (row) => {
  // 提取 field 生成行对象
  const newRow = columnList.value.reduce((obj, item) => {
    // 以 item.field 为键，赋值为空字符串
    obj[item.field] = '';
    return obj;
  }, {} as Record<string, string>); // 类型断言，确保对象键值为 string 类型
  tableData.value.push(newRow);
}
// 行操作，删除行
const deleteRow = (row) => {
  confirm({
    content: `确定删除行吗？`,
  }).then(async () => {
    const rowIndex = row.rowIndex;
    deleteRowList.value.push(tableData.value[rowIndex]);
    tableData.value.splice(rowIndex, 1);
  })
}
// 右键菜单配置
const menuConfig = reactive<VxeTablePropTypes.MenuConfig>({
  header: {
    options: [
      [
        {code: 'COPY_TITLE', name: '在前面添加列', functions: addBeforeCol},
        {code: 'COPY_TITLE', name: '在后面添加列', functions: addAfterCol},
        {code: 'HIDDEN_COLUMN', name: '删除列', functions: deleteCol},
      ]
    ]
  },
  body: {
    options: [
      {code: 'CLEAR_CELL', name: '添加一行', functions: addRow},
    ]
  }
})
// 列拖动
const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})
// 单击编辑
const editConfig = ref<VxeTablePropTypes.EditConfig>({
  trigger: 'click',
  mode: 'cell'
})
// 菜单点击事件
const contextMenuClickEvent: VxeTableEvents.MenuClick = (e) => {
  e.menu.functions(e);
}
// 表头编辑,聚焦
const editUpdate = async (item) => {
  item.headEdit = true;
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value[0].focus();
  }
}
// 取消表头编辑
const noEditUpdate = (item) => {
  item.headEdit = false;
}
// 表头编辑,变化
const changeEditUpdate = (row) => {
  for (let item of columnList.value) {
    if (row.field != item.field && item.title == row.title) {
      message.error('名称已存在！');
      row.title= ''
      return;
    }
  }
}
// 是否可编辑,数据库无配置默认输入框
const parseEditRender = (editRender) => {
  if (editRender) {
    return JSON.parse(editRender);
  }
  return {name: 'input'};
}
// 初始化列数据
const initColumnData = async () => {
  const res = await getEditRuleHeadList({});
  columnList.value = res.map(item => ({
    id: item.id,
    field: item.ruleCode, // ruleCode 对应 field
    title: item.ruleName, // ruleName 对应 title
    editRender: item.editRender, // 固定编辑渲染配置
    headEdit: false, // 表头编辑
    headShow: true, // 表头显示
    width: 150, // 表头宽度
  }))
}
// 初始化表单数据
const initTableData = async () => {
  const res = await getEditRuleDetailByRuleTableId(1);
  if (res) {
    tableData.value = res;
  }
}
onMounted(async () => {
  loading.value = true;
  await initColumnData();
  await initTableData();
  loading.value = false;
})
</script>
<template>
  <div>
    <VbenLoading v-if="loading" :spinning="true" :text="'加载中。。。'"/>
    <Space style="padding:10px">
      <Button type="primary" @click="addRow" style="background-color: #19a15f">新增行</Button>
      <Button type="primary" @click="saveEvent">保存</Button>
      <Button type="primary" @click="exportEvent" style="background-color: #da8b17">导出</Button>
      <Button type="default" @click="refreshEvent">刷新</Button>
    </Space>
    <VxeTable
      border
      ref="tableRef"
      @menu-click="contextMenuClickEvent"
      :column-drag-config="columnDragConfig"
      :menu-config="menuConfig"
      :column-config="columnConfig"
      :edit-config="editConfig"
      :data="tableData">
      <VxeColumn v-for="(item,index) in columnList" :key="item.field"
                 :field="item.field"
                 :title="item.title"
                 :width="item.width"
                 :visible="headShow"
                 :edit-render="parseEditRender(item.editRender)">
        <!--表头编辑-->
        <template #header>
          <div style="padding: 10px" @click="editUpdate(item)">
            <p v-if="!item.headEdit">{{ item.title }}</p>
            <div v-if="item.headEdit">
              <Textarea
                style="width: 200px"
                ref="textareaRef"
                type="textarea"
                :rows="8"
                v-model:value="item.title"
                @change="changeEditUpdate(item)"
                @blur="noEditUpdate(item)"
              />
            </div>
          </div>
        </template>
      </VxeColumn>
      <vxe-column field='?' title="操作" width="100" fixed="right">
        <template #default="row">
          <Button size="small" danger @click="deleteRow(row)">删除</Button>
        </template>
      </vxe-column>
    </VxeTable>
  </div>
</template>
