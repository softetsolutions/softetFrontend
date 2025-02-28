import { useState } from "react";
import { Send } from "lucide-react";
import emailjs from '@emailjs/browser';

export function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    contact: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Fetch environment variables
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!publicKey || !serviceId || !templateId) {
      console.error("Missing EmailJS environment variables.");
      alert("Error: Missing EmailJS configuration.");
      setIsSubmitting(false);
      return;
    }

    try {
      emailjs.init(publicKey);
      await emailjs.send(serviceId, templateId, {
        to_name: 'Softet Solutions',
        from_name: formData.name.trim(),
        message: `Subject: ${formData.subject.trim()}\nMessage: ${formData.message.trim()}\nPhone: ${formData.contact.trim()}\nEmail: ${formData.email.trim()}`,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        contact: "",
      });

      alert("Thanks for filling out the form! We will get back to you soon.");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
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
          {["name", "email", "subject", "contact"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-blue-900">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                id={field}
                required
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-blue-900">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : (
              <span className="flex items-center">
                Send Message <Send className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
