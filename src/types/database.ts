export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  name_en: string | null;
  slug: string;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  name_en: string | null;
  model_name: string | null;
  description: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  specs: Record<string, string>;
  drawing_pdf_url: string | null;
  drawing_dwg_url: string | null;
  drawing_img_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
}

export interface Document {
  id: string;
  product_id: string | null;
  title: string;
  type: 'catalog' | 'drawing' | 'manual' | 'other';
  file_url: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  created_at: string;
}

export interface Certificate {
  id: string;
  name: string;
  name_en: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface CompanyInfo {
  id: string;
  section: 'greeting' | 'history' | 'certificates' | 'location';
  content: Record<string, unknown>;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  location: string | null;
  year: number | null;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  sort_order: number;
}
