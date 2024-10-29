import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import getAuthToken from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  containerName: string;
  indexName: string;
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
  indexName: 'sanfransisco',
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(testUser);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    getAuthToken().then((token) => {
      setAuthToken(token);
    });
  }, [user]);


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
