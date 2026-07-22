import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, Blog } from "../lib/api";
import { getSimilarityColor, getStatusColor } from "../lib/utils";
import { format } from "date-fns";
import { FileText, ChevronRight, ShieldAlert, CheckCircle2, X } from "lucide-react";

export default function BlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>("All");

  useEffect(() => {
    fetchBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const filteredBlogs = filterTopic === "All" ? blogs : blogs.filter(b => b.topic === filterTopic);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Blogs</h1>
          <p className="text-slate-400 mt-1">Manage and review uploaded content.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white w-full md:w-48"
          >
            <option value="All" className="bg-slate-900">All Topics</option>
            <option value="General" className="bg-slate-900">General</option>
            <option value="Technology" className="bg-slate-900">Technology</option>
            <option value="Science" className="bg-slate-900">Science</option>
            <option value="Business" className="bg-slate-900">Business</option>
            <option value="Health" className="bg-slate-900">Health</option>
            <option value="Arts" className="bg-slate-900">Arts</option>
          </select>
          <Link
            to="/upload"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-sm whitespace-nowrap"
          >
            Upload New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBlogs.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg p-12 rounded-3xl border border-white/10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No blogs found</h3>
              <p className="text-slate-400 mt-2">You haven't uploaded any content yet.</p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setPreviewBlog(blog)}
                className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center group cursor-pointer"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${
                      blog.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      blog.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {blog.status}
                    </span>
                    {blog.topic && (
                      <span className="px-3 py-1 rounded text-[10px] font-bold uppercase border bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {blog.topic}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 line-clamp-2">{blog.summary || blog.description}</p>
                  <p className="text-xs font-medium text-slate-500">
                    Uploaded on {format(new Date(blog.uploadDate), "MMMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto p-4 bg-black/20 rounded-xl md:bg-transparent md:p-0">
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Similarity</span>
                    <div className="flex items-center gap-2">
                      {blog.similarityScore > 70 ? (
                        <ShieldAlert className="text-rose-400" size={20} />
                      ) : (
                        <CheckCircle2 className={blog.similarityScore < 30 ? "text-emerald-400" : "text-amber-400"} size={20} />
                      )}
                      <span className={`text-2xl font-black ${
                        blog.similarityScore < 30 ? "text-emerald-400" :
                        blog.similarityScore < 70 ? "text-amber-400" :
                        "text-rose-400"
                      }`}>
                        {blog.similarityScore}%
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/reports/${blog.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto md:mt-2 text-blue-400 flex items-center gap-1 font-medium text-sm group-hover:underline"
                  >
                    View Report <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white truncate pr-4">{previewBlog.title}</h2>
              <button 
                onClick={() => setPreviewBlog(null)}
                className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                   <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${
                     previewBlog.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                     previewBlog.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                     'bg-amber-500/20 text-amber-300 border-amber-500/30'
                   }`}>
                     {previewBlog.status}
                   </span>
                   {previewBlog.topic && (
                     <span className="px-3 py-1 rounded text-[10px] font-bold uppercase border bg-blue-500/20 text-blue-300 border-blue-500/30">
                       {previewBlog.topic}
                     </span>
                   )}
                   <span className="text-sm font-medium text-slate-400">
                     Uploaded on {format(new Date(previewBlog.uploadDate), "MMM dd, yyyy")}
                   </span>
                </div>
                
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase">Similarity:</span>
                  <span className={`text-sm font-black ${
                     previewBlog.similarityScore < 30 ? "text-emerald-400" :
                     previewBlog.similarityScore < 70 ? "text-amber-400" :
                     "text-rose-400"
                   }`}>
                     {previewBlog.similarityScore}%
                   </span>
                </div>
              </div>

              {previewBlog.summary && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{previewBlog.summary}</p>
                </div>
              )}

              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Content Preview</h4>
                 <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm line-clamp-[10]">
                   {previewBlog.content}
                 </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 mt-auto">
              <button 
                onClick={() => setPreviewBlog(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Close Preview
              </button>
              <Link
                to={`/reports/${previewBlog.id}`}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2 border border-blue-500/30"
              >
                View Full Report <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
