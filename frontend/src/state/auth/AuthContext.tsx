import React from "react";
import type { AuthState, User } from "./types";

type AuthContextValue = AuthState & {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);


