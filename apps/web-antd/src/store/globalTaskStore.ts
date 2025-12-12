import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义全局仓库（id 唯一，建议语义化命名）
export const useGlobalTaskStore = defineStore('globalTask', () => {
  // 1. 定义全局响应式变量：任务数量（初始0）
  const taskTodoTotal = ref<number>(0);
  // 2. 定义修改方法（推荐：统一管理修改逻辑，便于维护）
  // 方式1：直接设置值
  const setTaskTodoTotal = (newVal: number) => {
    taskTodoTotal.value = newVal;
  };
  // 暴露变量和方法（组件中可访问/调用）
  return {
    taskTodoTotal,
    setTaskTodoTotal,
  };
});
