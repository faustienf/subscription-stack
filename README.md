# subscription-stack
📚 Register a subscription in LIFO stack

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

### React Hook

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
