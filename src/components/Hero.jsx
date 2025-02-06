import { useEffect, useState } from "react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[rgb(11,59,106)] via-[#165490] to-[#0B3B6A] flex flex-col justify-center">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center -mt-28">
          <div className="overflow-hidden">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl pb-2">
              <span className="block animate-rising break-words ">
                Empowering Businesses
              </span>
              <span className="block animate-rising break-words mt-3">
                with
              </span>
              <span className="block animate-rising break-words mt-3">
                Cutting-Edge Software Solutions
              </span>
            </h1>
          </div>
          <p
            className={`mt-6 text-lg text-blue-100 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your One-Stop Solution for All Things Software – Web, Mobile,
            Extensions, Desktop, and Custom Solutions Tailored Just for You!
          </p>
          <div
            className={`mt-10 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button className="px-8 py-4 text-[#0B3B6A] border-2 border-[#0B3B6A] bg-white rounded-xl hover:bg-blue-50 hover:border-blue-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 active:scale-95 transition-all duration-200 font-semibold shadow-sm animate-rising cursor-pointer">
              Discover Our Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
