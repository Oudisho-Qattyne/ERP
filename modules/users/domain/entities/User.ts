// modules/users/domain/entities/User.ts

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: 'active' | 'inactive';
  photo: string | null;
  signature: string | null;
  role: Role;
  created_at: string;
  permissions: string[];
}

export interface RoleDetails extends Role {
  permissions: string[];
}
