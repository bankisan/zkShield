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
          nullifier: string | null
        }
        Insert: {
          address: string
          created_at?: string
          nullifier?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          nullifier?: string | null
        }
        Relationships: []
      }
      shield_account_addresses: {
        Row: {
          address: string
          created_at: string
          path: Json | null
          shield_account_id: number
        }
        Insert: {
          address: string
          created_at?: string
          path?: Json | null
          shield_account_id: number
        }
        Update: {
          address?: string
          created_at?: string
          path?: Json | null
          shield_account_id?: number
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
          inviter_address: string
          recipient_address: string
          shield_account_id: number
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          inviter_address: string
          recipient_address: string
          shield_account_id: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          inviter_address?: string
          recipient_address?: string
          shield_account_id?: number
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
          proof: Json
          signer: string
          user_op_id: number
        }
        Insert: {
          created_at?: string
          proof: Json
          signer: string
          user_op_id: number
        }
        Update: {
          created_at?: string
          proof?: Json
          signer?: string
          user_op_id?: number
        }
        Relationships: [
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
          data: Json
          id: number
          shield_account_id: number | null
        }
        Insert: {
          created_at?: string
          data: Json
          id?: number
          shield_account_id?: number | null
        }
        Update: {
          created_at?: string
          data?: Json
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
          address: string | null
          created_at: string
          id: number
          name: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          name?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
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
