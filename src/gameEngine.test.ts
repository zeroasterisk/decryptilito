import { expect } from 'chai';
import { getRandomOrder } from './gameEngine';

it('getRandomOrder creates 3 random numbers between 1-4', () => {
  const order = getRandomOrder();
  expect(order).to.be.a('array');
  expect(order.length).to.equal(3);
  if (order.includes(1) && order.includes(2) && order.includes(3)) {
    expect(!order.includes(4));
  }
  if (order.includes(1) && order.includes(2) && order.includes(4)) {
    expect(!order.includes(3));
  }
  expect(new Set(order).size).to.equal(3);
});
it('getRandomOrder creates 3 random numbers with no duplicates', () => {
  const order = getRandomOrder();
  expect(order).to.be.a('array');
  expect(order.length).to.equal(3);
  expect(new Set(order).size).to.equal(3);
});
