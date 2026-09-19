'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  HeartHandshake,
  ChefHat,
  Truck,
  Leaf,
  CheckCircle2,
  Star,
  ArrowRight,
  ChevronDown,
  Utensils,
  Building2,
  CalendarCheck,
  Check,
  Shield,
  Layers,
  Heart,
  BadgeCheck,
} from 'lucide-react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, badge }) => (
  <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1">
    <div className="flex items-center justify-between mb-5">
      <div className="w-14 h-14 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#0D5C53] group-hover:scale-110 group-hover:bg-[#0D5C53] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      {badge && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#0D5C53] border border-teal-200/60">
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2.5 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
      {title}
    </h3>
    <p className="text-stone-600 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

export default function AboutPage() {
  const { isAuthenticated } = useStore();
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const trustMetrics = [
    { number: '50,000+', label: 'Fresh Meals Delivered', sub: 'Across Colombo & suburbs' },
    { number: '99.4%', label: 'On-Time Delivery', sub: 'Temperature-controlled transit' },
    { number: '4.9 / 5.0', label: 'Customer Satisfaction', sub: 'Over 1,200+ verified ratings' },
    { number: '100%', label: 'Preservative-Free', sub: 'Cooked fresh every single morning' },
  ];

  const cateringServices = [
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: 'Daily Meal Subscriptions',
      target: 'Busy Professionals & Families',
      description:
        'Flexible 7-day or 5-day breakfast, lunch, and dinner plans. Pick your weekly menu from over 30+ regional Sri Lankan specialties with zero repetitive meal fatigue.',
      features: [
        'Weekly customizable menu',
        'Pause or skip deliveries anytime',
        'Direct doorstep delivery before 12:00 PM',
        'Single or multi-portion family packages',
      ],
      tag: 'Most Popular',
      link: '/meal-plans',
      linkText: 'Explore Weekly Plans',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Corporate & Office Catering',
      target: 'Teams, Companies & Workplaces',
      description:
        'Boost workplace energy with wholesome, warm Sri Lankan buffets or individually sealed meal boxes delivered reliably to your corporate premises every weekday.',
      features: [
        'Individual tamper-proof sealed packaging',
        'Dedicated corporate invoicing & accounts',
        'Dietary options (Veg, Non-Veg, Halal-sourced)',
        'Eco-friendly compostable meal containers',
      ],
      tag: 'Enterprise Ready',
      link: '/meal-plans',
      linkText: 'View Corporate Packages',
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: 'Health & Dietary Customization',
      target: 'Fitness, Dietary & Wellness Needs',
      description:
        'Crafted nutrition plans designed for specific dietary preferences, from Ceylon Vegetarian and Jaffna Vegan to high-protein fitness meals and diabetic-conscious low-GI red rice bowls.',
      features: [
        'Pure coconut oil & cold-pressed preparations',
        'Zero artificial preservatives, coloring, or MSG',
        'Accurate portioning & macro-friendly balances',
        'High-fiber traditional grains & local greens (Mallum)',
      ],
      tag: 'Dietitian Approved',
      link: '/meal-plans',
      linkText: 'Browse Health Plans',
    },
  ];

  const kitchenTimeline = [
    {
      time: '04:30 AM',
      title: 'Fresh Market Sourcing',
      desc: 'Our procurement team sources fresh vegetables, local herbs, spices, and farm poultry from vetted local growers across the Western Province.',
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
    },
    {
      time: '06:00 AM',
      title: 'Master Chef Prep & Slow Cooking',
      desc: 'Our regional culinary masters begin roasting whole spices, tempering fresh curries in stainless steel cauldrons, and steaming wholesome red rice.',
      icon: <ChefHat className="w-5 h-5 text-amber-600" />,
    },
    {
      time: '10:00 AM',
      title: 'Safety Check & Hygienic Sealing',
      desc: 'Each meal undergoes temperature validation before being sealed in food-grade, leak-proof, eco-friendly containers with tamper-evident security labels.',
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
    },
    {
      time: '11:15 AM',
      title: 'Insulated Express Delivery',
      desc: 'Our trained delivery fleet transports meals in thermal insulated carriers directly to homes and office desks, ensuring food arrives piping hot.',
      icon: <Truck className="w-5 h-5 text-blue-600" />,
    },
  ];

  const qualityStandards = [
    {
      title: 'SLS & Food Safety Compliant Kitchens',
      description:
        'Our commercial kitchens follow rigorous food hygiene standards with daily sanitation audits, hairnet/glove protocols, and stainless steel food prep surfaces.',
      icon: <Shield className="w-6 h-6 text-[#0D5C53]" />,
    },
    {
      title: '100% Halal-Sourced & Ethical Poultry',
      description:
        'All chicken, meats, and seafood are sourced exclusively from certified suppliers with complete cold-chain traceabilities.',
      icon: <BadgeCheck className="w-6 h-6 text-[#0D5C53]" />,
    },
    {
      title: 'Zero Chemical Preservatives & No MSG',
      description:
        'We never freeze pre-cooked food. Every meal delivered to your doorstep was prepared from scratch on that exact morning.',
      icon: <Leaf className="w-6 h-6 text-[#0D5C53]" />,
    },
    {
      title: 'Tamper-Evident & Thermal Packing',
      description:
        'Meals are sealed with safety break-away bands in leak-proof, microwave-safe, BPA-free containers that retain moisture and authentic aroma.',
      icon: <Layers className="w-6 h-6 text-[#0D5C53]" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "7Day Meals has completely transformed our weekdays. As two working parents in Colombo 05, getting authentic string hoppers and balanced rice & curry without spending 2 hours cooking has been a blessing.",
      author: 'Dr. Anoma Wijesinghe',
      role: 'Consultant Physician, Colombo',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        "We subscribed our 25-person tech startup to 7Day Meals corporate lunch service. The food is consistently fresh, never oily, and delivered right on time every day at 12:15 PM sharp.",
      author: 'Tharindu Senanayake',
      role: 'Head of Product, Colombo IT Hub',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        "The Fish Ambul Thiyal and Polos Curry taste just like my grandmother's home cooking in Galle. Honest ingredients and authentic Sri Lankan spices with zero artificial taste.",
      author: 'Nirmal Perera',
      role: 'Senior Financial Analyst',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does 7Day Meals guarantee food freshness?',
      a: 'We operate on a strictly "Cook-to-Order" daily schedule. We do not use frozen meals or pre-cooked batches. Ingredients are sourced at 4:30 AM every morning, cooked in our central kitchen, packed in thermal containers, and delivered directly to your doorstep within hours of cooking.',
    },
    {
      q: 'What delivery areas do you currently cover?',
      a: 'We deliver daily across Colombo 01 through Colombo 15, as well as Greater Colombo suburbs including Dehiwala, Mount Lavinia, Rajagiriya, Battaramulla, Nawala, Nugegoda, Maharagama, and Kotte. We are expanding to additional zones weekly.',
    },
    {
      q: 'Can I customize my meals or specify food allergies?',
      a: 'Yes! When selecting your weekly meal plan, you can choose between Vegetarian, Non-Veg, Vegan, and Gluten-Conscious plans. You can also view exact ingredient lists for every meal on the meal plans page.',
    },
    {
      q: 'What if I need to pause my subscription or travel?',
      a: 'We offer maximum flexibility with zero lock-in contracts. You can pause, skip specific days, or update your delivery address directly through your customer dashboard with at least 24 hours advance notice.',
    },
    {
      q: 'How are the meals packaged for delivery?',
      a: 'Meals are packed in food-grade, 100% BPA-free, leak-proof, microwave-safe containers sealed with tamper-evident security bands. Containers are delivered in insulated thermal packs to keep food fresh and hot until you are ready to eat.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 flex flex-col font-sans">
      {/* Header (Guest vs Auth aware) */}
      {mounted && isAuthenticated ? (
        <Header activeTab="About Us" />
      ) : (
        <PublicHeader activePage="about" />
      )}

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F2EC] via-[#FDFBF7] to-[#FDFBF7] py-16 sm:py-24 border-b border-stone-200/50">
          {/* Subtle Watermark */}
          <div className="absolute top-10 right-4 -translate-y-1/2 text-[14vw] font-serif font-black text-[#0D5C53]/5 whitespace-nowrap select-none pointer-events-none z-0">
            Heritage & Trust
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading and Story Intro */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] text-[#0D5C53] text-xs sm:text-sm font-semibold w-fit border border-teal-200/60 shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#0D5C53]" />
                  <span>The 7Day Meals Story & Mission</span>
                </div>

                <h1
                  className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.12] text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Authentic Sri Lankan Heritage,{' '}
                  <span className="text-[#0D5C53]">Delivered with Care</span>
                </h1>

                <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  7Day Meals was born with a simple, heartfelt promise: to rescue busy professionals, families, and organizations from greasy takeout and monotonous meal prep by delivering authentic, wholesome, home-style Sri Lankan food every single day.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/meal-plans"
                    className="inline-flex items-center gap-2 bg-[#0D5C53] hover:bg-[#09433D] text-white font-semibold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm sm:text-base group"
                  >
                    <span>Browse Meal Plans</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Collage with Trust Badges */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Image */}
                  <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=900"
                      alt="Sri Lankan Gourmet Culinary Preparation"
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                        Colombo Central Kitchen
                      </div>
                      <div className="text-sm sm:text-base font-bold">
                        Cooked Fresh Every Morning by Master Chefs
                      </div>
                    </div>
                  </div>

                  {/* Floating Trust Card 1: Hygiene Guaranteed */}
                  <div className="absolute -top-6 -left-4 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-20 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0D5C53]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">Hygienic & Certified</div>
                      <div className="text-[11px] text-stone-500">100% Food-Grade Kitchens</div>
                    </div>
                  </div>

                  {/* Floating Trust Card 2: Freshness */}
                  <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-20 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">0% Preservatives</div>
                      <div className="text-[11px] text-stone-500">Farm-to-Plate Sourcing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20 pt-10 border-t border-stone-200/80">
              {trustMetrics.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/70 backdrop-blur-xs rounded-2xl p-5 border border-stone-200/70 text-center hover:bg-white transition-colors"
                >
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D5C53] mb-1">
                    {item.number}
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-0.5">{item.label}</div>
                  <div className="text-xs text-stone-500">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Background & Our Heritage Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Image Collage */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                      <Image
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
                        alt="Authentic Sri Lankan Red Rice & Curry"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="bg-[#F5F2EC] p-4 rounded-2xl border border-stone-200/80">
                      <div className="text-[#0D5C53] font-bold text-2xl mb-1">30+</div>
                      <div className="text-xs font-semibold text-stone-700">Rotating Weekly Recipes</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="bg-[#0D5C53] text-white p-5 rounded-2xl shadow-md">
                      <HeartHandshake className="w-7 h-7 text-emerald-300 mb-2" />
                      <div className="font-bold text-sm mb-1">Local Farm Network</div>
                      <div className="text-xs text-teal-100/90 leading-relaxed">
                        Supporting 40+ local farmers & fishermen.
                      </div>
                    </div>
                    <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                      <Image
                        src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600"
                        alt="Traditional String Hoppers & Curries"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                    Our Origin & Heritage
                  </span>
                  <h2
                    className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-gray-900 mt-2 mb-4 leading-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Preserving the Soul of Sri Lankan Home Cooking
                  </h2>
                </div>

                <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    Sri Lankan food is an art of patience, rich aroma, and holistic wellness. True Sri Lankan curry isn't prepared with artificial flavor powders or synthetic colors; it relies on cold-pressed coconut milk, stone-roasted curry powders, aromatic curry leaves, goraka, and Ceylon cinnamon.
                  </p>
                  <p>
                    In today's fast-paced environment, making authentic three-meal plans daily is nearly impossible for most busy households. 7Day Meals was created to bridge this gap. We combine traditional culinary techniques with high-tech commercial hygiene and precision logistics, giving you real food you can trust every single day.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-stone-200/70">
                    <CheckCircle2 className="w-5 h-5 text-[#0D5C53] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Real Home Style</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Authentic regional flavors crafted with heirloom family recipes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-stone-200/70">
                    <CheckCircle2 className="w-5 h-5 text-[#0D5C53] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Clean & Wholesome</h4>
                      <p className="text-xs text-stone-500 mt-0.5">No artificial additives, excess oil, or harmful food colorings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values & Pillars Section */}
        <section className="py-16 sm:py-24 bg-[#F5F2EC] border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                Our Guiding Values
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-gray-900 mt-2 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                The Pillars That Earn Your Trust
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Everything we cook and deliver is anchored in our uncompromising dedication to safety, freshness, authenticity, and customer care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
                icon={<Leaf className="w-7 h-7" />}
                title="100% Daily Fresh"
                description="We never use frozen or recycled pre-made curries. Vegetables and spices are procured daily and cooked fresh every single morning."
                badge="Farm-to-Table"
              />
              <ValueCard
                icon={<ChefHat className="w-7 h-7" />}
                title="Master Chefs"
                description="Our kitchen is led by veteran Sri Lankan chefs who specialize in regional classics from Colombo, Kandy, Galle, and Jaffna."
                badge="Culinary Heritage"
              />
              <ValueCard
                icon={<ShieldCheck className="w-7 h-7" />}
                title="Stringent Hygiene"
                description="HACCP compliant stainless steel facility with temperature tracking, hairnets, sanitary gloves, and tamper-proof safety seals."
                badge="Safety First"
              />
              <ValueCard
                icon={<HeartHandshake className="w-7 h-7" />}
                title="No-Lock-in Freedom"
                description="Transparent pricing, no hidden delivery surcharges, and total freedom to pause, cancel, or modify your meals at any time."
                badge="Customer-Centric"
              />
            </div>
          </div>
        </section>

        {/* Catering Services & Trust Breakdown */}
        <section id="services" className="py-16 sm:py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                Our Catering Solutions
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-gray-900 mt-2 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Comprehensive Meal Services for Every Need
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Whether you need individual daily nutrition, wholesome family dinners, or corporate office catering, we provide seamless, dependable culinary solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {cateringServices.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/80 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#0D5C53]/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#0D5C53] flex items-center justify-center group-hover:bg-[#0D5C53] group-hover:text-white transition-colors">
                        {service.icon}
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-1 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                      {service.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#0D5C53] mb-4">
                      Targeted for: {service.target}
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-stone-100 mb-8">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Service Highlights:
                      </div>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={service.link}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F2EC] hover:bg-[#0D5C53] text-gray-900 hover:text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors group-hover:bg-[#0D5C53] group-hover:text-white"
                  >
                    <span>{service.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Kitchen Timeline / Process */}
        <section className="py-16 sm:py-24 bg-[#1E293B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#34D399]">
                Transparency in Action
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mt-2 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Our Daily Sourcing & Cooking Process
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe complete transparency builds lasting trust. Here is how your meal is crafted from 4:30 AM dawn to your lunchtime delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {kitchenTimeline.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col relative hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-[#0D5C53]/50 text-teal-300 border border-teal-500/30">
                      {step.time}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs font-bold text-teal-400">
                    Step 0{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Food Safety & Quality Standards Grid */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                  Hygiene & Safety Protocol
                </span>
                <h2
                  className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Your Health & Safety Is Our Highest Standard
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Food safety isn't an afterthought at 7Day Meals — it is engineered into every single recipe, prep counter, and delivery bag.
                </p>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Our 100% Satisfaction Guarantee</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    If any meal fails to meet our high standards of freshness or flavor, notify our support team within 2 hours of delivery for an instant replacement or refund.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {qualityStandards.map((std, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#FDFBF7] border border-stone-200/80 hover:border-[#0D5C53]/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] flex items-center justify-center mb-4">
                      {std.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                      {std.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {std.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials & Reviews */}
        <section className="py-16 sm:py-24 bg-[#F5F2EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                Customer Testimonials
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-gray-900 mt-2 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Trusted by Families & Professionals
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Discover why over 1,200+ customers rely on 7Day Meals for their daily nutrition across Colombo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-stone-700 text-sm sm:text-base italic leading-relaxed mb-6">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                      <Image
                        src={t.avatar}
                        alt={t.author}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.author}</div>
                      <div className="text-xs text-stone-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C53]">
                Got Questions?
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                Everything you need to know about our catering service, ordering, and delivery.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-[#FDFBF7] hover:bg-stone-100/60 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-gray-900 text-sm sm:text-base pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#0D5C53] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 sm:p-6 pt-2 bg-white text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0D5C53] to-[#083E38] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 inline-block mb-4">
              Join the 7Day Meals Community
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Taste the True Standard of Sri Lankan Catering
            </h2>
            <p className="text-base sm:text-lg text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Sign up in less than 2 minutes and customize your weekly breakfast, lunch, or dinner plan. Fresh food, delivered on time, guaranteed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/meal-plans"
                className="bg-white hover:bg-stone-100 text-[#0D5C53] font-bold text-sm sm:text-base px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                View Available Meal Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
