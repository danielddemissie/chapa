import fetch from 'node-fetch';
import { verifyUrl, initializeUrl } from './urls';

/**
 * @typedef {ICustomization}
 */
interface ICustomization {
  title: string;
  logo: string;
  description: string;
}

/**
 * @typedef {ICustomerInfo}
 */
interface ICustomerInfo {
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  tx_ref: string;
}

class Chapa {
  private chapaKey: string;
  private initializeInfo: any;

  constructor(chapaKey: string) {
    this.chapaKey = chapaKey;
  }

  /**
   *
   * @param {ICustomization} customization
   * @param {string} callbackUrl
   */
  config(customization: ICustomization, callbackUrl: string) {
    this.initializeInfo.customization = customization;
    this.initializeInfo.callback_url = callbackUrl;
  }

  /**
   *
   * @param customerInfo
   * @returns {Promise}
   */
  initialize(customerInfo: ICustomerInfo): Promise<any> {
    const requiredParams = ['email', 'amount', 'first_name', 'last_name', 'tx_ref', 'currency'];
    let missingParams = [];

    missingParams = requiredParams.filter((key) => !customerInfo.hasOwnProperty(key));
    if (missingParams.length > 0) {
      throw new Error(
        `The customerInfo has ${missingParams.length} missing required paramater '${[...missingParams]}'`,
      );
    }
    return new Promise((resolve: any, reject: any) => {
      fetch(initializeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.chapaKey,
        },
        body: JSON.stringify({ ...customerInfo, ...this.initializeInfo }),
      })
        .then(async (res: any) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param {string} tnxRef
   * @returns {Promise}
   */
  verify(tnxRef: string): Promise<any> {
    if (!tnxRef) throw new Error('Transaction refrence is required!');
    return new Promise((resolve: any, reject: any) => {
      fetch(verifyUrl + tnxRef, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.chapaKey,
        },
      })
        .then(async (res: { status: number; json: () => any }) => {
          if (res.status === 200) {
            resolve(await res.json());
          } else {
            reject(await res.json());
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}

export default Chapa;
