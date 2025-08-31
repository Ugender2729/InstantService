import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminUser, adminUsers } from '@/data/adminUsers';

interface AdminContextType {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const adminLogin = (email: string, password: string): boolean => {
    console.log('Admin login attempt:', { email, password });
    console.log('Available admin users:', adminUsers);
    
    const foundAdmin = adminUsers.find(
      (a: AdminUser) => a.email === email && a.password === password
    );

    console.log('Found admin:', foundAdmin);

    if (foundAdmin) {
      setAdmin(foundAdmin);
      localStorage.setItem('admin', JSON.stringify(foundAdmin));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    return admin.permissions.includes(permission);
  };

  // Check for existing admin session on mount
  React.useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing saved admin:', error);
        localStorage.removeItem('admin');
      }
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAdminAuthenticated: !!admin,
        adminLogin,
        adminLogout,
        hasPermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}; 