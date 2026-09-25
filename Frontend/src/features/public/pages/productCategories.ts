export interface ProductWork {
  id: string;
  title: string;
  image?: string;
}

export interface ProductCategory {
  slug: string;
  title: string;
  intro: string;
  image?: string;
  works: ProductWork[];
}



export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "modular-kitchen",

    title: "Modular Kitchen",

    intro:
      "We design modular kitchens for our clients to make their homes look more attractive and functional. Our range includes straight, L-shaped, and island layouts, tailored to how you cook and gather.",

    image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790064544/WhatsApp_Image_2026-09-22_at_1.23.38_PM_2.jpg",

    works: [
      {
        id: "mk-1",
        title: "The Hollis Residence",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790064551/WhatsApp_Image_2026-09-22_at_1.23.38_PM_3.jpg",
      },
      {
        id: "mk-2",
        title: "Cedar Loft Kitchen",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065200/WhatsApp_Image_2026-09-22_at_1.43.59_PM_1.jpg",
      },
      {
        id: "mk-3",
        title: "Marina Bay Apartment",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065227/WhatsApp_Image_2026-09-22_at_1.44.03_PM_1.jpg",
      },
      {
        id: "mk-4",
        title: "Ridgeview Family Home",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065223/WhatsApp_Image_2026-09-22_at_1.44.02_PM.jpg",
      },
    ],
  },

  {
    slug: "furniture",

    title: "Furniture",

    intro:
      "Custom, handcrafted furniture built around your space and how you actually live in it — from living room pieces to dining sets and built-ins.",

    image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065255/WhatsApp_Image_2026-09-22_at_1.28.28_PM.jpg",

    works: [
      {
        id: "f-1",
        title: "Marlow sit out",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065189/WhatsApp_Image_2026-09-22_at_1.28.27_PM_1.jpg",
      },
      {
        id: "f-2",
        title: "Aster Dining Set",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065192/WhatsApp_Image_2026-09-22_at_1.28.27_PM.jpg",
      },
      {
        id: "f-3",
        title: "Birchwood Space",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065266/WhatsApp_Image_2026-09-22_at_1.31.08_PM_2.jpg",
      },
      {
        id: "f-4",
        title: "Linden Makeup area",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065279/WhatsApp_Image_2026-09-22_at_1.31.09_PM_1.jpg",
      },
    ],
  },

  {
    slug: "wardrobe",

    title: "Wardrobe",

    intro:
      "Walk-ins and fitted wardrobes designed around how you store, dress, and move through your room every day.",

    image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065282/WhatsApp_Image_2026-09-22_at_1.31.09_PM_2.jpg",

    works: [
      {
        id: "w-1",
        title: "Aster Walk-in",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065899/walk_in_wardrobe.jpg",
      },
      {
        id: "w-2",
        title: "Hollis Fitted Wardrobe",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065906/WhatsApp_Image_2026-09-22_at_1.53.29_PM.jpg",
      },
      {
        id: "w-3",
        title: "Birchwood Closet",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065894/wardrobe_1.jpg",
      },
      {
        id: "w-4",
        title: "wardrobe with loft",
        image: "https://res.cloudinary.com/zmpym9nr/image/upload/v1790065867/wardrobe_wit_loft.jpg",
      },
    ],
  },
];