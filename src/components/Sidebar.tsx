import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Upload, ShieldAlert, Settings, LogOut, FileCheck } from "lucide-react";
import { cn } from "../lib/utils";

export default function Sidebar({ user }: { user: any }) {
  const location = useLocation();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/blogs", icon: FileText, label: "All Blogs" },
    { to: "/upload", icon: Upload, label: "Upload Blog" },
  ];

  if (user?.role === "admin") {
    links.push({ to: "/reports", icon: ShieldAlert, label: "Plagiarism Reports" });
  }

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen flex flex-col hidden md:flex z-10 relative">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">VERIFY.AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                isActive
                  ? "bg-white/10 border border-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-blue-600/20 rounded-2xl p-4 border border-blue-400/30">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-2">Security Status</p>
          <p className="text-sm text-blue-100">Enterprise Protection Active</p>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl w-full transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-white/5 rounded-xl w-full transition-colors mt-1">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
