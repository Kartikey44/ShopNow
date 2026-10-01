import React, { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, MessageCircle } from "lucide-react";

function Contacts() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#06110d] text-white px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-10 mb-10">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.25em]">
            Get In Touch
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold mt-4">
            Contact Us
          </h1>

          <p className="max-w-xl mx-auto text-gray-500 mt-4">
            Have a question about an order, product or anything else? We would
            love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Mail size={20} className="text-emerald-400" />
              </div>

              <h3 className="font-semibold mt-5">Email</h3>

              <p className="text-sm text-gray-500 mt-2">support@example.com</p>
            </div>

            <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Phone size={20} className="text-emerald-400" />
              </div>

              <h3 className="font-semibold mt-5">Phone</h3>

              <p className="text-sm text-gray-500 mt-2">+91 98765 43210</p>
            </div>

            <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MapPin size={20} className="text-emerald-400" />
              </div>

              <h3 className="font-semibold mt-5">Location</h3>

              <p className="text-sm text-gray-500 mt-2">India</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MessageCircle size={19} className="text-emerald-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Send us a message</h2>

                <p className="text-xs text-gray-500 mt-1">
                  We usually respond within 24 hours.
                </p>
              </div>
            </div>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="contact-label">Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="contact-input"
                  />
                </div>

                <div>
                  <label className="contact-label">Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="contact-input"
                  />
                </div>
              </div>

              <div>
                <label className="contact-label">Subject</label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="contact-input"
                />
              </div>

              <div>
                <label className="contact-label">Message</label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="6"
                  className="contact-input py-3 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#03100a] font-semibold flex items-center justify-center gap-2 transition hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Send Message
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
