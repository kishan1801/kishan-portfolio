import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Admin from "@/pages/Admin";
import ChatDrawer from "@/components/ChatDrawer";
import { Toaster } from "sonner";
import { ChatContext, ThemeContext } from "@/context/AppContexts";
import "@/App.css";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("kk-theme") || "dark",
  );
  const [chatOpen, setChatOpen] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("kk-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    let frame;
    const loop = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (chatOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [chatOpen]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((current) => (current === "dark" ? "light" : "dark")),
      }}
    >
      <ChatContext.Provider value={{ open: chatOpen, setOpen: setChatOpen }}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="site-shell min-h-screen text-foreground">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:projectId" element={<ProjectDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
            <ChatDrawer />
            <Toaster position="bottom-right" richColors closeButton />
          </div>
        </BrowserRouter>
      </ChatContext.Provider>
    </ThemeContext.Provider>
  );
}
export default App;
