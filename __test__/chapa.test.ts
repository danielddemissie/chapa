import Chapa from '../src/index';
import { InitializeInfo, TransferInfo } from '../src/types';

describe('Chapa test-cases', () => {
  let chapa: Chapa;

  beforeAll(() => {
    chapa = new Chapa('CHASECK_TEST-hmTtIKnvC6qBOf6oPMoSPK8FzBCgkXYC');
  });

  it('initialize with secrete key', () => {
    expect(chapa.chapaKey).toBe('CHASECK_TEST-hmTtIKnvC6qBOf6oPMoSPK8FzBCgkXYC');
  });

  it('customize the chapa checkout', () => {
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

  it('initialize fn resolve with correct data ', () => {
    const initializeInfo = chapa.initialize({
      email: 'daniel@daniel.com',
      amount: 100,
      first_name: 'daniel',
      last_name: 'demelash',
      tx_ref: 'tx_ref12',
      currency: 'ETB',
      callback_url: 'http://localhost:3000',
    });
    expect(initializeInfo).resolves.not.toThrow();
  });

  it('initialize fn reject with wrong data ', () => {
    const initializeInfo = chapa.initialize({
      email: 'daniel@daniel.com',
      amount: 100,
      first_name: 'daniel',
      last_name: 'demelash',
      tx_ref: 'tx_ref12',
      currency: 'This is wrong currency',
      callback_url: 'http://localhost:3000',
    });
    expect(initializeInfo).rejects.toThrow();
  });

  it('verify fn rejects with wrong tx_ref', () => {
    const verify = chapa.verify('tx_ref');

    expect(verify).rejects.toThrow();
  });

  it('initialize fn reject with wrong transfer info', () => {
    const transferInfo = chapa.transfer({
      account_name: 'daniel',
      account_number: '1234',
      beneficiary_name: 'shaka',
      reference: 'refrence',
      bank_code: 'error bank code',
      amount: 100,
      currency: 'ETB',
    });

    expect(transferInfo).rejects.toThrow();
  });

  it('get all banks info', () => {
    const allBanks = chapa.getBanks();

    expect(allBanks).resolves.not.toThrow();
  });
});
