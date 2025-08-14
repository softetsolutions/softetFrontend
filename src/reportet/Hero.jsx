const HeroSection = () => {
  return (
    <>
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
   </>
  );
};

export default HeroSection;
