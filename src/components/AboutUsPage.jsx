import { Navbar } from "../components/Navbar";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar showoptions={false} />

      {/* Main About Us content */}
      <div className="min-h-screen bg-blue-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            About Softet Solutions
          </h1>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p className="text-lg font-semibold text-blue-800">
              Transforming Ideas into Digital Excellence
            </p>

            <p>
              At <strong>Softet Solutions</strong>, our mission is to deliver
              exceptional software solutions that drive business success. As the
              founder and owner, I am proud to lead a team of dedicated experts
              who specialize in web, app, and desktop development. We are
              committed to bringing your ideas to life with the latest
              technologies and user-centered design principles.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">
              Our Core Values
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Innovation First
                </h3>
                <p>
                  We believe in staying ahead of the curve. That’s why we
                  leverage cutting-edge technologies to build solutions that are
                  not only functional but also future-proof. Whether it’s a
                  dynamic web application, a cross-platform mobile app, or a
                  robust desktop system, we ensure our clients receive the best
                  in class.
                </p>
                <ul className="list-disc list-inside mt-3 ml-4 space-y-2">
                  <li>Leveraging cutting-edge technologies</li>
                  <li>Providing hands-on Industrial Training</li>
                  <li>
                    Specializing in the <strong>MERN Stack • Live</strong>
                  </li>
                  <li>
                    Helping you <strong>Become Job Ready</strong> at an
                    accessible price of <strong>₹4,999</strong>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Client-Centric Approach
                </h3>
                <p>
                  Your success is our success. Every project we undertake is
                  driven by a deep understanding of your goals, challenges, and
                  vision. We work closely with you at every stage—from ideation
                  to deployment—ensuring the final product not only meets but
                  exceeds your expectations.
                </p>
                <p className="mt-4 italic text-blue-700 font-medium">
                  Focused on your success.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mt-10 mb-4">
              Why Choose Us?
            </h2>

            <p>
              With years of experience in the tech industry, Softet Solutions
              has built a reputation for reliability, transparency, and
              excellence. We don’t just build software—we build partnerships.
              Whether you’re a startup looking to launch your first product or
              an established business aiming to digitize operations, we are here
              to guide you through your digital transformation journey.
            </p>

            <p>
              Thank you for considering Softet Solutions. Together, let’s turn
              your vision into reality.
            </p>

            <p className="mt-8 text-blue-900 font-bold">— Softet Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
