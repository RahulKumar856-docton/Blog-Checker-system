import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, FileText, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";
import { fetchBlogs, Blog } from "../lib/api";
import { getSimilarityColor } from "../lib/utils";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useOutletContext() as any;
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs().then(setBlogs);
  }, []);

  const totalBlogs = blogs.length;
  const approved = blogs.filter(b => b.status === "approved").length;
  const rejected = blogs.filter(b => b.status === "rejected").length;
  const pending = blogs.filter(b => b.status === "pending").length;

  const stats = [
    { label: "Total Uploads", value: totalBlogs, icon: FileText, color: "bg-blue-500" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "bg-green-500" },
    { label: "Rejected (Copyright)", value: rejected, icon: XCircle, color: "bg-red-500" },
    { label: "Pending Review", value: pending, icon: AlertTriangle, color: "bg-yellow-500" },
  ];

  const pieData = [
    { name: "Approved", value: approved, color: "#10b981" },
    { name: "Rejected", value: rejected, color: "#ef4444" },
    { name: "Pending", value: pending, color: "#f59e0b" },
  ];

  // Mock bar chart data
  const activityData = [
    { name: "Mon", uploads: 4 },
    { name: "Tue", uploads: 7 },
    { name: "Wed", uploads: 2 },
    { name: "Thu", uploads: 5 },
    { name: "Fri", uploads: 8 },
    { name: "Sat", uploads: 3 },
    { name: "Sun", uploads: 6 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Verification Overview</h1>
          <p className="text-slate-400 mt-1 text-sm">System performing multi-layer semantic analysis</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-sm flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Real-time Scanning Active
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter mb-1">Total Scanned</p>
          <p className="text-3xl font-light text-white">{totalBlogs}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter mb-1">Approved</p>
          <p className="text-3xl font-light text-emerald-400">{approved}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter mb-1">Pending Review</p>
          <p className="text-3xl font-light text-amber-400">{pending}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter mb-1">Similarity Detected</p>
          <p className="text-3xl font-light text-rose-400">{rejected}</p>
          <div className="mt-2 text-xs text-rose-400 font-medium">Score &gt; 70% risk rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            Upload Activity
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff1a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} dx={-10} />
                <Tooltip cursor={{ fill: "#ffffff1a" }} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #ffffff1a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} itemStyle={{ color: "#fff" }} />
                <Bar dataKey="uploads" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Status Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #ffffff1a", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-light text-white">{totalBlogs}</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs text-slate-300 font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Recent Uploads</h3>
          <button className="text-blue-400 text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Blog Title</th>
                <th className="px-6 py-4 font-bold">Upload Date</th>
                <th className="px-6 py-4 font-bold">Similarity</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.slice(0, 5).map((blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{blog.title}</p>
                    <p className="text-xs text-slate-400 truncate w-64">{blog.summary || blog.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {format(new Date(blog.uploadDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      blog.similarityScore < 30 ? "text-emerald-400" :
                      blog.similarityScore < 70 ? "text-amber-400" :
                      "text-rose-400"
                    }`}>
                      {blog.similarityScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 border rounded text-[10px] font-bold uppercase ${
                      blog.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      blog.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No blogs uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
