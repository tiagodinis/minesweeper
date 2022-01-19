import React, { createContext, useContext, useReducer } from "react";
import {
  useUpdateEffect,
  useUpdateLayoutEffect,
} from "../hooks/useUpdateEffect";

type Reducer<D, S, A> = (deps: D, state: S, action: A) => S;
type Store<S, A> = [
  (props: { children: React.ReactNode }) => JSX.Element,
  () => S,
  () => React.Dispatch<A>
];

export default function createDependentStore<D, S, A>(
  setupDeps: () => D,
  userReducer: Reducer<D, S, A>,
  initialState: S,
  depsChangeAction: A,
  asyncDepsUpdate: boolean,
  key?: string
): Store<S, A> {
  const StoreContext = createContext<S | undefined>(undefined);
  const DispatchContext = createContext<React.Dispatch<A> | undefined>(
    undefined
  );

  // OPTIONAL LOCAL STORAGE
  let reducer: Reducer<D, S, A> = userReducer;
  if (key !== undefined) {
    reducer = (deps, state, action) => {
      const newState = userReducer(deps, state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };

    const jsonValue = localStorage.getItem(key);
    if (jsonValue) initialState = JSON.parse(jsonValue);
  }

  // PROVIDERS
  const AsyncDepsDispatch = (dispatch: React.Dispatch<A>, deps: D) =>
    useUpdateEffect(() => dispatch(depsChangeAction), [deps]);

  const SyncDepsDispatch = (dispatch: React.Dispatch<A>, deps: D) =>
    useUpdateLayoutEffect(() => dispatch(depsChangeAction), [deps]);

  function StoreProvider({ children }: { children: React.ReactNode }) {
    const deps = setupDeps();
    const [store, dispatch] = useReducer(
      (state: S, action: A) => reducer(deps, state, action),
      initialState
    );

    asyncDepsUpdate
      ? AsyncDepsDispatch(dispatch, deps)
      : SyncDepsDispatch(dispatch, deps);

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
