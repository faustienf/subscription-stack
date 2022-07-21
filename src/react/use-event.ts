import { useCallback, useLayoutEffect, useRef } from 'react';

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
