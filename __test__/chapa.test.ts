import Chapa from '../src/index';
import * as dotenv from 'dotenv';
dotenv.config();

const chapaKey = process.env.chapaKey;

describe('Chapa test-cases', () => {
  let chapa: Chapa;

  beforeAll(() => {
    chapa = new Chapa(chapaKey as string);
  });

  it('Initialize chapa with secrete key', () => {
    expect(chapa.chapaKey).toBe(chapaKey);
  });

  it('Customize the chapa checkout', () => {
    chapa.customize({
      title: 'MyApp',
      description: 'Paying to MyApp',
      logo: 'http://localhost:3000/img.png',
    });
    expect(chapa.customization).toEqual({
      title: 'MyApp',
      description: 'Paying to MyApp',
      logo: 'http://localhost:3000/img.png',
    });
  });

  it('iInitialize fn resolve with correct data ', () => {
    const initializeInfo = chapa.initialize(
      {
        email: 'daniel@daniel.com',
        amount: 100,
        first_name: 'daniel',
        last_name: 'demelash',
        currency: 'ETB',
        callback_url: 'http://localhost:3000',
      },
      { autoTx_ref: true },
    );
    return expect(initializeInfo).resolves.not.toThrow();
  });

  it('verify fn rejects with wrong tx_ref', () => {
    const verify = chapa.verify('tx_ref12');

    return expect(verify).rejects.not.toThrow();
  });

  // it('transfer fn reject insufficent balance with transfer info', () => {
  //   const transferInfo = chapa.transfer({
  //     account_name: 'daniel',
  //     account_number: '12345678',
  //     beneficiary_name: 'shaka',
  //     reference: 'refrence',
  //     bank_code: '32735b19-bb36-4cd7-b226-fb7451cd98f0',
  //     amount: 100,
  //     currency: 'ETB',
  //   });
  //   return expect(transferInfo).rejects.toStrictEqual({
  //     data: null,
  //     message: 'Insufficient Balalnce',
  //     status: 'failed',
  //   });
  // });

  it('get all banks info', () => {
    const allBanks = chapa.getBanks();

    return expect(allBanks).resolves.not.toThrow();
  });

  // it('Create subaccout with subaccount info', () => {
  //   const subaccount = chapa.createSubAccount({
  //     bank_code: '32735b19-bb36-4cd7-b226-fb7451cd98f0',
  //     business_name: 'shaka',
  //     account_name: 'shaka',
  //     account_number: '12345678',
  //     split_type: 'flat',
  //     split_value: 2,
  //   });

  //   return expect(subaccount).rejects.toStrictEqual({
  //     data: null,
  //     message: 'To create subaccounts via API you need to be on live mode.',
  //     status: 'failed',
  //   });
  // });
});
