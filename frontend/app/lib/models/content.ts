import { ObjectId } from 'mongodb';

export type ContentType = 'article' | 'announcement' | 'faq' | 'help';
export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Content {
  _id?: ObjectId;
  title: string;
  type: ContentType;
  content: string;
  author: string;
  authorId?: string;
  published: Date;
  publishDate?: Date; // For scheduled content
  status: ContentStatus;
  views: number;
  tags?: string[];
  featuredImage?: string;
  lastModified: Date;
  createdAt: Date;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContentStats {
  articles: number;
  announcements: number;
  faqs: number;
  help: number;
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  archived: number;
} 