const { useState, useEffect, createContext, useRef } = require('react');

// * React Hooks are a new feature in React 16.8.0.
// React Hooks use features of the React Framework by calling special functions from within the component.
// React Hooks are a way to make UI components more performant and reusable.
// UI components are often dynamic and may change due to their state or props.
// You can use stateful logic without changing your component hierarchy.

// With (CC) state logic lived in the class constructor.
// A problem with this pattern is that it would produce lots of nested components.
// Sharing components resulted in HOC and render props.
// A pattern of passing components as arguments to other components.

// React Hooks changed this by providing you reactivity from components.
// Providing you lower level features of React outside of the context of your component.
// Think of Hooks as lower level primitives or building blocks.

// Ensure you call them in the right order, at the top-level of your component.
// They don't work inside nested functions, loops etc...
function App() {
  useHook(); // ✔️
  const func = () => useHook(); // ❌
}

// * #1 useState() the most important and often used Hook.
// Used to handle reactive data, any data that changes in the application is called state.
// When state changes you want React to re-render (update) the UI so the latest state are displayed.
// The function returns an array with two values the current state and a function to update the state.
// They returned as an array so that we can destructure and assign them to local variables.
function App() {
  const [currentState, setCurrentState] = useState('initial state'); // ✔️
  // The first value is reactive data/state that if changed, React will auto re-build/re-render the UI.
  // We change the value with the setter updater function.
  return (
    <div>
      <p>{currentState}</p>
      <button onClick={() => setCurrentState('new state')}>Change state</button>
    </div>
  );
}

// Before using it, understand the different legacy class-based React lifecycle events:
// componentDidMount(); - component is mounted and can only happen once (initialized).
// componentDidUpdate(); - multiple times the component state can update triggering (re-rendering).
// componentWillUnmount(); - when the component is removed (unmounted) from the DOM.

// * #2 useEffect() the second most useful Hook.
// Now that we have these effects (side-effects) in mind when using useEffect().
// They allow us to implement logic for all those effects within a single function API.
// In (FC) layout you can use useEffect() to handle multiple events.
function App() {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // The first argument is a callback you define.
  // This side-effect arrow function will run after React has updated the DOM.
  // ! Without the second argument, React will run this function when mounted and each state (re-render).
  // But in most cases you would want additional fine-grained control over when the effect runs.
  useEffect(() => () => alert('component mounted'));

  // The second argument is an array of values that are used to determine if the effect should run.
  // Imagine we need to first fetch data when the component is mounted (initialized).
  // Then update the state asynchronously after the data has been fetched.
  // ! Without an dependency array the effect will run into an infinite loop ❌.
  useEffect(() => {
    fetch('foo').then(() => setLoaded(true));
  }, []);
  
  // An [] empty array will run the effect on every render (mount) only.
  // However you may want to run the effect only when the stateful data has changed.
  // Adding state to the dependency array will track/check it's values against === hard equality ✔️.
  useEffect(() => {
    fetch('foo').then(() => setLoaded(true));
  }, [count]);
  
  // The third argument is a returned function after your callback side-effect function.
  // Also known as the cleanup function that will run when the component is (unmounted).
  // Tear-down code is called when the component is destroyed, removed from the UI.
  useEffect(() => {
    alert('hello side effect!');
    return () => alert('goodbye component!');
  }, []);

  return (
    <div>
      <p>{currentState}</p>
      <button onClick={() => setCurrentState('new state')}>Change state</button>
    </div>
  );
}

// * #3 useContext() allows you to work within the React Context API.
// That context itself is a mechanism to share or scope values throughout the entire component tree.
// You can use useContext() to access the context value.
// You can also use useContext() to provide a value to the context.
const moods = {
  happy: '🥰',
  sad: '😢',
};
// To share the current mood across multiple disconnected components we create a context.
// One part of the application would be happy so we scope it with a Provider there.
// The <Provider /> component that wraps the application and provides the context value.
// Now any child wrapped by that component will inherit that value.
// Without the need in passing props down to the children.
const MoodContext = createContext(moods);
function App(props) {
  return (
    <MoodContext.Provider value={moods.happy}>
      <MoodEmoji />
    </MoodContext.Provider>
  );
}
// Finally that brings us to the actual useContext Hook usage.
// It allows as to access that value from the context <Provider />.
// The advantage is that the child component can be many levels deep into the component tree.
// Using the <Consumer /> component we can access that context from the nearest parent <Provider />.
// Reading a parent value from useContext is much easier than passing props down multiple children.
// Now when the value changes from the parent, the child will update automatically.
function MoodEmoji() {
  return <MoodContext.Consumer>{(mood) => <p>{mood}</p>}</MoodContext.Consumer>;
}

// * #3 useRef() is a Hook that allows you to access the DOM element of a React component.
// This is a common pattern in React where you want to interact with the DOM directly.
// It returns a mutable ref object that will keep the same object reference between renders/re-renders.
// Meaning that the mutable value does NOT re-render UI when that value changes.
// We access the DOM element directly but count does't change because its not triggering a re-rendered.
function App() {
  const count = useRef(0);
  return (
    <>
      <button onClick={() => count.current++}>Click Me</button>
      <h1>{count.current}</h1>
    </>
  );
}
// A more common use case is to grab native DOM elements directly from your JSX.
// Below we create a null reference to a variable called myBtn and link it to a "raw" HTML <button>.
// Using the ref attribute we can connect it to this "raw" HTML <button>.
// From there we can call the .current property to call a native DOM API like click().
function App() {
  const myBtn = useRef(null);
  const clickIt = () => myBtn.current.click();
  return (
    <>
      <button ref={myBtn}>Click Me</button>
    </>
  );
}

// * #4 useReducer() is a Hook that allows you to manage state in a functional component.
// Similar to useState it returns an array of values.
// Destructing again we have access to the current state, but what's new is a dispatch() function.
// useReducer follows the Redux pattern and is a very different way of managing state.
// Instead of updating state directly we dispatch() as action object to an external like reducer() function.
// The action is a plain JS object that describes the type of action performed and an optional data payload.
// The reducer function is responsible for updating, determining and handling your next state outcome.
// We define the reducer and pass it as an argument to the useReducer() Hook.
// The second argument is a default state value.
// useReducer allows us to handle complex state management, avoiding Redux but use the pattern.
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state + 1};
    case 'decrement':
      return {count: state - 1};
    default:
      throw new Error();
  }
}

function App() {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <h1>{count}</h1>
    </>
  ); 
}

// * #5 useMemo() is a Hook that allows you to memoize expensive results.
// Similar to useCallback() but it will only re-evaluate the function if one of the dependencies has changed.
// It will only re-evaluate the function if one of the dependencies has changed.
// Memoization is a technique to cache expensive results and only re-evaluate if dependencies change.
// It is a performance optimization technique that can be used to speed up your application.
// ! useMemo() should only be used when you need to memoize expensive results.
// Below we recompute when the count state changes.
function App() {
  const [count, setCount] = useState(60);
  const expensiveCount = useMemo((count) => count ** 2, [count]) // expensiveCount is a memoized value.
  return (
    <>
      {/* ... */}
    </>
  ); 
}

// * #6 useCallback() is a Hook that allows you to memoize expensive results.
// Similar to useMemo() but it will only re-evaluate the function if one of the dependencies has changed.
// It will only re-evaluate the function if one of the dependencies has changed.
// Memoization is a technique to cache expensive results and only re-evaluate if dependencies change.
// It is a performance optimization technique that can be used to speed up your application.
// ! useCallback() should only be used when you need to memoize expensive results.
// Below we recompute when the count state changes.
function App() {
  const [count, setCount] = useState(60);
  const showCount = useCallback((count) => count ** 2, [count]) // showCount is a memoized value.
  return (
    <>
      {/* ... */}
    </>
  ); 
}

// * #7 useImperativeHandle() is a Hook that allows you to pass a ref callback to a child component. (rarely used)
// It allows you to pass a ref callback to a child component.
// The ref callback will be called with the child component instance as the first argument.
// This allows you to access the DOM element of the child component from the parent component.
// The second argument is a function that will be called when the child component is unmounted.
// This is a great way to implement event handlers that should be cleaned up when the child component unmounts.
// Below we create a ref callback that will be called when the child component unmounts.
function CoolButton(props, ref) {
  const Btn = useRef(null);

  useImperativeHandle(ref, () => Btn.current.click());
  
  return <><button ref={ref}></button></>;
}
CoolButton = forwardRef(CoolButton);

// * #8 useLayoutEffect() is a Hook that allows you to run side effects before or after a component renders. (rarely used)
// Runs after the DOM is updated, but before the browser renders/paints the DOM.
// This is useful for running side effects (like setting up event listeners) after the DOM has been updated.
// ! blocks the rendering of the component until your callback is finished.
function App() {
  const myBtn = useRef(null);

  useLayoutEffect(() => {
    myBtn.current.click();
  }, [myBtn]);
  
  return <><button ref={ref}></button></>;
}

// * #9 useDebugValue() is a Hook that allows you to add a debug value to a component. (rarely used)
// It allows you to add a debug value to a component.
// The argument passed in the hook is the value displayed in the React DevTools.
// This is useful for debugging purposes.
function useDisplayName() {
  const [displayName, setDisplayName] = useState();

  useEffect(() => {
    const data = fetchFromDd(props.id);
    setDisplayName(data.displayName);
  }, []);

  useDebugValue(displayName ?? 'loading...');
  
  return displayName
}
// We can use this hook to display the displayName of a component in the React DevTools.
// Additional we can use the same logic repeatedly in our component tree.
function App() {
  
  const displayName = useDisplayName();

  return <><button>{displayName}</button></>;

}