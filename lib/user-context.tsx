'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AnonUser {
  type: 'anon';
  id: string;
  name: string;
}

interface AuthUser {
  type: 'auth';
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export type AppUser = AnonUser | AuthUser;

const UserContext = createContext<AppUser | null>(null);

const ANON_ID_KEY = 'quiz_anon_id';
const ANON_NAME_KEY = 'quiz_anon_name';

function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function getAnonId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ANON_ID_KEY);
}

export function getAnonName(): string {
  if (typeof window === 'undefined') return 'Guest';
  return localStorage.getItem(ANON_NAME_KEY) || 'Guest';
}

export function setAnonName(name: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ANON_NAME_KEY, name);
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      setUser({
        type: 'auth',
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        isAdmin: session.user.isAdmin ?? false,
      });
    } else {
      setUser({
        type: 'anon',
        id: getOrCreateAnonId(),
        name: getAnonName(),
      });
    }
  }, [session, status]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): AppUser | null {
  return useContext(UserContext);
}
