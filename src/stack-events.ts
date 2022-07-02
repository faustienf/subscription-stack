export type Unsubscribe = () => void;
export type Subscribe = () => Unsubscribe;
export type StackEvents = (subscribe: Subscribe) => Unsubscribe;

export const createStackEvents = (): StackEvents => {
  let stack = new Map<Subscribe, Unsubscribe>();

  return (newSubscribe: Subscribe): Unsubscribe => {
    stack.forEach((unsubscribe) => {
      unsubscribe();
    });

    stack = new Map([[newSubscribe, () => {}], ...stack]);
    stack.forEach((_, subscribe) => {
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
