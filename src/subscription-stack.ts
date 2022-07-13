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
  const stack = new Map<Subscribe, Unsubscribe>();
  return (newSubscribe: Subscribe): Unsubscribe => {
    const subscriptions = new Set<Subscribe>([newSubscribe, ...stack.keys()]);
    // cleanup
    stack.forEach((unsubscribe) => unsubscribe());
    stack.clear();
    // reorder stack and resubscribe
    subscriptions.forEach((subscribe) => {
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
