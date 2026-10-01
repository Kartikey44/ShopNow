import React from "react";
import { Sparkles, ShieldCheck, Leaf, Heart } from "lucide-react";

function About() {
  const values = [
    {
      icon: <Sparkles size={22} />,
      title: "Quality First",
      description:
        "We focus on carefully selected materials and products designed to last.",
    },
    {
      icon: <Leaf size={22} />,
      title: "Thoughtful Choices",
      description:
        "We believe better products should be made with thoughtful decisions at every step.",
    },
    {
      icon: <Heart size={22} />,
      title: "Made for You",
      description:
        "Every collection is designed around comfort, simplicity and everyday style.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Trusted Experience",
      description:
        "From checkout to delivery, we aim to make every part of your shopping experience simple.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06110d] text-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.25em] mb-5">
            Our Story
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight max-w-4xl mx-auto">
            Simple style.
            <span className="text-emerald-400"> Better choices.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 leading-relaxed mt-7">
            We are building a modern shopping experience focused on quality
            products, thoughtful design and a simpler way to discover things you
            actually want.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden border border-emerald-900/40">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
              alt="Our store"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <p className="text-emerald-400 text-sm uppercase tracking-widest mb-4">
              What We Believe
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold">
              Shopping should feel effortless.
            </h2>

            <p className="text-gray-400 leading-relaxed mt-5">
              We created our store with one simple idea: remove the unnecessary
              complexity from online shopping.
            </p>

            <p className="text-gray-400 leading-relaxed mt-4">
              From carefully selected products to a clean shopping experience,
              everything is designed to help you discover, choose and enjoy
              products without the noise.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 border-t border-emerald-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-xs uppercase tracking-widest">
              Our Values
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold mt-3">
              What matters to us
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-[#0b1914] border border-emerald-900/50 rounded-2xl p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  {value.icon}
                </div>

                <h3 className="font-semibold mt-5">{value.title}</h3>

                <p className="text-sm text-gray-500 leading-relaxed mt-3">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
