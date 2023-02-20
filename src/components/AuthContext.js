import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [lang, setLang] = useState("");
  const [theme, setTheme] = useState("light");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, name, setName, lang, setLang, theme, setTheme, role, setRole }}>{props.children}</AuthContext.Provider>;
};

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
