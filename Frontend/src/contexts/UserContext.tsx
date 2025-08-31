import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'user' | 'provider';
  skills?: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  login: (userData: Omit<User, 'isAuthenticated'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userType: 'user' | 'provider' | null;
  // Add function to save user data
  saveUserData: (userData: Omit<User, 'isAuthenticated'>) => void;
  getAllUsers: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: Omit<User, 'isAuthenticated'>) => {
    const userWithAuth = {
      ...userData,
      isAuthenticated: true,
    };
    setUser(userWithAuth);
    localStorage.setItem('currentUser', JSON.stringify(userWithAuth));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const saveUserData = (userData: Omit<User, 'isAuthenticated'>) => {
    const userWithAuth = {
      ...userData,
      isAuthenticated: true,
    };
    
    // Save to current user
    setUser(userWithAuth);
    localStorage.setItem('currentUser', JSON.stringify(userWithAuth));
    
    // Save to all users list
    const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const updatedUsers = existingUsers.filter((u: User) => u.id !== userData.id);
    updatedUsers.push(userWithAuth);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };

  const getAllUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem('allUsers') || '[]');
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  };

  React.useEffect(() => {
    // Load current user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user?.isAuthenticated || false,
        userType: user?.type || null,
        saveUserData,
        getAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 