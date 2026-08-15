"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  ArrowLeft,
  MessageCircle,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import toast from "react-hot-toast";

// ============================================
// Contact Page
// ============================================
export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // Handle form input changes
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================
  // Handle form submission
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  // ============================================
  // Go back
  // ============================================
  const goBack = () => {
    router.back();
  };

  // ============================================
  // Contact info
  // ============================================
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@carmarket.com",
      href: "mailto:support@carmarket.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Car Street, New York, NY 10001",
      href: "https://maps.google.com",
    },
  ];

  // ============================================
  // Social links
  // ============================================
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  // ============================================
  // Working hours
  // ============================================
  const workingHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Back Button ===== */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors mb-6"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* ===== Header ===== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">
            📬 Contact Us
          </h1>
          <p className="text-[rgb(var(--muted-foreground))] text-lg mt-3 max-w-2xl mx-auto">
            Have questions about buying or selling a car? We're here to help!
            Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== Contact Info ===== */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">📞 Get in Touch</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[rgb(var(--muted))] transition-colors group"
                    >
                      <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-[rgb(var(--muted-foreground))]">
                          {item.title}
                        </p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* ===== Working Hours ===== */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">🕐 Working Hours</h3>
              <div className="space-y-2">
                {workingHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm py-2 border-b border-[rgb(var(--border))] last:border-0"
                  >
                    <span className="text-[rgb(var(--muted-foreground))]">
                      {item.day}
                    </span>
                    <span className="font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== Social Links ===== */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">🌐 Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center hover:bg-primary-500/20 transition-all hover:scale-110"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-primary-500" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== Contact Form ===== */}
          <div className="lg:col-span-2">
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6">✉️ Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* ===== Name ===== */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-all"
                      required
                    />
                  </div>

                  {/* ===== Email ===== */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* ===== Subject ===== */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-all"
                  />
                </div>

                {/* ===== Message ===== */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={6}
                    className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] resize-none transition-all"
                    required
                  />
                </div>

                {/* ===== Submit ===== */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-[rgb(var(--muted-foreground))] text-center">
                  We'll get back to you within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* ===== Map Section (Optional) ===== */}
        <div className="mt-12">
          <div className="card p-6 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">📍 Find Us</h3>
            <div className="w-full h-64 bg-[rgb(var(--muted))] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                <p className="text-[rgb(var(--muted-foreground))]">
                  Google Maps Integration
                </p>
                <p className="text-xs text-[rgb(var(--muted-foreground))] mt-1">
                  (Add your Google Maps embed code here)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
