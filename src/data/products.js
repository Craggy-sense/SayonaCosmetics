// Product catalogue — mirrors the Sayona Cosmetics Product Catalogue 2026.
// sizes[].image (optional): photo of that exact size; product.image is the default (shown first).
// groupImage (optional): photo of the whole range, used for sizes without their own photo.
// defaultSize: index of the size shown first on the card (its photo + price).
// Prices are the RRP column of the catalogue price list (KSh).
export const FALLBACK_PRODUCTS = [
  {
    id: "argan-shampoo",
    defaultSize: 2,
    groupImage: "/product-images/argan-shampoo.jpg",
    image: "/product-images/argan-shampoo-1l.jpg",
    title: "Argan Oil Hair Shampoo",
    category: "shampoo-conditioner",
    desc: "Sayona Argan Oil cleansing and moisturizing 2-in-1 shampoo for dry or damaged hair. Suits frizzy, tangled and damaged hair perfectly — the unique formulation restores life and luster to dull, dry hair while reducing split ends and frizz.",
    benefits: ["Argan Oil cleansing & moisturizing 2-in-1 formula", "For dry or damaged hair", "Restores life and luster to dull, dry hair", "Reduces split ends and frizz"],
    usage: "Apply a generous amount to wet hair. Massage gently into a rich lather from roots to ends. Rinse thoroughly.",
    tag: "BESTSELLER",
    sizes: [
      { size: "250 ml", price: 55, image: "/product-images/argan-shampoo-250ml.jpg" },
      { size: "500 ml", price: 85, image: "/product-images/argan-shampoo-500ml.jpg" },
      { size: "1 ltr", price: 125, image: "/product-images/argan-shampoo-1l.jpg" },
      { size: "5 ltr", price: 395 }
    ]
  },
  {
    id: "olive-shampoo",
    defaultSize: 2,
    groupImage: "/product-images/olive-shampoo.jpg",
    image: "/product-images/olive-shampoo-1l.jpg",
    title: "Olive Oil Hair Shampoo",
    category: "shampoo-conditioner",
    desc: "Sayona Olive Oil cleansing and moisturizing 2-in-1 crystal shampoo for dry or damaged hair. Formulated for African hair and enriched with olive oil, an excellent source of antioxidants.",
    benefits: ["Olive Oil cleansing & moisturizing 2-in-1 crystal shampoo", "For dry or damaged hair", "Enriched with olive oil — an excellent source of antioxidants", "Formulated for African hair"],
    usage: "Apply to wet hair. Gently massage into the scalp to create a thick lather. Rinse thoroughly.",
    tag: "NEW",
    sizes: [
      { size: "250 ml", price: 55, image: "/product-images/olive-shampoo-250ml.jpg" },
      { size: "500 ml", price: 85 },
      { size: "1 ltr", price: 125, image: "/product-images/olive-shampoo-1l.jpg" },
      { size: "5 ltr", price: 395 }
    ]
  },
  {
    id: "coconut-conditioner",
    defaultSize: 1,
    groupImage: "/product-images/coconut-conditioner.jpg",
    image: "/product-images/coconut-conditioner-500ml.jpg",
    title: "Coconut Oil Hair Conditioner",
    category: "shampoo-conditioner",
    desc: "Sayona Hair Coconut Oil Moisture Boost Hair Conditioner — conditions to restore moisture. Formulated with Coconut Oil–derived fatty acids, this rich conditioner helps prevent breakage, restore elasticity, and deeply hydrate dry or damaged hair. Its creamy formula detangles, improves softness and manageability, and leaves hair silky, shiny, and healthier.",
    benefits: ["Coconut Oil Moisture Boost formula", "Helps prevent breakage and restore elasticity", "Deeply hydrates dry or damaged hair", "Creamy formula detangles and leaves hair silky and shiny"],
    usage: "After shampooing, apply evenly from mid-shaft to ends. Leave on for 3 to 5 minutes. Comb through gently and rinse thoroughly.",
    tag: "POPULAR",
    sizes: [
      { size: "250 ml", price: 65, image: "/product-images/coconut-conditioner-250ml.jpg" },
      { size: "500 ml", price: 95, image: "/product-images/coconut-conditioner-500ml.jpg" },
      { size: "1 ltr", price: 150 },
      { size: "5 ltr", price: 540 }
    ]
  },
  {
    id: "olive-leave-in",
    defaultSize: 3,
    groupImage: "/product-images/olive-leave-in.jpg",
    image: "/product-images/olive-leave-in-500ml.jpg",
    title: "Olive Oil Leave-In Treatment",
    category: "treatments",
    desc: "Sayona Olive Oil Leave-In Hair Treatment richly moisturizes. A lightweight formula collection that nourishes dull, frizzy hair and helps stop dryness, itching, and flaking of the scalp to maximize fullness and improve manageability. Olive oil also invigorates the skin and soothes tightness to support a healthy scalp foundation, delivering super-nourishing results for natural and relaxed hair.",
    benefits: ["Lightweight, richly moisturizing formula", "Helps stop dryness, itching and flaking of the scalp", "Soothes scalp tightness for a healthy scalp foundation", "Maximizes fullness on natural and relaxed hair"],
    usage: "Apply a small amount to clean, damp or dry hair. Massage gently into the scalp and distribute evenly. Do not rinse out.",
    tag: "ESSENTIAL",
    sizes: [
      { size: "60 ml", price: 50, image: "/product-images/olive-leave-in-60ml.jpg" },
      { size: "120 ml", price: 85 },
      { size: "250 ml", price: 170 },
      { size: "500 ml", price: 305, image: "/product-images/olive-leave-in-500ml.jpg" },
      { size: "1 ltr", price: 470, image: "/product-images/olive-leave-in-1l.jpg" }
    ]
  },
  {
    id: "indian-hemp-pomade",
    image: "/product-images/indian-hemp-pomade.jpg",
    title: "Indian Hemp Anti-Dandruff Pomade",
    category: "styling",
    desc: "Indian Hemp based anti-dandruff pomade — a Dry & Itchy Scalp Glossifier for sensitive and itchy scalps. Enriched with medicinal herbs, vitamins, Argan, Castor, Coconut and Tea Tree oils, with Eucalyptus and Peppermint essentials. Specially formulated to target the root cause of dandruff. Soothing & cooling formula with Mint Oil.",
    benefits: ["Dry & Itchy Scalp Glossifier", "For sensitive & itchy scalp", "Soothing & cooling formula with Mint Oil", "Targets the root cause of dandruff"],
    usage: "Part hair in sections and apply a small amount directly to the scalp. Massage thoroughly. Brush or comb hair and style as usual.",
    tag: "HOT",
    sizes: [
      { size: "60 ml", price: 65 },
      { size: "120 ml", price: 100 },
      { size: "250 ml", price: 185 },
      { size: "500 ml", price: 420 },
      { size: "600 ml", price: 455 }
    ]
  },
  {
    id: "argan-hair-food",
    image: "/product-images/argan-hair-food.jpg",
    title: "Argan Oil Hair Food",
    category: "styling",
    desc: "Nourish and strengthen. Argan oil is known for its ability to help hair restore, enhance, and grow. Its natural moisturizers help repair damage from blow-drying and flat ironing.",
    benefits: ["Nourishes & strengthens", "Helps hair restore, enhance and grow", "Natural moisturizers help repair heat damage", "Ideal after blow-drying and flat ironing"],
    usage: "Apply directly to hair shafts and scalp. Massage gently. Ideal for use before styling or as a daily moisture sealant.",
    tag: "DAILY WEAR",
    sizes: [
      { size: "60 ml", price: 60 },
      { size: "120 ml", price: 95 },
      { size: "250 ml", price: 180 },
      { size: "500 ml", price: 385 },
      { size: "600 ml", price: 410 }
    ]
  },
  {
    id: "dreadlock-wax",
    image: "/product-images/dreadlock-wax.jpg",
    title: "Extra Hold Dreadlock Wax",
    category: "styling",
    desc: "Sayona Extra Hold Dreadlock Wax is a non-flaking formula crafted with precision. Our dreadlock gel wax is designed to meet the unique needs of those with dreadlocks.",
    benefits: ["Extra hold", "Non-flaking formula", "Gel wax crafted with precision", "Designed for the unique needs of dreadlocks"],
    usage: "Apply a small amount to the root section of locks. Twist or palm roll hair. Work down lock segments as needed.",
    tag: "PROFESSIONAL",
    sizes: [
      { size: "60 ml", price: 120 },
      { size: "120 ml", price: 180 },
      { size: "250 ml", price: 300 },
      { size: "500 ml", price: 540 },
      { size: "600 ml", price: 575 }
    ]
  },
  {
    id: "protein-treatment",
    image: "/product-images/protein-treatment.jpg",
    title: "Hair Protein Treatment",
    category: "treatments",
    desc: "Sayona Hair Protein Treatment is a leave-in, no-rinsing treatment formulated to help reinforce weak, fragile, and over-processed hair. Enriched with Keravis, Polyquaternium-7, and conditioning ingredients, it helps improve the feel of the hair, reduce the appearance of breakage, and leave hair looking stronger, smoother, and more manageable.",
    benefits: ["Leave-in, no rinsing", "Enriched with Keravis & Polyquaternium-7", "Reinforces weak, fragile and over-processed hair", "Strengthens • Rebuilds • Reduces breakage"],
    usage: "Shampoo hair and towel dry. Apply evenly throughout damp hair. Do not rinse out. Comb through and style.",
    tag: "THERAPY",
    sizes: [
      { size: "60 ml", price: 110 },
      { size: "120 ml", price: 180 },
      { size: "250 ml", price: 300 },
      { size: "500 ml", price: 455 },
      { size: "600 ml", price: 470 }
    ]
  },
  {
    id: "cholesterol-treatment",
    image: "/product-images/cholesterol-treatment.jpg",
    title: "Hair Cholesterol Treatment",
    category: "treatments",
    desc: "Sayona Hair Cholesterol Treatment is designed to deeply condition dry, rough, and tired-looking hair. Formulated with cholesterol, natural oils, and conditioning ingredients, it helps soften the hair, improve smoothness, and restore a healthier, nourished feel.",
    benefits: ["With natural oils & cholesterol", "Deeply conditions dry, rough, tired-looking hair", "Restores moisture • Softens • Revives dry hair", "Leaves hair smoother with a nourished feel"],
    usage: "Shampoo and rinse hair. Apply treatment, massaging from roots to ends. Cover with cap for 15-20 mins. Rinse well.",
    tag: "RESTORE",
    sizes: [
      { size: "60 ml", price: 110 },
      { size: "120 ml", price: 180 },
      { size: "250 ml", price: 300 },
      { size: "500 ml", price: 455 },
      { size: "600 ml", price: 470 }
    ]
  },
  {
    id: "deep-penetrating-treatment",
    image: "/product-images/deep-treatment.jpg",
    title: "Hair Deep Penetrating Treatment",
    category: "treatments",
    desc: "Sayona Hair Deep Treatment is formulated to help replenish moisture and improve the feel of dry, dull, or hard-to-manage hair. With hydrating and conditioning ingredients, it helps leave hair feeling softer, smoother, shinier, and easier to comb.",
    benefits: ["Moisture-lock formula", "Replenishes moisture in dry, dull hair", "Deep hydration • Smoothness • Shine", "Leaves hair softer and easier to comb"],
    usage: "Apply to washed, towel-dried hair. Leave on for 10-15 minutes, preferably under heat. Rinse thoroughly.",
    tag: "HYDRATE",
    sizes: [
      { size: "60 ml", price: 95 },
      { size: "120 ml", price: 170 },
      { size: "250 ml", price: 290 },
      { size: "500 ml", price: 445 },
      { size: "600 ml", price: 460 }
    ]
  },
  {
    id: "foam-wrap",
    image: "/product-images/foam-wrap.jpg",
    title: "Olive Oil Hair Foam Wrap",
    category: "styling",
    desc: "Sayona Foam Wrap is a super formula designed to impart conditioning and moisture to your scalp and hair. Infused with olive oil, essential oils and vitamin enrichment, Sayona Foam Wrap gives balanced nutritional nourishment to your hair, leaving it soft & silky, moisturized and easy to manage.",
    benefits: ["Infused with Olive Oil for scalp and hair hydration", "Essential oils and vitamin enrichment", "Leaves hair soft, silky and moisturized", "Makes hair easy to manage"],
    usage: "Pump foam into palms. Distribute evenly through wet or dry hair. Wrap, mold, or set hair. Dry and style.",
    tag: "SALON PRO",
    sizes: [
      { size: "250 ml", price: 540 }
    ]
  },
  {
    id: "hair-dryer",
    image: "/product-images/hair-dryer.jpg",
    title: "Sayona Professional Hair Dryer",
    category: "appliances",
    desc: "Experience effortless styling with this 2000W hair dryer. Adjustable speeds and heat settings, an ergonomic soft-grip handle, and included nozzles and comb make achieving salon-quality hair at home simple and precise. Available in three models: SY-300 Gold, SY-800 and SY-1000.",
    benefits: ["2000W power", "Adjustable speed and heat settings", "Ergonomic soft-grip handle", "Nozzles and comb included"],
    usage: "Select nozzle/comb attachment. Adjust heat and speed. Blow dry sections maintaining safe styling distance.",
    tag: "ELECTRONIC",
    sizes: [
      { size: "SY-300 Gold", price: 4500 },
      { size: "SY-800", price: 4400 },
      { size: "SY-1000", price: 4300 }
    ]
  },
  {
    id: "cordless-clippers",
    image: "/product-images/cordless-clipper.jpg",
    title: "Sayona Cordless Hair Clipper",
    category: "appliances",
    desc: "Achieve sharp, even cuts with this cordless hair clipper (model SC-9308). Comfortable and easy to handle, it trims smoothly without snagging, giving you barbershop-quality results at home.",
    benefits: ["Cordless for easy handling", "Sharp, even cuts without snagging", "Barbershop-quality results at home", "Model SC-9308 with charging stand"],
    usage: "Ensure blades are clean and oiled. Select guide comb length. Power on and trim against hair growth.",
    tag: "COMING SOON",
    comingSoon: true,
    sizes: [
      { size: "Model SC-9308", price: 3800 }
    ]
  },
  {
    id: "corded-clippers",
    image: "/product-images/corded-clippers.jpg",
    title: "Sayona Corded Hair Clippers",
    category: "appliances",
    desc: "Get neat, even cuts with these corded hair clippers. Comfortable and easy to use, they deliver precise results at home, keeping you looking sharp without a trip to the barber. Available as the SBC-9210 Balding Clipper and the SH-9211.",
    benefits: ["Neat, even cuts", "Comfortable and easy to use", "Precise results at home", "Models SBC-9210 (Balding) and SH-9211"],
    usage: "Plug into power. Apply blade oil. Adjust taper lever and execute close cuts.",
    tag: "COMING SOON",
    comingSoon: true,
    sizes: [
      { size: "Model SBC-9210", price: 3200 }
    ]
  },
  {
    id: "straightener",
    image: "/product-images/straightener.jpg",
    title: "Sayona Pro Black Titanium Straightener",
    category: "appliances",
    desc: "Built for precision and performance, the Pro Black Titanium/Ceramic straightener heats up quickly and delivers high heat efficiency for faster styling and long-lasting sleekness. Perfect for those who want salon-level results with speed and control.",
    benefits: ["Titanium/Ceramic plates", "Heats up quickly", "High heat efficiency for faster styling", "Long-lasting sleekness with salon-level results"],
    usage: "Plug in and heat. Section dry, clean hair. Clamp straightener close to roots and glide down to ends.",
    tag: "SALON FAVORITE",
    sizes: [
      { size: "Pro Black Edition", price: 5400 }
    ]
  }
];
