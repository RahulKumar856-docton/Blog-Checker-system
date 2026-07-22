import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory mock database
const db = {
  users: [
    { id: "u1", name: "Admin User", role: "admin", email: "admin@example.com" },
    { id: "u2", name: "Creator", role: "user", email: "user@example.com" },
  ],
  blogs: [
    {
      id: "b1",
      title: "The Future of Artificial Intelligence",
      description: "An overview of AI advancements.",
      content: "Artificial intelligence is evolving rapidly. We are seeing major leaps in LLMs...",
      authorId: "u2",
      uploadDate: new Date().toISOString(),
      status: "approved",
      similarityScore: 12,
      summary: "AI is rapidly evolving with major leaps in large language models. These advancements are reshaping how we interact with technology. Future implications span across multiple industries including healthcare and education.",
      feedback: [],
      rejectionReason: null,
      topic: "Technology",
      aiReport: {
        matches: [],
        decision: "Original",
      }
    }
  ],
};

// Initialize Gemini for verification
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// API Routes
const apiRouter = express.Router();

apiRouter.get("/users/me", (req, res) => {
  // Mock auth - return the user for now
  res.json(db.users[1]);
});

apiRouter.get("/blogs", (req, res) => {
  res.json(db.blogs);
});

apiRouter.post("/blogs", async (req, res) => {
  const { title, description, content, topic } = req.body;
  
  const newBlog = {
    id: crypto.randomUUID(),
    title,
    description,
    content,
    topic: topic || "General",
    authorId: "u2", // Mock creator ID
    uploadDate: new Date().toISOString(),
    status: "pending",
    similarityScore: 0,
    summary: "",
    feedback: [] as { reason: string, text: string }[],
    rejectionReason: null as string | null,
    aiReport: null as any,
  };
  
  // Verification Process
  if (ai) {
    try {
      const prompt = `
You are an advanced AI content verification and plagiarism detection engine.
Analyze the following blog content for potential plagiarism, copyright issues, and semantic similarity to known concepts or existing internet content.

Provide a JSON response with the following structure:
{
  "similarityScore": number (0-100),
  "decision": string ("Original", "Needs Manual Review", "Copyright Risk / Reject"),
  "matches": [
    {
      "platform": string (e.g. "Google", "Medium", "Reddit", "Internal DB"),
      "url": string,
      "matchingText": string
    }
  ],
  "confidenceScore": number (0-100),
  "summary": string ("A 1-3 sentence summary capturing the main points of the blog content.")
}

Blog Title: ${title}
Blog Description: ${description}
Blog Content: ${content}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const result = JSON.parse(response.text || "{}");
      newBlog.similarityScore = result.similarityScore || 0;
      newBlog.summary = result.summary || "";
      
      // Enforce business logic
      if (newBlog.similarityScore >= 70) {
        newBlog.status = "rejected";
      } else if (newBlog.similarityScore >= 31) {
        newBlog.status = "pending";
      } else {
        newBlog.status = "approved"; // Auto-approve
      }
      
      newBlog.aiReport = result;

    } catch (e) {
      console.error("AI Verification failed", e);
      newBlog.similarityScore = Math.floor(Math.random() * 100);
      newBlog.status = newBlog.similarityScore > 70 ? "rejected" : "pending";
    }
  } else {
    // Fallback without Gemini
    newBlog.similarityScore = Math.floor(Math.random() * 100);
    newBlog.status = newBlog.similarityScore > 70 ? "rejected" : "pending";
    newBlog.summary = "A brief summary of the blog content generated automatically.";
  }

  db.blogs.push(newBlog);
  res.json(newBlog);
});

apiRouter.patch("/blogs/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const blog = db.blogs.find(b => b.id === id);
  if (blog) {
    blog.status = status;
    if (reason) {
      blog.rejectionReason = reason;
    }
    res.json(blog);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

apiRouter.post("/blogs/:id/feedback", (req, res) => {
  const { id } = req.params;
  const { reason, text } = req.body;
  const blog = db.blogs.find(b => b.id === id);
  if (blog) {
    if (!blog.feedback) {
      blog.feedback = [];
    }
    blog.feedback.push({ reason, text });
    res.json(blog);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.use("/api", apiRouter);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
