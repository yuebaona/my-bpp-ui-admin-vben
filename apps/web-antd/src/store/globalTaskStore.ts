import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getTaskTodoPage } from '#/api/bpm/task';

// 定义全局仓库（id 唯一，建议语义化命名）
export const useGlobalTaskStore = defineStore('globalTask', () => {
  // 1. 定义全局响应式变量：任务数量（初始0）
  const taskTodoTotal = ref<number>(0);
  // 2. 定义修改方法（推荐：统一管理修改逻辑，便于维护）
  const setTaskTodoTotal = (newVal: number) => {
    taskTodoTotal.value = newVal;
  };
  // 3. 手动实现$reset方法，重置数据,防止退出时logout调用resetAllStores报错
  const $reset = () => {

  };
  // 刷新任务数量
  const refreshTaskTodoTotal = async () => {
    try{
      // 获取待办任务
      const taskTodo = await getTaskTodoPage({
        pageNo: 1,
        pageSize: 100,
      });
      if (taskTodo) {
        taskTodoTotal.value = taskTodo.total;
      }
    } catch (error) {
      console.log('待办任务统计失败。')
    }
  };
  // 暴露变量和方法（组件中可访问/调用）
  return {
    taskTodoTotal,
    setTaskTodoTotal,
    refreshTaskTodoTotal,
    $reset
  };
});
