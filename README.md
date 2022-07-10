<p align="center">
  <img src="https://raw.githubusercontent.com/faustienf/subscription-stack/main/logo.png" width="300">
</p>

# subscription-stack

[![npm-version](https://img.shields.io/npm/v/subscription-stack.svg)](https://npmjs.org/package/subscription-stack)

📬 Register a subscription in LIFO stack

## Installation

```bash
npm i subscription-stack
```

## Usage

```js
// 1️. Create scoped stack
const stack = createSubscriptionStack();
// 2️. Pass subscribe function
stack(() => {
  // 3️. Return unsubscribe function
  return () => {};
});
```
### Example
```js
const stack = createSubscriptionStack();

stack(() => {
  const handle = () => console.log("1️⃣");
  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
});

stack(() => {
  const handle = () => console.log("2️⃣");
  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
});

// Console:
// 2️⃣
// 1️⃣
```

### ⚛️ React Hook

```js
const useStack = createSubscriptionStackHook();

useStack(() => {
  const handle = () => console.log("1️⃣");
  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
});

useStack(() => {
  const handle = () => console.log("2️⃣");
  window.addEventListener("click", handle);
  return () => window.removeEventListener("click", handle);
});

// Console:
// 2️⃣
// 1️⃣
```

## How does it work

```js
const queue = new Set(); // []

// Add 1 -> [1]
stack(() => {
  queue.add(1);
  return () => queue.delete(1);
});

// Delete 1 -> []
// Add 2 -> [2]
// Add 1 -> [2, 1]
const unsubscribe = stack(() => {
  queue.add(2);
  return () => queue.delete(2);
});

// Delete 2 -> [1]
// Delete 1 -> []
// Add 3 -> [3]
// Add 2 -> [3, 2]
// Add 1 -> [3, 2, 1]
stack(() => {
  queue.add(3);
  return () => queue.delete(3);
});

// Delete 2 -> [3, 1]
unsubscribe();
```
