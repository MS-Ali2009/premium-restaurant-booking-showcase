import { create } from 'zustand';

// Simple helper to base64 encode passwords to simulate secure storage in local storage
const hashPassword = (password) => {
  try {
    return btoa(password);
  } catch (e) {
    return password;
  }
};

export const useAuthStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('luxury_restaurant_user')) || null,
  users: JSON.parse(localStorage.getItem('luxury_restaurant_users')) || [],
  isOpen: false,
  authMode: 'login', // 'login' | 'register' | 'forgot' | 'reset'
  resetEmail: '',

  openAuth: (mode = 'login') => set({ isOpen: true, authMode: mode }),
  closeAuth: () => set({ isOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

  registerUser: (name, email, password) => {
    const currentUsers = get().users;
    const exists = currentUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      throw new Error('User with this email already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const newUsers = [...currentUsers, newUser];
    localStorage.setItem('luxury_restaurant_users', JSON.stringify(newUsers));
    
    // Automatically log in
    localStorage.setItem('luxury_restaurant_user', JSON.stringify(newUser));
    
    set({ users: newUsers, currentUser: newUser, isOpen: false });
    return newUser;
  },

  loginUser: (email, password) => {
    const currentUsers = get().users;
    const user = currentUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === hashPassword(password)
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    localStorage.setItem('luxury_restaurant_user', JSON.stringify(user));
    set({ currentUser: user, isOpen: false });
    return user;
  },

  forgotPassword: (email) => {
    const currentUsers = get().users;
    const user = currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email.');
    }

    set({ resetEmail: email.toLowerCase(), authMode: 'reset' });
  },

  resetPassword: (email, newPassword) => {
    const currentUsers = get().users;
    const userIndex = currentUsers.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const updatedUsers = [...currentUsers];
    updatedUsers[userIndex].password = hashPassword(newPassword);

    localStorage.setItem('luxury_restaurant_users', JSON.stringify(updatedUsers));
    
    // Update logged in user if applicable
    const currentUser = get().currentUser;
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedUser = { ...currentUser, password: hashPassword(newPassword) };
      localStorage.setItem('luxury_restaurant_user', JSON.stringify(updatedUser));
      set({ currentUser: updatedUser });
    }

    set({ users: updatedUsers, authMode: 'login', resetEmail: '' });
  },

  logout: () => {
    localStorage.removeItem('luxury_restaurant_user');
    set({ currentUser: null });
  },
}));
