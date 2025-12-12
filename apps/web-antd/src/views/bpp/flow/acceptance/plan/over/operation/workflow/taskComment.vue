<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Card, Flex, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getTaskListByProcessInstanceId } from '#/api/bpm/task';

defineOptions({ name: 'TaskComment' });
/**
 * 参数
 */
const props = defineProps({
  businessKey: {
    type: String,
  },
  // 是否显示申请人意见
  isShowApply: {
    type: Boolean,
    default: true,
  },
  // 流程状态
  status: String,
  // 当前任务对象
  todoTask: Object,
  processInstance: Object, //  流程实例信息
  processInstanceId: String, //  流程实例ID
  acceptancePlanOverOperationData: Object, //  单据对象
  acceptancePlanData: Object, //  单据对象
  containerDataArray: Object //  单据对象
});
// 审批意见数据
const taskCommentData = ref(null);
const taskCommentDataList = ref([]);


async function getDetailData() {
  const taskCommentDataArray = await getTaskListByProcessInstanceId(props.processInstanceId);
  taskCommentDataList.value = mergeByName(taskCommentDataArray);
  taskCommentData.value = taskCommentDataArray[0];
}

// 获取计划机械类型
function getPlannedMachineryType(plannedMachineryType: string) {
  if (plannedMachineryType == 'RMG_QC') {
    return '场桥+岸桥';
  } else if (plannedMachineryType == 'QC') {
    return '场桥';
  } else {
    return plannedMachineryType;
  }
}

function getIsAllowedStacking(isAllowedStacking: boolean) {
  if (isAllowedStacking) {
    return '是';
  } else {
    return '否';
  }
}

/**
 * const a = [
 * {id:1,name:'11'},
 * {id:2,taskDefinitionKey:'xx',assigneeUser:{
 *   id: 2
 *   nickname: '李四'
 * }},
 * {id:3,taskDefinitionKey:'xx',assigneeUser:{
 *    id: 1
 *    nickname: '张三'
 * }}
 * ]
 * 根据 taskDefinitionKey 合并数据，将assigneeUser.nickname用逗号拼接，并生成新属性 assigneeUserName，
 * 结果就是：const a = [
 * {id:1,name:'11'},
 * {id:2,taskDefinitionKey:'xx',assigneeUserName: '李四,张三'},
 * 按 name 合并数组对象，拼接指定字段（默认name），其他属性任取一条
 * @param {Array} arr - 原始数组
 */
function mergeByName(arr) {
  const resultMap = new Map();
  const noKeyResults = [];
  for (const item of arr) {
    const taskKey = item.taskDefinitionKey;
    // 跳过没有 taskDefinitionKey 的项目
    if (taskKey === undefined || taskKey === null || taskKey === '') {
      noKeyResults.push(item);
      continue;
    }
    const existing = resultMap.get(taskKey);
    if (existing) {
      // 合并 assigneeUserName
      const nickname = item.assigneeUser?.nickname;
      if (nickname) {
        const currentNames = existing.assigneeUserName || '';
        if (currentNames) {
          // 高效去重
          if (!currentNames.includes(nickname)) {
            existing.assigneeUserName = `${currentNames},${nickname}`;
          }
        } else {
          existing.assigneeUserName = nickname;
        }
      }
    } else {
      // 创建新对象
      const newItem = {};
      // 复制所有属性（除了 assigneeUser）
      Object.keys(item).forEach(key => {
        if (key !== 'assigneeUser') {
          newItem[key] = item[key];
        }
      });
      // 提取 assigneeUserName
      if (item.assigneeUser && item.assigneeUser.nickname) {
        newItem.assigneeUserName = item.assigneeUser.nickname;
      }
      resultMap.set(taskKey, newItem);
    }
  }
  // 合并结果
  const result = [];
  for (const value of resultMap.values()) {
    result.push(value);
  }
  return result.concat(noKeyResults);
}

onMounted(async () => {
  await getDetailData();
});
</script>
<!--审批意见组件-->
<template>
  <div style="font-size: 16px;font-weight: 600;padding-top: 15px;padding-bottom: 15px">
    审批记录
  </div>

  <Card v-if="isShowApply">
    <table class="handler-info-table">
      <tbody>
      <!-- 经办人备注行 -->
      <tr>
        <td class="handler-label-cell">经办人备注</td>
        <td class="handler-content-cell">{{ acceptancePlanData?.handlerRemark }}</td>
      </tr>
      <!-- 经办人确认行：内容+右侧信息 -->
      <tr>
        <td class="handler-label-cell">经办人确认</td>
        <td class="handler-content-cell">
          <p style="width:100%">{{ acceptancePlanData?.handlerConfirmation }}</p>
          <p class="handler-right-info" style="padding-left: 20px;padding-top:20px">
            经办人：{{ acceptancePlanData?.handlingPerson }}　
            时间：{{ dayjs(acceptancePlanData?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </td>
      </tr>
      </tbody>
    </table>
  </Card>
  <Card v-if="!isShowApply">
    <table class="handler-info-table">
      <tbody>
      <!-- 经办人备注行 -->
      <tr>
        <td class="handler-label-cell">经办人备注</td>
        <td class="handler-content-cell">{{ acceptancePlanOverOperationData?.handlerRemark }}</td>
      </tr>
      <!-- 经办人确认行：内容+右侧信息 -->
      <tr>
        <td class="handler-label-cell">经办人确认</td>
        <td class="handler-content-cell">
          <p style="width:100%">{{ acceptancePlanOverOperationData?.handlerConfirmation }}</p>
          <p class="handler-right-info" style="padding-left: 20px;padding-top:20px">
            经办人：{{ acceptancePlanOverOperationData?.handlingPerson }}　
            时间：{{
              dayjs(acceptancePlanOverOperationData?.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}
          </p>
        </td>
      </tr>
      </tbody>
    </table>
    <table class="audit-table" v-for="taskCommentData in taskCommentDataList">
      <tbody>
      <tr>
        <!-- 合并3行的环节列 -->
        <td class="section-cell" rowspan="3">{{ taskCommentData?.name }}</td>
        <td class="label-cell">审核结果</td>
        <td>
          <Tag color="processing" v-if="taskCommentData?.status==4">已取消</Tag>
          <Tag color="processing" v-if="taskCommentData?.status==3">审批不通过</Tag>
          <Tag color="success" v-if="taskCommentData?.status==2">同意</Tag>
          <Tag color="default" v-else-if="taskCommentData?.status==1">待审批</Tag>
          <Tag color="processing" v-else>审批中</Tag>
        </td>
      </tr>
      <tr>
        <td class="label-cell">审核意见</td>
        <td>{{ taskCommentData?.reason }}</td>
      </tr>
      <tr>
        <td class="label-cell" colspan="2">
          <span style="padding-right: 40px">
            审核人：{{ taskCommentData?.assigneeUserName }}
          </span>
          <span>
            时间：{{ dayjs(taskCommentData?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>
    <table class="handler-info-table">
      <tbody>
      <!-- 经办人备注行 -->
      <tr>
        <td class="handler-label-cell">箱子是否需要落堆</td>
        <td class="handler-content-cell" colspan="2">
          {{ getIsAllowedStacking(acceptancePlanOverOperationData?.isAllowedStacking) }}
        </td>
      </tr>
      <!-- 经办人确认行：内容+右侧信息 -->
      <tr>
        <td class="handler-label-cell" rowspan="2">变更道具相关</td>
        <td class="label-cell">
          机械类型
        </td>
        <td class="handler-content-cell">
          <p style="width:100%">
            {{ getPlannedMachineryType(acceptancePlanOverOperationData?.plannedMachineryType) }}</p>
        </td>
      </tr>
      <tr>
        <td class="label-cell">
          作业吊具
        </td>
        <td>
          <Flex>
            <Card v-for="item in containerDataArray" :key="item.containerNo"
                  style="width: 200px;margin-right: 5px">
              <p>箱号：{{ item.containerNo }}</p>
              <p>吊具类型：{{ item.plannedSpreaderType }}</p>
            </Card>
          </Flex>
        </td>
      </tr>
      </tbody>
    </table>
  </Card>
</template>
<style scoped>
/* 表格基础样式 */
.handler-info-table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  font-size: 14px;
  color: #333;
  font-family: "Microsoft YaHei", sans-serif;
}

/* 单元格样式：边框、内边距、垂直居中 */
.handler-info-table td {
  border: 1px solid #e6e6e6;
  padding: 12px;
  vertical-align: middle;
}

/* 左侧标签列：固定宽度、浅背景、右对齐 */
.handler-label-cell {
  width: 150px;
  background-color: #f5f7fa;
  text-align: right;
  font-weight: 500;
}

/* 右侧内容列：自适应宽度、左对齐 */
.handler-content-cell {
  text-align: left;
}

/* 内容列右侧信息（经办人/时间）：右对齐 */
.handler-right-info {
  text-align: right;
  color: #666;
}

/* 表格基础样式 */
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
  vertical-align: middle; /* 强制垂直居中 */
}

/* 左侧环节列：浅背景、居中、固定宽度 */
.section-cell {
  width: 150px;
  background-color: #f5f7fa;
  text-align: right;
  font-weight: 500;
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
