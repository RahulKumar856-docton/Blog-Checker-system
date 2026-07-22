import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Image as ImageIcon, Video, Mic, CheckCircle2 } from "lucide-react";
import { uploadBlog } from "../lib/api";

export default function UploadBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      await uploadBlog({ title, description, content, topic });
      setSuccess(true);
      setTimeout(() => navigate("/blogs"), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Successful!</h2>
        <p className="text-slate-400">Your content is now being analyzed by our AI verification engine.</p>
        <p className="text-slate-400">Redirecting to your blogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload New Blog</h1>
        <p className="text-slate-400 mt-1">Submit your content for multi-platform AI copyright verification.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Blog Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white placeholder-slate-500"
              placeholder="Enter an engaging title..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white"
            >
              <option value="General" className="bg-slate-900">General</option>
              <option value="Technology" className="bg-slate-900">Technology</option>
              <option value="Science" className="bg-slate-900">Science</option>
              <option value="Business" className="bg-slate-900">Business</option>
              <option value="Health" className="bg-slate-900">Health</option>
              <option value="Arts" className="bg-slate-900">Arts</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Short Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 resize-none"
            placeholder="A brief summary of your blog..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Complete Content</label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-white/5 focus:bg-white/10 text-white placeholder-slate-500"
            placeholder="Write or paste your full blog content here..."
          />
        </div>

        {/* Media Upload Area (UI only for visual completeness) */}
        <div className="pt-4">
          <label className="text-sm font-semibold text-slate-300 mb-3 block">Media Attachments (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button type="button" className="border border-dashed border-white/20 bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-400 transition-all">
              <ImageIcon size={24} />
              <span className="text-sm font-medium">Add Cover Image</span>
            </button>
            <button type="button" className="border border-dashed border-white/20 bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-400 transition-all">
              <Video size={24} />
              <span className="text-sm font-medium">Embed Video</span>
            </button>
            <button type="button" className="border border-dashed border-white/20 bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-400 transition-all">
              <Mic size={24} />
              <span className="text-sm font-medium">Voice Recording</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <UploadCloud size={20} />
                Submit for Verification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
