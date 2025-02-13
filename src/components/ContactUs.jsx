import { useState } from "react";
import { Send } from "lucide-react";

export function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Dummy form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent!");
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-blue-900 text-center">
          Contact Us
        </h2>
        <p className="mt-4 text-lg text-blue-800/80 text-center">
        Have a question about our product, looking for a demo, or interested in partnering with us? Reach out, and we’ll connect with you soon!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-blue-900"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <span className="flex items-center">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
