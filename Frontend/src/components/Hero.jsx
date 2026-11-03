import { Link } from "react-router-dom";
import { heroImages } from "../assets/frontend_assets/assets";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#06110d] text-white">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`ShopNow fashion ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 animate-heroFade"
            style={{ animationDelay: `${index * 3}s` }}
          />
        ))}

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/35 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6 pb-24 pt-32 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-white" />
            <span className="text-xs uppercase tracking-[0.35em] text-white/70">
              New Collection
            </span>
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Wear your
            <br />
            <span className="text-white/60">confidence.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-6 text-white/70 md:text-base">
            Discover carefully selected styles designed for everyday confidence.
            Explore our latest collection and find something made for you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/collection"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:scale-105 hover:bg-white/90"
            >
              Shop Collection
            </Link>

            <Link
              to="/collection"
              className="rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-medium backdrop-blur-md transition duration-300 hover:bg-white/15"
            >
              Explore Styles
            </Link>
          </div>

        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2 md:right-16">
        {heroImages.map((_, index) => (
          <span key={index} className="h-1 w-6 rounded-full bg-white/40" />
        ))}
      </div>
    </section>
  );
}

export default Hero;