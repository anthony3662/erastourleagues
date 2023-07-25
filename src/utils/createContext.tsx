import React from 'react';

type UseContext<T> = () => T;
type ProviderProps = {
  children: React.ReactNode;
};

function createContext<T>(createValue: () => T, initialValue?: T): [UseContext<T>, React.FC<ProviderProps>, React.Context<T | undefined>] {
  const context = React.createContext<T | undefined>(initialValue);

  const Provider = (props: ProviderProps) => {
    return <context.Provider value={createValue()}>{props.children}</context.Provider>;
  };

  const useContext: UseContext<T> = () => {
    const contextValue = React.useContext(context);

    if (contextValue === undefined) {
      throw new Error('Context must be used with a provider');
    }

    return contextValue;
  };

  return [useContext, Provider, context];
}

export { createContext };
