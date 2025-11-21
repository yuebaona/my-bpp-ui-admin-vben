<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {Card} from 'ant-design-vue';
import dayjs, { type Dayjs } from 'dayjs';
import {getTaskListByProcessInstanceId} from '#/api/bpm/task';

defineOptions({name: 'TaskComment'});
/**
 * 参数
 */
const props = defineProps({
  businessKey: {
    type: Number,
    default: 1,
  },
  //是否显示申请人意见
  isShowApply: {
    type: Boolean,
    default: true,
  },
  //流程状态
  status: String,
  //当前任务对象
  todoTask: Object,
  processInstance: Object, // 流程实例信息
  processInstanceId: String // 流程实例ID
});
const datailLoading = ref(false);
//审批意见数据
const taskCommentData = ref(null);
const taskCommentDataList = ref([]);

const {query} = useRoute();
const queryId = computed(() => query.id as string);

async function getDetailData() {
  const taskCommentDataArray = await getTaskListByProcessInstanceId(props.processInstanceId);
  taskCommentDataList.value = taskCommentDataArray;
  taskCommentData.value = taskCommentDataArray[0];
}

onMounted(async () => {
  await getDetailData();
});
</script>
<!--审批意见组件-->
<template>
  <Card title="经办人确认信息" if="isShowApply">
    <div class="approval-table">
      <!-- 经办人备注行 -->
      <div class="table-row">
        <div class="table-cell cell-section">经办人备注</div>
        <div class="table-cell" style="width:100%">

        </div>
      </div>
      <!-- 经办人确认行 -->
      <div class="table-row">
        <div class="table-cell cell-section">经办人确认</div>
        <div class="table-cell" style="width:100%">
          <p style="width:100%">{{taskCommentData?.reason}}</p>
          <p style="float: right">经办人：{{taskCommentData?.assigneeUser.nickname}}　时间：{{dayjs(taskCommentData?.createTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
        </div>
      </div>
    </div>
    <div class="audit-table" v-for="taskCommentData in taskCommentDataList">
      <!-- 第1行：审核结果 -->
      <div class="table-row">
        <div class="table-cell cell-section">{{taskCommentData?.name}}</div>
        <div class="table-cell cell-label">审核结果</div>
        <div class="table-cell cell-content"><span class="agree-tag">{{taskCommentData?.status==1 ? '同意' : '审核中'}}</span></div>
      </div>
      <!-- 第2行：审核意见 -->
      <div class="table-row">
        <div class="table-cell cell-label">审核意见</div>
        <div class="table-cell cell-content">{{taskCommentData?.reason}}</div>
      </div>
      <!-- 第3行：审核人/时间 -->
      <div class="table-row">
        <div class="table-cell cell-label">审核人：</div>
        <div class="table-cell cell-content">{{taskCommentData?.assigneeUser.nickname}}</div>
        <div class="table-cell cell-label">时间：</div>
        <div class="table-cell cell-content">{{dayjs(taskCommentData?.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </div>
  </Card>
  <table class="audit-table" v-for="taskCommentData in taskCommentDataList">
    <tbody>
        <tr>
          <!-- 合并3行的环节列 -->
          <td class="section-cell" rowspan="3">{{taskCommentData?.name}}</td>
          <td class="label-cell">审核结果</td>
          <td><span class="agree-tag">{{askCommentData?.status}}xx{{taskCommentData?.status==1 ? '同意' : '审核中'}}</span></td>
        </tr>
        <tr>
          <td class="label-cell">审核意见</td>
          <td>{{taskCommentData?.reason}}</td>
        </tr>
        <tr>
          <td class="label-cell" colspan="2"><span style="padding-right: 40px">审核人：{{taskCommentData?.assigneeUser.nickname}}</span><span>时间：{{dayjs(taskCommentData?.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span></td>
        </tr>
    </tbody>
  </table>
</template>
<style scoped>
.audit-table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  font-size: 14px;
  color: #333;
  font-family: "Microsoft YaHei", sans-serif;
}

/* 单元格基础样式：边框、内边距、垂直居中 */
.audit-table td {
  border: 1px solid #e6e6e6;
  padding: 12px;
  text-align: left;
  vertical-align: middle; /* 强制垂直居中 */
}

/* 左侧环节列：浅背景、居中、固定宽度 */
.section-cell {
  width: 120px;
  background-color: #f5f7fa;
  font-weight: 500;
  text-align: right
}

/* 项目列：右对齐、浅灰色 */
.label-cell {
  width: 90px;
  color: #666;
  text-align: right;
}

/* 同意标签：还原原图样式 */
.agree-tag {
  display: inline-block;
  padding: 3px 10px;
  background-color: #52c41a;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #4cae4c;
}
</style>
