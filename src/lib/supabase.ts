import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface News {
  id: string
  title: string
  content: string
  published: boolean
  date: string
  featured_image?: string
  author: string
  created_by: string
  created_at?: string
  updated_at?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_url?: string
  external_url?: string
  date: string
  created_at?: string
  updated_at?: string
}

export interface Collaborator {
  id: string
  name: string
  description: string
  logo_url?: string
  website_url?: string
  featured: boolean
  created_at?: string
  updated_at?: string
}