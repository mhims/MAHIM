import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_BLOG_POSTS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCES,
  DEFAULT_SETTINGS,
  DEFAULT_SKILLS,
  DEFAULT_USERS,
} from '../data/defaultData';
import {
  BlogPost,
  CertificationItem,
  ContactMessage,
  EducationItem,
  ExperienceItem,
  SiteSettings,
  SkillItem,
  UserAccount,
} from '../types';
import { sendToGoogleSheet } from '../utils/googleSheets';
import { hashPassword, verifyAdminPassword } from '../utils/security';

interface SiteContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  
  experiences: ExperienceItem[];
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  
  education: EducationItem[];
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  
  skills: SkillItem[];
  addSkill: (item: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, item: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  
  certifications: CertificationItem[];
  addCertification: (item: Omit<CertificationItem, 'id'>) => void;
  updateCertification: (id: string, item: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;
  
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  
  users: UserAccount[];
  currentUser: UserAccount | null;
  registerUser: (name: string, email: string, occupation?: string, phone?: string) => Promise<{ success: boolean; message: string; user?: UserAccount }>;
  loginUser: (email: string) => { success: boolean; user?: UserAccount; message: string };
  logoutUser: () => void;
  updateUserStatus: (id: string, status: 'approved' | 'pending', role?: 'user' | 'vip') => void;
  deleteUser: (id: string) => void;
  
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<{ success: boolean; message: string }>;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateAdminPassword: (newPass: string) => Promise<boolean>;
  
  isAdminModalOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  
  selectedPostForView: BlogPost | null;
  viewPost: (post: BlogPost | null) => void;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'mahims_site_settings_v1',
  THEME: 'mahims_site_theme_v1',
  EXPERIENCES: 'mahims_experiences_v1',
  EDUCATION: 'mahims_education_v1',
  SKILLS: 'mahims_skills_v1',
  CERTS: 'mahims_certs_v1',
  POSTS: 'mahims_posts_v1',
  USERS: 'mahims_users_v1',
  CURRENT_USER: 'mahims_current_user_v1',
  MESSAGES: 'mahims_messages_v1',
  ADMIN_AUTH: 'mahims_admin_session_v1',
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If parsed heroImage is an old local file (mahim.jpg) or empty, upgrade to default Cloudinary link.
        // Otherwise, keep the user's custom URL or uploaded image!
        const heroImageVal =
          parsed.heroImage &&
          typeof parsed.heroImage === 'string' &&
          !parsed.heroImage.includes('mahim.jpg')
            ? parsed.heroImage
            : DEFAULT_SETTINGS.heroImage;

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          whatsappLink: 'https://wa.me/@mahim.wp',
          heroImage: heroImageVal,
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
      const list: ExperienceItem[] = saved ? JSON.parse(saved) : DEFAULT_EXPERIENCES;
      return list.map(item => {
        if (item.company.includes('দেশী ভোজ') || item.company.includes('দেশি ভোজ') || item.company.includes('DESHI VOJ')) {
          return {
            ...item,
            company: 'আলোকিত গাইবান্ধা (ALOKITO GAIBANDHA)',
          };
        }
        if (item.company.includes('চলমান চিটটারা') || item.company.includes('CHALAMAN CHITTARA')) {
          return {
            ...item,
            company: 'চলমান চিত্র (CHALAMAN CHITRA)',
            period: '২০২৪ – ২০২৫',
          };
        }
        return item;
      });
    } catch {
      return DEFAULT_EXPERIENCES;
    }
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EDUCATION);
      if (saved) {
        const parsed: EducationItem[] = JSON.parse(saved);
        return parsed.map(item => {
          if (item.institution.includes('ঢাকা ইন্টারন্যাশনাল ইউনিভার্সিটি') || item.institution.toLowerCase().includes('dhaka international')) {
            return {
              ...item,
              institution: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি',
              department: 'ডিপার্টমেন্ট অফ পলিটিক্যাল সাইন্স',
            };
          }
          return item;
        });
      }
      return DEFAULT_EDUCATION;
    } catch {
      return DEFAULT_EDUCATION;
    }
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      const list: SkillItem[] = saved ? JSON.parse(saved) : [...DEFAULT_SKILLS];
      const hasMinecraft = list.some(s => s.name.includes('মাইনক্রাফট'));
      const hasN8n = list.some(s => s.name.toLowerCase().includes('n8n'));
      if (!hasMinecraft) {
        list.push({ id: 'sk-9', name: 'কাস্টম মাইনক্রাফট স্কিন ডিজাইন', category: 'design', proficiency: 96, highlight: true });
      }
      if (!hasN8n) {
        list.push({ id: 'sk-10', name: 'n8n অটোমেশন এক্সপার্ট', category: 'tools', proficiency: 90, highlight: true });
      }
      return list;
    } catch {
      return DEFAULT_SKILLS;
    }
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
      const list: CertificationItem[] = saved ? JSON.parse(saved) : DEFAULT_CERTIFICATIONS;
      return list.map(({ credentialId, ...rest }) => rest);
    } catch {
      return DEFAULT_CERTIFICATIONS;
    }
  });

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
    } catch {
      return DEFAULT_BLOG_POSTS;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPostForView, setSelectedPostForView] = useState<BlogPost | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certifications));
  }, [certifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Theme management: defaults to dark as requested, allows toggling to light
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark'; // Default is Dark Mode as requested
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // Global hotkey listener: ctrl + alt + shift + windows + a OR ctrl + alt + shift + a
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Alt + Shift + A (with or without Meta/Windows key)
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync settings to storage', e);
      }
      return updated;
    });
  };

  // Experiences
  const addExperience = (item: Omit<ExperienceItem, 'id'>) => {
    const newItem: ExperienceItem = { ...item, id: `exp-${Date.now()}` };
    setExperiences(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync experiences to storage', e);
      }
      return updated;
    });
  };
  const updateExperience = (id: string, item: Partial<ExperienceItem>) => {
    setExperiences(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...item } : e));
      try {
        localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync experiences to storage', e);
      }
      return updated;
    });
  };
  const deleteExperience = (id: string) => {
    setExperiences(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync experiences to storage', e);
      }
      return updated;
    });
  };

  // Education
  const addEducation = (item: Omit<EducationItem, 'id'>) => {
    const newItem: EducationItem = { ...item, id: `edu-${Date.now()}` };
    setEducation(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync education to storage', e);
      }
      return updated;
    });
  };
  const updateEducation = (id: string, item: Partial<EducationItem>) => {
    setEducation(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...item } : e));
      try {
        localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync education to storage', e);
      }
      return updated;
    });
  };
  const deleteEducation = (id: string) => {
    setEducation(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync education to storage', e);
      }
      return updated;
    });
  };

  // Skills
  const addSkill = (item: Omit<SkillItem, 'id'>) => {
    const newItem: SkillItem = { ...item, id: `sk-${Date.now()}` };
    setSkills(prev => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync skills to storage', e);
      }
      return updated;
    });
  };
  const updateSkill = (id: string, item: Partial<SkillItem>) => {
    setSkills(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...item } : s));
      try {
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync skills to storage', e);
      }
      return updated;
    });
  };
  const deleteSkill = (id: string) => {
    setSkills(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync skills to storage', e);
      }
      return updated;
    });
  };

  // Certifications
  const addCertification = (item: Omit<CertificationItem, 'id'>) => {
    const newItem: CertificationItem = { ...item, id: `cert-${Date.now()}` };
    setCertifications(prev => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync certs to storage', e);
      }
      return updated;
    });
  };
  const updateCertification = (id: string, item: Partial<CertificationItem>) => {
    setCertifications(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...item } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync certs to storage', e);
      }
      return updated;
    });
  };
  const deleteCertification = (id: string) => {
    setCertifications(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync certs to storage', e);
      }
      return updated;
    });
  };

  // Posts
  const addPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      views: 0,
      slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    setPosts(prev => [newPost, ...prev]);
  };
  const updatePost = (id: string, post: Partial<BlogPost>) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...post } : p)));
  };
  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  // User Accounts
  const registerUser = async (name: string, email: string, occupation?: string, phone?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত রয়েছে। অনুগ্রহ করে লগইন করুন।' };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      role: 'user',
      status: 'approved', // default active regular reader
      joinedDate: new Date().toLocaleDateString('bn-BD'),
      occupation: occupation || 'পাঠক/ডিজাইন অনুরাগী',
      phone: phone || '',
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Sync to Google Sheet in background if webhook is set
    if (settings.googleSheetWebhookUrl) {
      sendToGoogleSheet(settings.googleSheetWebhookUrl, {
        action: 'register_user',
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        occupation: newUser.occupation,
        role: newUser.role,
        status: newUser.status,
      }).catch(console.error);
    }

    return { success: true, message: 'একাউন্ট সফলভাবে তৈরি হয়েছে!', user: newUser };
  };

  const loginUser = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found, message: `স্বাগতম, ${found.name}!` };
    }
    return { success: false, message: 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সাইন-আপ করুন।' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserStatus = (id: string, status: 'approved' | 'pending', role?: 'user' | 'vip') => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          return {
            ...u,
            status,
            ...(role ? { role } : {}),
          };
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Contact Messages
  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
      status: 'unread',
    };
    setContactMessages(prev => [newMessage, ...prev]);

    // Send to Google Sheets if configured
    if (settings.googleSheetWebhookUrl) {
      sendToGoogleSheet(settings.googleSheetWebhookUrl, {
        action: 'contact_message',
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
      }).catch(console.error);
    }

    return { success: true, message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! মাহিম শীঘ্রই যোগাযোগ করবেন।' };
  };

  const markMessageRead = (id: string) => {
    setContactMessages(prev => prev.map(m => (m.id === id ? { ...m, status: 'read' } : m)));
  };

  const deleteMessage = (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  // Admin Auth
  const loginAdmin = async (password: string) => {
    const isValid = await verifyAdminPassword(password, settings.adminPasswordHash);
    if (isValid) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const updateAdminPassword = async (newPass: string) => {
    if (newPass.length < 6) return false;
    const newHash = await hashPassword(newPass);
    updateSettings({ adminPasswordHash: newHash });
    return true;
  };

  // Backups
  const exportBackupJson = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      experiences,
      education,
      skills,
      certifications,
      posts,
      users,
      contactMessages,
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackupJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.experiences) setExperiences(data.experiences);
      if (data.education) setEducation(data.education);
      if (data.skills) setSkills(data.skills);
      if (data.certifications) setCertifications(data.certifications);
      if (data.posts) setPosts(data.posts);
      if (data.users) setUsers(data.users);
      if (data.contactMessages) setContactMessages(data.contactMessages);
      return true;
    } catch (e) {
      console.error('Backup import error:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setExperiences(DEFAULT_EXPERIENCES);
    setEducation(DEFAULT_EDUCATION);
    setSkills(DEFAULT_SKILLS);
    setCertifications(DEFAULT_CERTIFICATIONS);
    setPosts(DEFAULT_BLOG_POSTS);
    setUsers(DEFAULT_USERS);
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        updateSettings,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        education,
        addEducation,
        updateEducation,
        deleteEducation,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        posts,
        addPost,
        updatePost,
        deletePost,
        users,
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        updateUserStatus,
        deleteUser,
        contactMessages,
        addContactMessage,
        markMessageRead,
        deleteMessage,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        isAdminModalOpen,
        openAdminModal: () => setIsAdminModalOpen(true),
        closeAdminModal: () => setIsAdminModalOpen(false),
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        selectedPostForView,
        viewPost: setSelectedPostForView,
        theme,
        toggleTheme,
        setTheme,
        exportBackupJson,
        importBackupJson,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
