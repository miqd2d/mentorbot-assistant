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
      assignments: {
        Row: {
          created_at: string
          description: string | null
          due_date: string
          id: string
          name: string
          professor_id: string
          subject: string
          submission_rate: number
          submitted_count: number
          total_students: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          name: string
          professor_id: string
          subject: string
          submission_rate?: number
          submitted_count?: number
          total_students?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          name?: string
          professor_id?: string
          subject?: string
          submission_rate?: number
          submitted_count?: number
          total_students?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignments_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          absent_count: number
          class_session_id: string
          created_at: string
          date: string
          id: string
          present_count: number
          professor_id: string
        }
        Insert: {
          absent_count?: number
          class_session_id: string
          created_at?: string
          date: string
          id?: string
          present_count?: number
          professor_id: string
        }
        Update: {
          absent_count?: number
          class_session_id?: string
          created_at?: string
          date?: string
          id?: string
          present_count?: number
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          batch: string
          created_at: string
          duration: string
          id: string
          is_ongoing: boolean | null
          location: string
          professor_id: string
          subject: string
          time: string
        }
        Insert: {
          batch: string
          created_at?: string
          duration: string
          id?: string
          is_ongoing?: boolean | null
          location: string
          professor_id: string
          subject: string
          time: string
        }
        Update: {
          batch?: string
          created_at?: string
          duration?: string
          id?: string
          is_ongoing?: boolean | null
          location?: string
          professor_id?: string
          subject?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          id: string
          notification_id: string
          student_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          student_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          professor_id: string
          sent_at: string
          status: string
          subject: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          professor_id: string
          sent_at?: string
          status: string
          subject?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          professor_id?: string
          sent_at?: string
          status?: string
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          avatar: string | null
          created_at: string
          department: string
          email: string
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          department: string
          email: string
          id?: string
          name: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          department?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_attendance: {
        Row: {
          attendance_record_id: string
          created_at: string
          id: string
          present: boolean
          student_id: string
        }
        Insert: {
          attendance_record_id: string
          created_at?: string
          id?: string
          present?: boolean
          student_id: string
        }
        Update: {
          attendance_record_id?: string
          created_at?: string
          id?: string
          present?: boolean
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_attendance_record_id_fkey"
            columns: ["attendance_record_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar: string | null
          batch: string
          created_at: string
          department: string
          email: string
          id: string
          name: string
          roll_number: string
        }
        Insert: {
          avatar?: string | null
          batch: string
          created_at?: string
          department: string
          email: string
          id?: string
          name: string
          roll_number: string
        }
        Update: {
          avatar?: string | null
          batch?: string
          created_at?: string
          department?: string
          email?: string
          id?: string
          name?: string
          roll_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
