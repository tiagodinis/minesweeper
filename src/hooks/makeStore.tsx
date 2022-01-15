import React, { createContext, useContext, useReducer } from "react";

type Reducer<T, A> = (state: T, action: A) => T;
type Store<T, A> = [
  (props: { children: React.ReactNode }) => JSX.Element,
  () => T,
  () => React.Dispatch<A>
];

export default function makeStore<T, A>(
  userReducer: Reducer<T, A>,
  initialState: T,
  key?: string
): Store<T, A> {
  const StoreContext = createContext<T | undefined>(undefined);
  const DispatchContext = createContext<React.Dispatch<A> | undefined>(
    undefined
  );

  // OPTIONAL LOCAL STORAGE
  let reducer: Reducer<T, A> = userReducer;
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
