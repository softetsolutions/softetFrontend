import {
  Users,
  ClipboardCheck,
  Clock,
  BarChart3,
  Wallet,
  MapPin,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Users,
    gradient: "from-indigo-500 to-indigo-700",
    title: "Role-Based Access",
    desc: "Separate, purpose-built views for Admin, Area Manager, and MR — each seeing exactly the data relevant to their role.",
  },
  {
    icon: ClipboardCheck,
    gradient: "from-blue-500 to-blue-700",
    title: "Daily & Monthly Reporting",
    desc: "MRs submit daily visit reports and monthly sales reports directly from the app — no paperwork, no spreadsheets.",
  },
  {
    icon: Clock,
    gradient: "from-violet-500 to-purple-700",
    title: "Missed Doctor Tracking",
    desc: "MRs and Area Managers instantly see which doctors were missed, so no visit plan falls through the cracks.",
  },
  {
    icon: BarChart3,
    gradient: "from-sky-500 to-blue-600",
    title: "Headquarter-Wise Sales Insights",
    desc: "Admins view sales performance and visit compliance broken down by headquarter, MR, and doctor.",
  },
  {
    icon: Wallet,
    gradient: "from-purple-600 to-indigo-800",
    title: "Built-In HRMS",
    desc: "Leave tracking and payroll generation live inside ReportET, so there's no need for a separate HR tool.",
  },
  {
    icon: MapPin,
    gradient: "from-cyan-500 to-sky-700",
    title: "Live Employee Tracking",
    desc: "Real-time location tracking for field employees is on its way, adding another layer of visibility for admins.",
    soon: true,
  },
];

const adminPoints = [
  "Daily reporting, MR-wise and doctor-wise",
  "Headquarter-wise sales and missed-visit view",
  "Monthly report roll-ups across the team",
  "Leave approvals and payroll generation",
];

const mobilePoints = [
  "Submit daily and monthly reports on the go",
  "See missed doctors at a glance",
  "Apply for leave and check payroll status",
  "Same account, for both MR and Area Manager",
];

const audienceTags = [
  "Medical Representatives",
  "Area Managers",
  "Admin Teams",
  "Multi-Headquarter Operations",
  "Doctor Visit Compliance",
  "Leave & Payroll",
];

export default function Hero() {
  return (
    <main className="bg-slate-50 text-slate-900 font-sans">
      {/* HERO */}
      <section className="text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4">
          Field Force Reporting Platform
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          Every Visit, Every Report,{" "}
          <span className="bg-gradient-to-br from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            One Platform.
          </span>
        </h1>
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 mx-auto mb-6" />
        <p className="text-slate-500 text-base md:text-lg mb-8 max-w-xl mx-auto">
          ReportET helps medical distribution businesses track daily reporting,
          monthly sales, and doctor visits across every headquarter — with a
          built-in HRMS for leave and payroll, so your field team runs on a
          single system, not five.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-transform"
          >
            Request a Demo <ArrowRight size={18} />
          </a>
          {/* <button className="bg-white border border-slate-200 font-bold px-7 py-3.5 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors">
            See Plans
          </button> */}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-14 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Built for
            Admin, Area Manager & MR roles
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Daily &
            monthly reporting
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />{" "}
            Headquarter-wise sales visibility
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3">
            Features Overview
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Built for the Way Your Field Team Works
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, gradient, title, desc, soon }) => (
            <div
              key={title}
              className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              {soon && (
                <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5`}
              >
                <Icon className="text-white" size={26} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLUE BAND */}
      <section className="bg-gradient-to-br from-indigo-700 to-blue-500 text-white px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Built to Simplify Field Force Management
            </h2>
            <p className="text-blue-100 max-w-md mb-7">
              Whether you manage a handful of MRs or a field force spread across
              dozens of headquarters, ReportET keeps reporting, sales tracking,
              and HR on one system — purpose-built for medical distribution
              businesses.
            </p>
            <button className="bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 transition-transform">
              Talk to Us
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              ["Daily", "Visit & reporting cycle"],
              ["Monthly", "Sales report roll-up"],
              ["3 Roles", "Admin · Area Manager · MR"],
              ["1 Platform", "Reporting + HRMS combined"],
            ].map(([num, label]) => (
              <div
                key={num}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="text-2xl font-extrabold mb-1">{num}</div>
                <div className="text-sm text-blue-100">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3">
            Two Platforms, One System
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Admin Panel & Mobile App
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full mb-5">
              Admin Panel
            </span>
            <h3 className="text-2xl font-extrabold mb-3">
              Complete visibility, from HQ to doctor
            </h3>
            <p className="text-slate-500 mb-6">
              Everything your admin team needs to see how the field force is
              performing, in one dashboard.
            </p>
            <ul className="space-y-3">
              {adminPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-slate-700"
                >
                  <Check className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full mb-5">
              Mobile App
            </span>
            <h3 className="text-2xl font-extrabold mb-3">
              Built for the MR and Area Manager, on the move
            </h3>
            <p className="text-slate-500 mb-6">
              A simple app to log visits, file reports, and stay on top of
              doctor coverage — right from the field.
            </p>
            <ul className="space-y-3">
              {mobilePoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-slate-700"
                >
                  <Check className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHO ITS FOR */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-white">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
              Made for Medical Distribution Businesses
            </h2>
            <p className="text-slate-400 max-w-md">
              If you run a field force of Medical Representatives and Area
              Managers — five or five hundred — ReportET is built around how
              your business actually operates: doctor visits, headquarter-wise
              sales, and the HR work that keeps a field team running.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {audienceTags.map((tag) => (
              <span
                key={tag}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          Bring Your Field Force Onto One Platform
        </h2>
        <p className="text-slate-500 mb-8">
          See how ReportET handles reporting, sales tracking, and HR for teams
          like yours.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/contact"
            className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-transform"
          >
            Request a Demo
          </a>
        </div>
      </section>
    </main>
  );
}
