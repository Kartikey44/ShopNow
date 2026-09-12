import React from "react";
import { motion } from "framer-motion";

import { Mail, MapPin, Phone, ArrowUp, Send } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    Shop: [
      ["All Products", "/products"],
      ["Collections", "/collections"],
      ["Cart", "/cart"],
      ["Orders", "/orders"],
    ],

    Company: [
      ["Home", "/"],
      ["About Us", "/about"],
      ["Contact Us", "/contacts"],
    ],

    Support: [
      ["Help Center", "/contacts"],
      ["Shipping & Delivery", "#"],
      ["Returns & Refunds", "#"],
      ["Privacy Policy", "#"],
    ],
  };

  const socials = [
    {
      icon: FaFacebookF,
      label: "Facebook",
      href: "#",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "#",
    },
    {
      icon: FaTwitter,
      label: "Twitter",
      href: "#",
    },
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "#",
    },
  ];

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-950 text-white">
      <motion.div
        className="mx-auto w-[92%] max-w-7xl py-14 md:py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
        }}
      >
        {/* ================= MAIN FOOTER ================= */}

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)_1.5fr] lg:gap-8">
          {/* ================= BRAND ================= */}

          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 lg:col-span-1"
          >
            <motion.a
              href="/"
              whileHover={{
                scale: 1.03,
              }}
              className="inline-block text-3xl font-extrabold tracking-tight"
            >
              Shop
              <span className="text-sky-400">Now</span>
            </motion.a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Your one-stop destination for quality products, great prices, and
              a seamless online shopping experience.
            </p>

            {/* Contact Information */}

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={17} className="shrink-0 text-sky-400" />

                <span>Greater Noida, India</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={17} className="shrink-0 text-sky-400" />

                <span>support@shopnow.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={17} className="shrink-0 text-sky-400" />

                <span>+91 98765 43210</span>
              </div>
            </div>
          </motion.div>

          {/* ================= LINK COLUMNS ================= */}

          {Object.entries(links).map(([title, items]) => (
            <motion.div key={title} variants={itemVariants}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                {title}
              </h3>

              <ul className="space-y-3">
                {items.map(([name, href]) => (
                  <motion.li
                    key={name}
                    whileHover={{
                      x: 5,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <a
                      href={href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-sky-400"
                    >
                      {name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* ================= NEWSLETTER ================= */}

          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 lg:col-span-1"
          >
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider">
              Stay Updated
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Subscribe to get updates about new products, offers, and exclusive
              deals.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-l-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
              />

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                className="flex items-center justify-center rounded-r-lg bg-sky-400 px-4 text-slate-950 transition-colors hover:bg-sky-300"
              >
                <Send size={17} />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ================= DIVIDER ================= */}

        <motion.div
          variants={itemVariants}
          className="my-10 h-px bg-slate-800"
        />

        {/* ================= BOTTOM ================= */}

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          {/* Copyright */}

          <p className="text-center text-xs text-slate-500 md:text-left">
            © {currentYear} ShopNow. All rights reserved.
          </p>

          {/* Social Icons */}

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{
                  y: -4,
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors duration-200 hover:border-sky-400 hover:text-sky-400"
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>

          {/* Back To Top */}

          <motion.button
            onClick={scrollToTop}
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.9,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-sky-400 hover:text-sky-400"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;