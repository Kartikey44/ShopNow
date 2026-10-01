import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Collections() {
  const collections = [
    {
      id: 1,
      title: "Men",
      subtitle: "Modern essentials",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000",
    },
    {
      id: 2,
      title: "Women",
      subtitle: "Timeless styles",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000",
    },
    {
      id: 3,
      title: "Accessories",
      subtitle: "Complete your look",
      image:
        "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=1000",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06110d] text-white px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.25em]">
            Discover
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold mt-3">
            Collections
          </h1>

          <p className="text-gray-500 max-w-xl mx-auto mt-4">
            Explore our latest collections, curated for every style and
            occasion.
          </p>
        </div>

        {/* 3 Collections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to="/collection"
              className="group relative h-[500px] rounded-2xl overflow-hidden border border-emerald-900/40"
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-emerald-400 text-xs uppercase tracking-[0.2em]">
                  {collection.subtitle}
                </p>

                <h2 className="text-3xl font-semibold mt-2">
                  {collection.title}
                </h2>

                <div className="flex items-center gap-2 mt-5 text-sm text-gray-300 group-hover:text-emerald-400 transition">
                  Explore Collection
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;
