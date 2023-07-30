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
      addresses: {
        Row: {
          address: string
          created_at: string
        }
        Insert: {
          address: string
          created_at?: string
        }
        Update: {
          address?: string
          created_at?: string
        }
        Relationships: []
      }
      shield_account_addresses: {
        Row: {
          address: string | null
          created_at: string
          shield_account_id: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          shield_account_id?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          shield_account_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shield_account_addresses_address_fkey"
            columns: ["address"]
            referencedRelation: "addresses"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "shield_account_addresses_shield_account_id_fkey"
            columns: ["shield_account_id"]
            referencedRelation: "shield_accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      shield_account_invitations: {
        Row: {
          created_at: string
          inviter_address: string | null
          recipient_address: string | null
          shield_account_id: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          inviter_address?: string | null
          recipient_address?: string | null
          shield_account_id?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          inviter_address?: string | null
          recipient_address?: string | null
          shield_account_id?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shield_account_invitations_inviter_address_fkey"
            columns: ["inviter_address"]
            referencedRelation: "addresses"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "shield_account_invitations_recipient_address_fkey"
            columns: ["recipient_address"]
            referencedRelation: "addresses"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "shield_account_invitations_shield_account_id_fkey"
            columns: ["shield_account_id"]
            referencedRelation: "shield_accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      shield_account_user_op_signatures: {
        Row: {
          created_at: string
          proof: string | null
          shield_account_id: number | null
          signer: string | null
          user_op_id: number | null
        }
        Insert: {
          created_at?: string
          proof?: string | null
          shield_account_id?: number | null
          signer?: string | null
          user_op_id?: number | null
        }
        Update: {
          created_at?: string
          proof?: string | null
          shield_account_id?: number | null
          signer?: string | null
          user_op_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shield_account_user_op_signatures_shield_account_id_fkey"
            columns: ["shield_account_id"]
            referencedRelation: "shield_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shield_account_user_op_signatures_signer_fkey"
            columns: ["signer"]
            referencedRelation: "addresses"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "shield_account_user_op_signatures_user_op_id_fkey"
            columns: ["user_op_id"]
            referencedRelation: "shield_account_user_ops"
            referencedColumns: ["id"]
          }
        ]
      }
      shield_account_user_ops: {
        Row: {
          created_at: string
          data: string | null
          id: number
          shield_account_id: number | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          id?: number
          shield_account_id?: number | null
        }
        Update: {
          created_at?: string
          data?: string | null
          id?: number
          shield_account_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shield_account_user_ops_shield_account_id_fkey"
            columns: ["shield_account_id"]
            referencedRelation: "shield_accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      shield_accounts: {
        Row: {
          created_at: string
          id: number
          name: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          status?: string | null
          updated_at?: string
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
