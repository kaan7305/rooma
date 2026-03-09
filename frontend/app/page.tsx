'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { Search, ChevronDown, ChevronLeft, ChevronRight, Shield, Video, FileCheck, ArrowRight, Sparkles, Bed, Bath, Bell, MapPin, Calendar, DollarSign, Star, CheckCircle, MessageSquare, Briefcase, GraduationCap, Phone } from 'lucide-react';
import SmartSearchBar from '@/components/SmartSearchBar';
import { allProperties } from '@/data/properties';

// ── Scroll-triggered animation hook ──
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}


// No safetySteps needed — replaced by Guests/Hosts tabbed section

const universities = [
  { name: 'Johns Hopkins University', logo: '/jhu-logo.png' },
  { name: 'University of Toronto', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_coa.svg/200px-Utoronto_coa.svg.png' },
];

const faqs = [
  {
    question: 'How does ROOMA verify listings?',
    answer: 'Every listing goes through a multi-step verification process. Student hosts must verify their university enrollment, provide proof of lease, and upload real photos of the space. Our team manually reviews each listing before it goes live.',
  },
  {
    question: 'Is my payment protected?',
    answer: 'Yes! Your payment is held securely in escrow until you move in and confirm the space matches the listing. If something is wrong, you can file a dispute and get a full refund within 48 hours of move-in.',
  },
  {
    question: 'Can I meet the host before booking?',
    answer: 'Absolutely. We encourage video calls between student hosts and guests before any booking is confirmed. You can schedule a virtual tour directly through our platform.',
  },
  {
    question: 'What if I need to cancel my sublease?',
    answer: 'Our flexible cancellation policy allows free cancellation up to 14 days before your move-in date. After that, cancellation fees may apply depending on the host\'s policy. We always work to find a fair solution.',
  },
  {
    question: 'How long can I sublet for?',
    answer: 'ROOMA supports sublets from as short as 1 week to as long as 12 months. Whether you need a place for a summer internship, a semester abroad, a co-op term, or a gap year — we\'ve got you covered.',
  },
  {
    question: 'Is ROOMA only for students?',
    answer: 'Yes! ROOMA is built exclusively for students. Both hosts and guests must verify their student status through their university email. This keeps our community safe and ensures you\'re always subletting from a fellow student you can trust.',
  },
];

const topCities = [
  { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80', listings: '2,400+' },
  { name: 'Boston', image: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=600&auto=format&fit=crop&q=80', listings: '1,800+' },
  { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&auto=format&fit=crop&q=80', listings: '2,100+' },
  { name: 'San Francisco', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&auto=format&fit=crop&q=80', listings: '1,500+' },
  { name: 'Chicago', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&auto=format&fit=crop&q=80', listings: '1,200+' },
  { name: 'Miami', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&auto=format&fit=crop&q=80', listings: '900+' },
];

// ── Auto-scrolling notification stream ──
const notificationData = [
  { name: 'Leo', location: 'West Village, NYC', time: 'Just now' },
  { name: 'Amy', location: 'East Village, NYC', time: '2s ago' },
  { name: 'Jordan', location: 'Back Bay, Boston', time: '5s ago' },
  { name: 'Priya', location: 'Greenwich Village', time: '8s ago' },
  { name: 'Marcus', location: 'Williamsburg, BK', time: '12s ago' },
  { name: 'Sofia', location: 'Allston, Boston', time: '15s ago' },
  { name: 'Ethan', location: 'Mission District, SF', time: '20s ago' },
  { name: 'Olivia', location: 'Koreatown, LA', time: '25s ago' },
  { name: 'Noah', location: 'Lincoln Park, Chicago', time: '30s ago' },
  { name: 'Ava', location: 'Capitol Hill, Seattle', time: '35s ago' },
  { name: 'Liam', location: 'Dupont Circle, DC', time: '40s ago' },
  { name: 'Emma', location: 'Midtown, Atlanta', time: '45s ago' },
];

function NotificationStream() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNotifs = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  // Duplicate for seamless feel
  const items = [...notificationData, ...notificationData];

  return (
    <div className="max-w-xl mx-auto">
      {/* Counter badge */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-lg shadow-orange-500/30">
          <Bell className="w-4 h-4 animate-wiggle" />
          Students notified in your area
        </div>
      </div>

      {/* Horizontal slideable container */}
      <div className="relative group/notifs">
        {/* Left arrow */}
        <button
          onClick={() => scrollNotifs('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/notifs:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
        {/* Right arrow */}
        <button
          onClick={() => scrollNotifs('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/notifs:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>

        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-[5] pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-[5] pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 py-2 snap-x snap-mandatory hide-scrollbar"
        >
          {items.map((notif, i) => (
            <div
              key={`${notif.name}-${i}`}
              className="flex-shrink-0 w-[280px] snap-start bg-white rounded-2xl shadow-sm hover:shadow-lg px-5 py-4 border border-gray-100 transition-all hover:-translate-y-0.5"
            >
              {/* Top row: app icon + time */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img src="/rooma-logo.svg" alt="Rooma" className="w-10 h-10 rounded-xl shadow-sm" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Rooma</p>
                    <p className="text-[10px] text-gray-400">{notif.time}</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              {/* Message body */}
              <p className="text-sm text-gray-600 leading-relaxed">
                Hey {notif.name}, check out this apartment in <span className="font-medium text-gray-900">{notif.location}</span>
              </p>
              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors">
                  View listing
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <p className="text-center text-xs text-gray-400 mt-3">Swipe to see more notifications</p>
    </div>
  );
}

// ── Profile card mockup ──
function ProfileCardMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-w-sm mx-auto">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden">
          <svg className="w-12 h-12 text-white/80 mt-2" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 1 0-16 0" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg">Sarah M.</h4>
          <p className="text-sm text-gray-500">Junior at NYU Stern</p>
          <div className="flex items-center gap-1 mt-0.5">
            <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">Verified Student</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>19 East 31st Street, New York, NY</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Jun 1, 2026 to Aug 31, 2026</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">$2,100/mo</span>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mb-5">
        <p className="text-sm font-semibold text-gray-900 mb-1">About Sarah</p>
        <p className="text-xs text-gray-500 leading-relaxed">Hi! I&apos;ll have an internship at Seattle this summer and I&apos;m looking for housing near campus. Would love a cozy place with great light!</p>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700">Ignore</button>
        <button className="flex-1 py-2.5 rounded-full bg-orange-500 text-sm font-bold text-white">Accept</button>
      </div>
    </div>
  );
}

// ── Video call mockup ──
function VideoCallMockup() {
  return (
    <div className="relative max-w-lg mx-auto">
      {/* Background city image */}
      <div className="rounded-3xl overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=80"
          alt="City view"
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
      {/* Phone overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-56">
        <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
          <div className="bg-gray-900 rounded-[1.6rem] overflow-hidden">
            {/* Notch */}
            <div className="flex justify-center pt-2 pb-1 bg-gray-900">
              <div className="w-20 h-5 bg-black rounded-full" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
              alt="Video call"
              className="w-full aspect-[3/4] object-cover"
            />
            {/* Small self-view */}
            <div className="absolute bottom-8 right-6 w-14 h-18 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                alt="Self view"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Call controls */}
            <div className="flex justify-center gap-4 py-3 bg-gray-900/90">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Payment check mockup ──
function PaymentMockup() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Check pattern border */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-2xl font-bold text-orange-500">Rooma</span>
            </div>
            <span className="text-sm text-gray-400">#5679</span>
          </div>
          <div className="mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Pay to the order of</span>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Georgia, serif' }}>Sarah Martinez</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>Two thousand one hundred and 0/100</p>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-2">
              <span className="text-lg font-bold text-gray-900">$ 2,100.00</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            <span>MEMO: </span>
            <span style={{ fontFamily: 'Georgia, serif' }} className="text-gray-500">Summer sublet - deposit &amp; 1st month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Guest step data (old Browse/Connect/Move In style) ──
const guestSteps = [
  {
    step: '01',
    label: 'Browse',
    title: 'Find the perfect sublet',
    description: 'Browse verified student listings with detailed photos, virtual tours, and honest reviews from fellow students.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
    icon: Search,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    step: '02',
    label: 'Connect',
    title: 'Connect with your fellow student',
    description: 'Video chat with verified student hosts, ask about the space, campus proximity, and living arrangements before committing.',
    image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=600&auto=format&fit=crop&q=80',
    icon: Video,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    step: '03',
    label: 'Move In',
    title: 'Sublease with confidence',
    description: 'Secure payments, verified leases, and 24/7 support. Your deposit is protected until you move in and confirm everything matches.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    icon: FileCheck,
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
];

// ── Guest step with alternating image layout ──
function GuestStepCard({ step, index }: { step: typeof guestSteps[0]; index: number }) {
  const { ref, isVisible } = useInView(0.2);

  return (
    <div ref={ref} className="relative">
      {index < 2 && (
        <div className="hidden lg:block absolute left-1/2 -bottom-24 w-px h-24 bg-gradient-to-b from-gray-200 to-transparent" />
      )}
      <div
        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="flex-1 w-full group">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.02]">
            <img src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className={`absolute inset-0 bg-gradient-to-tr ${step.color} opacity-20`} />
            <div className={`absolute top-6 left-6 flex items-center gap-2 bg-gradient-to-br ${step.color} rounded-full px-5 py-3 shadow-xl`}>
              <step.icon className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">{step.label}</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${step.bgColor} rounded-full mb-6`}>
            <span className={`text-sm font-bold ${step.textColor}`}>{step.step}</span>
            <step.icon className={`w-4 h-4 ${step.textColor}`} />
            <span className={`text-sm font-semibold ${step.textColor}`}>{step.label}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
          <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
          <div className={`mt-6 h-1 w-16 rounded-full bg-gradient-to-r ${step.color}`} />
        </div>
      </div>
    </div>
  );
}

// ── Guests / Hosts tabbed section ──
function GuestsHostsSection() {
  const [activeTab, setActiveTab] = useState<'guests' | 'hosts'>('guests');

  const hostSteps = [
    {
      number: 1,
      title: 'List your place',
      description: 'Rooma will instantly notify students looking for sublets in your city.',
      visual: <NotificationStream />,
    },
    {
      number: 2,
      title: 'Review their profile before chatting',
      description: 'When a student is interested in your place, review their verified profile — university, year, and social links — before deciding to chat.',
      visual: <ProfileCardMockup />,
    },
    {
      number: 3,
      title: 'Meet your guest before booking',
      description: 'Rooma sets up a video call where you\'ll learn about your potential guest and determine if they are a good fit.',
      visual: <VideoCallMockup />,
    },
    {
      number: 4,
      title: 'Sublease with confidence',
      description: 'Rooma ensures your guest pays the security deposit and first month\'s rent before moving in, then we deposit rent payments into your bank account each month.',
      visual: <PaymentMockup />,
    },
  ];

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex bg-white rounded-full p-1.5 shadow-md border border-gray-200">
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'guests'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Guests
          </button>
          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'hosts'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hosts
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'guests' ? (
        <div className="space-y-28">
          {guestSteps.map((step, index) => (
            <GuestStepCard key={step.label} step={step} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-32">
          {hostSteps.map((step, i) => (
            <StepBlock key={`host-${step.number}`} step={step} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Individual step with number + connector ──
function StepBlock({ step, index }: { step: { number: number; title: string; description: string; visual: React.ReactNode }; index: number }) {
  const { ref, isVisible } = useInView(0.15);

  return (
    <div ref={ref} className="relative">
      {/* Connector line */}
      {index < 3 && (
        <div className="absolute left-1/2 -bottom-32 w-0.5 h-32 -translate-x-1/2 bg-gradient-to-b from-orange-300 to-transparent hidden md:block" />
      )}

      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Step number */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white font-bold text-lg">{step.number}</span>
          </div>
        </div>

        {/* Title + Description */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {step.title}
          </h3>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Visual mockup */}
        <div className="max-w-xl mx-auto">
          {step.visual}
        </div>
      </div>
    </div>
  );
}

// ── City filter tabs + scrollable property cards ──
const cityTabs = ['New York', 'Boston', 'San Francisco', 'Los Angeles', 'Chicago', 'Miami'];

function PropertyCarousel() {
  const [activeCity, setActiveCity] = useState('New York');
  const scrollRef = useRef<HTMLDivElement>(null);

  const cityProperties = allProperties.filter(p =>
    p.city.toLowerCase().includes(activeCity.toLowerCase())
  );

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Random "posted" labels for realism
  const postedLabels = ['Posted today', 'Posted yesterday', '', '', 'Posted today', ''];

  return (
    <div>
      {/* City Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 px-6 overflow-x-auto">
        {cityTabs.map((city) => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCity === city
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Scrollable Cards */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-6 lg:px-8 pb-4 snap-x snap-mandatory hide-scrollbar"
        >
          {cityProperties.map((property, i) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="flex-shrink-0 w-[300px] snap-start group/card"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                />
                {/* Posted badge */}
                {postedLabels[i % postedLabels.length] && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-700">{postedLabels[i % postedLabels.length]}</span>
                  </div>
                )}
                {/* Host avatar */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full pl-1 pr-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/50">
                    <svg className="w-6 h-6 text-white/80 mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white">{property.hostName?.split(' ')[0] || 'Host'}</span>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover/card:text-orange-600 transition-colors mt-1">
                {property.hostName?.split(' ')[0]}&apos;s {property.type.toLowerCase()} in {activeCity}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{property.duration}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-base font-bold text-gray-900">${property.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1 text-sm text-gray-700"><Bed className="w-3.5 h-3.5" /> {property.beds} bed</span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1 text-sm text-gray-700"><Bath className="w-3.5 h-3.5" /> {property.baths} bath</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll animation refs
  const searchSection = useInView(0.2);
  const safetyHeader = useInView(0.3);
  const uniSection = useInView(0.2);
  const mapSection = useInView(0.2);
  const faqSection = useInView(0.2);
  const citiesSection = useInView(0.2);
  const ctaSection = useInView(0.2);

  // Hero text animation
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO SECTION WITH VIDEO BACKGROUND ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-3xl">
            {/* Animated hero text */}
            <div className={`transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Student-to-student subletting platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Sublets by{' '}
                <br className="hidden sm:block" />
                students, for{' '}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">students</span>
              </h1>
            </div>

            <p className={`mt-6 text-lg md:text-xl text-gray-200 max-w-xl transition-all duration-1000 delay-200 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The only subletting platform built exclusively for students. Find verified sublets from fellow students at your university — for summer breaks, semester exchanges, or co-ops.
            </p>

            <div className={`mt-8 flex flex-wrap gap-4 transition-all duration-1000 delay-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                href="/search"
                className="group inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full text-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                Find your home
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/host"
                className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-full text-lg transition-all border-2 border-white/40 hover:border-white/70 hover:-translate-y-0.5 active:translate-y-0"
              >
                List your place
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ===== FIND THE PERFECT SUBLET ===== */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div
          ref={searchSection.ref}
          className={`transition-all duration-700 ${
            searchSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Find the perfect sublet
            </h2>
            <p className="text-center text-gray-500 mb-8">Search student sublets by city, university, price, or just describe what you need</p>
            <SmartSearchBar placeholder='Try "2 bed apartment in Boston under $2000" or "pet friendly near NYU"' />
          </div>

          {/* City Tabs + Property Carousel */}
          <PropertyCarousel />
        </div>
      </section>

      {/* ===== HOW ROOMA TAKES THE WORK OUT OF SUBLEASING ===== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div
            ref={safetyHeader.ref}
            className={`text-center mb-12 transition-all duration-700 ${
              safetyHeader.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              How Rooma takes the work<br />out of subleasing
            </h2>
          </div>

          {/* Guests / Hosts Toggle */}
          <GuestsHostsSection />
        </div>
      </section>

      {/* ===== UNIVERSITY PARTNERS ===== */}
      <section className="bg-gray-50 py-16 lg:py-20 overflow-hidden">
        <div
          ref={uniSection.ref}
          className={`max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-700 ${
            uniSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Official housing partner for
          </h2>
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {universities.map((uni, i) => (
              <div
                key={uni.name}
                className={`flex flex-col items-center gap-4 transition-all duration-500 hover:scale-105 ${
                  uniSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white shadow-lg flex items-center justify-center p-4 hover:shadow-xl transition-all">
                  <img
                    src={uni.logo}
                    alt={uni.name}
                    className="h-16 w-16 md:h-20 md:w-20 object-contain"
                  />
                </div>
                <span className="text-sm md:text-base text-gray-700 font-semibold text-center">{uni.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONNECTING SUBLETTERS WORLDWIDE ===== */}
      <section className="py-20 lg:py-28">
        <div
          ref={mapSection.ref}
          className={`max-w-7xl mx-auto px-6 lg:px-8 text-center transition-all duration-700 ${
            mapSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Connecting subletters across the world
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            From New York to San Francisco, Boston to Miami — ROOMA connects students finding their next home every day.
          </p>
          {/* Map with animated elements */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden aspect-[2/1] max-w-5xl mx-auto shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80"
              alt="World map"
              className="w-full h-full object-cover opacity-20"
            />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 animate-pulse" />

            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
              {/* NYC to London */}
              <path d="M280 170 Q400 100 480 160" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" opacity="0.6">
                <animate attributeName="stroke-dasharray" from="0 500" to="500 0" dur="3s" repeatCount="indefinite" />
              </path>
              {/* NYC to SF */}
              <path d="M280 170 Q230 200 180 180" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" opacity="0.5">
                <animate attributeName="stroke-dasharray" from="0 300" to="300 0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              </path>
              {/* London to Dubai */}
              <path d="M480 160 Q560 180 620 200" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" opacity="0.4">
                <animate attributeName="stroke-dasharray" from="0 400" to="400 0" dur="3.5s" begin="1s" repeatCount="indefinite" />
              </path>
              {/* NYC to Miami */}
              <path d="M280 170 Q270 220 260 240" stroke="url(#lineGrad)" strokeWidth="1" fill="none" opacity="0.4">
                <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="2s" begin="1.5s" repeatCount="indefinite" />
              </path>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F97316" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* City dots with labels and ripple effect */}
            {[
              { top: '34%', left: '22%', label: 'NYC', delay: '0s', size: 'lg' },
              { top: '28%', left: '28%', label: 'Toronto', delay: '0.3s', size: 'md' },
              { top: '44%', left: '18%', label: 'SF', delay: '0.6s', size: 'lg' },
              { top: '32%', left: '48%', label: 'London', delay: '0.9s', size: 'md' },
              { top: '48%', left: '26%', label: 'Miami', delay: '1.2s', size: 'sm' },
              { top: '36%', left: '72%', label: 'Tokyo', delay: '1.5s', size: 'md' },
              { top: '30%', left: '14%', label: 'Seattle', delay: '1.8s', size: 'sm' },
              { top: '38%', left: '62%', label: 'Dubai', delay: '2.1s', size: 'sm' },
            ].map((city, i) => (
              <div key={i} className="absolute group" style={{ top: city.top, left: city.left }}>
                {/* Outer ripple */}
                <span
                  className="absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20"
                  style={{ animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`, animationDelay: city.delay }}
                />
                {/* Middle ripple */}
                <span
                  className="absolute inline-flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30"
                  style={{ animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`, animationDelay: `calc(${city.delay} + 0.3s)` }}
                />
                {/* Core dot */}
                <span className={`relative inline-flex rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 -translate-x-1/2 -translate-y-1/2 ${
                  city.size === 'lg' ? 'h-3 w-3' : city.size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2'
                }`} />
                {/* Label tooltip */}
                <span className="absolute left-1/2 -translate-x-1/2 -top-7 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {city.label}
                </span>
              </div>
            ))}

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`p-${i}`}
                className="absolute w-1 h-1 rounded-full bg-orange-400/40"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${5 + Math.random() * 90}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}

            {/* Center overlay with counter */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-gray-900/70 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-2xl border border-white/10">
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">ROOMA</div>
                <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide">Growing every day</div>
                {/* Stats row */}
                <div className="flex gap-8 mt-5 pt-5 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">8+</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Cities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">5K+</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div
          ref={faqSection.ref}
          className={`max-w-3xl mx-auto px-6 lg:px-8 transition-all duration-700 ${
            faqSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${
                  openFaq === index ? 'shadow-md border-orange-200' : ''
                }`}
                style={{
                  transitionDelay: faqSection.isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className={`text-lg font-semibold pr-4 transition-colors ${openFaq === index ? 'text-orange-600' : 'text-gray-900 group-hover:text-orange-600'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    openFaq === index ? 'bg-orange-500 rotate-180' : 'bg-gray-100 group-hover:bg-orange-50'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-colors ${openFaq === index ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP CITIES ===== */}
      <section className="py-20 lg:py-28">
        <div
          ref={citiesSection.ref}
          className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ${
            citiesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Top cities
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Explore sublets in the most popular cities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCities.map((city, i) => (
              <Link
                key={city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className={`group relative rounded-2xl overflow-hidden aspect-[3/2] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                  citiesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                  <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                    {city.listings} listings
                  </p>
                </div>
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative overflow-hidden">
        <div
          ref={ctaSection.ref}
          className={`relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 py-20 lg:py-24 transition-all duration-700 ${
            ctaSection.isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your next home?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Join students across the country who trust ROOMA for safe, verified student-to-student subletting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/search"
                className="group inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-orange-600 font-semibold rounded-full text-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                Browse sublets
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full text-lg transition-all border-2 border-orange-400 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/rooma-logo.svg" alt="Rooma" className="w-12 h-12" />
                <h3 className="text-2xl font-bold text-white">ROOMA</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The student-to-student subletting platform. Built exclusively for students, by students.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety Center</Link></li>
                <li><Link href="/cancellation" className="hover:text-white transition-colors">Cancellation</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hosting</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/host" className="hover:text-white transition-colors">List Your Space</Link></li>
                <li><Link href="/host-resources" className="hover:text-white transition-colors">Host Resources</Link></li>
                <li><Link href="/hosting-community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ROOMA, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/community" className="hover:text-white transition-colors">Join subletting communities</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Custom CSS for animations ── */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out both;
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scroll-up 25s linear infinite;
        }
        .animate-scroll-up:hover {
          animation-play-state: paused;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.7; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.5; }
          75% { transform: translateY(-15px) translateX(3px); opacity: 0.6; }
        }
        @keyframes ping {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          75%, 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
