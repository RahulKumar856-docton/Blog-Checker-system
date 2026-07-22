/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import BlogsList from "./pages/BlogsList";
import UploadBlog from "./pages/UploadBlog";
import BlogReport from "./pages/BlogReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="upload" element={<UploadBlog />} />
          <Route path="reports/:id" element={<BlogReport />} />
          {/* Admin routes could be separated, but for this preview they share the layout */}
          <Route path="reports" element={<BlogsList />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
