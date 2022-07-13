import { useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { Subscribe, createSubscriptionStack } from './subscription-stack';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * @see https://github.com/reactjs/rfcs/pull/220
 */
export const useEvent = <T extends AnyFunction>(callback?: T) => {
  const ref = useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = callback;
  });

  return useCallback<AnyFunction>(
    (...args) => ref.current?.apply(null, args) as ReturnType<T>,
    []
  ) as T;
};

/**
 * @example
 * const useStack = createSubscriptionStackHook();
 * useStack(() => {
 *  const handler = () => doSomething();
 *  window.addEventListener('click', handler);
 *  return () => window.removeEventListener('click', handler);
 * });
 */
export const createSubscriptionStackHook = () => {
  const stack = createSubscriptionStack();

  return (subscribe: Subscribe) => {
    const event = useEvent(subscribe);
    useEffect(() => {
      return stack(event);
    }, [event]);
  };
};
