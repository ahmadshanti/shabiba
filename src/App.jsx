import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Colleges from "./pages/Colleges";
import CollegeDetails from "./pages/CollegeDetails";
import Announcements from "./pages/Announcements";
import Chatbot from "./pages/Chatbot";
import Housing from "./pages/Housing";
import Materials from "./pages/Materials";
import Resources from "./pages/Resources";
import CollegeResources from "./pages/CollegeResources";
import MajorResources from "./pages/MajorResources";
import MaterialDetails from "./pages/MaterialDetails";
import AnnouncementDetails from "./pages/AnnouncementDetails";
import AdminLite from "./pages/AdminLite";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ScrollToTopButton from "./components/ScrollToTopButton";
import RequireRole from "./pages/RequireRole";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route
            element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}
          >
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:id" element={<CollegeDetails />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/resources" element={<Resources />} />
            <Route
              path="/resources/colleges/:collegeId"
              element={<CollegeResources />}
            />
            <Route
              path="/resources/majors/:majorId"
              element={<MajorResources />}
            />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/:id" element={<MaterialDetails />} />
            <Route path="/announcements/:id" element={<AnnouncementDetails />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireRole allowedRoles={["admin"]}>
                  <Admin />
                </RequireRole>
              }
            />
            <Route
              path="/admin-lite"
              element={
                <RequireRole allowedRoles={["admin", "admin_lite"]}>
                  <AdminLite />
                </RequireRole>
              }
            />
          </Route>
        </Routes>

        <ScrollToTopButton />
      </>
    </BrowserRouter>
  );
}