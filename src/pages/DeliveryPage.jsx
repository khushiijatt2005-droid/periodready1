import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Package, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DeliveryPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose your kit',
      desc: 'Pick your emergency Saviour Pouch (₹49), Regular Kit, Travel Kit or Cozy Knit Cramp Bag based on your exact situation.',
      icon: Package,
      tag: 'Step 1'
    },
    {
      num: '02',
      title: 'We pack it discreetly',
      desc: 'Our dispatch center immediately seals your kit inside a 100% plain, unmarked, tamper-proof envelope with zero embarrassing labels or logos.',
      icon: ShieldCheck,
      tag: 'Step 2'
    },
    {
      num: '03',
      title: 'Delivered in about 10 minutes',
      desc: 'A rider delivers directly to your campus gate, hostel reception, PG guard post or office reception in approximately 10 minutes.',
      icon: Zap,
      tag: 'Step 3'
    }
  ];

  const platforms = [
    { name: 'Blinkit', status: 'Available', isAvailable: true, time: '10 Mins', link: 'https://blinkit.com/' },
    { name: 'Zepto', status: 'Available', isAvailable: true, time: '10 Mins', link: 'https://www.zeptonow.com/' },
    { name: 'Swiggy Instamart', status: 'Available', isAvailable: true, time: '10 Mins', link: 'https://www.swiggy.com/instamart' },
    { name: 'Amazon', status: 'Coming soon', isAvailable: false, time: 'Next Day', link: null },
    { name: 'Myntra', status: 'Coming soon', isAvailable: false, time: 'Standard', link: null },
    { name: 'Flipkart', status: 'Coming soon', isAvailable: false, time: 'Standard', link: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blush text-rose text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
          The 10-Minute Menstrual Emergency Guarantee
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-indigo tracking-tight">
          How 10-Minute Discreet Delivery Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Menstrual surprises don’t send advance calendars. When your period arrives in the middle of a college lecture, library study session, or office meeting, you shouldn't have to wait hours or walk through crowded markets.
        </p>
      </div>

      {/* THREE STEPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="relative bg-white rounded-3xl p-8 border border-lavender-border shadow-soft hover:shadow-lift transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif font-extrabold text-4xl text-lavender-deep group-hover:text-rose transition-colors">
                    {st.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-lavender flex items-center justify-center text-indigo group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <span className="text-[11px] font-bold tracking-wider uppercase text-rose block mb-1">
                  {st.tag}
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero delay dispatch</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* WHERE TO GET PERIODREADY ROW */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-lavender-border shadow-soft space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose">
            Instant Availability
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-indigo">
            Where to Get PeriodReady
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Available on your favorite Indian quick-commerce platforms or order directly from our web app.
          </p>
        </div>

        {/* 6 Platform Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((plat) => {
            const content = (
              <>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo shadow-xs mb-2">
                  <Package className="w-5 h-5 text-indigo" />
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1 justify-center">
                  <span>{plat.name}</span>
                  {plat.link && <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo" />}
                </div>

                <div className="mt-3">
                  {plat.isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                      Available
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-600">
                      Coming soon
                    </span>
                  )}
                </div>
              </>
            );

            if (plat.link) {
              return (
                <a
                  key={plat.name}
                  href={plat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-2xl text-center flex flex-col items-center justify-between transition-all bg-lavender/40 border-2 border-indigo/20 shadow-sm hover:border-indigo hover:shadow-md cursor-pointer"
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={plat.name}
                className="p-4 rounded-2xl text-center flex flex-col items-center justify-between transition-all bg-slate-50 border-2 border-dashed border-slate-300 opacity-60"
              >
                {content}
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-blush/60 border border-blush-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-rose flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Indore Dark Hub Locations
              </div>
              <div className="text-xs text-slate-600">
                Vijay Nagar (HQ), Bhawarkua, Geeta Bhawan, MR 10, Super Corridor &amp; Rau Bypass
              </div>
            </div>
          </div>

          <Link
            to="/shop"
            className="shrink-0 px-6 py-2.5 rounded-full bg-indigo hover:bg-indigo-dark text-white font-semibold text-xs shadow-md transition-colors"
          >
            Order Kit Now
          </Link>
        </div>
      </div>

      {/* Campus & PG FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h3 className="font-serif font-bold text-2xl text-center text-indigo">
          Frequently Asked Questions About Delivery
        </h3>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-lavender-border shadow-xs">
            <h4 className="font-semibold text-sm text-slate-900 mb-1">
              Can the rider deliver to my college gate or PG guard?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes! Simply enter "Campus Main Gate 2" or "PG Reception" in the address field. The rider will call or SMS upon arrival so you can collect it quietly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-lavender-border shadow-xs">
            <h4 className="font-semibold text-sm text-slate-900 mb-1">
              Will anyone know what is inside the parcel?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never. All kits are sealed inside an opaque, unmarked, tamper-evident courier pouch with zero period branding on the outside.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-lavender-border shadow-xs">
            <h4 className="font-semibold text-sm text-slate-900 mb-1">
              What if I don't have online UPI ready?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You can select "Cash on delivery" at checkout and pay the rider cash or scan their UPI QR code upon arrival at your gate.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
