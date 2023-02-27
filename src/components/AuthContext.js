import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("theme", theme);
  }, [lang, theme]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        name,
        setName,
        lang,
        setLang,
        theme,
        setTheme,
        role,
        setRole,
        userId,
        setUserId,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
