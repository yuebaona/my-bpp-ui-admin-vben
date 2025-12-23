<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';

import {Button, Card, Flex, FormItem, message, Select, SelectOption, Space} from "ant-design-vue";
import {confirm} from '@vben/common-ui';
import {
  type FlowOverLimitWorkApi,
  getAcceptancePlanOverOperation,
  acceptancePlanOverRejectProgress,
  startProgressAcceptancePlanOverOperation,
} from "#/api/bpp/flow/acceptance/plan/over/operation";
import {getDictDataPage} from '#/api/bpp/base/dict/data';
import {approveTask, getTaskListByReturn, rejectTask, transferTask,returnTask } from '#/api/bpm/task';
import {getSimpleUserList} from '#/api/system/user';

defineOptions({ name: 'CustomButtonView' });
const emit = defineEmits(['close-form','submit-form']);
/**
 * 参数
 */
const props = defineProps({
  businessKey: {
    type: String,
  },
  // 业务单据ID
  id: {
    type: String,
    default: '1',
  },
  // 流程状态
  status: {
    type: String,
  },
  // 当前任务对象
  todoTask: {
    type: Object,
  },
  // 流程节点信息
  activityNodes: {
    type: Object,
  },
  // 流程实例信息
  processInstance: {
    type: Object,
  },
});
const transferVisible = ref(false);
const buttonLoading = ref(false);
const plannedCheTypeArray = ref([]);
const initplannedMachryTypeArray = ref([]);
const plannedMachryTypeArray = ref([]);
const formRef = ref(null);

// 下一步审批节点
const nextNodeNameArray = ref([
  {
    name: '操作审批',
  },
  {
    name: '技术审批',
  },
  {
    name: '商务审批',
  },
]);
const formData = ref<FlowOverLimitWorkApi.AcceptancePlanOverOperationVO>({
  id: undefined,
  isAllowedStacking: undefined,
  plannedMachryType: undefined,
  acptPlnNo: undefined,
  processInstanceId: undefined,
  auditOpinion: undefined,
  nodeName: undefined,
  acceptancePlanOverOperationOtherProcessReqVOS: [{
    id: undefined,
    containerNo: undefined,
    plannedCheType: undefined,
  }],
});
const transferFormRef = ref(null);
const transferFormData = ref({
  id: undefined,
  auditOpinion: undefined,
});
// 退回节点
const returnList = ref([] as any);
const returnVisible = ref(false);
const returnFormRef = ref(null);
const returnFormData = ref({
  id: undefined,
  returnReason: undefined,
  targetTaskDefinitionKey: undefined,
});

async function getDetailData() {
  // 加载单据数据
  const businessData = await getAcceptancePlanOverOperation(props.businessKey);
  const overFormData = businessData.acceptancePlanOverOperationRespVO;
  formData.value.id = overFormData.id;
  formData.value.isAllowedStacking = overFormData.isAllowedStacking;
  formData.value.plannedMachryType = overFormData.plannedMachryType||'QC';
  formData.value.acptPlnNo = overFormData.acptPlnNo;
  formData.value.processInstanceId = overFormData.processInstanceId;
  formData.value.acceptancePlanOverOperationOtherProcessReqVOS = businessData.acceptancePlanOverOperationContainerRespVOS;
}

// 取消任务，关闭弹窗
function closeTask() {
  emit('close-form');
}
// 提交任务，关闭弹窗
function submitFormCallBack() {
  emit('close-form');
  emit('submit-form');
}
// 审批通过
async function passTask() {
  try {
    buttonLoading.value = true;
    await formRef.value.validate();
    // 修改单据数据
    await startProgressAcceptancePlanOverOperation(formData.value)
    // 流程变量
    let variables = {
      entity: {
        nodeName: formData.value.nodeName,
      },
    };
    // 审批通过数据
    const data = {
      id: props.todoTask?.id,
      reason: formData.value.auditOpinion,
      variables, // 审批通过, 把修改的字段值赋于流程实例变量
      nextAssignees: {}, // 下个自选节点选择的审批人信息
    } as any;
    // 任务审批
    await approveTask(data);
    message.success('审批通过成功');
    setTimeout(() => {
      submitFormCallBack();
    }, 500);
  } catch (e) {
    const res = JSON.stringify(e);
    if (res.indexOf('errorFields') > -1) {
      message.error('有字段未填写。');
    } else {
      message.error('审批失败' + res);
    }
  } finally {
    buttonLoading.value = false;
  }
}

// 拒绝任务，即流程结束
async function noPassTask() {
  if (!formData.value.auditOpinion) {
    message.error('请填写审批意见！');
    return;
  }
  const taskId = props.todoTask?.id;
  if (!taskId) {
    message.error('任务ID不能为空');
    return;
  }
  confirm({
    content: `确定拒绝任务吗？，拒绝后流程直接结束。`,
  }).then(async () => {
    try {
      buttonLoading.value = true;
      // 审批不通过数据
      const data = {
        id: taskId,
        reason: formData.value.auditOpinion,
      };
      await rejectTask(data);
      // 修改单据数据
      await acceptancePlanOverRejectProgress({ id: props.businessKey });
      message.success('拒绝成功,流程已结束！');
      setTimeout(() => {
        submitFormCallBack();
      }, 500);
    } catch (e) {
      message.error('拒绝失败' + JSON.stringify(e));
    } finally {
      buttonLoading.value = false;
    }
  });
}

// 任务退回弹窗
async function openReturnTask() {
  try {
    // 获取退回节点
    returnList.value = await getTaskListByReturn(props.todoTask?.id);
    if (returnList.value.length === 0) {
      message.warning('当前没有可退回的节点');
    } else {
      returnFormData.value.id = props.todoTask?.id;
      returnVisible.value = true;
    }
  } catch (e) {
    returnVisible.value = false;
    message.warning('当前没有可退回的节点!');
  }
}

// 任务退回
async function doReturnTask() {
  await returnFormRef.value.validate();
  try {
    buttonLoading.value = true;
    // 1 提交退回
    const data = {
      id: returnFormData.value.id,
      reason: returnFormData.value.returnReason,
      targetTaskDefinitionKey: returnFormData.value.targetTaskDefinitionKey,
    };
    await returnTask(data);
    message.success('退回成功！');
    buttonLoading.value = false;
    returnVisible.value = false;
    setTimeout(() => {
      submitFormCallBack();
    }, 500);
  } catch (e) {
    message.error(`退回失败 + ${JSON.stringify(e)}`);
  } finally {
    buttonLoading.value = false;
  }
}

// 任务转办弹窗
async function openTransferTask() {
  transferVisible.value = true;
}

// 转办任务
async function doTransferTask() {
  await transferFormRef.value.validate();
  try {
    buttonLoading.value = true;
    const data = {
      id: props.todoTask?.id,
      reason: transferFormData.value.auditOpinion,
      assigneeUserId: transferFormData.value.assigneeUserId,
    };
    await transferTask(data);
    message.success('转办成功！');
    buttonLoading.value = false;
    transferVisible.value = false;
    setTimeout(() => {
      submitFormCallBack();
    }, 500);
  } catch (e) {
    message.error('转办失败' + JSON.stringify(e));
  } finally {
    buttonLoading.value = false;
  }
}

// 表格列配置
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    // 自定义序号生成逻辑
    customRender: ({index}) => index + 1,
    width: 80,
    align: 'center',
  },
  {
    align: 'center',
    title: '箱号',
    dataIndex: 'contNo',
    width: 120,
  },
  {
    title: '作业吊具',
    dataIndex: 'plannedCheType',
    width: 160,
    align: 'center',
  },
]);

function changeRadio(e) {
  const value = e.target.value;
  if (value) {
    // 选择"是"时，过滤出'RMG_QC'选项并设为默认值
    plannedMachryTypeArray.value = initplannedMachryTypeArray.value.filter(x => x.value === 'RMG_QC');
    if (plannedMachryTypeArray.value.length > 0) {
      formData.value.plannedMachryType = plannedMachryTypeArray.value[0].value;
    }
  } else {
    // 选择"否"时，过滤出'QC'选项并设为默认值
    plannedMachryTypeArray.value = initplannedMachryTypeArray.value.filter(x => x.value === 'QC');
    if (plannedMachryTypeArray.value.length > 0) {
      formData.value.plannedMachryType = plannedMachryTypeArray.value[0].value;
    }
  }
}

async function getDictData(dictType: string) {
  const dictData = await getDictDataPage({dictType: dictType});
  return dictData.list;
}
const formRules = ref({
  isAllowedStacking: { required: true, message: '请输入箱子是否需要落堆' },
  plannedMachryType: { required: true, message: '请输入机械类型' },
  auditOpinion: { required: true, message: '请输入审批意见' },
  // 吊具类型校验规则
  plannedCheTypeRules: [
    {
      required: true,
      message: '请选择吊具类型',
    },
  ],
});

// 初始化字典数据
async function initDictData() {
  const dictData = await getDictData('spreader_type');
  plannedCheTypeArray.value = dictData;
  const mechanical = await getDictData('mechanical_type');
  initplannedMachryTypeArray.value = mechanical;
  plannedMachryTypeArray.value = mechanical;
  if(!formData.isAllowedStacking){
    plannedMachryTypeArray.value = initplannedMachryTypeArray.value.filter(x => x.value === 'QC')
  }
}

/** 初始化用户数据 */
const userList = ref([]);

async function getUserList() {
  const userDataList = await getSimpleUserList();
  userList.value = userDataList.map(x => {
    return {
      label: x.nickname,
      value: x.id,
    }
  });
}
/**
 * 判断是否技术审批节点
 */
function checkJiShu() {
  const taskDefinitionKey = props.todoTask?.taskDefinitionKey;
  if (
    '技术审批>Activity__421452375161762843694786'.includes(taskDefinitionKey) ||
    '技术审批>Activity__748830456241762844475732'.includes(taskDefinitionKey)
  ) {
    return false;
  }
  return true;
}
onMounted(async () => {
  await getUserList();
  await initDictData();
  await getDetailData();
});
</script>

<template>
  <Card>
    <a-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
    >
      <a-form-item label="下一步审批节点" name="nodeName" v-if="checkJiShu()">
        <a-select
          v-model:value="formData.nodeName"
          allow-clear
          placeholder="请选择下一步审批节点"
        >
          <a-select-option :value="item.name" v-for="item in nextNodeNameArray" :key="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 箱子是否需要落堆（单选） -->
      <a-form-item label="箱子是否需要落堆" name="isAllowedStacking">
        <a-radio-group v-model:value="formData.isAllowedStacking" @change="changeRadio">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 机械类型（下拉） -->
      <a-form-item label="机械类型" name="plannedMachineryType">
        <a-select
          v-model:value="formData.plannedMachineryType"
          allow-clear
          placeholder="请选择机械类型"
        >
          <a-select-option :value="item.value" v-for="item in plannedMachryTypeArray"
      <a-form-item label="机械类型" name="plannedMachryType">
          v-model:value="formData.plannedMachryType"
          <a-select-option :value="item.value" v-for="item in plannedMachryTypeArray"
                           :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 作业吊具（动态表格） -->
      <a-form-item label="作业吊具"
      >
        <div class="table-container">
          <a-table
            :columns="columns"
            :data-source="formData.acceptancePlanOverOperationOtherProcessReqVOS"
            bordered
            :pagination="false"
            :scroll="{ x: 'auto' }"
            :row-key="(record) => record.index"
          >
            <!-- 作业吊具列：下拉选择器 -->
            <template #bodyCell="{ column, record,index }">
              <template v-if="column.dataIndex === 'plannedCheType'">
                <a-form-item
                  :name="['acceptancePlanOverOperationOtherProcessReqVOS', index, 'plannedCheType']"
                  :rules="formRules.plannedCheTypeRules"
                >
                  <a-select
                    v-model:value="record.plannedCheType"
                    style="width: 180px"
                    allow-clear
                  >
                    <a-select-option :value="item.value" v-for="item in plannedCheTypeArray"
                                     :key="item.value">{{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </template>
            </template>
          </a-table>
        </div>
      </a-form-item>

      <!-- 审核意见（文本域） -->
      <a-form-item label="审核意见" name="auditOpinion">
        <a-textarea
          v-model:value="formData.auditOpinion"
          placeholder="请输入审核意见"
          rows="4"
        />
      </a-form-item>
      <a-form-item>
        <Flex justify="end">
          <Space>
            <Button @click="closeTask()">取消</Button>
            <Button type="primary" @click="passTask" :loading="buttonLoading">通过</Button>
            <!--退回-->
            <a-popover v-model:open="returnVisible" title="退回" trigger="manual">
              <template #content>
                <a-card style="width: 500px; height: 250px">
                  <a-form
                    ref="returnFormRef"
                    :model="returnFormData"
                  >
                    <a-form-item label="退回节点" name="targetTaskDefinitionKey"
                                 :rules="[{ required: true, message: '请选择退回节点' }]"
                    >
                      <Select
                        v-model:value="returnFormData.targetTaskDefinitionKey"
                        :allow-clear="true"
                        style="width: 100%"
                      >
                        <SelectOption
                          v-for="item in returnList"
                          :key="item.taskDefinitionKey"
                          :label="item.name"
                          :value="item.taskDefinitionKey"
                        >
                          {{ item.name }}
                        </SelectOption>
                      </Select>
                    </a-form-item>
                    <a-form-item label="退回理由" name="returnReason"
                                 :rules="[{ required: true, message: '请输入退回理由' }]"
                    >
                      <a-textarea
                        v-model:value="returnFormData.returnReason"
                        placeholder="请输入退回理由"
                        rows="4"
                      />
                    </a-form-item>
                    <a-form-item>
                      <Flex justify="center">
                        <Space>
                          <Button
                            @click="()=>{
                                  returnVisible = false;
                                  returnFormData.id = undefined;
                                  returnFormData.returnReason = undefined;
                                  returnFormData.targetTaskDefinitionKey = undefined;
                                }"
                            :loading="buttonLoading">取消</Button>
                          <Button type="primary" @click="doReturnTask" :loading="buttonLoading">确定</Button>
                        </Space>
                      </Flex>
                    </a-form-item>
                  </a-form>
                </a-card>
              </template>
<!--              <Button style="background-color:#ff9900;color: #ffffff" @click.prevent="openReturnTask" :loading="buttonLoading">退回</Button>-->
            </a-popover>
            <Button type="primary" danger @click="noPassTask" :loading="buttonLoading">拒绝</Button>
            <!--转办-->
            <a-popover v-model:open="transferVisible" title="转办" trigger="click">
              <template #content>
                <a-card style="width: 500px;height: 246px">
                  <a-form
                    ref="transferFormRef"
                    :model="transferFormData"
                  >
                    <a-form-item label="转办给" name="assigneeUserId"
                                 :rules="[
                                   { required: true, message: '请选择转办用户' }
                                 ]"
                    >
                      <a-select
                        v-model:value="transferFormData.assigneeUserId"
                        style="width: 100%"
                        placeholder="请选择用户"
                        :options="userList"
                      ></a-select>
                    </a-form-item>
                    <a-form-item label="审核意见" name="auditOpinion"
                                 :rules="[
                                   { required: true, message: '请输入审核意见' }
                                 ]"
                    >
                      <a-textarea
                        v-model:value="transferFormData.auditOpinion"
                        placeholder="请输入审核意见"
                        rows="4"
                      />
                    </a-form-item>
                    <a-form-item>
                      <Flex justify="center">
                        <Space>
                          <Button @click="()=>{
                                transferVisible=false;
                                transferFormData.assigneeUserId=undefined;
                                transferFormData.auditOpinion=null;
                                }"
                                  :loading="buttonLoading">取消
                          </Button>
                          <Button type="primary" @click="doTransferTask" :loading="buttonLoading">
                            确定
                          </Button>
                        </Space>
                      </Flex>
                    </a-form-item>
                  </a-form>
                </a-card>
              </template>
              <Button type="primary" color="pink" @click="openTransferTask"
                      :loading="buttonLoading">转办
              </Button>
            </a-popover>
          </Space>
        </Flex>
      </a-form-item>
    </a-form>
  </Card>
</template>
