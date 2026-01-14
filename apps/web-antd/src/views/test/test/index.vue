<template>
  1111
  <div class="example-container">
    <h2>高级查询组件示例</h2>

    <!-- 使用高级查询组件 -->
    <AdvancedQuery
      :fields="fields"
      :operators-map="operatorsMap"
      :default-levels="defaultLevels"
      @query="handleQuery"
      @reset="handleReset"
      @saveTemplate="handleSaveTemplate"
    />

    <!-- 显示查询结果 -->
    <div class="result-area" v-if="queryResult">
      <h3>查询参数：</h3>
      <pre>{{ JSON.stringify(queryResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdvancedQuery from './index.vue'

// 字段配置
const fields = [
  { value: 'name', label: '姓名' },
  { value: 'age', label: '年龄' },
  { value: 'gender', label: '性别' },
  { value: 'department', label: '部门' },
  { value: 'salary', label: '薪资' }
]

// 操作符映射
const operatorsMap = {
  default: [
    { value: 'eq', label: '等于' },
    { value: 'ne', label: '不等于' },
    { value: 'gt', label: '大于' },
    { value: 'ge', label: '大于等于' },
    { value: 'lt', label: '小于' },
    { value: 'le', label: '小于等于' },
    { value: 'like', label: '包含' },
    { value: 'notlike', label: '不包含' },
    { value: 'null', label: '为空' },
    { value: 'notnull', label: '不为空' }
  ]
}

// 默认层级数据
const defaultLevels = [
  {
    relation: 'AND',
    conditions: [
      {
        relation: 'AND',
        conditions: [
          {
            relation: 'AND',
            conditions: [
              {
                field: '',
                operator: '',
                value: '',
              },
            ],
          },
        ],
      },
    ],
  },
]

// 查询结果
const queryResult = ref<any>(null)

// 处理查询事件
const handleQuery = (params: any) => {
  console.log('查询参数:', params)
  queryResult.value = params
}

// 处理重置事件
const handleReset = () => {
  console.log('重置查询条件')
  queryResult.value = null
}

// 处理保存模板事件
const handleSaveTemplate = (templateName: string) => {
  console.log('保存模板:', templateName)
}
</script>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.result-area {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.result-area h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.result-area pre {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
