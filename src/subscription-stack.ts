export type Unsubscribe = () => void;
export type Subscribe = () => Unsubscribe;
export type SubscriptionStack = (subscribe: Subscribe) => Unsubscribe;

/**
 * Create scoped LIFO-stack
 *
 * @example
 * const stack = createSubscriptionStack();
 * stack(() => {
 *  const handler = () => doSomething();
 *  window.addEventListener('click', handler);
 *  return () => window.removeEventListener('click', handler);
 * });
 */
export const createSubscriptionStack = (): SubscriptionStack => {
  let stack = new Map<Subscribe, Unsubscribe>();

  return (newSubscribe: Subscribe): Unsubscribe => {
    stack = new Map([[newSubscribe, () => undefined], ...stack]);

    stack.forEach((unsubscribe, subscribe) => {
      unsubscribe();
      stack.set(subscribe, subscribe());
    });

    return () => {
      const unsubscribe = stack.get(newSubscribe);
      if (unsubscribe) {
        unsubscribe();
      }
      stack.delete(newSubscribe);
    };
  };
};
