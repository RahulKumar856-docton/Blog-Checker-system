import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogs, updateBlogStatus, submitFeedback, Blog } from "../lib/api";
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Activity, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { getSimilarityColor, getStatusColor } from "../lib/utils";

export default function BlogReport() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackReason, setFeedbackReason] = useState("Inaccurate Similarity Score");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchBlogs().then((blogs) => {
      const b = blogs.find((b) => b.id === id);
      if (b) setBlog(b);
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async (status: string, reason?: string) => {
    if (!blog) return;
    const updated = await updateBlogStatus(blog.id, status, reason);
    setBlog(updated);
    setIsRejecting(false);
    setRejectReason("");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !feedbackText) return;
    setIsSubmittingFeedback(true);
    try {
      const updated = await submitFeedback(blog.id, feedbackReason, feedbackText);
      setBlog(updated);
      setFeedbackText("");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Report not found</h2>
        <Link to="/blogs" className="text-blue-400 mt-4 inline-block hover:underline">Return to Blogs</Link>
      </div>
    );
  }

  const aiDecision = blog.aiReport?.decision || (blog.similarityScore > 70 ? "Copyright Risk" : blog.similarityScore > 30 ? "Needs Manual Review" : "Original");

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Blogs
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
            <span>ID: {blog.id}</span>
            <span>•</span>
            <span>Uploaded: {format(new Date(blog.uploadDate), "MMM dd, yyyy h:mm a")}</span>
            <span>•</span>
            <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${
                      blog.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      blog.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
              Status: {blog.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {blog.status === "pending" && !isRejecting && (
            <>
              <button onClick={() => handleUpdateStatus("approved")} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2 border border-emerald-500/30">
                <CheckCircle2 size={18} /> Approve
              </button>
              <button onClick={() => setIsRejecting(true)} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2 border border-rose-500/30">
                <ShieldAlert size={18} /> Reject
              </button>
            </>
          )}
        </div>
      </div>

      {isRejecting && (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-rose-400" size={20} />
            Provide Rejection Reason
          </h3>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 resize-none"
            rows={3}
            placeholder="Explain why this content is being rejected..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsRejecting(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={() => handleUpdateStatus("rejected", rejectReason)} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-colors border border-rose-500/30">
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {blog.status === "rejected" && blog.rejectionReason && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-rose-300 uppercase tracking-widest mb-1">Rejection Reason</h4>
            <p className="text-sm text-rose-100">{blog.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Summary Card */}
        <div className="md:col-span-1 bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center justify-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1" style={{ backgroundColor: blog.similarityScore > 70 ? '#ef4444' : blog.similarityScore > 30 ? '#f59e0b' : '#10b981' }} />
          
          <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs">AI Similarity Score</h3>
          
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="351.8"
                strokeDashoffset={351.8 - (351.8 * blog.similarityScore) / 100}
                className={blog.similarityScore < 30 ? "text-emerald-400" : blog.similarityScore < 70 ? "text-amber-400" : "text-rose-400"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-3xl font-black text-white">{blog.similarityScore}%</div>
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 font-bold text-lg text-white">
              {blog.similarityScore > 70 ? <ShieldAlert className="text-rose-400" /> : blog.similarityScore > 30 ? <AlertTriangle className="text-amber-400" /> : <CheckCircle2 className="text-emerald-400" />}
              {aiDecision}
            </div>
            {blog.aiReport?.confidenceScore && (
              <p className="text-xs text-slate-400 mt-1">AI Confidence: {blog.aiReport.confidenceScore}%</p>
            )}
          </div>
        </div>

        {/* Matches Overview */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <Activity className="text-blue-400" size={20} />
            <h3 className="font-bold text-white">Matched Sources</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[300px]">
            {(!blog.aiReport?.matches || blog.aiReport.matches.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-8">
                <CheckCircle2 size={32} className="text-emerald-400" />
                <p>No identical external sources found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blog.aiReport.matches.map((match, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white">{match.platform}</span>
                      {match.url && (
                        <a href={match.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-sm font-medium">
                          <ExternalLink size={14} /> Source
                        </a>
                      )}
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-sm text-slate-300 italic border-l-4 border-l-rose-400">
                      "{match.matchingText}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
         <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <FileText className="text-blue-400" size={20} />
            <h3 className="font-bold text-white">Content Preview</h3>
          </div>
          <div className="p-6">
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Summary</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{blog.summary || "No summary available."}</p>
            </div>
            <p className="font-semibold text-white mb-4 pb-4 border-b border-white/10">{blog.description}</p>
            <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
      </div>

      {/* User Feedback Mechanism */}
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <MessageSquare className="text-blue-400" size={20} />
          <h3 className="font-bold text-white">Verification Feedback</h3>
        </div>
        <div className="p-6">
          {blog.feedback && blog.feedback.length > 0 ? (
            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-medium text-slate-400">Previous Feedback:</h4>
              {blog.feedback.map((fb, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 block">{fb.reason}</span>
                  <p className="text-sm text-slate-300">{fb.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Flag Result As</label>
              <select 
                value={feedbackReason}
                onChange={(e) => setFeedbackReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white"
              >
                <option value="Inaccurate Similarity Score" className="bg-slate-900">Inaccurate Similarity Score</option>
                <option value="Incorrect Source Match" className="bg-slate-900">Incorrect Source Match</option>
                <option value="Unfair Rejection" className="bg-slate-900">Unfair Rejection</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Explanation</label>
              <textarea
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 resize-none"
                rows={3}
                placeholder="Briefly explain why you disagree with the AI's analysis..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmittingFeedback || !feedbackText}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors border border-blue-500/30 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingFeedback ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
