export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          resource: string
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          resource: string
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          resource?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      availabilities: {
        Row: {
          created_at: string | null
          date: string
          end_time: string | null
          freelancer_id: string | null
          id: string
          notes: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time?: string | null
          freelancer_id?: string | null
          id?: string
          notes?: string | null
          start_time?: string | null
          status: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string | null
          freelancer_id?: string | null
          id?: string
          notes?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          client_id: string | null
          completed_at: string | null
          contract_url: string | null
          created_at: string | null
          deposit_amount: number
          event_date: string
          freelancer_id: string | null
          id: string
          location: string
          offer_id: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          contract_url?: string | null
          created_at?: string | null
          deposit_amount: number
          event_date: string
          freelancer_id?: string | null
          id?: string
          location: string
          offer_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          contract_url?: string | null
          created_at?: string | null
          deposit_amount?: number
          event_date?: string
          freelancer_id?: string | null
          id?: string
          location?: string
          offer_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          equipment: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_pro_member: boolean | null
          portfolio_links: string[] | null
          profile_strength: number | null
          rating: number | null
          total_jobs: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          equipment?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id: string
          is_pro_member?: boolean | null
          portfolio_links?: string[] | null
          profile_strength?: number | null
          rating?: number | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          equipment?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_pro_member?: boolean | null
          portfolio_links?: string[] | null
          profile_strength?: number | null
          rating?: number | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_specialties: {
        Row: {
          freelancer_id: string
          specialty: Database["public"]["Enums"]["specialty"]
        }
        Insert: {
          freelancer_id: string
          specialty: Database["public"]["Enums"]["specialty"]
        }
        Update: {
          freelancer_id?: string
          specialty?: Database["public"]["Enums"]["specialty"]
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_specialties_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          offer_id: string | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content: string
          id?: string
          offer_id?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          offer_id?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          budget: number
          client_id: string | null
          created_at: string | null
          description: string
          duration: number | null
          event_date: string
          event_time: string | null
          freelancer_id: string | null
          id: string
          location: string
          specialty: Database["public"]["Enums"]["specialty"]
          status: Database["public"]["Enums"]["offer_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget: number
          client_id?: string | null
          created_at?: string | null
          description: string
          duration?: number | null
          event_date: string
          event_time?: string | null
          freelancer_id?: string | null
          id?: string
          location: string
          specialty: Database["public"]["Enums"]["specialty"]
          status?: Database["public"]["Enums"]["offer_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget?: number
          client_id?: string | null
          created_at?: string | null
          description?: string
          duration?: number | null
          event_date?: string
          event_time?: string | null
          freelancer_id?: string | null
          id?: string
          location?: string
          specialty?: Database["public"]["Enums"]["specialty"]
          status?: Database["public"]["Enums"]["offer_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          gateway_data: Json | null
          gateway_id: string | null
          id: string
          paid_at: string | null
          payment_method: string
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          gateway_data?: Json | null
          gateway_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          gateway_data?: Json | null
          gateway_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          audio_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          freelancer_id: string | null
          id: string
          image_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          freelancer_id?: string | null
          id?: string
          image_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          freelancer_id?: string | null
          id?: string
          image_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          whatsapp_notification_opt_in: boolean
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          whatsapp_notification_opt_in?: boolean
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          whatsapp_notification_opt_in?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          giver_id: string | null
          id: string
          rating: number
          receiver_id: string | null
          responded_at: string | null
          response: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          giver_id?: string | null
          id?: string
          rating: number
          receiver_id?: string | null
          responded_at?: string | null
          response?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          giver_id?: string | null
          id?: string
          rating?: number
          receiver_id?: string | null
          responded_at?: string | null
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_giver_id_fkey"
            columns: ["giver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string
          gateway_id: string | null
          id: string
          plan_name: string | null
          price: number
          starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          gateway_id?: string | null
          id?: string
          plan_name?: string | null
          price: number
          starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          gateway_id?: string | null
          id?: string
          plan_name?: string | null
          price?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_freelancer_info: {
        Args: { freelancer_id: string }
        Returns: {
          avatar_url: string
          bio: string
          city: string
          experience_years: number
          full_name: string
          hourly_rate: number
          id: string
          is_pro_member: boolean
          rating: number
          state: string
          total_reviews: number
        }[]
      }
    }
    Enums: {
      availability_status: "available" | "unavailable" | "partially_available"
      booking_status: "confirmed" | "in_progress" | "completed" | "cancelled"
      offer_status: "pending" | "accepted" | "rejected" | "counter_proposed"
      payment_status: "pending" | "paid" | "refunded" | "failed"
      specialty:
        | "audio_engineer"
        | "sound_technician"
        | "mixing_engineer"
        | "mastering_engineer"
        | "camera_operator"
        | "video_editor"
        | "colorist"
        | "motion_graphics"
        | "lighting_technician"
        | "gaffer"
        | "electrician"
        | "live_streaming"
        | "broadcast_engineer"
        | "video_streaming"
        | "dj"
        | "vj"
        | "live_performance"
        | "producer"
        | "director"
        | "assistant_director"
        | "photographer"
        | "drone_operator"
        | "steadicam_operator"
      subscription_status: "active" | "cancelled" | "expired"
      user_type: "freelancer" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      availability_status: ["available", "unavailable", "partially_available"],
      booking_status: ["confirmed", "in_progress", "completed", "cancelled"],
      offer_status: ["pending", "accepted", "rejected", "counter_proposed"],
      payment_status: ["pending", "paid", "refunded", "failed"],
      specialty: [
        "audio_engineer",
        "sound_technician",
        "mixing_engineer",
        "mastering_engineer",
        "camera_operator",
        "video_editor",
        "colorist",
        "motion_graphics",
        "lighting_technician",
        "gaffer",
        "electrician",
        "live_streaming",
        "broadcast_engineer",
        "video_streaming",
        "dj",
        "vj",
        "live_performance",
        "producer",
        "director",
        "assistant_director",
        "photographer",
        "drone_operator",
        "steadicam_operator",
      ],
      subscription_status: ["active", "cancelled", "expired"],
      user_type: ["freelancer", "client"],
    },
  },
} as const
