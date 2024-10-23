import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  containerName: string;
}

interface UserContextType {
  user: User | null;
  authToken: string | null;
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const testUser: User = {
  id: '123',
  name: 'Test User',
  email: 'test@test.com',
  containerName: 'sanfransisco',
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(testUser);
  const [authToken, setAuthToken] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, authToken, setUser, setAuthToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
