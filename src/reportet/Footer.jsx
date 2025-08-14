export default function Footer() {
  return (
    <footer className="bg-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Logo & Description */}
        <div>
          {/* <img src="/logo.png" alt="Reporting Log" className="w-40 mb-4" /> */}
                    <a href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            Report<span className="text-black">ET</span>
          </a>
          <p className="text-sm leading-relaxed">
            Reporting Log is Sales Force Automation tool, that helps to manage field force for any kind of marketing industry.
          </p>
        </div>

        {/* Column 2: Company */}
        <div>
          <h4 className="text-red-400 uppercase font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Features', 'Contact Us', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Social */}
        <div>
          <h4 className="text-red-400 uppercase font-semibold text-sm mb-4">Social</h4>
          <ul className="space-y-2 text-sm">
            {['Twitter', 'Facebook', 'LinkedIn'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="text-red-400 uppercase font-semibold text-sm mb-4">Contact Us</h4>
          <p className="text-sm mb-2">1800-000-0000</p>
          <p className="text-sm mb-4">(+91) 9874563210</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="mailto:info@reportinglog.com" className="hover:text-white transition">
                info@reportet.com
              </a>
            </li>
            <li>
              <a href="mailto:sales@reportinglog.com" className="hover:text-white transition">
                sales@reportet.com
              </a>
            </li>
            <li>
              <a href="mailto:support@reportinglog.com" className="hover:text-white transition">
                support@reportet.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
