import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  PackageCheck,
  Crown,
  TrendingUp,
  Flame,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Khushi Jat',
      initials: 'KJ',
      role: 'CEO',
      subRole: 'Founder & Visionary',
      quote: '"Emergency preparedness is every woman’s fundamental right to dignity, speed and peace of mind."',
      isCEO: true,
      color: 'indigo',
      gradient: 'from-amber-300 via-rose to-indigo-light',
      nameColor: 'bg-gradient-to-r from-white via-amber-100 to-rose-200 text-transparent bg-clip-text',
      badgeBg: 'bg-gradient-to-br from-indigo-800 via-indigo to-rose/50 text-white border-2 border-amber-300/90 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      pillBg: 'bg-gradient-to-r from-rose to-rose-dark text-white border border-rose-300/40 shadow-sm',
      cardBg: 'bg-gradient-to-br from-[#1a173d] via-[#2a245f] to-[#3f377a]',
      cardBorder: 'border-2 border-amber-400/40 hover:border-amber-400 shadow-2xl',
      footerLeft: 'Executive Leadership',
      footerRight: 'Indore HQ · Founder',
      icon: Crown
    },
    {
      name: 'Mohammad Farhan Mansuri',
      initials: 'FM',
      role: 'CMO',
      subRole: 'Chief Marketing Officer',
      quote: '"Normalizing period dialogue across every Indian college campus, hostel and workplace."',
      isCEO: false,
      color: 'rose',
      gradient: 'from-[#d6457f] via-[#ec4899] to-[#be185d]',
      nameColor: 'bg-gradient-to-r from-[#881337] via-[#9d174d] to-[#be185d] text-transparent bg-clip-text',
      badgeBg: 'bg-gradient-to-br from-[#d6457f] to-[#9d174d] text-white shadow-lg shadow-rose/30 ring-2 ring-pink-200/90',
      pillBg: 'bg-pink-50 text-[#9d174d] border-pink-200 font-extrabold',
      cardBg: 'bg-gradient-to-b from-[#fff0f5] via-white to-[#fff8fa]',
      cardBorder: 'border-2 border-pink-200/90 hover:border-rose/60 shadow-soft hover:shadow-lift',
      footerLeft: 'Brand Strategy',
      footerRight: 'CMO · Marketing',
      icon: Sparkles
    },
    {
      name: 'Anushka Khandelwal',
      initials: 'AK',
      role: 'CFO',
      subRole: 'Chief Financial Officer',
      quote: '"Keeping life-saving menstrual emergency kits radically affordable starting at ₹49."',
      isCEO: false,
      color: 'green',
      gradient: 'from-[#059669] via-[#0d9488] to-[#14b8a6]',
      nameColor: 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-transparent bg-clip-text',
      badgeBg: 'bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-200/90',
      pillBg: 'bg-emerald-50 text-[#065f46] border-emerald-200 font-extrabold',
      cardBg: 'bg-gradient-to-b from-[#f0fdf4] via-white to-[#f7fef9]',
      cardBorder: 'border-2 border-emerald-200/90 hover:border-emerald-500/60 shadow-soft hover:shadow-lift',
      footerLeft: 'Unit Economics',
      footerRight: 'CFO · Finance',
      icon: TrendingUp
    },
    {
      name: 'Sachin Gangbhoj',
      initials: 'SG',
      role: 'COO',
      subRole: 'Chief Operating Officer',
      quote: '"Expanding our 10-minute dark store hyper-local network to every corner of Central India."',
      isCEO: false,
      color: 'orange',
      gradient: 'from-[#d97706] via-[#ea580c] to-[#f97316]',
      nameColor: 'bg-gradient-to-r from-[#7c2d12] via-[#9a3412] to-[#c2410c] text-transparent bg-clip-text',
      badgeBg: 'bg-gradient-to-br from-[#d97706] to-[#c2410c] text-white shadow-lg shadow-orange-500/30 ring-2 ring-amber-200/90',
      pillBg: 'bg-amber-50 text-[#9a3412] border-amber-200 font-extrabold',
      cardBg: 'bg-gradient-to-b from-[#fffbeb] via-white to-[#fffdf5]',
      cardBorder: 'border-2 border-amber-200/90 hover:border-orange-500/60 shadow-soft hover:shadow-lift',
      footerLeft: 'Dark Store Ops',
      footerRight: 'COO · Operations',
      icon: Zap
    }
  ];

  const guide = [
    {
      title: 'Emergency Period Kit (₹49)',
      when: 'Unexpected period surprises in college, exams, office or transit.',
      contains: '1 Pad, 2 Coin Tissues, 2 Painkiller Tablets, Compact Pouch.',
      action: 'Pocket Rescue'
    },
    {
      title: 'Regular Period Kit (₹179)',
      when: 'Full day lectures, PG stay, or workday replenishment.',
      contains: '3 XL Pads, Hand Sanitizer, Disposal Bags, Guide Card.',
      action: 'Daily Essential'
    },
    {
      title: 'Travel Period Kit (₹249)',
      when: 'Trains, flights, road trips & places with zero clean water.',
      contains: 'Cramp Roll-on, Stain Remover, Cups/Pads, 10 Intimate Wipes.',
      action: 'No-Wash Edition'
    },
    {
      title: 'Over-all Master Combo Box (₹399)',
      when: 'Best for gifting to a friend, daughter, sister, or personal stocking.',
      contains: 'Full Regular Kit + Full Travel Kit + Full Emergency Kit in Gift Box.',
      action: 'Best For Gifting'
    },
    {
      title: 'Cozy Knit Hot Water Bag (₹349)',
      when: 'Intense menstrual cramps, lower back stiffness, bedtime warmth.',
      contains: 'Reusable leak-resistant bag with cable-knit cover (7 pastel colours).',
      action: 'Cramp Relief'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* BRAND STORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blush text-rose text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Born in Indore, Built for India
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-indigo tracking-tight">
            The Story Behind PeriodReady
          </h1>
          <p className="font-serif italic text-lg text-rose font-medium">
            "When a period surprises you, we’re 10 minutes away."
          </p>
          <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              In India, millions of college students living in PGs, hostel residents far from home, and working professionals endure a shared, quiet panic: <strong className="text-slate-900">an unexpected period starting hours before an exam or right in the middle of a workday</strong>.
            </p>
            <p>
              Walking to distant medical stores, asking male pharmacists while facing awkward stares, or waiting hours for standard e-commerce delivery was simply unacceptable. 
            </p>
            <p>
              We founded <strong className="text-indigo">PeriodReady</strong> in Vijay Nagar, Indore with a clear, singular pledge: <span className="font-semibold text-slate-900">Emergency period care delivered in 10 minutes to your gate in 100% plain, discreet packaging.</span>
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <span className="font-serif italic font-bold text-indigo text-base">
              "Be Ready. Feel Confident. Always."
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-lavender via-blush/40 to-white border border-lavender-border shadow-lift space-y-6">
            <div className="w-16 h-16 rounded-full bg-white p-2 shadow-sm border border-lavender-border flex items-center justify-center">
              <img src="/images/logo.png" alt="PeriodReady Logo" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xl text-indigo">Our Three Core Pillars</h3>
              
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sub-10 Min Response:</strong> Hyperlocal dark-store dispatch.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero-Judgment Discreet Packaging:</strong> Tamper-evident plain courier sleeves.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Accessible Pricing:</strong> Pocket rescue kits starting at just ₹49.</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-lavender-border text-xs text-slate-600 flex items-center justify-between">
              <div>
                📍 <strong>Indore HQ:</strong> Vijay Nagar, Indore, Madhya Pradesh 452001
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Vijay+Nagar,+Indore,+Madhya+Pradesh+452001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose font-bold text-xs hover:underline shrink-0 ml-2"
              >
                Open in Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* "WHICH KIT IS FOR YOU?" SECTION */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose">
            Selection Guide
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-indigo">
            Which Kit Is Right For You?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare scenarios to find your perfect menstrual emergency companion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guide.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-lavender-border shadow-soft flex flex-col justify-between space-y-4 hover:shadow-lift transition-shadow"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lavender text-indigo border border-lavender-border uppercase">
                  {item.action}
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600">
                  <strong>When to use:</strong> {item.when}
                </p>
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <strong>Includes:</strong> {item.contains}
                </p>
              </div>

              <Link
                to={item.title.includes('Hot Water Bag') ? '/hot-water-bag' : '/shop'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo hover:text-rose transition-colors"
              >
                <span>View kit &amp; order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* MEET OUR LEADERSHIP TEAM */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose">
            Visionary Founders &amp; Operators
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-indigo">
            Meet Our Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            The passionate team based in Indore, dedicated to revolutionizing Indian menstrual emergency logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {teamMembers.map((member) => {
            const IconComponent = member.icon;

            if (member.isCEO) {
              // Special emphasized CEO Card: Dark Indigo with White/Gold glow text and larger emphasis
              return (
                <div
                  key={member.name}
                  className={`relative rounded-3xl ${member.cardBg} text-white p-6 sm:p-7 ${member.cardBorder} flex flex-col justify-between overflow-hidden transform md:-translate-y-3 transition-all duration-300 group`}
                >
                  {/* Glowing Top Band */}
                  <div className={`absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r ${member.gradient} shadow-md`}></div>
                  
                  {/* Subtle decorative glow in background */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose/25 rounded-full blur-2xl pointer-events-none group-hover:bg-rose/35 transition-all"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="space-y-5 pt-3 relative z-10">
                    {/* Big Rounded-Square Initials Badge + Founder Crown */}
                    <div className="flex items-center justify-between">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-serif font-black text-2xl tracking-wider ${member.badgeBg}`}>
                        {member.initials}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-[11px] font-bold tracking-wide shadow-xs">
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>Founder</span>
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-serif font-extrabold text-2xl sm:text-[26px] tracking-tight ${member.nameColor}`}>
                        {member.name}
                      </h3>
                      {/* Uppercase Role Pill & Sub-role */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${member.pillBg}`}>
                          <Star className="w-3 h-3 fill-white text-white" />
                          {member.role}
                        </span>
                        <span className="text-[11px] text-amber-200/90 font-medium">
                          {member.subRole}
                        </span>
                      </div>
                    </div>

                    {/* Short Italic Line */}
                    <p className="font-serif italic text-xs sm:text-sm text-pink-100/90 leading-relaxed border-l-2 border-rose/60 pl-3 py-0.5">
                      {member.quote}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-pink-200/80 relative z-10">
                    <span className="font-medium">{member.footerLeft}</span>
                    <span className="text-amber-200 font-bold">{member.footerRight}</span>
                  </div>
                </div>
              );
            }

            // Other Leadership Team Cards (FM, AK, SG)
            return (
              <div
                key={member.name}
                className={`relative rounded-3xl ${member.cardBg} text-slate-800 p-6 sm:p-7 ${member.cardBorder} flex flex-col justify-between overflow-hidden transition-all duration-300 group hover:-translate-y-1.5`}
              >
                {/* Gradient Top Band */}
                <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${member.gradient} shadow-xs`}></div>

                <div className="space-y-4 pt-3 relative z-10">
                  {/* Big Rounded-Square Initials Badge + Role Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-black text-xl tracking-wider ${member.badgeBg}`}>
                      {member.initials}
                    </div>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${member.pillBg} shadow-xs`}>
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-serif font-extrabold text-xl sm:text-[22px] tracking-tight ${member.nameColor}`}>
                      {member.name}
                    </h3>
                    {/* Uppercase Role Pill */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${member.pillBg}`}>
                        {member.role}
                      </span>
                      {member.subRole && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {member.subRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Short Italic Line */}
                  <p className="font-serif italic text-xs text-slate-700 leading-relaxed border-l-2 border-slate-200 group-hover:border-slate-300 pl-2.5 py-0.5 transition-colors">
                    {member.quote}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500 relative z-10">
                  <span>{member.footerLeft}</span>
                  <span className="font-bold text-slate-700">{member.footerRight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
