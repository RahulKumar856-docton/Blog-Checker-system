export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Match {
  platform: string;
  url: string;
  matchingText: string;
}

export interface AIReport {
  similarityScore: number;
  decision: string;
  matches: Match[];
  confidenceScore: number;
}

export interface Feedback {
  reason: string;
  text: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  authorId: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  similarityScore: number;
  aiReport?: AIReport;
  summary?: string;
  feedback?: Feedback[];
  rejectionReason?: string;
  topic?: string;
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch("/api/users/me");
  return res.json();
}

export async function fetchBlogs(): Promise<Blog[]> {
  const res = await fetch("/api/blogs");
  return res.json();
}

export async function uploadBlog(data: { title: string; description: string; content: string; topic?: string }): Promise<Blog> {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBlogStatus(id: string, status: string, reason?: string): Promise<Blog> {
  const res = await fetch(`/api/blogs/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reason }),
  });
  return res.json();
}

export async function submitFeedback(id: string, reason: string, text: string): Promise<Blog> {
  const res = await fetch(`/api/blogs/${id}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason, text }),
  });
  return res.json();
}
