<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { Button, Card, Descriptions, Flex, message, Space,ImagePreviewGroup,Image } from 'ant-design-vue';
import { useAuthStore } from "#/store";
import {
  getMachineSpreaderRecord,
  machineSpreaderRecordUpdateProcess,
} from "#/api/bpp/flow/acceptance/plan/over/operation";
import { approveTask, rejectTask, transferTask } from "#/api/bpm/task";
import { getSimpleUserList } from "#/api/system/user";
import { confirm } from '@vben/common-ui';
import dayjs from "dayjs";
import {router} from "#/router";
import { useGlobalTaskStore } from '#/store/globalTaskStore';

const emit = defineEmits(['close-form']);
const authStore = useAuthStore();
/**
 * 参数
 */
const props = defineProps({
  formPagePath: {
    type: String,
  },
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
    type: Number,
  },
  // 当前任务对象
  todoTask: {
    type: Object,
  },
  // 流程节点信息
  activityNodes: {
    type: Object,
  },
  containerDataArray: {
    type: Object,
  },
  // 流程实例信息
  processInstance: {
    type: Object,
  },
});
const transferVisible = ref(false);
const buttonLoading = ref(false);
const formRef = ref(null);
const machineSpreaderRecord = ref(null);
const transferFormRef = ref(null);
const transferFormData = ref({
  assigneeUserId: undefined,
  auditOpinion: undefined,
});
// 超限受理集装箱表信息
const containerFormData = ref({
  auditOpinion: undefined,
  containerFormDataArray: [{
    id: undefined,
    acceptancePlanNo: undefined,
    containerNo: undefined,
    isSystemRate: undefined,
    quotePrice: undefined,
  }]
});
// 获取待办任务,刷新菜单
async function reGetTaskTodoPage(){
  const globalTaskStore = useGlobalTaskStore();
  globalTaskStore.refreshTaskTodoTotal();
}

// 关闭窗口
async function closeTask() {
  await reGetTaskTodoPage();
  // 返回待办列表
  router.push({
    path: props.formPagePath,
  });
}

function cancelTask() {
  closeTask();
}

// 审批通过
async function passTask() {
  const taskId = props.todoTask?.id;
  if (!taskId) {
    message.error('任务ID不能为空');
    return;
  }
  try {
    buttonLoading.value = true;
    await formRef.value.validate();
    // 修改单据数据
    const machineSpreaderRecordData = containerFormData.value.containerFormDataArray[0];
    await machineSpreaderRecordUpdateProcess(machineSpreaderRecordData)
    //流程变量
    let variables = {
      entity: machineSpreaderRecord.value,
    }
    // 审批通过数据
    const data = {
      id: props.todoTask?.id,
      reason: containerFormData.value.auditOpinion,
      variables, // 审批通过, 把修改的字段值赋于流程实例变量
      nextAssignees: {}, // 下个自选节点选择的审批人信息
    } as any;
    //任务审批
    await approveTask(data);
    message.success('审批通过成功');
    await authStore.fetchUserInfo();
    setTimeout(() => {
      closeTask();
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

// 拒绝
function noPassTask() {
  if (!containerFormData.value.auditOpinion) {
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
        reason: containerFormData.value.auditOpinion,
      };
      await rejectTask(data);
      message.success('拒绝成功,流程已结束！');
      setTimeout(() => {
        closeTask();
      }, 500);
    } catch (e) {
      message.error('拒绝失败' + JSON.stringify(e));
    } finally {
      buttonLoading.value = false;
    }
  });
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
      closeTask();
    }, 500);
  } catch (e) {
    message.error('转办失败' + JSON.stringify(e));
  } finally {
    buttonLoading.value = false;
  }
}

// 表格列配置（合并表头）
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    // 自定义序号生成逻辑
    customRender: ({index}) => index + 1,
    width: 60,
    align: 'center',
  },
  {
    title: '箱号',
    dataIndex: 'containerNo',
    width: 120,
    align: 'center',
  },
  {
    title: '是否使用系统费率',
    dataIndex: 'isSystemRate',
    width: 160,
    align: 'center',
  },
  {
    title: '报价金额（人民币）',
    dataIndex: 'quotePrice',
    width: 180,
    align: 'center',
  },
]);
watch(() => props.businessKey, async () => {
    machineSpreaderRecord.value = await getMachineSpreaderRecord(props.businessKey)
    containerFormData.value.containerFormDataArray = [
      {
        id: machineSpreaderRecord.value.id,
        acceptancePlanNo: machineSpreaderRecord.value.acceptancePlanNo,
        containerNo: machineSpreaderRecord.value.containerNo,
        isSystemRate: machineSpreaderRecord.value.isSystemRate,
        quotePrice: machineSpreaderRecord.value.quotePrice,
      }
    ];
}, {immediate: true, deep: true})
/** 初始化用户数据 */
const userList = ref([]);

async function getUserList() {
  const userDataList = await getSimpleUserList();
  userList.value = userDataList.map(x => {
    return {
      label: x.nickname,
      value: x.id
    }
  })
}

onMounted(async () => {
  await getUserList();
});
</script>

<template>
  <Card title="作业变更申请单">
    <!-- 基础信息模块 - 固定两列布局 -->
    <a-divider orientation="left">基础信息</a-divider>
    <Descriptions layout="horizontal" :column="2" bordered
                  :labelStyle="{textAlign: 'right',width: '200px',backgroundColor: 'RGB(246, 247, 249)'}">
      <Descriptions.Item label="申请时间">
        {{ dayjs(machineSpreaderRecord?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </Descriptions.Item>
      <Descriptions.Item label="经办人">{{ machineSpreaderRecord?.creatorName }}</Descriptions.Item>
      <Descriptions.Item label="现场作业类别">{{ machineSpreaderRecord?.machineSpreaderChangeType }}</Descriptions.Item>
      <Descriptions.Item label="驱动源">{{ machineSpreaderRecord?.operationSource }}</Descriptions.Item>
      <Descriptions.Item label="变更原因">{{ machineSpreaderRecord?.changeReason }}</Descriptions.Item>
      <Descriptions.Item label="现场图片">
        <Flex>
          <ImagePreviewGroup>
            <Image
              v-for="(item,index) in machineSpreaderRecord?.operationFile?JSON.parse(machineSpreaderRecord?.operationFile):[]"
                   :width="80"
                   :height="80"
                   :key="item"3
                   :src="item" />
          </ImagePreviewGroup>
        </Flex>
      </Descriptions.Item>
      <Descriptions.Item label="作业船名">{{ machineSpreaderRecord?.vesselName }}</Descriptions.Item>
      <Descriptions.Item label="作业航次">{{ machineSpreaderRecord?.vesselVoyage }}</Descriptions.Item>
      <Descriptions.Item label="箱号">{{ machineSpreaderRecord?.containerNo }}</Descriptions.Item>
      <Descriptions.Item label="作业位置">{{ machineSpreaderRecord?.operationPosition }}</Descriptions.Item>
      <Descriptions.Item label="作业机械号">{{ machineSpreaderRecord?.machineNo }}</Descriptions.Item>
      <Descriptions.Item label="实际吊具类型">{{ machineSpreaderRecord?.spreaderType }}</Descriptions.Item>
      <Descriptions.Item label="更换吊具开始时间">
        {{ dayjs(machineSpreaderRecord?.startTime).format('YYYY-MM-DD HH:mm:ss') }}
      </Descriptions.Item>
      <Descriptions.Item label="更换吊具结束时间">
        {{ dayjs(machineSpreaderRecord?.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </Descriptions.Item>
      <Descriptions.Item label="换回原吊具开始时间">
        {{ dayjs(machineSpreaderRecord?.startTimeBack).format('YYYY-MM-DD HH:mm:ss') }}
      </Descriptions.Item>
      <Descriptions.Item label="换回原吊具结束时间">
        {{ dayjs(machineSpreaderRecord?.endTimeBack).format('YYYY-MM-DD HH:mm:ss') }}
      </Descriptions.Item>
      <Descriptions.Item label="备注" :span="2">
        {{ machineSpreaderRecord?.remark }}
      </Descriptions.Item>
    </Descriptions>
    <!-- 商务报价模块 -->
    <a-divider orientation="left">商务报价</a-divider>
    <Card>
      <div class="form-container">
        <a-form
          ref="formRef"
          :model="containerFormData"
        >
          <a-form-item>
            <!-- 表格（含合并表头） -->
            <a-table
              :columns="columns"
              :data-source="containerFormData.containerFormDataArray"
              bordered
              :pagination="false"
              :scroll="{ x: 'auto' }"
              :row-key="(record) => record.index"
              style="border-collapse: collapse;"
            >
              <!-- 自定义单元格内容 -->
              <template #bodyCell="{ column, record,index }">
                <!-- 是否使用系统费率 -->
                <template v-if="column.dataIndex === 'isSystemRate'">
                  <a-form-item
                    :name="['containerFormDataArray', index, 'isSystemRate']"
                    :rules="[{required: true,message: '请填写是否使用系统费率', trigger: 'change'}]"
                  >
                    <a-radio-group v-model:value="record.isSystemRate">
                      <a-radio :value="true">是</a-radio>
                      <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </template>
                <!-- 报价金额 -->
                <template v-if="column.dataIndex === 'quotePrice'">
                  <a-form-item
                    :name="['containerFormDataArray', index, 'quotePrice']"
                    :rules="[{required: true,message: '请填写报价金额', trigger: 'change'}]"
                  >
                    <a-input v-model:value="record.quotePrice" style="width: 230px;"
                             placeholder="请输入"/>
                    <span style="margin-left: 4px;">元</span>
                  </a-form-item>
                </template>
              </template>
            </a-table>
          </a-form-item>
          <a-form-item label="审批意见" name="auditOpinion"
                       :rules="[{required: true,message: '请填写审批意见', trigger: 'change'}]"
          >
            <a-textarea
              v-model:value="containerFormData.auditOpinion"
              placeholder="请输入审批意见"
              style="flex: 1; resize: none;"
              :rows="3"
            />
          </a-form-item>
        </a-form>
      </div>
    </Card>
    <Flex justify="end" style="margin-top: 10px;">
      <Space>
        <Button @click="cancelTask">取消</Button>
        <Button type="primary" @click="passTask" :loading="buttonLoading">通过</Button>
        <Button
          type="primary"
          danger
          @click="noPassTask"
          :loading="buttonLoading"
        >拒绝
        </Button>
        <a-popover v-model:open="transferVisible" title="转办" trigger="click">
          <template #content>
            <a-card style="width: 500px; height: 246px">
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
                    clearable
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
                    :rows="4"
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
                      <Button type="primary" @click="doTransferTask" :loading="buttonLoading">确定
                      </Button>
                    </Space>
                  </Flex>
                </a-form-item>
              </a-form>
            </a-card>
          </template>
          <Button type="primary" color="pink" @click="openTransferTask" :loading="buttonLoading">
            转办
          </Button>
        </a-popover>
      </Space>
    </Flex>
  </Card>
</template>
