import { HashRouter, Routes, Route } from "react-router-dom";
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
import RequireRole from "./pages/RequireRole";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
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
    </HashRouter>
  );
}