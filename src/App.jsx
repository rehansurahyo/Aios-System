// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Cabins from "./pages/Cabins";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ReadingManager from "./pages/ReadingManager";
import Login from "./pages/Login";
import CabinPricing from "./pages/CabinPricing";
import ArticleManagement from "./pages/ArticleManagement";
import PriceAgreements from "./pages/PriceAgreements";
import Users from "./pages/Users";

import { ToastProvider } from "./components/Toast";

function App() {
  const [theme, setTheme] = useState("dark");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ language persist (refresh pe reset nahi hoga)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("aios_language") || "en";
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("aios_language", language);
  }, [language]);

  // try auto-login
  useEffect(() => {
    const stored = localStorage.getItem("aios_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("aios_token");
    localStorage.removeItem("aios_user");
    setUser(null);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard theme={theme} language={language} />;

      case "cabins":
        return <Cabins theme={theme} language={language} />;

      case "calendar":
      case "bookings":
        return <Bookings theme={theme} language={language} />;

      case "customers":
      case "club":
        return <Customers theme={theme} language={language} />;

      case "cash-register":
      case "vouchers":
      case "reports":
        return <Reports theme={theme} language={language} />;

      case "ai-reading-manager":
        return <ReadingManager theme={theme} language={language} />;

      case "settings":
        return <Settings theme={theme} language={language} />;

      case "articles": // New route
        return <ArticleManagement theme={theme} language={language} onNavigate={handleNavigate} />;

      case "items":
        return <Cabins theme={theme} language={language} />;

      case "users":
        return <Users key={language} theme={theme} language={language} />;

      case "pricing":
        return <CabinPricing theme={theme} language={language} />;

      case "price-agreements":
        return <PriceAgreements key={language} theme={theme} onNavigate={handleNavigate} />;

      default:
        return <Dashboard theme={theme} language={language} />;
    }
  };

  if (!user) {
    return (
      <ToastProvider>
        <Login theme={theme} onLoginSuccess={handleLoginSuccess} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div
        className={
          theme === "dark"
            ? "min-h-screen bg-slate-950 text-slate-50"
            : "min-h-screen bg-slate-50 text-slate-900"
        }
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            theme={theme}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            language={language}
          />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar
              theme={theme}
              onToggleTheme={toggleTheme}
              onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
              language={language}
              onChangeLanguage={setLanguage}
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-y-auto">{renderPage()}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
