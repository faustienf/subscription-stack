import { useEffect } from 'react';
import { Subscribe, createSubscriptionStack } from '../subscription-stack';
import { useEvent } from './use-event';

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
