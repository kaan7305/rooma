import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export interface LocalAuthUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  user_type: 'guest' | 'host' | 'both';
  phone: string | null;
  date_of_birth: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  student_verified: boolean;
  id_verified: boolean;
  profile_photo_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface CreateLocalAuthUserInput {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  user_type: 'guest' | 'host' | 'both';
  phone?: string | null;
  date_of_birth?: string | null;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'local-auth-users.json');

let cache: LocalAuthUser[] | null = null;

const loadUsers = async (): Promise<LocalAuthUser[]> => {
  if (cache) {
    return cache;
  }

  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cache = parsed as LocalAuthUser[];
      return cache;
    }
  } catch {
    // Fall through and initialize empty store.
  }

  cache = [];
  return cache;
};

const persistUsers = async (users: LocalAuthUser[]) => {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
  cache = users;
};

export const findLocalUserByEmail = async (email: string): Promise<LocalAuthUser | null> => {
  const users = await loadUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
};

export const findLocalUserById = async (id: string): Promise<LocalAuthUser | null> => {
  const users = await loadUsers();
  return users.find((u) => u.id === id) || null;
};

export const createLocalUser = async (input: CreateLocalAuthUserInput): Promise<LocalAuthUser> => {
  const users = await loadUsers();
  const now = new Date().toISOString();
  const normalized = input.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    throw new Error('A user with this email already exists');
  }

  const user: LocalAuthUser = {
    id: crypto.randomUUID(),
    email: normalized,
    password_hash: input.password_hash,
    first_name: input.first_name,
    last_name: input.last_name,
    user_type: input.user_type,
    phone: input.phone || null,
    date_of_birth: input.date_of_birth || null,
    email_verified: false,
    phone_verified: false,
    student_verified: false,
    id_verified: false,
    profile_photo_url: null,
    bio: null,
    created_at: now,
    updated_at: now,
    last_login: null,
  };

  users.push(user);
  await persistUsers(users);
  return user;
};

export const updateLocalUser = async (
  id: string,
  patch: Partial<LocalAuthUser>
): Promise<LocalAuthUser | null> => {
  const users = await loadUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return null;
  }

  const currentUser = users[index];
  if (!currentUser) {
    return null;
  }

  const updated: LocalAuthUser = {
    ...currentUser,
    ...patch,
    updated_at: new Date().toISOString(),
  };

  users[index] = updated;
  await persistUsers(users);
  return updated;
};
