import { ChevronRight, Download, Check, Home, Bell, Search, Menu, Stethoscope, Users, Pill } from 'lucide-react';

const HeroSection = () => {

  const testimonials = [
    {
      id: 1,
      quote: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus",
      image: "https://placehold.co/128x128/9CA3AF/FFFFFF?text=AM", // Placeholder image for Adward Maya
      name: "Adward Maya",
      title: "WEB DEVELOPER"
    },
    {
      id: 2,
      quote: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus",
      image: "https://placehold.co/128x128/9CA3AF/FFFFFF?text=JR", // Placeholder image for Jesmin Rosy
      name: "Jesmin Rosy",
      title: "WEB DESIGNER"
    }
  ];
  return (
    <section>
      <section
        className="relative bg-cover bg-center min-h-screen text-white flex flex-col justify-center items-center text-center px-4"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/8855516/pexels-photo-8855516.jpeg')" }} // Replace with your background image path
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/20"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-6 ">
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            We help you to boost your business
          </h1>
          <p className="text-lg md:text-xl text-blue-600">
            Connect with your clients in a different way
          </p>
        </div>
      </section>

            <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-inter flex flex-col lg:flex-row items-center justify-center lg:space-x-12">
        {/* Left side: Mobile App Mockup */}
        <div className="flex-shrink-0 mb-12 lg:mb-0">
          <div className="bg-gray-100 rounded-[3rem] p-4 shadow-2xl relative w-80 h-[600px] border-[10px] border-gray-900">
            {/* Top Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-900 rounded-b-2xl z-10"></div>

            {/* Main App Content */}
            <div className="bg-white rounded-[2rem] h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4">
                <button className="text-gray-400 p-2 rounded-lg bg-gray-100">
                  <ChevronRight size={20} className="transform rotate-180" />
                </button>
                <span className="text-gray-800 font-semibold">Medical Analysis</span>
                <button className="text-gray-400 p-2 rounded-lg bg-gray-100">
                  <Menu size={20} />
                </button>
              </div>

              {/* Stats Section */}
              <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-6 rounded-2xl flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-medium">Active Doctors</h4>
                    <p className="text-2xl text-gray-900 font-bold">275</p>
                    <p className="text-xs text-gray-400">This Monthly</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-medium">Active Patienats</h4>
                    <p className="text-2xl text-gray-900 font-bold">1685</p>
                    <p className="text-xs text-gray-400">This Monthly</p>
                  </div>
                </div>
              </div>

              {/* Nav Bar */}
              <div className="mt-auto p-4 flex justify-around items-center bg-white border-t border-gray-200 rounded-b-[2rem]">
                <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <Home size={24} />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <Bell size={24} />
                </button>
                <button className="text-blue-500">
                  <Pill size={24} />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <Search size={24} />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Text Content */}
        <div className="max-w-xl text-center lg:text-left">
          <h3 className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-2">
            ABOUT OUR APP
          </h3>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            Assuring you of <span className="text-blue-600">the best medical services.</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            We help you to create innovations and we transform ideas into reality. The innovation is often identified with new technology. Most of the innovative projects however is not based on revolutionary technological solutions. The innovation is often about changing the meaning of what a product or a service is and what it offers its users.
          </p>

          {/* Features List */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center space-x-2">
              <Check size={20} className="text-blue-500" />
              <span className="text-gray-700">Ultimate interface</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check size={20} className="text-blue-500" />
              <span className="text-gray-700">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-16 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold text-red-500 mb-10">
            Get amazing product with an excellent service
          </h1>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {/* Business Analytics */}
            <div className="flex flex-col items-center px-4">
              <div className="text-red-500 mb-3 text-4xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Analytics</h3>
              <p className="text-gray-600">
                Reporting Log helps to discover, interpret, and communicate with meaningful patterns in data.
                We aim to obtain insightful and actionable information that help practitioners accomplish tasks.
              </p>
            </div>

            {/* Customized Solutions */}
            <div className="flex flex-col items-center px-4">
              <div className="text-red-500 mb-3 text-4xl">🏷️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customized solutions</h3>
              <p className="text-gray-600">
                Reporting Log is fully customizable as per your requirement that gives you more power and
                manageable way to control everything.
              </p>
              <button className="mt-6 px-6 py-2 border-2 border-red-500 text-red-500 rounded-full font-semibold hover:bg-red-500 hover:text-white transition">
                GET STARTED
              </button>
            </div>



            {/* Expense Control */}
            <div className="flex flex-col items-center px-4">
              <div className="text-red-500 mb-3 text-4xl">💼</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Expense Control</h3>
              <p className="text-gray-600">
                Reporting Log has various powerful tools that helps you to control daily and monthly expenses
                dynamically without wasting time to calculate manually and traditional way.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <section className="bg-white">


        {/* Strong Numbers Section */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12">STRONG NUMBERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Stat 1 */}
              <div>
                <div className="flex justify-center mb-4">
                  {/* <img src="/icons/users.svg" alt="Users" className="h-10" /> */}
                </div>
                <p className="text-3xl font-bold text-gray-800">4500+</p>
                <p className="text-gray-600 mt-2">Users use daily Reporting Log to submit their Daily Report.</p>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="flex justify-center mb-4">
                  {/* <img src="/icons/chat.svg" alt="Satisfaction" className="h-10" /> */}
                </div>
                <p className="text-3xl font-bold text-gray-800">99.9%</p>
                <p className="text-gray-600 mt-2">User satisfaction rate for Reporting Log.</p>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="flex justify-center mb-4">
                  {/* <img src="/icons/globe.svg" alt="Countries" className="h-10" /> */}
                </div>
                <p className="text-3xl font-bold text-gray-800">10+</p>
                <p className="text-gray-600 mt-2">Reporting Log team provides their service in more than 10 countries.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="max-w-7xl mx-auto text-center">
          {/* Section Heading and Subheading */}
          <h3 className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-2">
            CLIENTS FEEDBACK
          </h3>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-12">
            What our client says
          </h2>

          {/* Testimonials Container */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 lg:gap-12">
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 max-w-lg mx-auto md:mx-0 flex flex-col items-start space-y-6 transform transition-transform duration-300 hover:scale-105"
              >
                {/* Quote Icon */}
                <div className="flex items-center justify-center p-3 rounded-xl bg-blue-100 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote"><path d="M15 22s-4-1-4-8V2h8v7.21c0 2.2-2 3.4-4 4.7l-1 1.1c-1 1.4-2 2.5-3 3.1c-1 0.5-2 0.7-3 0.9" /><path d="M9 22s-4-1-4-8V2h8v7.21c0 2.2-2 3.4-4 4.7l-1 1.1c-1 1.4-2 2.5-3 3.1c-1 0.5-2 0.7-3 0.9" /></svg>
                </div>

                {/* Quote Text */}
                <p className="text-gray-600 leading-relaxed font-inter">{testimonial.quote}</p>

                {/* Author and Title section */}
                <div className="flex items-center space-x-4 pt-4">
                  {/* Author Image */}
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-bold text-lg font-inter">{testimonial.name}</span>
                    <span className="text-gray-500 text-sm uppercase tracking-wide font-medium font-inter">{testimonial.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Contact Form Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full mt-12 lg:mt-0">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-8 text-center">
            Get in Touch
          </h2>
          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Your Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Your Email"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                placeholder="Your Message"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Send Message</span>

            </button>
          </form>
        </div>
      </div>

    </section>

  );
};

export default HeroSection;
