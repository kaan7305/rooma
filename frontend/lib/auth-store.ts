import { create } from 'zustand';

const API_BASE_URL = '/api';

interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: string;
  email_verified: boolean;
  student_verified: boolean;
  profile_photo_url?: string;
  bio?: string;
  created_at?: string;
  is_admin?: boolean;
  is_host?: boolean;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const mapBackendUserToStoreUser = (backendUser: BackendUser): User => ({
  id: backendUser.id,
  email: backendUser.email,
  firstName: backendUser.first_name,
  lastName: backendUser.last_name,
  name: `${backendUser.first_name} ${backendUser.last_name}`,
  phone: backendUser.phone,
  userType: backendUser.user_type,
  emailVerified: backendUser.email_verified,
  studentVerified: backendUser.student_verified,
  profilePhotoUrl: backendUser.profile_photo_url,
  bio: backendUser.bio,
  createdAt: backendUser.created_at,
  is_admin: backendUser.is_admin,
  is_host: backendUser.is_host,
});

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  const preview = text.slice(0, 160).replace(/\s+/g, ' ').trim();
  throw new Error(`Expected JSON response, got non-JSON (${response.status}): ${preview}`);
};

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  userType: string;
  emailVerified: boolean;
  studentVerified: boolean;
  profilePhotoUrl?: string;
  bio?: string;
  createdAt?: string;
  is_admin?: boolean;
  is_host?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        const details = [data.error, data.message, data.cause].filter(Boolean).join(' | ');
        throw new Error(details || 'Login failed');
      }

      const user = mapBackendUserToStoreUser(data.data.user);

      set({
        user,
        accessToken: data.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Login failed. Please try again.'),
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          user_type: data.userType || 'guest',
        }),
      });

      const responseData = await parseJsonResponse(response);

      if (!response.ok) {
        const details = [responseData.error, responseData.message, responseData.cause].filter(Boolean).join(' | ');
        throw new Error(details || 'Registration failed');
      }

      const user = mapBackendUserToStoreUser(responseData.data.user);

      set({
        user,
        accessToken: responseData.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('accessToken', responseData.data.accessToken);
      localStorage.setItem('refreshToken', responseData.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Registration failed. Please try again.'),
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear localStorage and state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUser: async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      set({ isAuthenticated: false, user: null, accessToken: null });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        // Token might be expired, try to refresh
        if (response.status === 401) {
          await get().refreshToken();
          return;
        }
        throw new Error('Failed to load user');
      }

      const data = await parseJsonResponse(response);
      const user = mapBackendUserToStoreUser(data.data);

      set({
        user,
        accessToken,
        isAuthenticated: true,
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      set({ isAuthenticated: false, user: null, accessToken: null });
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await parseJsonResponse(response);

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      set({ accessToken: data.data.accessToken });

      // Reload user with new token
      await get().loadUser();
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    }
  },

  updateUser: (data: Partial<User>) => {
    const updatedUser = get().user ? { ...get().user, ...data } as User : null;
    set({ user: updatedUser });
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  clearError: () => set({ error: null }),
}));
