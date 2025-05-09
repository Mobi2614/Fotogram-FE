import { getCurrentUser } from "@/services/auth-api";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";

type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNo: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  id: string;
} | null;

type UserContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  user: UserType;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCurrentUser: () => void;
  logout: () => void;
};

type UserActionType =
  | { type: "SET_LOGGED_IN"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: UserType }
  | {
      type: "RESET";
      payload: Omit<UserContextType, "setLoggedIn" | "setLoading" | "fetchCurrentUser" | "logout">;
    };

const initialState: Omit<
  UserContextType,
  "setLoggedIn" | "setLoading" | "fetchCurrentUser" | "logout"
> = {
  isLoggedIn: false,
  loading: true,
  error: null,
  user: null,
};

function reducer(state: typeof initialState, action: UserActionType): typeof initialState {
  switch (action.type) {
    case "SET_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setLoggedIn = (isLoggedIn: boolean) =>
    dispatch({ type: "SET_LOGGED_IN", payload: isLoggedIn });
  const setLoading = (isLoading: boolean) => dispatch({ type: "SET_LOADING", payload: isLoading });
  const setUser = (data: UserType) => dispatch({ type: "SET_USER", payload: data });
  const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
  // const reset = () => dispatch({ type: "RESET", payload: initialState });
  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
      setLoggedIn(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setError(null);
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user_token");
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("user_token");
      if (token) {
        setLoading(true);
        fetchCurrentUser();
      } else {
        setLoading(false);
      }
    };
    checkToken();
  }, [fetchCurrentUser]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        setLoggedIn,
        setLoading,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
