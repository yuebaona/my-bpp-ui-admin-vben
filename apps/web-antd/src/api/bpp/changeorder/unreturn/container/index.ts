// import type { PageParam, PageResult } from '@vben/request';
//
// import { requestClient } from '#/api/request';

export namespace UnreturnedContApi {
  export interface PlanInfoVO {
    person: string;
    phone: string;
    company: string;
    agentCompany: string;
    remark: string;
  }

  export interface PayInfoVO {
    payer: string;
    payType: string;
    title: string;
  }

  export interface AcceptancePlanVO {
    id: number;
    acptPlnNo: string;
    transportOrderNo: string;
    businessType: string;
    contNo: string;
    orderStatus: string;
    vslName: string;
    vslVoy: string;
    dischargePort: string;
    destinationPort: string;
    tradeType: string;
    holderCode: string;
    contSize: string;
    contType: string;
    contHeight: string;
    contIso: string;
    contEmptyFlag: boolean;
    flowCategory: string;
    returnTerminal: string;
    imdgCode: string;
    unNo: string;
    isRefrigerated: boolean;
    refrigerationTemp: number;
    ventilationPort: string;
    sealNo: string;
    contWeightKg: number;
    contGrade: number;
    isDamaged: boolean;
    damageGrade: string;
    isOog: boolean;
    oogFront: number;
    oogBack: number;
    oogLeft: number;
    oogRight: number;
    oogHeight: number;
    isDirectLoadPick: boolean;
    isPtiValid: boolean;
    ptiExpiryDate: string;
    relatedBillNo: string;
    relatedToNo: string;
    payerCode: string;
    paymentType: string;
    invoiceTitle: string;
    oldContNo: string;
    remark: string;
    transportOrderCategory: string;
    effectiveStartTime: string;
    effectiveEndTime: string;
    appointmentStartTime: string;
    appointmentEndTime: string;
    appointmentVehicle: string;
    originalAcptPlnNo: string;
    deleted: boolean;
    billMessageSaveReqVOList: BillMassageVO;
    contInfoBundledSaveReqVOList: ContBundleVO;
  }

  export interface BillMassageVO {
    billMessageId: boolean;
    billNo: string;
    cargoType: string;
    cargoName: string;
    cargoCount: number;
    deleted: boolean;
    acptPlnNo: string;
    midTransportBillId: number;
    transportOrderNo: string;
    billType: string;
    orderStatus: string;
  }

  export interface ContBundleVO {
    id: number;
    acptPlnNo: string;
    childContNo: string;
    parentContNo: string;
    contSize: string;
    contType: string;
    contHeight: string;
    contIso: string;
    transportOrderNo: string;
    orderStatus: string;
    deleted: boolean;
  }

  export interface UnreturnedContVO {
    transportOrderSaveReqVOList: AcceptancePlanVO;
  }
}
