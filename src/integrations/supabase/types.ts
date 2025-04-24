export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          message: string
          sender_email: string
          sender_role: string
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          message: string
          sender_email: string
          sender_role: string
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          message?: string
          sender_email?: string
          sender_role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          script_answer: Json | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          script_answer?: Json | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          script_answer?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      configurations: {
        Row: {
          default_message: string | null
          id: string
          updated_at: string | null
          webhook_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          default_message?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          default_message?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      coverage_areas: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          estado: string | null
          id: string
          rua: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          rua?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          rua?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          birth_date: string | null
          business_type: string | null
          cep: string
          city: string
          complement: string | null
          cpf: string
          created_at: string | null
          email: string
          id: string
          lead_id: string | null
          name: string
          neighborhood: string | null
          number: string | null
          plan_type: string | null
          reference: string | null
          rg: string | null
          state: string
          status: string
          street: string
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          birth_date?: string | null
          business_type?: string | null
          cep: string
          city: string
          complement?: string | null
          cpf: string
          created_at?: string | null
          email: string
          id?: string
          lead_id?: string | null
          name: string
          neighborhood?: string | null
          number?: string | null
          plan_type?: string | null
          reference?: string | null
          rg?: string | null
          state: string
          status?: string
          street: string
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          birth_date?: string | null
          business_type?: string | null
          cep?: string
          city?: string
          complement?: string | null
          cpf?: string
          created_at?: string | null
          email?: string
          id?: string
          lead_id?: string | null
          name?: string
          neighborhood?: string | null
          number?: string | null
          plan_type?: string | null
          reference?: string | null
          rg?: string | null
          state?: string
          status?: string
          street?: string
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          subject: string
          type: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          filename: string
          id: string
          processed_rows: number | null
          status: string | null
          total_rows: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          filename: string
          id?: string
          processed_rows?: number | null
          status?: string | null
          total_rows?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          filename?: string
          id?: string
          processed_rows?: number | null
          status?: string | null
          total_rows?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          birthDate: string | null
          businesstype: string | null
          cep: string
          city: string | null
          complement: string | null
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          neighborhood: string | null
          number: string | null
          origem: string | null
          plantype: string | null
          reference: string | null
          rg: string | null
          session_id: string | null
          state: string | null
          status: string
          street: string | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          birthDate?: string | null
          businesstype?: string | null
          cep: string
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          neighborhood?: string | null
          number?: string | null
          origem?: string | null
          plantype?: string | null
          reference?: string | null
          rg?: string | null
          session_id?: string | null
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          birthDate?: string | null
          businesstype?: string | null
          cep?: string
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          origem?: string | null
          plantype?: string | null
          reference?: string | null
          rg?: string | null
          session_id?: string | null
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      marketing_config: {
        Row: {
          created_at: string | null
          custom_scripts: string | null
          favicon: string | null
          gtm_id: string | null
          id: string
          meta_pixel_id: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_og_image: string | null
          seo_title: string | null
          tracking_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_scripts?: string | null
          favicon?: string | null
          gtm_id?: string | null
          id?: string
          meta_pixel_id?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_og_image?: string | null
          seo_title?: string | null
          tracking_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_scripts?: string | null
          favicon?: string | null
          gtm_id?: string | null
          id?: string
          meta_pixel_id?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_og_image?: string | null
          seo_title?: string | null
          tracking_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          message: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          message: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          message?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          chave: string
          valor: string | null
        }
        Insert: {
          chave: string
          valor?: string | null
        }
        Update: {
          chave?: string
          valor?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string | null
          role?: string
        }
        Relationships: []
      }
      viability: {
        Row: {
          cep: string
          city: string | null
          complement: string | null
          created_at: string | null
          id: string
          is_viable: boolean
          neighborhood: string | null
          number: string | null
          state: string | null
          street: string | null
          updated_at: string | null
        }
        Insert: {
          cep: string
          city?: string | null
          complement?: string | null
          created_at?: string | null
          id?: string
          is_viable?: boolean
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string
          city?: string | null
          complement?: string | null
          created_at?: string | null
          id?: string
          is_viable?: boolean
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      website_visits: {
        Row: {
          id: string
          is_recurring: boolean | null
          page_url: string
          visit_date: string | null
          visitor_id: string
        }
        Insert: {
          id?: string
          is_recurring?: boolean | null
          page_url: string
          visit_date?: string | null
          visitor_id: string
        }
        Update: {
          id?: string
          is_recurring?: boolean | null
          page_url?: string
          visit_date?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      whatsapp_settings: {
        Row: {
          attendant_number: string
          created_at: string | null
          default_message: string
          id: string
          meta_api_token: string
          phone_number_id: string
          updated_at: string | null
        }
        Insert: {
          attendant_number: string
          created_at?: string | null
          default_message: string
          id?: string
          meta_api_token: string
          phone_number_id: string
          updated_at?: string | null
        }
        Update: {
          attendant_number?: string
          created_at?: string | null
          default_message?: string
          id?: string
          meta_api_token?: string
          phone_number_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_by_email: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_by_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_attendant_by_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_client_by_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_first_run: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "attendant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "attendant"],
    },
  },
} as const
