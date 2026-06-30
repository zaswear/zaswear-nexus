import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import Bookmarks from "./pages/Bookmarks";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="proyectos/:id" element={<ProjectDetail />} />
        <Route path="tareas" element={<Tasks />} />
        <Route path="enlaces" element={<Bookmarks />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
