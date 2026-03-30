import { db } from "@workspace/db";
import {
  pricingPlansTable,
  trainersTable,
  blogPostsTable,
  testimonialsTable,
  galleryImagesTable,
} from "@workspace/db/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Pricing Plans ──────────────────────────────────────────────
  const existingPlans = await db.select().from(pricingPlansTable);
  if (existingPlans.length === 0) {
    await db.insert(pricingPlansTable).values([
      {
        name: "Starter",
        price: 29,
        period: "month",
        description: "Perfect for beginners ready to start their fitness journey.",
        features: [
          "Full gym floor access",
          "Locker room & showers",
          "2 group classes/month",
          "Fitness assessment",
          "Mobile app access",
        ],
        highlighted: false,
        color: "#3B9EFF",
      },
      {
        name: "Elite",
        price: 59,
        period: "month",
        description: "Our most popular plan for serious athletes who demand more.",
        features: [
          "Unlimited gym access 24/7",
          "Unlimited group classes",
          "1 personal training session/month",
          "Nutrition consultation",
          "Progress tracking dashboard",
          "Guest passes (2/month)",
          "Priority class booking",
        ],
        highlighted: true,
        color: "#60a5fa",
      },
      {
        name: "Pro",
        price: 119,
        period: "month",
        description: "The ultimate package for elite performance and results.",
        features: [
          "Everything in Elite",
          "4 personal training sessions/month",
          "Custom meal planning",
          "Advanced performance analytics",
          "Recovery & spa access",
          "Unlimited guest passes",
          "Dedicated locker",
          "Priority trainer access",
        ],
        highlighted: false,
        color: "#a78bfa",
      },
    ]);
    console.log("  ✓ Pricing plans seeded");
  } else {
    console.log("  – Pricing plans already exist, skipping");
  }

  // ── Trainers ───────────────────────────────────────────────────
  const existingTrainers = await db.select().from(trainersTable);
  if (existingTrainers.length === 0) {
    await db.insert(trainersTable).values([
      {
        name: "Marcus Reid",
        specialty: "Strength & Powerlifting",
        bio: "Former national powerlifting champion with 12 years of coaching experience. Marcus specializes in building raw strength and teaching perfect form to prevent injury while maximizing gains.",
        imageUrl: null,
        experience: 12,
        certifications: ["NSCA-CSCS", "USA Powerlifting Coach", "CPR/AED"],
        rating: 4.9,
        email: "marcus@elitefitness.com",
      },
      {
        name: "Sophia Chen",
        specialty: "HIIT & Metabolic Conditioning",
        bio: "Certified metabolic conditioning specialist with a background in competitive CrossFit. Sophia designs high-intensity programs that torch fat and build athletic endurance.",
        imageUrl: null,
        experience: 8,
        certifications: ["NASM-CPT", "CrossFit L2", "Precision Nutrition L1"],
        rating: 4.8,
        email: "sophia@elitefitness.com",
      },
      {
        name: "Diego Vega",
        specialty: "Athletic Performance & Mobility",
        bio: "Former professional soccer player turned performance coach. Diego focuses on sport-specific training, injury prevention, and unlocking your body's full athletic potential.",
        imageUrl: null,
        experience: 10,
        certifications: ["CSCS", "FMS Certified", "USAW Sports Performance Coach"],
        rating: 4.9,
        email: "diego@elitefitness.com",
      },
      {
        name: "Amara Williams",
        specialty: "Yoga & Mind-Body Wellness",
        bio: "500-hour certified yoga teacher blending ancient practices with modern sports science. Amara helps members reduce stress, increase flexibility, and build a strong mind-muscle connection.",
        imageUrl: null,
        experience: 9,
        certifications: ["RYT-500", "NASM-CPT", "Corrective Exercise Specialist"],
        rating: 4.7,
        email: "amara@elitefitness.com",
      },
      {
        name: "Tyler Brooks",
        specialty: "Bodybuilding & Body Recomposition",
        bio: "IFBB amateur bodybuilding competitor with a passion for helping clients transform their physiques. Tyler brings a science-based approach to hypertrophy training and nutrition.",
        imageUrl: null,
        experience: 7,
        certifications: ["NASM-CPT", "Precision Nutrition L2", "ISSA Specialist in Fitness Nutrition"],
        rating: 4.8,
        email: "tyler@elitefitness.com",
      },
      {
        name: "Priya Nair",
        specialty: "Functional Fitness & Rehabilitation",
        bio: "Physical therapy background combined with personal training expertise. Priya specializes in helping clients recover from injuries and rebuild functional strength safely and effectively.",
        imageUrl: null,
        experience: 11,
        certifications: ["DPT", "NASM-CPT", "Titleist Performance Institute Certified"],
        rating: 5.0,
        email: "priya@elitefitness.com",
      },
    ]);
    console.log("  ✓ Trainers seeded");
  } else {
    console.log("  – Trainers already exist, skipping");
  }

  // ── Blog Posts ─────────────────────────────────────────────────
  const existingPosts = await db.select().from(blogPostsTable);
  if (existingPosts.length === 0) {
    await db.insert(blogPostsTable).values([
      {
        title: "5 Science-Backed Strategies to Break Through Strength Plateaus",
        excerpt: "Hit a wall with your lifts? These proven techniques from sports science will reignite your progress and have you hitting new PRs in weeks.",
        content: "Every athlete eventually faces a strength plateau. The weights stop moving up, the motivation dips, and doubt creeps in. But plateaus are not dead ends — they are signals that your body has adapted and needs a new stimulus. Here are five evidence-based strategies to break through...",
        category: "Training",
        author: "Marcus Reid",
        published: true,
        imageUrl: null,
      },
      {
        title: "The Ultimate Guide to Post-Workout Nutrition",
        excerpt: "What you eat in the 45 minutes after training can make or break your results. Here's exactly what to eat and why it matters.",
        content: "The post-workout window is one of the most critical periods for muscle recovery and growth. During this time, your muscles are primed to absorb nutrients at an accelerated rate. Getting your nutrition right can dramatically improve your recovery...",
        category: "Nutrition",
        author: "Sophia Chen",
        published: true,
        imageUrl: null,
      },
      {
        title: "Why Mobility Work Is the Missing Piece in Your Training Program",
        excerpt: "Most gym-goers skip mobility training. Here's why that's a huge mistake — and a simple daily routine to fix it.",
        content: "Mobility is not just stretching. It is the ability to actively control your joints through their full range of motion. Poor mobility is the silent killer of athletic performance, and it is responsible for more training setbacks than almost any other factor...",
        category: "Recovery",
        author: "Diego Vega",
        published: true,
        imageUrl: null,
      },
      {
        title: "Building Mental Toughness: The Psychological Edge of Elite Athletes",
        excerpt: "Physical training is only half the battle. Discover the mental frameworks used by world-class athletes to perform under pressure.",
        content: "When two athletes of equal physical ability compete, the one with stronger mental fortitude will win every time. Mental toughness is not a fixed trait — it is a trainable skill. Here is how to develop it...",
        category: "Mindset",
        author: "Amara Williams",
        published: true,
        imageUrl: null,
      },
      {
        title: "Progressive Overload: The One Principle That Drives All Muscle Growth",
        excerpt: "If you're not applying progressive overload, you're not growing. Here's the complete guide to implementing this fundamental principle.",
        content: "Progressive overload is the gradual increase of stress placed on the body during training. It is the single most important principle in strength and physique development. Without it, your body has no reason to adapt and grow stronger...",
        category: "Training",
        author: "Tyler Brooks",
        published: true,
        imageUrl: null,
      },
      {
        title: "Returning to Training After Injury: A Safe and Smart Roadmap",
        excerpt: "Coming back from an injury is both physical and psychological. Follow this step-by-step guide to return stronger than before.",
        content: "Injury is one of the most frustrating experiences an athlete can face. The fear of re-injury, the deconditioning, the psychological setback — it can feel overwhelming. But with the right approach, you can not only return to your previous level but surpass it...",
        category: "Recovery",
        author: "Priya Nair",
        published: true,
        imageUrl: null,
      },
    ]);
    console.log("  ✓ Blog posts seeded");
  } else {
    console.log("  – Blog posts already exist, skipping");
  }

  // ── Testimonials ───────────────────────────────────────────────
  const existingTestimonials = await db.select().from(testimonialsTable);
  if (existingTestimonials.length === 0) {
    await db.insert(testimonialsTable).values([
      {
        name: "James Thornton",
        role: "Member since 2022",
        content: "I've been to dozens of gyms over the years, but Elite Fitness is on another level entirely. The equipment is pristine, the trainers genuinely care about your progress, and the community here is incredibly motivating. I lost 40 lbs and hit my first 315 lb squat here.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
      {
        name: "Rachel Kim",
        role: "Pro member since 2021",
        content: "Working with Priya after my ACL surgery was a game changer. She took the time to understand my injury, built a program around my limitations, and helped me come back stronger than I was before. I can't recommend this place enough.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
      {
        name: "Carlos Mendez",
        role: "Elite member since 2023",
        content: "The 24/7 access alone is worth every penny — I train at 5am before work and the facility is spotless. The training app makes it easy to track everything. Diego's mobility classes have completely transformed how my body feels.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
      {
        name: "Natalie Obi",
        role: "Member since 2022",
        content: "I was intimidated to join a gym for the first time, but the staff at Elite Fitness made me feel welcome from day one. Amara's yoga sessions helped me overcome my anxiety and build confidence I didn't know I had. Truly life-changing.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
      {
        name: "Derek Hollis",
        role: "Pro member since 2020",
        content: "Four years in and this is still the best investment I make every month. I've gone from a skinny 165 lbs to a lean 195 lbs under Tyler's guidance. The nutrition support and body composition tracking keep me dialed in year-round.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
      {
        name: "Sarah Lum",
        role: "Elite member since 2023",
        content: "Sophia's HIIT classes are absolutely brutal in the best way. I've never sweat so much in my life but the results speak for themselves — down 3 dress sizes in 6 months while getting stronger. The community in these classes is electric.",
        rating: 5,
        approved: true,
        imageUrl: null,
      },
    ]);
    console.log("  ✓ Testimonials seeded");
  } else {
    console.log("  – Testimonials already exist, skipping");
  }

  // ── Gallery Images ─────────────────────────────────────────────
  const existingGallery = await db.select().from(galleryImagesTable);
  if (existingGallery.length === 0) {
    await db.insert(galleryImagesTable).values([
      { url: "/images/gallery-1.jpg", title: "Main Training Floor", category: "Facility" },
      { url: "/images/gallery-2.jpg", title: "Free Weights Area", category: "Facility" },
      { url: "/images/gallery-3.jpg", title: "Cardio Zone", category: "Facility" },
      { url: "/images/gallery-4.jpg", title: "Personal Training Session", category: "Training" },
      { url: "/images/gallery-5.jpg", title: "Group HIIT Class", category: "Classes" },
      { url: "/images/gallery-6.jpg", title: "Recovery & Stretching Area", category: "Recovery" },
      { url: "/images/gallery-7.jpg", title: "Strength Competition Prep", category: "Training" },
      { url: "/images/gallery-8.jpg", title: "Yoga & Mind-Body Studio", category: "Classes" },
      { url: "/images/gallery-9.jpg", title: "Member Transformation Wall", category: "Community" },
    ]);
    console.log("  ✓ Gallery images seeded");
  } else {
    console.log("  – Gallery images already exist, skipping");
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
