import Chapa from '../index';

it('Chapa constructor called', () => {
  const chapa = new Chapa('chapa-key');
  expect(Chapa).toHaveBeenCalledTimes(1);
});
