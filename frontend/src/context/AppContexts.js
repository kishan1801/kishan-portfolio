import { createContext, useContext } from "react";

export const ChatContext = createContext({ open: false, setOpen: () => {} });
export const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });
export const useChat = () => useContext(ChatContext);
export const useTheme = () => useContext(ThemeContext);
