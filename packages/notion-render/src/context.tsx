import { createContext, useContext } from "react";

import { EmptyClasses, type Classes } from "./classes";
import { DefaultComponents, type Components } from "./components";

interface NotionRenderContext {
  components: Components;
  classes: Classes;
}
export const Context = createContext<NotionRenderContext | undefined>(
  undefined
);

export const useNotionRenderContext = () => {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error("useNotionRenderContext called without a Provider");
  return context;
};

export interface NotionRenderContextProps {
  classes?: Partial<Classes>;
  components?: Partial<Components>;
  children: React.ReactNode;
}
export function NotionRenderContext({
  classes,
  components,
  children,
}: NotionRenderContextProps) {
  const context = useContext(Context);

  const finalClasses = { ...EmptyClasses, ...context?.classes, ...classes };
  const finalComponents = {
    ...DefaultComponents,
    ...context?.components,
    ...components,
  };

  if (context === undefined) {
    return (
      <Context.Provider
        value={{ classes: finalClasses, components: finalComponents }}
      >
        {children}
      </Context.Provider>
    );
  }
  return <>{children}</>;
}
