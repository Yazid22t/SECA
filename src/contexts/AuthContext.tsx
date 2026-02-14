import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  user: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("user")
  );

  const signIn = async (email: string, password: string) => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.msg === "Login success") {
      localStorage.setItem("user", email);
      setUser(email);
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string) => {
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data.msg === "User created";
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
