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
  
  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'mahims_site_settings_v1',
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
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          heroImage: (parsed.heroImage && typeof parsed.heroImage === 'string' && parsed.heroImage.startsWith('data:image'))
            ? parsed.heroImage
            : DEFAULT_SETTINGS.heroImage,
          phone: '',
          address: '',
          facebookUrl: parsed.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
          instagramUrl: parsed.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
          fiverrUrl: parsed.fiverrUrl || DEFAULT_SETTINGS.fiverrUrl,
          behanceUrl: parsed.behanceUrl || DEFAULT_SETTINGS.behanceUrl,
          linkedinUrl: parsed.linkedinUrl || DEFAULT_SETTINGS.linkedinUrl,
          whatsappLink: parsed.whatsappLink || DEFAULT_SETTINGS.whatsappLink,
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
      return saved ? JSON.parse(saved) : DEFAULT_EXPERIENCES;
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
      return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
      return saved ? JSON.parse(saved) : DEFAULT_CERTIFICATIONS;
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
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Experiences
  const addExperience = (item: Omit<ExperienceItem, 'id'>) => {
    const newItem: ExperienceItem = { ...item, id: `exp-${Date.now()}` };
    setExperiences(prev => [newItem, ...prev]);
  };
  const updateExperience = (id: string, item: Partial<ExperienceItem>) => {
    setExperiences(prev => prev.map(e => (e.id === id ? { ...e, ...item } : e)));
  };
  const deleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  // Education
  const addEducation = (item: Omit<EducationItem, 'id'>) => {
    const newItem: EducationItem = { ...item, id: `edu-${Date.now()}` };
    setEducation(prev => [newItem, ...prev]);
  };
  const updateEducation = (id: string, item: Partial<EducationItem>) => {
    setEducation(prev => prev.map(e => (e.id === id ? { ...e, ...item } : e)));
  };
  const deleteEducation = (id: string) => {
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  // Skills
  const addSkill = (item: Omit<SkillItem, 'id'>) => {
    const newItem: SkillItem = { ...item, id: `sk-${Date.now()}` };
    setSkills(prev => [...prev, newItem]);
  };
  const updateSkill = (id: string, item: Partial<SkillItem>) => {
    setSkills(prev => prev.map(s => (s.id === id ? { ...s, ...item } : s)));
  };
  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // Certifications
  const addCertification = (item: Omit<CertificationItem, 'id'>) => {
    const newItem: CertificationItem = { ...item, id: `cert-${Date.now()}` };
    setCertifications(prev => [...prev, newItem]);
  };
  const updateCertification = (id: string, item: Partial<CertificationItem>) => {
    setCertifications(prev => prev.map(c => (c.id === id ? { ...c, ...item } : c)));
  };
  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id));
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
