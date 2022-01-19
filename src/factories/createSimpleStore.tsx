import React, { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useStorage";

type SetState<S> = React.Dispatch<React.SetStateAction<S>>;
type SimpleStore<S> = [
  (
    | ((props: { children: React.ReactNode }, key: string) => JSX.Element)
    | ((props: { children: React.ReactNode }) => JSX.Element)
  ),
  () => S,
  () => SetState<S>
];

export default function createSimpleStore<S>(
  initialState: S,
  key?: string
): SimpleStore<S> {
  const StoreContext = createContext<S | undefined>(undefined);
  const SetStoreContext = createContext<SetState<S> | undefined>(undefined);

  // PROVIDERS
  const StoreProvider =
    key !== undefined
      ? (props: { children: React.ReactNode }) => LocalProvider(props, key)
      : Provider;

  function Provider({ children }: { children: React.ReactNode }) {
    const [store, setStore] = useState(initialState);
    return getProviderElement(store, setStore, children);
  }

  function LocalProvider(
    { children }: { children: React.ReactNode },
    key: string
  ) {
    const [store, setStore] = useLocalStorage(key, initialState);
    return getProviderElement(store, setStore, children);
  }

  function getProviderElement(
    store: S,
    setStore: SetState<S>,
    children: React.ReactNode
  ) {
    return (
      <StoreContext.Provider value={store}>
        <SetStoreContext.Provider value={setStore}>
          {children}
        </SetStoreContext.Provider>
      </StoreContext.Provider>
    );
  }

  // CONSUMERS
  const useStore = () => validateConsumer(useContext(StoreContext));
  const useSetStore = () => validateConsumer(useContext(SetStoreContext));

  function validateConsumer(consumer: any) {
    if (consumer === undefined)
      throw new Error("consumer must be used within a StoreProvider");
    return consumer;
  }

  return [StoreProvider, useStore, useSetStore];
}
