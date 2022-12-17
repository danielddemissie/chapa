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
  tx_ref: string;
  currency: string;
  return_url?: string;
  callback_url: string;
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

type status = 'sucess' | 'failed';

export interface InitializeResponse {
  message: string;
  status: status;
  data?: {
    checkout_url: string;
  };
}

export interface ChapaType {
  chapaKey: string;
  customization: CustomizationInfo;

  customize: (customizationInfo: CustomizationInfo) => any;
  initialize: (initializeInfo: InitializeInfo) => Promise<InitializeResponse>;
  verify: (tnxRef: string) => any;
  transfer: (transferInfo: TransferInfo) => any;
  getBanks: () => any;
}
