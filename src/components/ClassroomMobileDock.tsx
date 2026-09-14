import React, { useState, useEffect } from 'react';
import { Home, BookOpen, LogIn, Users, Calendar, User } from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { getCurrentStudent, StudentUser } from '../utils/studentAuth';
import { StudentProfileModal, ProfileModalTab } from './StudentProfileModal';

interface ClassroomMobileDockProps {
  currentPath?: string;
}

export const ClassroomMobileDock: React.FC<ClassroomMobileDockProps> = ({ currentPath: propPath }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (propPath) return propPath;
    if (typeof window !== 'undefined') {
      return window.location.pathname.replace(/\/+$/, '') || '/';
    }
    return '/classroom';
  });

  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => getCurrentStudent());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalTab, setStudentModalTab] = useState<ProfileModalTab>('my_courses');

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/\/+$/, '') || '/';
        setCurrentPath(path);
      }
    };

    const handleCustomRoute = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      if (customEvent.detail?.path) {
        setCurrentPath(customEvent.detail.path);
      }
    };

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<{ student: StudentUser | null }>;
      setCurrentStudent(custom.detail?.student || getCurrentStudent());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('app:routechange', handleCustomRoute);
    window.addEventListener('student:auth_changed', handleAuthChange);

    // Initial student check
    setCurrentStudent(getCurrentStudent());

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('app:routechange', handleCustomRoute);
      window.removeEventListener('student:auth_changed', handleAuthChange);
    };
  }, []);

  // Compute active tab status
  const isCoursesActive = currentPath.startsWith('/classroom/courses');
  const isFacultyActive =
    currentPath === '/classroom/instructor' ||
    currentPath === '/classroom/instructors' ||
    (currentPath.startsWith('/classroom/') && !isCoursesActive && currentPath !== '/classroom');
  const isHomeActive = currentPath === '/' || currentPath.startsWith('/portfolio');
  const isCalendarActive =
    (currentPath === '/classroom' && typeof window !== 'undefined' && window.location.hash === '#calendar');

  const handleCalendarClick = () => {
    if (currentPath === '/classroom') {
      const el = document.getElementById('calendar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/classroom#calendar');
        }
        return;
      }
    }

    navigateTo('/classroom');
    setTimeout(() => {
      const el = document.getElementById('calendar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/classroom#calendar');
        }
      }
    }, 250);
  };

  const handleAuthButtonClick = () => {
    if (currentStudent) {
      setStudentModalTab('my_courses');
    } else {
      setStudentModalTab('login');
    }
    setIsStudentModalOpen(true);
  };

  return (
    <>
      {/* Pinned Native Mobile App Dock */}
      <nav
        id="classroom-pinned-mobile-dock"
        aria-label="Classroom Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-orange-200/90 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] transition-all"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Tab 1: Home */}
          <button
            onClick={() => navigateTo('/')}
            id="mobile-dock-home-btn"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer group ${
              isHomeActive ? 'text-orange-600 font-bold' : 'text-zinc-600 hover:text-orange-600'
            }`}
            title="হোম পেজে যান"
          >
            <div className="relative">
              <Home size={19} className={isHomeActive ? 'text-orange-600 stroke-[2.4]' : 'text-zinc-600 group-hover:text-orange-600'} />
              {isHomeActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600" />
              )}
            </div>
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5 tracking-tight">
              হোম
            </span>
          </button>

          {/* Tab 2: Courses */}
          <button
            onClick={() => navigateTo('/classroom/courses')}
            id="mobile-dock-courses-btn"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer group ${
              isCoursesActive ? 'text-orange-600 font-bold' : 'text-zinc-600 hover:text-orange-600'
            }`}
            title="সকল কোর্স দেখুন"
          >
            <div className="relative">
              <BookOpen size={19} className={isCoursesActive ? 'text-orange-600 stroke-[2.4]' : 'text-zinc-600 group-hover:text-orange-600'} />
              {isCoursesActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600" />
              )}
            </div>
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5 tracking-tight">
              কোর্সসমূহ
            </span>
          </button>

          {/* Center Elevated Action Button -> লগইন / প্রোফাইল */}
          <button
            onClick={handleAuthButtonClick}
            id="mobile-dock-login-btn"
            className="flex flex-col items-center justify-center -mt-5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/35 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white"
            title={currentStudent ? `${currentStudent.name} (প্রোফাইল)` : 'শিক্ষার্থী লগইন'}
          >
            {currentStudent ? (
              <User size={20} className="text-white drop-shadow-xs" />
            ) : (
              <LogIn size={20} className="text-white drop-shadow-xs" />
            )}
            <span className="text-[10px] font-black font-['Hind_Siliguri',sans-serif] mt-0.5 tracking-tight text-white whitespace-nowrap">
              {currentStudent ? 'প্রোফাইল' : 'লগইন'}
            </span>
          </button>

          {/* Tab 4: Faculty / Teachers */}
          <button
            onClick={() => navigateTo('/classroom/instructor')}
            id="mobile-dock-faculty-btn"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer group ${
              isFacultyActive ? 'text-orange-600 font-bold' : 'text-zinc-600 hover:text-orange-600'
            }`}
            title="শিক্ষক ও মেন্টর প্যানেল"
          >
            <div className="relative">
              <Users size={19} className={isFacultyActive ? 'text-orange-600 stroke-[2.4]' : 'text-zinc-600 group-hover:text-orange-600'} />
              {isFacultyActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600" />
              )}
            </div>
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5 tracking-tight">
              শিক্ষক
            </span>
          </button>

          {/* Tab 5: Calendar */}
          <button
            onClick={handleCalendarClick}
            id="mobile-dock-calendar-btn"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer group ${
              isCalendarActive ? 'text-orange-600 font-bold' : 'text-zinc-600 hover:text-orange-600'
            }`}
            title="এডমিশন ক্যালেন্ডার"
          >
            <div className="relative">
              <Calendar size={19} className={isCalendarActive ? 'text-orange-600 stroke-[2.4]' : 'text-zinc-600 group-hover:text-orange-600'} />
              {isCalendarActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600" />
              )}
            </div>
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5 tracking-tight">
              ক্যালেন্ডার
            </span>
          </button>
        </div>
      </nav>

      {/* Global Student Profile / Login Modal Accessible from Any Classroom Page */}
      <StudentProfileModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        initialTab={studentModalTab}
        onSuccessLogin={(student) => {
          setCurrentStudent(student);
          // Broadcast to any other listeners
          window.dispatchEvent(new CustomEvent('student:auth_changed', { detail: { student } }));
        }}
      />
    </>
  );
};
