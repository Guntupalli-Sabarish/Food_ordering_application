import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  const login = (userData, jwtToken) => {
    setCurrentUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
