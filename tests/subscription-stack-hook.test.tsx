import React, { PropsWithChildren, useEffect, useState } from 'react';
import { renderHook, render } from '@testing-library/react';
import { FC } from 'react';
import { expect, test } from 'vitest';
import { createSubscriptionStackHook } from '../src/react/subscription-stack-hook';

test('Check hook', () => {
  const queue = new Set<number>();
  const useStack = createSubscriptionStackHook();

  const firstHook = renderHook(() => {
    useStack(() => {
      queue.add(1);
      return () => {
        queue.delete(1);
      };
    });
  });

  expect([...queue]).toEqual([1]);

  const secondHook = renderHook(() => {
    useStack(() => {
      queue.add(2);
      return () => {
        queue.delete(2);
      };
    });
  });

  expect([...queue]).toEqual([2, 1]);

  // Rerender shouldn't break the queue

  firstHook.rerender();
  expect([...queue]).toEqual([2, 1]);

  secondHook.rerender();
  expect([...queue]).toEqual([2, 1]);
});

const Delay: FC = ({ children }) => {
  const [isRendered, render] = useState(false);

  useEffect(() => {
    render(true);
  }, []);

  return isRendered ? <>{children}</> : null;
};

test('Check effect order', () => {
  const queue = new Set<number>();
  const useStack = createSubscriptionStackHook();

  const Component: FC<PropsWithChildren<{ order: number }>> = ({
    children,
    order
  }) => {
    useStack(() => {
      queue.add(order);
      return () => {
        queue.delete(order);
      };
    });

    return <>{children}</>;
  };

  render(
    <Component order={1}>
      <Component order={2} />
      <Delay>
        <Component order={4}>
          <Delay>
            <Component order={6} />
          </Delay>
        </Component>
        <Component order={5} />
      </Delay>
      <Component order={3} />
    </Component>
  );

  expect([...queue]).toEqual([6, 5, 4, 1, 3, 2]);
});
