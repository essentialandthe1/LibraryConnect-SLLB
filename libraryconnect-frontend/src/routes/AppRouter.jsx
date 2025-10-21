import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "../pages/Test";
import Login from "../pages/Login";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
