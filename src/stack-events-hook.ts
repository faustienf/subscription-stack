import { useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { Subscribe, createStackEvents } from "./stack-events";

type AnyFunction = (...args: any[]) => any;

/**
 * @see https://github.com/reactjs/rfcs/pull/220
 */
export const useEvent = <T extends AnyFunction>(callback?: T) => {
  const ref = useRef<AnyFunction | undefined>(() => {
    throw new Error("Cannot call an event handler while rendering.");
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
 * const useStackEvents = createStackEventsHook();
 */
export const createStackEventsHook = () => {
  const stackEvents = createStackEvents();

  return (subscribe: Subscribe) => {
    const event = useEvent(subscribe);
    useEffect(() => {
      return stackEvents(event);
    }, [event]);
  };
};
