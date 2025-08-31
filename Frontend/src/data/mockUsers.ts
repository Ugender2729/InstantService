export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  type: 'user' | 'provider';
  skills?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "9876543210",
    address: "123 Main Street, Mumbai",
    type: "user",
    skills: "Mathematics tutoring, House cleaning"
  },
  {
    id: "provider-1",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
    phone: "9876543211",
    address: "456 Oak Avenue, Delhi",
    type: "provider",
    skills: "Mathematics Tutoring, Physics, Event Planning"
  },
  {
    id: "user-2",
    name: "Maria Garcia",
    email: "maria@example.com",
    password: "password123",
    phone: "9876543212",
    address: "789 Pine Road, Bangalore",
    type: "user",
    skills: "House cleaning, Event planning"
  },
  {
    id: "provider-2",
    name: "David Kumar",
    email: "david@example.com",
    password: "password123",
    phone: "9876543213",
    address: "321 Elm Street, Pune",
    type: "provider",
    skills: "House Cleaning, Moving Services, Event Planning"
  }
]; 