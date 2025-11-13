/** 字典类型枚举 - 按模块分组和排序 */
enum DICT_TYPE {
  // ========== BPM 模块 ==========
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',

  BPM_MODEL_TYPE = 'bpm_model_type',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_LISTENER_TYPE = 'bpm_process_listener_type',
  BPM_PROCESS_LISTENER_VALUE_TYPE = 'bpm_process_listener_value_type',
  BPM_TASK_CANDIDATE_STRATEGY = 'bpm_task_candidate_strategy',
  BPM_TASK_STATUS = 'bpm_task_status',
  BROKERAGE_BANK_NAME = 'brokerage_bank_name', // 佣金提现银行
  BROKERAGE_BIND_MODE = 'brokerage_bind_mode', // 分销关系绑定模式

  BROKERAGE_ENABLED_CONDITION = 'brokerage_enabled_condition', // 分佣模式
  BROKERAGE_RECORD_BIZ_TYPE = 'brokerage_record_biz_type', // 佣金业务类型
  BROKERAGE_RECORD_STATUS = 'brokerage_record_status', // 佣金状态
  BROKERAGE_WITHDRAW_STATUS = 'brokerage_withdraw_status', // 佣金提现状态
  BROKERAGE_WITHDRAW_TYPE = 'brokerage_withdraw_type', // 佣金提现类型
  COMMON_STATUS = 'common_status',

  // ========== INFRA 模块 ==========
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',

  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',

  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CONFIG_TYPE = 'infra_config_type',

  INFRA_FILE_STORAGE = 'infra_file_storage',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',

  INFRA_JOB_STATUS = 'infra_job_status',

  INFRA_OPERATE_TYPE = 'infra_operate_type',

  // ========== Member 会员模块 ==========
  MEMBER_EXPERIENCE_BIZ_TYPE = 'member_experience_biz_type', // 会员经验业务类型
  MEMBER_POINT_BIZ_TYPE = 'member_point_biz_type', // 积分的业务类型

  // ========== SYSTEM 模块 ==========
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',

  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SOCIAL_TYPE = 'system_social_type',

  SYSTEM_USER_SEX = 'system_user_sex',
  TERMINAL = 'terminal', // 终端

  USER_TYPE = 'user_type',
}

export { DICT_TYPE };
