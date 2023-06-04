import axios from 'axios';
import {
  ChapaType,
  CustomizationInfo,
  InitializeInfo,
  InitializeResponse,
  TransferInfo,
  ICreateSubAccount,
  InitializeOptions,
} from './types';
import { v4 as uuid } from 'uuid';

const chapaUrl = 'https://api.chapa.co/v1';

const Axios = axios.create({
  baseURL: chapaUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

class Chapa implements ChapaType {
  readonly chapaKey;
  customization = {};

  constructor(chapaKey: string) {
    this.chapaKey = chapaKey;
  }

  /**
   *
   * @param customizationInfo
   */
  customize(customizationInfo: CustomizationInfo) {
    const expectedParams = ['title', 'description', 'logo'];
    const wrongParams = Object.keys(customizationInfo).filter((key) => !expectedParams.includes(key));
    if (wrongParams.length > 0) {
      throw new Error(`The CustomizationInfo has ${wrongParams.length} wrong paramater '${[...wrongParams]}'`);
    }
    this.customization = customizationInfo;
  }

  /**
   *
   * @returns uuid txRef
   */
  generateTxRef() {
    return uuid();
  }

  /**
   *
   * @param initializeInfo
   * @param initializeOptions
   * @returns
   */
  initialize(
    initializeInfo: InitializeInfo,
    initializeOptions: InitializeOptions = {
      autoTx_ref: false,
    },
  ) {
    const requiredParams = ['email', 'amount', 'first_name', 'tx_ref', 'last_name', 'currency'];
    if (initializeOptions.autoTx_ref) {
      requiredParams.splice(3, 1);
    }

    let missingParams = [];
    missingParams = requiredParams.filter((key) => !initializeInfo.hasOwnProperty(key));
    if (missingParams.length > 0) {
      throw new Error(
        `The initializeInfo has ${missingParams.length} missing required paramater '${[...missingParams]}'`,
      );
    }

    return new Promise<InitializeResponse>((resolve, reject) => {
      const paylodad = initializeOptions.autoTx_ref
        ? { ...initializeInfo, tx_ref: uuid(), customization: this.customization }
        : { ...initializeInfo, customization: this.customization };

      Axios({
        url: `/transaction/initialize`,
        method: 'post',
        data: paylodad,
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then((response) => {
          response.status === 200 ? resolve(response.data) : reject(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param tnxRef
   * @returns
   */
  verify(tnxRef: string) {
    if (!tnxRef) throw new Error('Transaction refrence is required!');

    return new Promise((resolve, reject) => {
      Axios({
        url: `/transaction/verify/${tnxRef}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then((response) => {
          response.status === 200 ? resolve(response.data) : reject(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param transferInfo
   * @returns
   */
  transfer(transferInfo: TransferInfo) {
    const requiredParams = [
      'account_name',
      'account_number',
      'amount',
      'currency',
      'beneficiary_name',
      'reference',
      'bank_code',
    ];
    let missingParams = [];

    missingParams = requiredParams.filter((key) => !transferInfo.hasOwnProperty(key));
    if (missingParams.length > 0) {
      throw new Error(
        `The transferInfo has ${missingParams.length} missing required paramater '${[...missingParams]}'`,
      );
    }

    return new Promise((resolve, reject) => {
      Axios({
        url: `/transfers`,
        method: 'post',
        data: transferInfo,
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then((response) => {
          response.status === 200 ? resolve(response.data) : reject(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @returns
   */
  getBanks() {
    return new Promise((resolve, reject) => {
      Axios({
        url: '/banks',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then((response) => {
          response.status === 200 ? resolve(response.data) : reject(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @returns
   */
  createSubAccount(subaccount: ICreateSubAccount) {
    const requiredParams = [
      'business_name',
      'account_name',
      'split_type',
      'account_number',
      'bank_code',
      'split_value',
    ];
    let missingParams = [];

    missingParams = requiredParams.filter((key) => !subaccount.hasOwnProperty(key));
    if (missingParams.length > 0) {
      throw new Error(`The Subaccount has ${missingParams.length} missing required paramater '${[...missingParams]}'`);
    }

    return new Promise((resolve, reject) => {
      Axios({
        url: '/subaccount',
        method: 'post',
        data: subaccount,
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then((response) => {
          response.status === 200 ? resolve(response.data) : reject(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Chapa;
