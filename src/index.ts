import axios from 'axios';
import { ChapaType, CustomizationInfo, InitializeInfo, InitializeResponse, TransferInfo } from './types';

const chapaUrl = 'https://api.chapa.co/v1';

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
   * @param initializeInfo
   * @returns
   */
  initialize(initializeInfo: InitializeInfo) {
    const requiredParams = ['email', 'amount', 'first_name', 'last_name', 'tx_ref', 'currency'];
    let missingParams = [];

    missingParams = requiredParams.filter((key) => !initializeInfo.hasOwnProperty(key));
    if (missingParams.length > 0) {
      throw new Error(
        `The initializeInfo has ${missingParams.length} missing required paramater '${[...missingParams]}'`,
      );
    }

    return new Promise<InitializeResponse>((resolve, reject) => {
      const paylodad = { ...initializeInfo, customization: this.customization };
      axios({
        url: `${chapaUrl}/transaction/initialize`,
        method: 'post',
        data: paylodad,
        headers: {
          'Content-Type': 'application/json',
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
      axios({
        url: `${chapaUrl}/transaction/verify/${tnxRef}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
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
      axios({
        url: `${chapaUrl}/transfers`,
        method: 'post',
        data: transferInfo,
        headers: {
          Authorization: 'Bearer ' + this.chapaKey,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('response===> ', response);
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
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
      axios({
        url: `${chapaUrl}/banks`,
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
}

export default Chapa;
