import React, { createContext, useContext, useState } from "react";
import { useLocalStorage } from "./useStorage";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type SimpleStore<T> = [
  (
    | ((props: { children: React.ReactNode }, key: string) => JSX.Element)
    | ((props: { children: React.ReactNode }) => JSX.Element)
  ),
  () => T,
  () => SetState<T>
];

export default function makeSimpleStore<T>(
  initialState: T,
  key?: string
): SimpleStore<T> {
  const StoreContext = createContext<T | undefined>(undefined);
  const SetStoreContext = createContext<SetState<T> | undefined>(undefined);

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
    store: T,
    setStore: SetState<T>,
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
