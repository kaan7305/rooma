import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  phone?: string;
  bio?: string;
  is_student?: boolean;
  is_verified?: boolean;
  verification_status?: 'pending' | 'verified' | 'rejected' | 'none';
  id_document?: string;
  selfie_photo?: string;
  is_email_verified?: boolean;

  // Student Verification Fields
  student_verification_status?: 'pending' | 'verified' | 'rejected' | 'none';
  university_name?: string;
  student_id_number?: string;
  graduation_year?: string;
  major?: string;
  student_id_document?: string;
  enrollment_letter?: string;
  sheerid_verified?: boolean;
  sheerid_token?: string;
  manual_review_notes?: string;
  verification_submitted_at?: string;
  verification_reviewed_at?: string;
  is_admin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_student?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

// Simulate delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      await delay(800); // Simulate network delay

      // Get stored users
      const usersJson = localStorage.getItem('nestquarter_users');
      const users: (RegisterData & { id: number })[] = usersJson ? JSON.parse(usersJson) : [];

      // Find user
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // In a real app, you'd verify password hash. For demo, we'll just check it exists
      if (!credentials.password || credentials.password.length < 6) {
        throw new Error('Invalid email or password');
      }

      // Store session
      localStorage.setItem('nestquarter_session', JSON.stringify({
        userId: user.id,
        email: user.email,
      }));

      set({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          is_student: user.is_student,
          is_admin: user.is_admin,
          student_verification_status: user.student_verification_status,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed. Please try again.',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      await delay(800); // Simulate network delay

      // Get stored users
      const usersJson = localStorage.getItem('nestquarter_users');
      const users: (RegisterData & { id: number })[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if email already exists
      if (users.some(u => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        ...data,
        id: users.length + 1,
        // Make the first user an admin automatically for testing
        is_admin: users.length === 0,
        student_verification_status: 'none' as 'pending' | 'verified' | 'rejected' | 'none',
        is_email_verified: true, // Email verified during registration process
      };

      users.push(newUser);
      localStorage.setItem('nestquarter_users', JSON.stringify(users));

      // Store session
      localStorage.setItem('nestquarter_session', JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
      }));

      set({
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          phone_number: newUser.phone_number,
          is_student: newUser.is_student,
          is_admin: newUser.is_admin,
          student_verification_status: newUser.student_verification_status,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed. Please try again.',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('nestquarter_session');
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUser: () => {
    const sessionJson = localStorage.getItem('nestquarter_session');
    if (!sessionJson) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const session = JSON.parse(sessionJson);
      const usersJson = localStorage.getItem('nestquarter_users');
      const users: any[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.id === session.userId);

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            phone: user.phone,
            bio: user.bio,
            is_student: user.is_student,
            is_admin: user.is_admin,
            is_email_verified: user.is_email_verified,
            student_verification_status: user.student_verification_status,
            university_name: user.university_name,
            student_id_number: user.student_id_number,
            graduation_year: user.graduation_year,
            major: user.major,
            student_id_document: user.student_id_document,
            enrollment_letter: user.enrollment_letter,
            sheerid_verified: user.sheerid_verified,
            manual_review_notes: user.manual_review_notes,
            verification_submitted_at: user.verification_submitted_at,
            verification_reviewed_at: user.verification_reviewed_at,
          },
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem('nestquarter_session');
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      localStorage.removeItem('nestquarter_session');
      set({ isAuthenticated: false, user: null });
    }
  },

  updateUser: (data: Partial<User>) => {
    const sessionJson = localStorage.getItem('nestquarter_session');
    if (!sessionJson) return;

    try {
      const session = JSON.parse(sessionJson);
      const usersJson = localStorage.getItem('nestquarter_users');
      const users: any[] = usersJson ? JSON.parse(usersJson) : [];

      const userIndex = users.findIndex(u => u.id === session.userId);
      if (userIndex === -1) return;

      // Update user in storage
      users[userIndex] = {
        ...users[userIndex],
        ...data,
      };
      localStorage.setItem('nestquarter_users', JSON.stringify(users));

      // Update state
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      }));
    } catch (error) {
      console.error('Failed to update user', error);
    }
  },

  clearError: () => set({ error: null }),
}));
