import { createContext, useContext } from 'react';


export function getOrCreateToken(): string {
  let token = localStorage.getItem("plantpal_token");
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("plantpal_token", token);
  }
  return token;
}

const AuthContext = createContext<string | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = getOrCreateToken(); // ✅ runs once per app load
  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
}

// 3️⃣ Hook to access the token anywhere
export function useAuth() {
  return useContext(AuthContext);
}
