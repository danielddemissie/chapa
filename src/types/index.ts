export interface CustomizationInfo {
  title?: string;
  description?: string;
  logo?: string;
}

export interface InitializeInfo {
  email: string;
  amount: number;
  first_name: string;
  last_name: string;
  tx_ref?: string;
  currency: string;
  return_url?: string;
  callback_url: string;
  subaccounts?: SubAccount[];
}

export interface TransferInfo {
  account_name: string;
  account_number: string;
  amount: number;
  currency: string;
  beneficiary_name: string;
  reference: string;
  bank_code: string;
}
export interface InitializeResponse {
  message: string;
  status: string;
  data?: {
    checkout_url: string;
  };
}
export interface ICreateSubAccount {
  business_name: string;
  account_name: string;
  bank_code: string;
  account_number: string;
  split_type: SplitType;
  split_value: number;
}

export type SplitType = 'flat' | 'percentage';

export interface InitializeOptions {
  autoTx_ref?: boolean;
}

export interface ChapaType {
  chapaKey: string;
  customization: CustomizationInfo;

  generateTxRef: () => string;
  customize: (customizationInfo: CustomizationInfo) => any;
  initialize: (initializeInfo: InitializeInfo, initializeOptions: InitializeOptions) => Promise<InitializeResponse>;
  verify: (tnxRef: string) => any;
  transfer: (transferInfo: TransferInfo) => any;
  getBanks: () => any;
}

export interface SubAccount {
  id: string;
  transaction_charge?: number;
  split_type?: SplitType;
}
