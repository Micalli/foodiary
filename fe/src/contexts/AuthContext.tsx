import { createContext, useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signInParams } from "../services/auth/signin";
import { authService } from "../services/auth";
import { signUpParams } from "../services/auth/signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../config/localStorageKeys";
import { httpClient } from "../services/httpClient";
import { meService } from "../services/me";
import { User } from "../services/me/me";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn(params: signInParams): Promise<void>;
  signUp(params: signUpParams): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

      setToken(data);
      setIsLoadingToken(false);
    }

    load();
  }, []);

  useEffect(() => {
    async function run() {
      if (!token) {
        httpClient.defaults.headers.common["Authorization"] = null;
        return;
      }

      httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    }

    run();
  }, [token]);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    setToken(null);
  }, []);

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (params: signInParams) => {
      const response = await authService.signIn(params);
      setToken(response.accesstoken);
    },
  });

  const { mutateAsync: signUp } = useMutation({
    mutationFn: async (params: signUpParams) => {
      const response = await authService.signUp(params);
      setToken(response.accesstoken);
      await AsyncStorage.setItem(
        LOCAL_STORAGE_KEYS.TOKEN,
        response.accesstoken
      );
    },
  });

  const { data: user, isFetching } = useQuery({
    enabled: !!token,
    queryKey: ["user"],
    queryFn: async () => {
      const response = await meService.me();
      const { user } = response;

      return user;
    },
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading: isLoadingToken || isFetching,
        user: user ?? null,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
