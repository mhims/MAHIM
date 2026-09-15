import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  Users,
} from 'lucide-react';
import {
  INDIVIDUAL_MENTOR_COURSES,
  COMBO_MENTORSHIP_COURSE,
  type MentorCourseInfo,
} from '../data/mentorshipDetails';
import { navigateTo } from '../utils/navigation';

interface Props {
  onOpenDetails?: (course: MentorCourseInfo) => void;
  onBuyCourse: (course: MentorCourseInfo) => void;
}

export const ClassroomMentorshipCoursesSection: React.FC<Props> = ({
  onBuyCourse,
}) => {
  const handleViewDetails = (course: MentorCourseInfo) => {
    // Direct page navigation for SEO & Google Ranking
    navigateTo(`/classroom/courses/mentorship/${course.slug}`);
  };

  const handleBuy = (course: MentorCourseInfo) => {
    if (course.externalBuyUrl) {
      window.open(course.externalBuyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onBuyCourse(course);
  };

  return (
    <section
      id="mentorship-courses-section"
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-6"
    >
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold uppercase tracking-wider mb-2 font-['Hind_Siliguri',sans-serif]">
          <Sparkles size={14} className="text-orange-600" />
          <span>Special Mentorship Programs</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-['Hind_Siliguri',sans-serif]">
          মেন্টরশীপ কোর্স ও গাইডলাইন প্রোগ্রাম
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 font-['Hind_Siliguri',sans-serif] max-w-2xl mx-auto leading-relaxed">
          আপনার প্রস্তুতিকে আরও সুশৃঙ্খল, কার্যকর এবং লক্ষ্যভিত্তিক করতে শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ মেন্টরদের ওয়ান-টু-ওয়ান গাইডলাইন ও কম্বো মেন্টরশীপ সেশন।
        </p>
      </div>

      {/* 1. All-in-One Combo Mentorship Course Card (featuring all mentors) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-1 shadow-xl shadow-orange-500/15"
      >
        <div className="bg-white rounded-[22px] p-5 sm:p-7 flex flex-col lg:flex-row items-center gap-6">
          {/* Combo Image Banner */}
          <div
            onClick={() => handleViewDetails(COMBO_MENTORSHIP_COURSE)}
            className="w-full lg:w-5/12 shrink-0 rounded-2xl overflow-hidden border border-orange-200 bg-zinc-950 shadow-md group relative cursor-pointer"
          >
            <img
              src={COMBO_MENTORSHIP_COURSE.image}
              alt={COMBO_MENTORSHIP_COURSE.mentorName}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] font-bold shadow-md uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
              🌟 কম্বো কোর্স (Combo)
            </div>
          </div>

          {/* Combo Content */}
          <div className="flex-1 w-full flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 font-['Hind_Siliguri',sans-serif]">
                  সকল মেন্টর একসাথে • All-in-One
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-['Hind_Siliguri',sans-serif]">
                  শীর্ষ বিশ্ববিদ্যালয়ের পূর্ণাঙ্গ প্যানেল
                </span>
              </div>

              <h3
                onClick={() => handleViewDetails(COMBO_MENTORSHIP_COURSE)}
                className="text-xl sm:text-2xl font-black text-zinc-900 hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] leading-tight mb-2 cursor-pointer"
              >
                {COMBO_MENTORSHIP_COURSE.mentorNameBn}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-4">
                ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির সেরা রোডম্যাপ তৈরিতে SamNad Academy ও Mahim’s Classroom-এর শীর্ষ ৪ জন অভিজ্ঞ মেন্টরের সম্মিলিত স্পেশাল গাইডলাইন ও সমন্বিত মেন্টরিং প্রোগ্রাম।
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  <CheckCircle2 size={15} className="text-orange-600 shrink-0" />
                  <span>৪ জন মেন্টরের কম্বাইন্ড স্টাডি প্ল্যান</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  <CheckCircle2 size={15} className="text-orange-600 shrink-0" />
                  <span>Personalized স্ট্র্যাটেজি ও রুটিন</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  <CheckCircle2 size={15} className="text-orange-600 shrink-0" />
                  <span>নিয়মিত গাইডলাইন ও প্রবলেম সলভিং</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  <CheckCircle2 size={15} className="text-orange-600 shrink-0" />
                  <span>এক্সাম ও এডমিশন স্পেশাল হ্যাকস</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: বিস্তারিত (Open dedicated page) & কিনুন */}
            <div className="flex items-center gap-3 pt-3 border-t border-orange-100 font-['Hind_Siliguri',sans-serif]">
              <button
                onClick={() => handleViewDetails(COMBO_MENTORSHIP_COURSE)}
                id="combo-mentorship-details-btn"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 hover:border-orange-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <BookOpen size={16} className="text-orange-600" />
                <span>বিস্তারিত দেখুন</span>
              </button>

              <button
                onClick={() => handleBuy(COMBO_MENTORSHIP_COURSE)}
                id="combo-mentorship-buy-btn"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingCart size={16} />
                <span>কিনুন (Buy Course)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Subheading for the 4 Individual Mentor Courses */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-orange-100 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
            <Users size={18} className="text-orange-600" />
            <span>ব্যক্তিগত মেন্টরশীপ কোর্সসমূহ (৪ জন মেন্টর)</span>
          </h3>
          <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
            আপনার পছন্দের মেন্টর নির্বাচন করে তাঁর সরাসরি তত্ত্বাবধানে প্রস্তুতি নিন
          </p>
        </div>
      </div>

      {/* 3. Grid of the 4 Individual Mentor Courses (Clean without numbering 1,2,3,4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INDIVIDUAL_MENTOR_COURSES.map((course, idx) => (
          <motion.div
            key={course.id}
            id={`mentor-course-card-${course.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white border-2 border-orange-200/90 hover:border-orange-500 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 group relative"
          >
            {/* Top Image Banner */}
            <div>
              <div
                onClick={() => handleViewDetails(course)}
                className="relative -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-4 rounded-t-[22px] overflow-hidden bg-zinc-950 aspect-[16/10] cursor-pointer border-b border-orange-100"
              >
                <img
                  src={course.image}
                  alt={course.mentorName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>

              {/* Mentor Identity - Clean: purely mentor name without 1,2,3,4 */}
              <div className="mb-4">
                <div className="inline-block text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md mb-1.5 font-['Hind_Siliguri',sans-serif]">
                  {course.badge}
                </div>

                <h4
                  onClick={() => handleViewDetails(course)}
                  className="text-base sm:text-lg font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] leading-tight cursor-pointer"
                >
                  {course.mentorName}
                </h4>

                <p className="text-xs font-semibold text-zinc-700 mt-1 font-['Hind_Siliguri',sans-serif]">
                  {course.mentorNameBn}
                </p>

                <p className="text-[11px] text-zinc-500 mt-1 leading-tight font-['Hind_Siliguri',sans-serif]">
                  {course.degreeBn ? `${course.degreeBn} • ` : ''}{course.institutionBn}
                </p>
              </div>

              {/* Course Highlights */}
              <div className="space-y-1.5 mb-5 pt-3 border-t border-orange-100 text-[11px] text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-orange-600 shrink-0" />
                  <span>Personalized ওয়ান-টু-ওয়ান মেন্টরিং</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-orange-600 shrink-0" />
                  <span>সাপ্তাহিক প্রগ্রেস ট্র্যাকিং ও রুটিন</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-orange-600 shrink-0" />
                  <span>পরীক্ষার স্ট্র্যাটেজি ও সাপোর্ট</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: বিস্তারিত (Opens separate page) & কিনুন */}
            <div className="flex items-center gap-2 pt-3 border-t border-orange-100 font-['Hind_Siliguri',sans-serif]">
              <button
                onClick={() => handleViewDetails(course)}
                id={`details-btn-${course.slug}`}
                className="flex-1 py-2.5 px-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1"
              >
                <span>বিস্তারিত</span>
                <ArrowRight size={13} className="text-orange-600" />
              </button>

              <button
                onClick={() => handleBuy(course)}
                id={`buy-btn-${course.slug}`}
                className="flex-1 py-2.5 px-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1"
              >
                <ShoppingCart size={13} />
                <span>কিনুন</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
