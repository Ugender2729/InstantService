export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export const adminUsers: AdminUser[] = [
  {
    id: "admin-1",
    name: "Ugender Admin",
    email: "Ugenderdharavath@gmail.com",
    password: "9398601984",
    role: "super_admin",
    permissions: ["view_bookings", "confirm_bookings", "view_payments", "manage_users", "view_all_data", "admin_access", "delete_users", "manage_providers", "system_settings"]
  },
  {
    id: "admin-2",
    name: "Test Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    permissions: ["view_bookings", "confirm_bookings", "view_payments", "manage_users", "view_all_data", "admin_access"]
  }
]; 