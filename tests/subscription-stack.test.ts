import { expect, test } from "vitest";
import { createSubscriptionStack } from "../src/subscription-stack";

test("Check add", () => {
  const queue = new Set<number>();
  const stack = createSubscriptionStack();

  /**
   * Add 1
   */
  stack(() => {
    queue.add(1);
    return () => queue.delete(1);
  });

  expect([...queue]).toEqual([1]);

  /**
   * Delete 1
   * Add 2
   * Add 1
   */
  stack(() => {
    queue.add(2);
    return () => queue.delete(2);
  });

  expect([...queue]).toEqual([2, 1]);

  /**
   * Delete 2
   * Delete 1
   * Add 3
   * Add 2
   * Add 1
   */
  stack(() => {
    queue.add(3);
    return () => queue.delete(3);
  });

  expect([...queue]).toEqual([3, 2, 1]);
});

test("Check scope", () => {
  const firstQueue = new Set<number>();
  const firstStack = createSubscriptionStack();

  const secondQueue = new Set<number>();
  const secondStack = createSubscriptionStack();

  firstStack(() => {
    firstQueue.add(1);
    return () => firstQueue.delete(1);
  });
  expect([...firstQueue]).toEqual([1]);

  firstStack(() => {
    firstQueue.add(2);
    return () => firstQueue.delete(2);
  });
  expect([...firstQueue]).toEqual([2, 1]);

  secondStack(() => {
    secondQueue.add(3);
    return () => secondQueue.delete(3);
  });
  expect([...secondQueue]).toEqual([3]);

  secondStack(() => {
    secondQueue.add(4);
    return () => secondQueue.delete(4);
  });
  expect([...secondQueue]).toEqual([4, 3]);

  expect([...firstQueue]).not.toEqual([...secondQueue]);
});

test("Check unsubscribe", () => {
  const queue = new Set<number>();
  const stack = createSubscriptionStack();

  /**
   * Add 1
   */
  stack(() => {
    queue.add(1);
    return () => queue.delete(1);
  });

  expect([...queue]).toEqual([1]);

  /**
   * Delete 1
   * Add 2
   * Add 1
   */
  const unsubscribe = stack(() => {
    queue.add(2);
    return () => queue.delete(2);
  });

  /**
   * Delete 2
   */
  unsubscribe();

  expect([...queue]).toEqual([1]);

  /**
   * Delete 1
   * Add 3
   * Add 1
   */
  stack(() => {
    queue.add(3);
    return () => queue.delete(3);
  });

  expect([...queue]).toEqual([3, 1]);
});
