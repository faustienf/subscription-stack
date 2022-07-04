# subscription-stack
[![npm-version](https://img.shields.io/npm/v/subscription-stack.svg)](https://npmjs.org/package/subscription-stack)

📬 Register a subscription in LIFO stack

## Installation

```bash
npm i subscription-stack
```

## Usage
```js
const stack = createSubscriptionStack();

stack(() => {
  const handle = () => console.log('1');
  window.addEventListener('click', handle);
  return () => window.removeEventListener('click', handle);
});

stack(() => {
  const handle = () => console.log('2');
  window.addEventListener('click', handle);
  return () => window.removeEventListener('click', handle);
});

// Console: 
// 2
// 1
```

## ⚛️ React Hook

```js
const useStack = createSubscriptionStackHook();

useStack(() => {
  const handle = () => console.log('1');
  window.addEventListener('click', handle);
  return () => window.removeEventListener('click', handle);
});

useStack(() => {
  const handle = () => console.log('2');
  window.addEventListener('click', handle);
  return () => window.removeEventListener('click', handle);
});

// Console: 
// 2
// 1
```

## How does it work

```js
const queue = new Set(); // []

// Add 1 -> [1]
stack(() => {
  queue.add(1);
  return () => queue.delete(1);
});

// Remove 1 -> []
// Add 2 -> [2]
// Add 1 -> [2, 1]
const unsubscribe = stack(() => {
  queue.add(2);
  return () => queue.delete(2);
});

// Remove 2 -> [1]
// Remove 1 -> []
// Add 3 -> [3]
// Add 2 -> [3, 2]
// Add 1 -> [3, 2, 1]
stack(() => {
  queue.add(3);
  return () => queue.delete(3);
});

// Remove 2 -> [3, 1]
unsubscribe();
```
