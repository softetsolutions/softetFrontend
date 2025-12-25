import React, { useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Testimonial } from "../components/Testimonial";
import { AboutUs } from "../components/AboutUs";
import { ContactUs } from "../components/ContactUs";
import { Footer } from "../components/Footer";
import { Tools } from "../components/Tools";

const Policy = () => {
  // refs for scrolling (optional if needed)
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const aboutUsRef = useRef(null);
  const toolsRef = useRef(null);

  // smooth scrolling function
  const scrollToSection = (ref) => {
    if (ref?.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar
        scrollToSection={scrollToSection}
        heroRef={heroRef}
        servicesRef={servicesRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
        toolsRef={toolsRef}
        aboutUsRef={aboutUsRef}
        isLoginRequired={false}
      />

      {/* Main Privacy Policy content */}
      <div className="min-h-screen bg-blue-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Privacy Policy
          </h1>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              Introduction: This Privacy Policy describes how and its affiliates
              (collectively "Softet Solutions, we, our, us") collect, use,
              share, protect, or otherwise process your information/personal
              data through our website
              <a
                href="https://www.softetsolutions.com/"
                className="text-blue-600 underline"
              >
                {" "}
                https://www.softetsolutions.com/
              </a>{" "}
              (Platform). Please note that you may browse certain sections of
              the Platform without registering. We do not offer any
              product/service outside India, and your personal data will
              primarily be stored and processed in India. By visiting this
              Platform, providing your information, or availing any
              product/service offered on the Platform, you agree to be bound by
              this Privacy Policy, the Terms of Use, applicable service/product
              terms, and the laws of India. If you do not agree, please do not
              use the Platform.
            </p>

            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Collection:</strong> We collect personal data when you
                use our Platform, services, or interact with us. This includes
                information provided during registration such as name, date of
                birth, address, phone number, email, and sensitive data like
                bank account or payment information, with your consent. You may
                opt not to provide certain information by choosing not to use
                specific features. We may also track behavior, preferences, and
                transaction information, including third-party partner data
                (governed by their privacy policies). Never share sensitive data
                like PINs or passwords via email or call.
              </li>

              <li>
                <strong>Usage:</strong> We use personal data to provide
                services, assist sellers/partners, enhance customer experience,
                resolve disputes, inform about offers, customize experiences,
                detect fraud, enforce terms, conduct research, and other
                purposes specified during collection. Access to services may
                depend on providing permission.
              </li>

              <li>
                <strong>Sharing:</strong> Personal data may be shared internally
                within our group or with third parties such as sellers, service
                providers, logistics partners, payment issuers, and government
                agencies if required by law or for fraud prevention. Third-party
                disclosures are necessary to provide services or comply with
                legal obligations.
              </li>

              <li>
                <strong>Security Precautions:</strong> We adopt reasonable
                practices to protect your data against unauthorized access,
                loss, or misuse. While we use secure servers, transmission over
                the internet may not be completely secure. Users are responsible
                for protecting login credentials.
              </li>

              <li>
                <strong>Data Deletion and Retention:</strong> You can delete
                your account via profile settings or by contacting us. Some data
                may be retained in cases of pending grievances, shipments, or
                legal requirements. Personal data is retained only as long as
                necessary and may be anonymized for research/analytics.
              </li>

              <li>
                <strong>Your Rights:</strong> You may access, rectify, and
                update your personal data through Platform functionalities.
              </li>

              <li>
                <strong>Consent:</strong> By using the Platform, you consent to
                collection, use, storage, disclosure, and processing of
                information as described. You may withdraw consent by contacting
                the Grievance Officer, but withdrawal may affect service
                availability.
              </li>

              <li>
                <strong>Changes to this Privacy Policy:</strong> Check the
                Privacy Policy periodically for updates. Significant changes may
                be communicated per applicable laws.
              </li>

              <li>
                <strong>Grievance Officer:</strong> Insert Name of the Office,
                Designation, Company Name and Address, Contact details, Phone,
                Time: Monday - Friday (9:00 - 18:00)
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        scrollToSection={scrollToSection}
        heroRef={heroRef}
        servicesRef={servicesRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
        toolsRef={toolsRef}
        aboutUsRef={aboutUsRef}
      />
    </div>
  );
};

export default Policy;
