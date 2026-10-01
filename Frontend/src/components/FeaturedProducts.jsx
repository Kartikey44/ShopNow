import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { featuredCategories } from "../assets/frontend_assets/assets";

function FeaturedProducts() {
  return (
    <section className="bg-[#06110d] px-6 py-16 text-black md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
              Explore ShopNow
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Featured
            </h2>
          </div>

          <Link
            to="/collection"
            className="group flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider"
          >
            View All
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Horizontal Categories */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative min-w-[260px] overflow-hidden rounded-2xl bg-black md:min-w-[300px] lg:min-w-0 lg:flex-1"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[300px]"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Arrow */}
              <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition duration-300 group-hover:scale-110">
                <ArrowUpRight size={17} />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55">
                  {category.label}
                </p>

                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs text-white/60">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;