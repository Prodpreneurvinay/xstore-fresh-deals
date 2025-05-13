
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      product_cities: {
        Row: {
          id: string
          product_id: string | null
          city_id: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          city_id?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          city_id?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category: string
          mrp: number
          selling_price: number
          image_url: string | null
          expiry_date: string | null
          quantity: string | null
          is_hot_deal: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          mrp: number
          selling_price: number
          image_url?: string | null
          expiry_date?: string | null
          quantity?: string | null
          is_hot_deal?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          mrp?: number
          selling_price?: number
          image_url?: string | null
          expiry_date?: string | null
          quantity?: string | null
          is_hot_deal?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
