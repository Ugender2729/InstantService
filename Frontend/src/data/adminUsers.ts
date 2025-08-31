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
    email: "ugenderdharavath@gmail.com",
    password: "9381493260",
    role: "admin",
    permissions: ["view_bookings", "confirm_bookings", "view_payments", "manage_users", "view_all_data", "admin_access"]
  }
]; 