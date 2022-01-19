import React, { createContext, useContext, useReducer } from "react";

type Reducer<S, A> = (state: S, action: A) => S;
type Store<S, A> = [
  (props: { children: React.ReactNode }) => JSX.Element,
  () => S,
  () => React.Dispatch<A>
];

export default function createStore<S, A>(
  userReducer: Reducer<S, A>,
  initialState: S,
  key?: string
): Store<S, A> {
  const StoreContext = createContext<S | undefined>(undefined);
  const DispatchContext = createContext<React.Dispatch<A> | undefined>(
    undefined
  );

  // OPTIONAL LOCAL STORAGE
  let reducer: Reducer<S, A> = userReducer;
  if (key !== undefined) {
    reducer = (state, action) => {
      const newState = userReducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };

    const jsonValue = localStorage.getItem(key);
    if (jsonValue) initialState = JSON.parse(jsonValue);
  }

  // PROVIDERS
  function StoreProvider({ children }: { children: React.ReactNode }) {
    const [store, dispatch] = useReducer(reducer, initialState);

    return (
      <StoreContext.Provider value={store}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StoreContext.Provider>
    );
  }

  // CONSUMERS
  const useStore = () => validateConsumer(useContext(StoreContext));
  const useDispatch = () => validateConsumer(useContext(DispatchContext));

  function validateConsumer(consumer: any) {
    if (consumer === undefined)
      throw new Error("consumer must be used within a StoreProvider");
    return consumer;
  }

  return [StoreProvider, useStore, useDispatch];
}
