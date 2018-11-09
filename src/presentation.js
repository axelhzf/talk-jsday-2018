// @ts-check
// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text,
  Image,
  CodePane,
  Layout,
  Fit,
  Fill,
  S
} from 'spectacle';
import createTheme from './theme/index';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-graphql';
import './style.css';
import { colors } from './theme/colors';

const theme = createTheme();

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck theme={theme} progress="bar" transition={[]} transitionDuration={0}>
        <Slide>
          <Heading size={2}>
            <S type="bold" textColor={colors.blue.base}>
              [] = useReact()
            </S>
          </Heading>
          <Text margin="40px 0 0 0">
            Axel Hernández Ferrera{' '}
            <Link href="https://twitter.com/axelhzf" title="@axelhzf" />
          </Text>
        </Slide>

        <Slide>
          <Heading size={2}>Agenda</Heading>
          <List>
            <ListItem>Motivations</ListItem>
            <ListItem>What are Hooks?</ListItem>
            <ListItem>Hooks internals</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading fit>I was going to talk about React internals</Heading>
          <List>
            <ListItem>
              Concurrent Mode (previously known as "Async React")
            </ListItem>
            <ListItem>Suspense</ListItem>
            <ListItem>Time slicing</ListItem>
            <ListItem>
              <Link
                title="Brandon Dail - Algebraic effects, Fibers, Coroutines Oh my!"
                href="https://www.youtube.com/watch?v=7GcrT0SBSnI"
              />
            </ListItem>
          </List>
        </Slide>

        <Slide>but...</Slide>

        <Slide>
          <Image
            src={require('./images/hooksIntroduction.webp')}
            height={300}
          />
          <Link
            title="React Today and Tomorrow"
            href="https://www.youtube.com/watch?v=dpw9EHDh2bM"
          />
        </Slide>

        <Slide>
          <Image src={require('./images/whateverAbramov.jpg')} height={500} />
        </Slide>

        <Slide>
          <Heading size={2}>Community response</Heading>
        </Slide>

        <Slide>
          <Heading size={1}>🤯</Heading>
        </Slide>

        <Slide>
          <Image src={require('./images/useWindow.jpg')} height={500} />
        </Slide>

        <Slide>
          <Heading fit>github.com/awesome-react-hooks</Heading>
          <Image src={require('./images/awesomeHooks.png')} height={300} />
        </Slide>

        <Slide>
          <Image src={require('./images/v8.jpg')} height={500} />
        </Slide>

        <Slide>
          <Image src={require('./images/hdd.jpg')} height={500} />
        </Slide>

        <Slide>
          <Text>Hooks are an experimental proposal to React.</Text>
          <Text>You don’t need to learn about them right now.</Text>
        </Slide>

        <Slide>
          <List>
            <ListItem>Completely opt-in</ListItem>
            <ListItem>100% backwards-compatible</ListItem>
            <ListItem>
              They’re currently in React v16.7.0-alpha and being discussed in an
              open RFC.
            </ListItem>
          </List>
        </Slide>

        <Slide>
          <Image src={require('./images/rewrite.jpeg')} height={500} />
        </Slide>

        <Slide>
          <Image src={require('./images/cantstopme.jpg')} height={300} />
        </Slide>

        <Slide>
          <Heading size={2}>What are hooks?</Heading>
        </Slide>

        <Slide>
          <Heading size={2}>What problem solves?</Heading>
          <List>
            <ListItem>Hard to reuse stateful logic between components</ListItem>
            <ListItem>Complex components become hard to understand</ListItem>
            <ListItem>Classes confuse both people and machines</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={2}>What problem solves?</Heading>
          <List>
            <ListItem>
              <strong>Hard to reuse stateful logic between components</strong>
            </ListItem>
            <ListItem>Complex components become hard to understand</ListItem>
            <ListItem>Classes confuse both people and machines</ListItem>
          </List>
        </Slide>

        <Slide>
          <JsCode>{`
class App extends React.Component {
  state = { width: window.innerWidth };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize = () => {
    this.setState({ width: window.innerWidth });
  };
  render() {
    return <div>{this.state.width}</div>;
  }
}
          `}</JsCode>
          <Link href="https://codesandbox.io/s/j477j86vk3" />
        </Slide>

        <Slide>
          <Heading size={2}>What options do we have now?</Heading>
          <List>
            <ListItem>HoC (Higher Order Components)</ListItem>
            <ListItem>Render props</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={2}>Higher Order Components</Heading>
        </Slide>

        <Slide>
          <JsCode>{`
function withSize(Component) {
  return class extends React.Component {
    state = {
      width: window.innerWidth
    };
    componentDidMount() {
      window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }
    handleResize = () => {
      this.setState({ width: window.innerWidth });
    };
    render() {
      return <Component {...this.props} size={this.state.width}/>
    }
  }
}
          `}</JsCode>
        </Slide>

        <Slide>
          <JsCode>{`
const A = withSize(function A({ size }) {
  return <div>A component {size}</div>
});

const B = withSize(function B({ size }) {
  return <div>B component {size}</div>
});
          `}</JsCode>

          <Link href="https://codesandbox.io/s/p9509pmr9q" />
        </Slide>

        <Slide>
          <Heading size={2}>Render props</Heading>
        </Slide>

        <Slide>
          <JsCode>{`
class Size extends React.Component {
  state = {
    width: window.innerWidth
  };
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize = () => {
    this.setState({ width: window.innerWidth });
  };
  render() {
    return this.props.children({ width: this.state.width });
  }
}
          `}</JsCode>
        </Slide>

        <Slide>
          <JsCode>{`
function A() {
  return (
    <Size>
      {({ width }) => (
        <div>A component {width}</div>
      )}
    </Size>
  );
}
          `}</JsCode>

          <Link href="https://codesandbox.io/s/7kn5xjzl06" />
        </Slide>

        <Slide>
          <Heading>Wrapper hell</Heading>

          <JsCode>{`
 export default compose(
     gqlCompose(graphql(TODOS_QUERY, { name: 'todosData' })),
     createTodoMutation,
     toggleTodoMutation,
     deleteTodoMutation,
     editTodoMutation,
     connect(mapStateToProps, mapDispatchToProps),
     withLoadingContainer,
     withActionHandlers,
     filterTodosMapper,
     withEditState,
     pure
 )(TodoComponent);
          `}</JsCode>
        </Slide>

        <Slide>
          <Heading size={2}>Hooks</Heading>
        </Slide>

        <Slide>
          <JsCode>{`
function useSize() {
  let [width, setWidth] = React.useState(window.innerWidth);
  function handleResize() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return width;
}
          `}</JsCode>
        </Slide>

        <Slide>
          <JsCode>{`
function A() {
  const size = useSize();
  return <div>Component A {size}</div>
}

function B() {
  const size = useSize();
  return <div>Component B {size}</div>
}
`}</JsCode>
          <Link href="https://codesandbox.io/s/5zm345r9ln" />
        </Slide>

        <Slide>
          <Heading size={3}>
            Hooks allow you to reuse stateful logic without changing your
            component hierarchy
          </Heading>
        </Slide>

        <Slide>
          <Heading size={2}>What problem solves?</Heading>
          <List>
            <ListItem>Hard to reuse stateful logic between components</ListItem>
            <ListItem>
              <strong>Complex components become hard to understand</strong>
            </ListItem>
            <ListItem>Classes confuse both people and machines</ListItem>
          </List>
        </Slide>

        <Slide>
          <Link href="https://codesandbox.io/s/j477j86vk3" />
          <JsCode>{`
class App extends React.Component {

  state = {
    width: window.innerWidth,
    count: 0
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.interval = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    clearInterval(this.interval);
  }

  handleResize = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return (
      <div>
        <div>{this.state.width}</div>
        <div>
          Count {this.state.count}
          <button onClick={() => this.setState({ count: 0 })}>reset</button>
        </div>
      </div>
    );
  }
}
          `}</JsCode>
        </Slide>

        <Slide>
          <Heading size={3}>
            Each lifecycle method often contains a mix of unrelated logic
          </Heading>
        </Slide>

        <Slide>
          <JsCode>{`
function useCounter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1)
    }, 1000)
    return () => clearInterval(interval);
  }, []);
  return [count, setCount];
}
          `}</JsCode>
        </Slide>

        <Slide>
          <JsCode>{`
function App() {
  const width = useSize();
  const [count, setCount] = useCounter();
  return (
    <div className="App">
      <div>{width}</div>
      <div>
        Count {count}
        <button onClick={() => setCount(0)}>reset</button>
      </div>
    </div>
  );
}
`}</JsCode>
          <Link href="https://codesandbox.io/s/5zm345r9ln" />
        </Slide>

        <Slide>
          <Heading size={3}>
            Hooks let you split one component into smaller functions based on
            what pieces are related
          </Heading>
        </Slide>

        <Slide>
          <Heading size={2}>What problem solves?</Heading>
          <List>
            <ListItem>Hard to reuse stateful logic between components</ListItem>
            <ListItem>Complex components become hard to understand</ListItem>
            <ListItem>
              <strong>Classes confuse both people and machines</strong>
            </ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={2}>Classes confuse people</Heading>
          <Link href="https://codesandbox.io/s/k52vy881v7" />
        </Slide>

        <Slide>
          <Heading size={2}>Classes confuse machine</Heading>
        </Slide>

        <Slide>
          <Heading size={3}>
            Ahead of time compilation of components has a lot of future
            potential. Especially if it's not limited to templates.
          </Heading>
        </Slide>

        <Slide>
          <Heading size={3}>
            Component folding using{' '}
            <a href="https://prepack.io/repl.html#BQMwrgdgxgLglgewgAmASmQbwFDOeaeJfOAIyQEMoo5gAPDHPPAJwFMYwWU7kAeALzIAjMgD8yXgC4S5CFRr1kAWhEYA1LMrVavVQCY0AblzIAvqYDmAGwSkK1gHS8hIMtsXCADMexm06EZAA">
              Prepack
            </a>
          </Heading>
        </Slide>

        <Slide>
          <Image src={require('./images/prepack-react.jpg')} height={600}/>
        </Slide>

        <Slide>
          <Heading size={2}>Classes don't minify very well</Heading>
        </Slide>

        <Slide>
          <Link href="https://twitter.com/jamiebuilds/status/1056015484364087297"/>
          <Image src={require('./images/minimize.jpg')} height={600}/>
        </Slide>












        <Slide>
          new mental model https://twitter.com/aweary/status/1055514451535790081
        </Slide>

        <Slide>
          <Image src={require('./images/copyReact.jpg')} height={500} />
        </Slide>


        <Slide>
          <JsCode>{`
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked \\{count\\} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
          `}</JsCode>
          * add some local state * react will preserve the state between
          re-renders * pairs, currentState and a function to update it * similar
          to setState, pero no mezcla old state with the new one * the argument
          that receive is the initial state
        </Slide>

        <Slide>
          <JsCode>{`
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
          `}</JsCode>
          * The name es the property is not part of the function * React assumes
          that if you call useState many times, you do it in the same order
          during every render
        </Slide>

        <Slide>
          Hooks are functions that let you hook into react state and lifecycles.
          Hooks don't work inside calsses
        </Slide>

        <Slide>
          Effect hook * data fetching * subscriptions * manually changing the
          DOM from React components This is a side effect It server the same
          purpose as componentDidMount, componentDidUpdate, componentWillUnmount
        </Slide>

        <Slide>
          <JsCode>{`
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
          `}</JsCode>
        </Slide>

        <Slide>
          React runs the effect after every render. Including the first render
          Effects may also specify how to clean up
          <JsCode>{`
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return function cleanUP() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
          `}</JsCode>
          By default it runs both after the first render and after every update.
          Instead of thinking in terms of mounting and updating you might find
          it easier to think that effecets happen after render. React guarantees
          the DOM has been updated by the time it runs the effects. React
          performs the cleanup when the component unmounts. This is why react
          also cleans up effects from othe previous render before running the
          effects next time. Usando el ejemplo de clases, podemos ver como suele
          ser una fuente de problemas, que no limpiamos el callback cuando hay
          un cambio de props, es por eso, que para evitar posibles problemas, el
          cleanup se ejecuta siempre cuando hay un cambio de propiedades. Lo
          ideal es que utilicemos varios bloques useEffect, para separar cada
          una de las partes de lógica de la aplicación.
        </Slide>

        <Slide>
          Optimizando el performance by skipping effects Hay casos en los que si
          aplicamos el efecto en cada rerender, esto podría causar problemas de
          performance. Podemos evitar este problema si comparamos las
          propiedades anteriores y las siguiente
          <JsCode>{`
          componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = \`You clicked \${this.state.count} times\`;
  }
}
          `}</JsCode>
          Para ello lo que vamos a utilizar es el segundo parámetro
          <JsCode>{`
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]); // Only re-run the effect if count changes
          `}</JsCode>
          En el futuro, el segundo parámetro se va a poder añadir
          automáticamente por una modificación de código en tiempo de build. En
          el caso de que quieras ejecutar el efecto un única vez (mount/unmount)
          existe la opción de pasar un array vacio.
        </Slide>

        <Slide>
          <List>
            <ListItem>
              Only call Hooks at the top level. Don't call Hooks inside llops,
              conditions, or nested functions.
            </ListItem>
            <ListItem>
              Only call Hooks from React function components. Don’t call Hooks
              from regular JavaScript functions
            </ListItem>
          </List>
          There is a linter plugin to enforce these rules automatically These
          rules might seems limiting or confusing at first, but they are
          essential to making Hooks work well
        </Slide>

        <Slide>
          Por qué estas reglas tan estricas para el uso de hooks Se puede
          utilizar varios hooks en el mismo componente
          <JsCode>{`
            // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });
          `}</JsCode>
        </Slide>

        <Slide>
          Entonces cómo React sabe qué estado corresponde a cada uso de
          `useState` La respuesta es que React utiliza el orden en el que los
          hooks son llamados
          <JsCode>{`
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialize the name state variable with 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. Initialize the surname state variable with 'Poppins'
useEffect(updateTitle)     // 4. Add an effect for updating the title

// -------------
// Second render
// -------------
useState('Mary')           // 1. Read the name state variable (argument is ignored)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. Read the surname state variable (argument is ignored)
useEffect(updateTitle)     // 4. Replace the effect for updating the title
          `}</JsCode>
          Mientras el orden de los hooks sea el mismo entre cada render. Es por
          eso que las llamadas a hooks no se pueden poner dentro de condiciones
          <JsCode>{`
if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
          `}</JsCode>
          En vez de usar eso
          <JsCode>{`
useEffect(function persistForm() {
    // 👍 We're not breaking the first rule anymore
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
          `}</JsCode>
        </Slide>

        <Slide>
          Passing information between hooks Los hooks son funciones, podemos
          pasar información entre ellos
          <JsCode>{`
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
          `}</JsCode>
        </Slide>

        <Slide>
          Building your own hooks
          <JsCode>{`
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
          `}</JsCode>
          <JsCode>{`
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
          `}</JsCode>
          * the state of these components is completely independent. * Hooks are
          a way to reuse stateful logic, not state itself
        </Slide>

        <Slide>
          If a function's name starts with "use" and it calls other Hooks, we
          say it is a custom hook
        </Slide>

        <Slide>
          Other Hooks useContext const locale = useContext(LocaleContext)
          useReducer const [todos, dispatch] = useReducer(todosReducer);
        </Slide>

        <Slide>
          You might be wondering: why is useState not named createState instead?
          “Create” wouldn’t be quite accurate because the state is only created
          the first time our component renders. During the next renders,
          useState gives us the current state. Otherwise it wouldn’t be “state”
          at all! There’s also a reason why Hook names always start with use.
          We’ll learn why later in the Rules of Hooks.
        </Slide>

        <Slide>
          useState Por defecto useState no mezcla el estado anterior con el
          nuevo, pero se puede conseguir el mismo efecto con
          <JsCode>{`
          setState(prevState => {
            return {...prevState, ...updatedValues}
          })
          `}</JsCode>
          El initial state se utiliza únicamente durante el primer render. El
          resto de renders el parámetro se omite. Se puede pasar una función en
          el caso de que haya que hacer algunos cálculos costosos. Lazy
          iniitialization
        </Slide>

        <Slide>
          useEffect Accepts a function that contains imperative, possibly
          effectful code. Mutations, subscriptions, timers, logging, and other
          side effects Think of effects as an escape hatch from React’s purely
          functional world into the imperative world. By default, effects run
          after every completed render, Cleaning up an effect using the return
          function Previous effect is cleaned up before executing the next
          effect * useEffect fires **after** layout and paint. A DOM mutation
          that is visible to the user must fire syncrhonously before the next
          paint, so that the user does not perceive a visual inconsistency.
          React provides two additional Hooks, useMutationEffect and
          useLayoutEffect. Same signature and only differ in when they are
          fired. Conditionally firing an effect
          <JsCode>{`
            useEffect(
              () => {
                const subscription = props.source.subscribe();
                return () => {
                  subscription.unsubscribe();
                };
              },
              [props.source],
            );
          `}</JsCode>
        </Slide>

        <Slide>
          <JsCode>{`
            const context = useContext(Context)
          `}</JsCode>
        </Slide>

        <Slide>
          const [state, dispatch] = useReducer(reducer, initialState,
          initialAction?); Alternative to useState. Accepts a reducer of type
          (state, action) => newState Returns the state and a dispatch method Es
          una manera de evitar tener que pasar callbacks, se puede pasar el
          dispatch únicamente
          <JsCode>{`
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return {count: action.payload};
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    {type: 'reset', payload: initialCount},
  );

  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
          `}</JsCode>
        </Slide>

        <Slide>
          useCallback return a memoized callback. Pass an inline callback and an
          array of inputs. useCallback will returns memoized version of the
          callback that only changes if one of the inputs has changed. This is
          useful when passing callbacks to optimized child components that rely
          on reference equality to prevent unnecessary renders useCallback(fn,
          inputs) is equivalent to useMemo(() => fn, inputs)
          <JsCode>{`
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
          `}</JsCode>
        </Slide>

        <Slide>
          useMemo return a memoized value
          <JsCode>{`
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
          `}</JsCode>
        </Slide>

        <Slide>
          useRef
          <JsCode>{`
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // \`current\` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
          `}</JsCode>
        </Slide>

        <Slide>useImperativeMethods</Slide>

        <Slide>
          useMutationEffect The signature is identical to useEffect, but it
          fires synchronously during the same phase that React performs its DOM
          mutations, before sibling components have been updated. Use this to
          perform custom DOM mutations.
        </Slide>

        <Slide>
          useLayoutEffect The signature is identical to useEffect, but it fires
          synchronously after all DOM mutations
        </Slide>

        <Slide>
          There are no plans to remove classes form react. They recommend trying
          hooks in new code Hooks are a more direct way to use the React
          features you already know (state, lifecycle, context and refs) You
          can't use Hooks inside of a class component Hooks will cover all use
          cases for classes as soon as possible. There are no Hook equivalent to
          `getSnapshotBeforeUpdate` and `componentDidCatch` yet. But they plan
          to add it. In the future, common libraries can use custom hooks like
          `useRedux` or `useRouter` Hooks were designed with static typing in
          mind. They are functions, they are easier to type correctly than
          patterns like higher-order components. Testing? A component using
          hooks is just a regular component. If your testing solution doesn't
          rely on react internals. Testing components with thooks shouldn't be
          different from how you normally test components. If you need to test a
          custom hook, you can do so by creating a component in your tests and
          using your hook from it. Hooks avoid a lot of the overhead that
          classes require, like the cost of creating class instances and binding
          event handlers in the constructor. Idiomatic code using Hooks doesn’t
          need the deep component tree nesting that is prevalent in codebases
          that use higher-order components, render props, and context. With
          smaller component trees, React has less work to do. Prior art for
          hooks * experiments with functional api in the react-future repository
          * Reactions component * adopt keyword
        </Slide>

        <Slide>
          Why Hooks? we often can’t break complex components down any further
          because the logic is stateful and can’t be extracted to a function or
          another component * Huge components that are hard to refactor and
          test. * Duplicated logic between different components and lifecycle
          methods. * Complex patterns like render props and higher-order
          components.
        </Slide>

        <Slide>
          Hooks let us organize the logic inside a component into reusable
          isolated units
        </Slide>

        <Slide>
          https://twitter.com/threepointone/status/1056594421079261185?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1056594421079261185&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2Fe55e7bcbf2d4912af7e539a2646388e2%3FpostId%3Dfdbde8803889
          https://twitter.com/prchdk/status/1056960391543062528?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1056960391543062528&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2F98fad9dea66efbd9f3d739fd0ce41042%3FpostId%3Dfdbde8803889
        </Slide>

        <Slide>
          Hooks apply the React philosophy (explicit data flow and composition)
          inside a component, rather than just between the components Hoks are a
          natural fot for the React component model
        </Slide>

        <Slide>
          Before we look at Hooks in detail, you might be worried that we’re
          just adding more concepts to React with Hooks If the React community
          embraces the Hooks proposal, it will reduce the number of concepts you
          need to juggle when writing React applications. Hooks let you always
          use functions instead of having to constantly switch between
          functions, classes, higher-order components, and render props.
        </Slide>

        <Slide>
          Hooks support increases React only by ~1.5kB (min+gzip). While this
          isn’t much, it’s also likely that adopting Hooks could reduce your
          bundle size because code using Hooks tends to minify better than
          equivalent code using classes
          https://twitter.com/jamiebuilds/status/1056015484364087297?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1056015484364087297&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2F40e914f1af8557ee7ecb3709b2be1ebc%3FpostId%3Dfdbde8803889
        </Slide>

        <Slide>The Hooks proposal doesn’t include any breaking changes</Slide>

        <Slide>
          Since Hooks are regular JavaScript functions, you can combine built-in
          Hooks provided by React into your own “custom Hooks”. This lets you
          turn complex problems into one-liners and share them across your
          application or with the React community:
          https://twitter.com/seldo/status/1057030727512911874?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1057030727512911874&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2F1222a3fec538e69ddc20489a6ada9a62%3FpostId%3Dfdbde8803889
        </Slide>

        <Slide>
          // useWidth
          https://gist.github.com/gaearon/cb5add26336003ed8c0004c4ba820eae
        </Slide>

        <Slide>
          Unlike render props or higher-order components, Hooks don’t create a
          “false hierarchy” in your render tree
        </Slide>

        <Slide>
          But if the React community embraces Hooks, it doesn’t make sense to
          have two different recommended ways to write components. Hooks can
          cover all use cases for classes while providing more flexibility in
          extracting, testing, and reusing code. This is why Hooks represent our
          vision for the future of React.
        </Slide>

        <Slide>
          We recognize the initial unfamiliarity but we think this tradeoff is
          worth the features it enables. If you disagree, I encourage you to
          play with it in practice and see if that changes how you feel. We’ve
          been using Hooks in production for a month to see whether engineers
          get confused by these rules.
        </Slide>

        <Slide>
          How hooks are defined
          https://gist.github.com/gaearon/62866046e396f4de9b4827eae861ff19 We
          keep a list of Hooks per component, and move to the next item in the
          list whenever a Hook is used. hanks to the Rules of Hooks, their order
          is the same on every render, so we can provide the component with
          correct state for each call
          https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e
          Perhaps you’re wondering where React keeps the state for Hooks. The
          answer is it’s kept in the exact same place where React keeps state
          for classes. React has an internal update queue which is the source of
          truth for any state, no matter how you define your components. Hooks
          don’t rely on Proxies or getters which can be common in modern
          JavaScript libraries. So arguably Hooks are less magic than some
          popular approaches to similar problems. I’d say Hooks are about as
          much magic as calling array.push and array.pop (for which the call
          order matters too!)
        </Slide>

        <Slide>
          React hooks not magic, just arrays
          https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e
        </Slide>

        <Slide>
          Array destructuring v8
          https://twitter.com/mathias/status/1057611461999112192
        </Slide>

        <Slide>
          Awesome react hooks https://github.com/rehooks/awesome-react-hooks
        </Slide>

        <Slide>
          Notice here how these things grow in complexity
          https://twitter.com/jamiebuilds/status/1055988893303037952
        </Slide>

        <Slide>
          Modern react new tools
          https://mobile.twitter.com/jongold/status/1058780700659277824
          https://twitter.com/jongold/status/1058790149536940033?s=20
        </Slide>

        <Slide>
          It might be interesting to note that we only expand React to things
          that empower the base abstraction: components. For example we’re not
          building a router into React. But features we build will be useful to
          routers and many other types of UI code outside React.
          https://twitter.com/dan_abramov/status/1058802250490015745?s=20
        </Slide>

        <Slide>
          Right, I see this as a short-term problem. If Hooks are successful, in
          a few years, new React devs won't need to know about classes or
          lifecycle methods at all.
          https://twitter.com/acdlite/status/1058129035325145088?s=20
        </Slide>

        <Slide>
          https://dev.to/kayis/react-hooks-demystified-2af6 react hooks
          demystified
        </Slide>

        <Slide>
          https://twitter.com/theKashey/status/1056343296086142977?s=20 No.
          useMemo is mostly not “what to memo”, or “how to memo” - it’s about
          “where to memo”. Per-instance memoization, so hardly doable with other
          libraries. Especially reselect, memoize-one, and all “mine”, which
          bound to one cached result.
        </Slide>

        <Slide>
          https://twitter.com/aweary/status/1055517146942386177?s=20
          useMutableReducer using immer to have a mutable reducer
        </Slide>

        <Slide>Concurrent React + Suspense!</Slide>

        <Slide>
          <Heading>Questions?</Heading>
          <Heading size={5} margin="40px 0 0 0">
            @axelhzf
          </Heading>
        </Slide>
      </Deck>
    );
  }
}

const JsCode = ({ children, ...other }) => (
  <CodePane lang="javascript" source={children} {...other} />
);

const GqlCode = ({ children }) => <CodePane lang="graphql" source={children} />;

const JsonCode = ({ children }) => <CodePane lang="json" source={children} />;

const SqlCode = ({ children }) => <CodePane lang="sql" source={children} />;

const Link = ({ href, title }) => (
  <a href={href} target="_blank">
    {title || href}
  </a>
);
