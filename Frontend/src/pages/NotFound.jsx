import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Page Not Found
        </p>

        <h1 className="mt-4 text-8xl font-bold tracking-tight text-gray-900">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! We couldn't find that page.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-gray-500">
          The page you're looking for may have been moved, deleted, or the URL
          might be incorrect.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Home size={17} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
