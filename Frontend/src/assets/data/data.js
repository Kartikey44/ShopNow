import {
  User,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  Settings,
} from "lucide-react";

export const navbar = [
  {
    id: "home",
    label: "HOME",
    path: "/",
  },

  {
    id: "women",
    label: "WOMEN",
    path: "/women",
    categories: [
      {
        id: "women-tops",
        label: "Tops",
        type: "tops",
        path: "/women/tops",
      },
      {
        id: "women-tshirts",
        label: "T-Shirts",
        type: "t-shirts",
        path: "/women/t-shirts",
      },
      {
        id: "women-dresses",
        label: "Dresses",
        type: "dresses",
        path: "/women/dresses",
      },
      {
        id: "women-jeans",
        label: "Jeans",
        type: "jeans",
        path: "/women/jeans",
      },
      {
        id: "women-trousers",
        label: "Trousers",
        type: "trousers",
        path: "/women/trousers",
      },
      {
        id: "women-skirts",
        label: "Skirts",
        type: "skirts",
        path: "/women/skirts",
      },
      {
        id: "women-kurtis",
        label: "Kurtis",
        type: "kurtis",
        path: "/women/kurtis",
      },
      {
        id: "women-sarees",
        label: "Sarees",
        type: "sarees",
        path: "/women/sarees",
      },
      {
        id: "women-ethnic-wear",
        label: "Ethnic Wear",
        type: "ethnic-wear",
        path: "/women/ethnic-wear",
      },
      {
        id: "women-jackets",
        label: "Jackets",
        type: "jackets",
        path: "/women/jackets",
      },
    ],
  },

  {
    id: "girls",
    label: "GIRLS",
    path: "/girls",
    categories: [
      {
        id: "girls-tops",
        label: "Tops",
        type: "tops",
        path: "/girls/tops",
      },
      {
        id: "girls-tshirts",
        label: "T-Shirts",
        type: "t-shirts",
        path: "/girls/t-shirts",
      },
      {
        id: "girls-dresses",
        label: "Dresses",
        type: "dresses",
        path: "/girls/dresses",
      },
      {
        id: "girls-jeans",
        label: "Jeans",
        type: "jeans",
        path: "/girls/jeans",
      },
      {
        id: "girls-skirts",
        label: "Skirts",
        type: "skirts",
        path: "/girls/skirts",
      },
      {
        id: "girls-shorts",
        label: "Shorts",
        type: "shorts",
        path: "/girls/shorts",
      },
      {
        id: "girls-jumpsuits",
        label: "Jumpsuits",
        type: "jumpsuits",
        path: "/girls/jumpsuits",
      },
      {
        id: "girls-party-wear",
        label: "Party Wear",
        type: "party-wear",
        path: "/girls/party-wear",
      },
      {
        id: "girls-ethnic-wear",
        label: "Ethnic Wear",
        type: "ethnic-wear",
        path: "/girls/ethnic-wear",
      },
      {
        id: "girls-jackets",
        label: "Jackets",
        type: "jackets",
        path: "/girls/jackets",
      },
    ],
  },

  {
    id: "men",
    label: "MEN",
    path: "/men",
    categories: [
      {
        id: "men-tshirts",
        label: "T-Shirts",
        type: "t-shirts",
        path: "/men/t-shirts",
      },
      {
        id: "men-shirts",
        label: "Shirts",
        type: "shirts",
        path: "/men/shirts",
      },
      {
        id: "men-jeans",
        label: "Jeans",
        type: "jeans",
        path: "/men/jeans",
      },
      {
        id: "men-trousers",
        label: "Trousers",
        type: "trousers",
        path: "/men/trousers",
      },
      {
        id: "men-shorts",
        label: "Shorts",
        type: "shorts",
        path: "/men/shorts",
      },
      {
        id: "men-hoodies",
        label: "Hoodies",
        type: "hoodies",
        path: "/men/hoodies",
      },
      {
        id: "men-jackets",
        label: "Jackets",
        type: "jackets",
        path: "/men/jackets",
      },
      {
        id: "men-sweaters",
        label: "Sweaters",
        type: "sweaters",
        path: "/men/sweaters",
      },
      {
        id: "men-ethnic-wear",
        label: "Ethnic Wear",
        type: "ethnic-wear",
        path: "/men/ethnic-wear",
      },
      {
        id: "men-formal-wear",
        label: "Formal Wear",
        type: "formal-wear",
        path: "/men/formal-wear",
      },
    ],
  },

  {
    id: "boys",
    label: "BOYS",
    path: "/boys",
    categories: [
      {
        id: "boys-tshirts",
        label: "T-Shirts",
        type: "t-shirts",
        path: "/boys/t-shirts",
      },
      {
        id: "boys-shirts",
        label: "Shirts",
        type: "shirts",
        path: "/boys/shirts",
      },
      {
        id: "boys-jeans",
        label: "Jeans",
        type: "jeans",
        path: "/boys/jeans",
      },
      {
        id: "boys-trousers",
        label: "Trousers",
        type: "trousers",
        path: "/boys/trousers",
      },
      {
        id: "boys-shorts",
        label: "Shorts",
        type: "shorts",
        path: "/boys/shorts",
      },
      {
        id: "boys-hoodies",
        label: "Hoodies",
        type: "hoodies",
        path: "/boys/hoodies",
      },
      {
        id: "boys-sweatshirts",
        label: "Sweatshirts",
        type: "sweatshirts",
        path: "/boys/sweatshirts",
      },
      {
        id: "boys-jackets",
        label: "Jackets",
        type: "jackets",
        path: "/boys/jackets",
      },
      {
        id: "boys-ethnic-wear",
        label: "Ethnic Wear",
        type: "ethnic-wear",
        path: "/boys/ethnic-wear",
      },
      {
        id: "boys-party-wear",
        label: "Party Wear",
        type: "party-wear",
        path: "/boys/party-wear",
      },
    ],
  },

  {
    id: "new-arrivals",
    label: "NEW ARRIVALS",
    path: "/new-arrivals",
    categories: [
      {
        id: "just-in",
        label: "Just In",
        type: "just-in",
        path: "/new-arrivals/just-in",
      },
      {
        id: "trending-now",
        label: "Trending Now",
        type: "trending",
        path: "/new-arrivals/trending",
      },
      {
        id: "latest-styles",
        label: "Latest Styles",
        type: "latest-styles",
        path: "/new-arrivals/latest-styles",
      },
      {
        id: "new-men",
        label: "New Men",
        type: "men",
        path: "/new-arrivals/men",
      },
      {
        id: "new-women",
        label: "New Women",
        type: "women",
        path: "/new-arrivals/women",
      },
      {
        id: "new-boys",
        label: "New Boys",
        type: "boys",
        path: "/new-arrivals/boys",
      },
      {
        id: "new-girls",
        label: "New Girls",
        type: "girls",
        path: "/new-arrivals/girls",
      },
    ],
  },

  {
    id: "offers",
    label: "OFFERS",
    path: "/offers",
    categories: [
      {
        id: "under-499",
        label: "Under ₹499",
        type: "price-under-499",
        path: "/offers/under-499",
      },
      {
        id: "under-999",
        label: "Under ₹999",
        type: "price-under-999",
        path: "/offers/under-999",
      },
      {
        id: "under-1499",
        label: "Under ₹1499",
        type: "price-under-1499",
        path: "/offers/under-1499",
      },
      {
        id: "flat-50-off",
        label: "Flat 50% Off",
        type: "discount-50",
        path: "/offers/flat-50",
      },
      {
        id: "buy-1-get-1",
        label: "Buy 1 Get 1",
        type: "buy-1-get-1",
        path: "/offers/buy-1-get-1",
      },
      {
        id: "clearance-sale",
        label: "Clearance Sale",
        type: "clearance",
        path: "/offers/clearance",
      },
    ],
  },

  {
    id: "genz",
    label: "GENZ",
    path: "/genz",
    categories: [
      {
        id: "oversized-tshirts",
        label: "Oversized T-Shirts",
        type: "oversized-t-shirts",
        path: "/genz/oversized-t-shirts",
      },
      {
        id: "graphic-tees",
        label: "Graphic Tees",
        type: "graphic-tees",
        path: "/genz/graphic-tees",
      },
      {
        id: "cargo-pants",
        label: "Cargo Pants",
        type: "cargo-pants",
        path: "/genz/cargo-pants",
      },
      {
        id: "baggy-jeans",
        label: "Baggy Jeans",
        type: "baggy-jeans",
        path: "/genz/baggy-jeans",
      },
      {
        id: "crop-tops",
        label: "Crop Tops",
        type: "crop-tops",
        path: "/genz/crop-tops",
      },
      {
        id: "streetwear",
        label: "Streetwear",
        type: "streetwear",
        path: "/genz/streetwear",
      },
      {
        id: "co-ord-sets",
        label: "Co-ord Sets",
        type: "co-ord-sets",
        path: "/genz/co-ord-sets",
      },
      {
        id: "hoodies",
        label: "Hoodies",
        type: "hoodies",
        path: "/genz/hoodies",
      },
      {
        id: "sneakers",
        label: "Sneakers",
        type: "sneakers",
        path: "/genz/sneakers",
      },
    ],
  },
];

export const profile = [
  {
    id: "profile",
    label: "My Profile",
    link: "/profile",
    icon: User,
  },
  {
    id: "orders",
    label: "My Orders",
    link: "/orders",
    icon: Package,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    link: "/wishlist",
    icon: Heart,
  },
  {
    id: "cart",
    label: "My Cart",
    link: "/cart",
    icon: ShoppingCart,
  },
  {
    id: "addresses",
    label: "My Addresses",
    link: "/addresses",
    icon: MapPin,
  },
  {
    id: "settings",
    label: "Settings",
    link: "/settings",
    icon: Settings,
  },
];
