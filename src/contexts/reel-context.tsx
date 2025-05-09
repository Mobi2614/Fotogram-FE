import { createContext, useReducer, ReactNode, useContext } from "react";

type ReelId = string | null;
type ReelContextType = {
  showComments: boolean;
  reelId: ReelId;
  setCommentsVisibility: (visible: boolean) => void;
  setReelId: (reelId: ReelId) => void;
};

const initialState: ReelContextType = {
  showComments: false,
  reelId: null,
  setCommentsVisibility: () => {},
  setReelId: () => {},
};

type ReelActionType =
  | { type: "SET_COMMENTS_VISIBILITY"; payload: boolean }
  | { type: "SET_REEL_ID"; payload: ReelId };

const ReelContext = createContext<ReelContextType>(initialState);

const reducer = (
  state: ReelContextType,
  action: ReelActionType
): ReelContextType => {
  switch (action.type) {
    case "SET_COMMENTS_VISIBILITY":
      return { ...state, showComments: action.payload };
    case "SET_REEL_ID":
      return { ...state, reelId: action.payload };
    default:
      return state;
  }
};

export default function ReelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCommentsVisibility = (visible: boolean) => {
    dispatch({ type: "SET_COMMENTS_VISIBILITY", payload: visible });
  };

  const setReelId = (reelId: ReelId) => {
    dispatch({ type: "SET_REEL_ID", payload: reelId });
  };

  return (
    <ReelContext.Provider
      value={{ ...state, setCommentsVisibility, setReelId }}
    >
      {children}
    </ReelContext.Provider>
  );
}

// write a useReelContext hook
export function useReelContext() {
  const context = useContext(ReelContext);
  if (context === undefined) {
    throw new Error("useReelContext must be used within a ReelProvider");
  }
  return context;
}
