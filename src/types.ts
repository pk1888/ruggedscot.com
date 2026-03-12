export interface Post {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Travel' | 'Recipe' | 'Hill Climbing' | 'Hobbies' | 'Thoughts';
  date: string;
  image: string;
  readTime: string;
  keywords?: string[];
}

export interface Page {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  hero_image?: string;
  quote?: string;
  slug: string;
  has_form?: boolean;
}

export type Theme = 'light' | 'dark';
