import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
