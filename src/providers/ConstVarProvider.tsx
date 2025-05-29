import { createContext, ReactNode, useContext, useState } from "react";
import { CONST_TYMT_LINKS, IConstTymtLinks } from "../const/tymtConsts";

interface ConstVarContextType {
  constTymtLinks: IConstTymtLinks;
}

const ConstVarContext = createContext<ConstVarContextType | undefined>(undefined);

export const ConstVarProvider = ({ children }: { children: ReactNode }) => {
  const [constTymtLinks, _setConstTymtLinks] = useState<IConstTymtLinks>(CONST_TYMT_LINKS);

  return <ConstVarContext.Provider value={{ constTymtLinks }}>{children}</ConstVarContext.Provider>;
};

export const useConstVar = (): ConstVarContextType => {
  const context = useContext(ConstVarContext);
  if (!context) {
    throw new Error("useConstVar must be used within a ConstVarProvider");
  }
  return context;
};
