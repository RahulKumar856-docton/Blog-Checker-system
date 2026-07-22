import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

export default function TopNav({ user }: { user: any }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Verification Complete",
      message: "Blog 'The Future of AI' has been analyzed.",
      time: "2m ago"
    },
    {
      id: 2,
      type: "warning",
      title: "Manual Review Required",
      message: "Blog 'Tech Trends 2024' requires manual review (Similarity: 45%).",
      time: "1h ago"
    },
    {
      id: 3,
      type: "error",
      title: "Content Rejected",
      message: "Blog 'React Fundamentals' was auto-rejected due to high similarity.",
      time: "3h ago"
    }
  ];

  return (
    <header className="h-16 bg-transparent border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-96 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search blogs, reports, authors..."
          className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative text-slate-400 hover:text-white transition-colors flex items-center justify-center mt-1"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-bold text-white text-sm">System Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 items-start cursor-default">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === "success" && <CheckCircle size={16} className="text-emerald-400" />}
                      {notif.type === "warning" && <AlertTriangle size={16} className="text-amber-400" />}
                      {notif.type === "error" && <ShieldAlert size={16} className="text-rose-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{notif.title}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] font-medium text-slate-500 mt-2 uppercase tracking-wider">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-white/5 border-t border-white/10 text-center hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Mark All as Read</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
