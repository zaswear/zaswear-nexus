export interface Project {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
  tag: string;
  category: string;
  type: string;
  size?: "lg" | "md" | "sm";
  desc?: string;
  widget?: { type: string; url: string };
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  projectId?: string;
  createdAt: number;
}

export interface Idea {
  id: string;
  text: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  label: string;
  url: string;
  createdAt: number;
}
