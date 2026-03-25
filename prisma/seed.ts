// prisma/seed.ts
// Idempotent seed: upserts all records so it can be run multiple times safely.

import { PrismaClient, UserRole } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function hash(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const USERS = [
  // ── Super Admin ──────────────────────────────────────────────────────────
  {
    name: 'Super Admin',
    email: 'admin@boombox.com',
    password: 'SuperAdmin123!',
    role: UserRole.SUPER_ADMIN,
    avatar: null,
  },
  // ── Admins ───────────────────────────────────────────────────────────────
  {
    name: 'Maria Santos',
    email: 'maria.santos@boombox.com',
    password: 'Admin@Maria2024',
    role: UserRole.ADMIN,
    avatar: null,
  },
  {
    name: 'Carlos Reyes',
    email: 'carlos.reyes@boombox.com',
    password: 'Admin@Carlos2024',
    role: UserRole.ADMIN,
    avatar: null,
  },
  // ── SMMs ─────────────────────────────────────────────────────────────────
  {
    name: 'Ana Lim',
    email: 'ana.lim@boombox.com',
    password: 'Smm@Ana2024!',
    role: UserRole.SMM,
    avatar: null,
  },
  {
    name: 'Jake Mendoza',
    email: 'jake.mendoza@boombox.com',
    password: 'Smm@Jake2024!',
    role: UserRole.SMM,
    avatar: null,
  },
  {
    name: 'Ria Cruz',
    email: 'ria.cruz@boombox.com',
    password: 'Smm@Ria2024!',
    role: UserRole.SMM,
    avatar: null,
  },
  {
    name: 'Dan Torres',
    email: 'dan.torres@boombox.com',
    password: 'Smm@Dan2024!',
    role: UserRole.SMM,
    avatar: null,
  },
];

// Client seed data — added after user IDs are resolved
type ClientSeed = {
  name: string;
  address: string;
  industry: string;
  slogan: string;
  links: string[];
  coreProducts: string[];
  idealCustomers: string;
  brandEmotion: string;
  uniqueProposition: string;
  whyChooseUs: string;
  mainGoal: string;
  shortTermGoal: string;
  longTermGoal: string;
  competitors: string[];
  indirectCompetitors: string[];
  brandAssets: string[];
  fontUsed: string[];
  smmDriveLink: string;
  contractDeliverables: string;
  assignedSmmEmails: string[];   // resolved to IDs at runtime
  createdByEmail: string;        // resolved to ID at runtime
  links_data: {
    strategyAiLink: string;
    businessSummaryLink: string;
    basecampLink: string;
    contentCreationLink: string;
  };
};

const CLIENTS: ClientSeed[] = [
  {
    name: 'Bloom & Brew Coffee Co.',
    address: '12 Katipunan Ave, Quezon City, Philippines',
    industry: 'Food & Beverage',
    slogan: 'Every Cup Tells a Story',
    links: [
      'https://bloomandbrew.ph',
      'https://instagram.com/bloomandbrew',
      'https://facebook.com/bloomandbrew',
    ],
    coreProducts: [
      'Specialty Coffee Blends',
      'Artisan Pastries',
      'Cold Brew Bottles',
      'Coffee Subscriptions',
    ],
    idealCustomers:
      'Urban professionals aged 25–40 who value quality coffee, cozy ambiance, and Instagram-worthy aesthetics.',
    brandEmotion: 'Warmth, creativity, and a sense of belonging.',
    uniqueProposition:
      'Farm-to-cup sourcing with single-origin beans from local Philippine highlands.',
    whyChooseUs:
      'We partner directly with Benguet and Mt. Apo farmers, ensuring freshness and fair trade.',
    mainGoal: 'Increase foot traffic and grow online ordering by 30% within 6 months.',
    shortTermGoal: 'Launch a Ramadan limited-edition menu campaign on Instagram Reels.',
    longTermGoal: 'Expand to 5 additional branches across Metro Manila by 2027.',
    competitors: ['Starbucks', 'Tim Hortons PH', 'Bo\'s Coffee'],
    indirectCompetitors: ['Chatime', 'Macao Tea House', 'Jamba Juice PH'],
    brandAssets: [],
    fontUsed: ['Playfair Display', 'Lato'],
    smmDriveLink: 'https://drive.google.com/drive/folders/bloom-brew-assets',
    contractDeliverables:
      '12 Instagram posts/month, 4 Reels, 8 Stories, Monthly analytics report',
    assignedSmmEmails: ['ana.lim@boombox.com', 'jake.mendoza@boombox.com'],
    createdByEmail: 'maria.santos@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/bloom-brew-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/bloom-brew-summary',
      basecampLink: 'https://basecamp.com/projects/bloom-brew',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/bloom-brew-content',
    },
  },
  {
    name: 'FitForge Gym & Wellness',
    address: '3F Robinsons Galleria, Ortigas Center, Pasig City',
    industry: 'Health & Fitness',
    slogan: 'Forge Your Best Self',
    links: [
      'https://fitforge.com.ph',
      'https://instagram.com/fitforge_ph',
      'https://tiktok.com/@fitforgeph',
    ],
    coreProducts: [
      'Monthly Gym Memberships',
      'Personal Training Packages',
      'Group Classes (HIIT, Yoga, Zumba)',
      'Nutrition Coaching',
    ],
    idealCustomers:
      'Fitness-conscious individuals aged 18–45, both beginners and seasoned athletes seeking community and results.',
    brandEmotion: 'Empowerment, discipline, and transformation.',
    uniqueProposition:
      'Science-backed programming combined with a supportive community — no intimidation, just progress.',
    whyChooseUs:
      'Certified coaches, state-of-the-art equipment, and flexible memberships with no lock-in contracts.',
    mainGoal: 'Double membership sign-ups within Q2 2026 through social media ads and organic reach.',
    shortTermGoal: '30-day challenge campaign to boost TikTok following to 10k.',
    longTermGoal: 'Become the #1 fitness brand in the Philippines by 2030.',
    competitors: ['Anytime Fitness PH', 'Gold\'s Gym Manila', 'Snap Fitness'],
    indirectCompetitors: ['Nike Training Club App', 'YouTube Fitness Channels', 'Home gym setups'],
    brandAssets: [],
    fontUsed: ['Montserrat', 'Bebas Neue'],
    smmDriveLink: 'https://drive.google.com/drive/folders/fitforge-assets',
    contractDeliverables:
      '16 Instagram posts/month, 8 TikToks, 4 Facebook Ads creatives, Weekly Stories',
    assignedSmmEmails: ['ria.cruz@boombox.com'],
    createdByEmail: 'carlos.reyes@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/fitforge-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/fitforge-summary',
      basecampLink: 'https://basecamp.com/projects/fitforge',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/fitforge-content',
    },
  },
  {
    name: 'Verdant Real Estate',
    address: '18F Ayala Tower One, Ayala Ave, Makati City',
    industry: 'Real Estate',
    slogan: 'Find Your Roots, Build Your Future',
    links: [
      'https://verdantrealty.ph',
      'https://facebook.com/verdantrealty',
      'https://linkedin.com/company/verdant-realty',
    ],
    coreProducts: [
      'Residential Property Listings',
      'Commercial Leasing',
      'Property Management Services',
      'Virtual Property Tours',
    ],
    idealCustomers:
      'First-time homebuyers and investors aged 30–55 looking for condominiums and house-and-lot in Metro Manila.',
    brandEmotion: 'Trust, stability, and aspiration.',
    uniqueProposition:
      'AI-assisted property matching and 360° virtual tours reduce buying time by 50%.',
    whyChooseUs:
      'In-house legal team, seamless bank financing coordination, and dedicated post-purchase support.',
    mainGoal: 'Generate 200 qualified leads per month via LinkedIn and Facebook campaigns.',
    shortTermGoal: 'Launch a "Dream Home" video series on Facebook to showcase listings.',
    longTermGoal: 'Expand listings database to 10,000 properties across Luzon by 2027.',
    competitors: ['Lamudi PH', 'Property24', 'Hoppler'],
    indirectCompetitors: ['Airbnb', 'OLX Property Listings'],
    brandAssets: [],
    fontUsed: ['Cormorant Garamond', 'Source Sans Pro'],
    smmDriveLink: 'https://drive.google.com/drive/folders/verdant-assets',
    contractDeliverables:
      '8 Facebook posts/month, 4 LinkedIn articles, 2 YouTube property tour edits, Monthly lead report',
    assignedSmmEmails: ['dan.torres@boombox.com'],
    createdByEmail: 'maria.santos@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/verdant-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/verdant-summary',
      basecampLink: 'https://basecamp.com/projects/verdant',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/verdant-content',
    },
  },
  {
    name: 'Lumina Skincare PH',
    address: '88 Tomas Morato, Quezon City, Philippines',
    industry: 'Beauty & Skincare',
    slogan: 'Glow from Within',
    links: [
      'https://luminaskincare.ph',
      'https://instagram.com/luminaskincareph',
      'https://tiktok.com/@luminaskincareph',
      'https://shopee.ph/luminaskincareph',
    ],
    coreProducts: [
      'Vitamin C Brightening Serum',
      'Hyaluronic Acid Moisturizer',
      'SPF 50+ Sunscreen',
      'Exfoliating Toner',
    ],
    idealCustomers:
      'Filipino women aged 18–35 dealing with hyperpigmentation, acne, and sun damage seeking effective, affordable skincare.',
    brandEmotion: 'Confidence, radiance, and self-love.',
    uniqueProposition:
      'Dermatologist-formulated products tailored for tropical Filipino skin, free from harmful whitening agents.',
    whyChooseUs:
      'FDA-registered, cruelty-free, and proven with clinical trials on Fitzpatrick skin types III–V.',
    mainGoal: 'Reach 50,000 monthly Shopee units sold through viral TikTok and IG Reels campaigns.',
    shortTermGoal: 'Partner with 20 nano-influencers for authentic product reviews in Q2.',
    longTermGoal: 'Export to Southeast Asian markets (Singapore, Malaysia) by 2027.',
    competitors: ['Careline', 'BLK Cosmetics', 'Happy Skin'],
    indirectCompetitors: ['Korean skincare brands on Shopee', 'Watsons PH house brands'],
    brandAssets: [],
    fontUsed: ['Josefin Sans', 'EB Garamond'],
    smmDriveLink: 'https://drive.google.com/drive/folders/lumina-assets',
    contractDeliverables:
      '20 Instagram posts/month, 12 TikToks, 4 Shopee campaign banners, Influencer briefing docs',
    assignedSmmEmails: ['ana.lim@boombox.com'],
    createdByEmail: 'carlos.reyes@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/lumina-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/lumina-summary',
      basecampLink: 'https://basecamp.com/projects/lumina',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/lumina-content',
    },
  },
  {
    name: 'TechNest Solutions',
    address: '5F Cybergate Tower, Pioneer St, Mandaluyong City',
    industry: 'Technology & SaaS',
    slogan: 'Nest Smarter, Scale Faster',
    links: [
      'https://technest.io',
      'https://linkedin.com/company/technest-ph',
      'https://twitter.com/technest_io',
    ],
    coreProducts: [
      'HR Management SaaS Platform',
      'Payroll Automation',
      'Employee Onboarding Portal',
      'IT Asset Management Tool',
    ],
    idealCustomers:
      'SME HR managers and CTOs in the Philippines (50–500 employees) struggling with manual HR processes.',
    brandEmotion: 'Efficiency, reliability, and growth.',
    uniqueProposition:
      'The only HR SaaS built natively for Philippine labor law compliance with BIR, SSS, PhilHealth, and Pag-IBIG integrations.',
    whyChooseUs:
      'Local support team, 99.9% uptime SLA, and free onboarding assistance for first 3 months.',
    mainGoal: 'Acquire 500 new SME subscribers via LinkedIn thought leadership and targeted ads.',
    shortTermGoal: 'Publish 8 LinkedIn articles on Philippine HR compliance in Q2.',
    longTermGoal: 'Achieve P100M ARR by end of 2027.',
    competitors: ['Sprout HR', 'PayrollHero', 'BambooHR'],
    indirectCompetitors: ['Manual spreadsheet solutions', 'Outsourced payroll agencies'],
    brandAssets: [],
    fontUsed: ['Inter', 'Fira Code'],
    smmDriveLink: 'https://drive.google.com/drive/folders/technest-assets',
    contractDeliverables:
      '12 LinkedIn posts/month, 4 thought-leadership articles, 2 webinar promotions, Monthly analytics',
    assignedSmmEmails: ['jake.mendoza@boombox.com', 'dan.torres@boombox.com'],
    createdByEmail: 'carlos.reyes@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/technest-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/technest-summary',
      basecampLink: 'https://basecamp.com/projects/technest',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/technest-content',
    },
  },
  {
    name: 'PH Eats Express',
    address: 'Unit 4, Greenfield District, Mandaluyong City',
    industry: 'Food Delivery & Restaurant',
    slogan: 'The Taste of Home, Delivered Fast',
    links: [
      'https://pheatsexpress.com',
      'https://instagram.com/pheatsexpress',
      'https://facebook.com/pheatsexpress',
      'https://tiktok.com/@pheatsexpress',
    ],
    coreProducts: [
      'Filipino Comfort Food Meals',
      'Party Trays & Catering',
      'Subscription Meal Plans',
      'Express 30-Min Delivery',
    ],
    idealCustomers:
      'OFW families, busy professionals, and students aged 20–45 who crave authentic Filipino dishes delivered quickly.',
    brandEmotion: 'Nostalgia, comfort, and pride in Filipino cuisine.',
    uniqueProposition:
      'Lola\'s recipes made with locally sourced ingredients — delivered in 30 minutes or it\'s free.',
    whyChooseUs:
      'Family-owned kitchen with 20-year legacy, FSSC 22000 certified, and eco-friendly packaging.',
    mainGoal: 'Grow delivery orders by 50% and build a loyal community of 100k followers across platforms.',
    shortTermGoal: 'Launch a "Fiesta Friday" UGC campaign encouraging customers to share food moments.',
    longTermGoal: 'Open cloud kitchen hubs in Cebu and Davao by 2027.',
    competitors: ['Mesa Filipino Moderne', 'Aristocrat Restaurant', 'Manam'],
    indirectCompetitors: ['GrabFood', 'Foodpanda', 'LalaFood home cooks'],
    brandAssets: [],
    fontUsed: ['Nunito', 'Pacifico'],
    smmDriveLink: 'https://drive.google.com/drive/folders/pheats-assets',
    contractDeliverables:
      '20 posts/month (IG + FB), 10 TikToks, 4 paid ad creatives, Weekly Stories, Community management',
    assignedSmmEmails: ['ria.cruz@boombox.com', 'ana.lim@boombox.com'],
    createdByEmail: 'maria.santos@boombox.com',
    links_data: {
      strategyAiLink: 'https://docs.google.com/document/d/pheats-strategy',
      businessSummaryLink: 'https://docs.google.com/document/d/pheats-summary',
      basecampLink: 'https://basecamp.com/projects/pheats',
      contentCreationLink: 'https://docs.google.com/spreadsheets/d/pheats-content',
    },
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ── 1. Upsert users ────────────────────────────────────────────────────
  const userMap = new Map<string, number>(); // email → id

  for (const u of USERS) {
    const hashedPassword = await hash(u.password);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        isActive: true,
      },
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        isActive: true,
        lastLogin: new Date(),
      },
    });

    userMap.set(u.email, user.id);
    console.log(`  👤 ${user.role.padEnd(12)} ${user.name} <${user.email}>`);
  }

  console.log('\n');

  // ── 2. Upsert clients + ClientLinks ───────────────────────────────────
  for (const c of CLIENTS) {
    const createdById = userMap.get(c.createdByEmail);
    if (!createdById) throw new Error(`Creator not found: ${c.createdByEmail}`);

    const assignedIds = c.assignedSmmEmails
      .map((email) => userMap.get(email))
      .filter((id): id is number => id !== undefined);

    // Upsert ClientLinks first (we need its id for the client)
    let clientLinks = await prisma.clientLinks.findFirst({
      where: {
        Client: {
          some: { name: c.name },
        },
      },
    });

    if (clientLinks) {
      clientLinks = await prisma.clientLinks.update({
        where: { id: clientLinks.id },
        data: {
          strategyAiLink: c.links_data.strategyAiLink,
          businessSummaryLink: c.links_data.businessSummaryLink,
          basecampLink: c.links_data.basecampLink,
          contentCreationLink: c.links_data.contentCreationLink,
        },
      });
    } else {
      clientLinks = await prisma.clientLinks.create({
        data: {
          clientId: 0, // placeholder; backfilled after client creation
          strategyAiLink: c.links_data.strategyAiLink,
          businessSummaryLink: c.links_data.businessSummaryLink,
          basecampLink: c.links_data.basecampLink,
          contentCreationLink: c.links_data.contentCreationLink,
        },
      });
    }

    // Upsert client
    const existing = await prisma.client.findFirst({ where: { name: c.name } });

    let client;
    if (existing) {
      client = await prisma.client.update({
        where: { id: existing.id },
        data: {
          address: c.address,
          industry: c.industry,
          slogan: c.slogan,
          links: c.links,
          coreProducts: c.coreProducts,
          idealCustomers: c.idealCustomers,
          brandEmotion: c.brandEmotion,
          uniqueProposition: c.uniqueProposition,
          whyChooseUs: c.whyChooseUs,
          mainGoal: c.mainGoal,
          shortTermGoal: c.shortTermGoal,
          longTermGoal: c.longTermGoal,
          competitors: c.competitors,
          indirectCompetitors: c.indirectCompetitors,
          brandAssets: c.brandAssets,
          fontUsed: c.fontUsed,
          smmDriveLink: c.smmDriveLink,
          contractDeliverables: c.contractDeliverables,
          assignedUserId: assignedIds[0] ?? null,
          assignedUserIds: assignedIds,
          clientLinksId: clientLinks.id,
          updatedAt: new Date(),
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          name: c.name,
          address: c.address,
          industry: c.industry,
          slogan: c.slogan,
          links: c.links,
          coreProducts: c.coreProducts,
          idealCustomers: c.idealCustomers,
          brandEmotion: c.brandEmotion,
          uniqueProposition: c.uniqueProposition,
          whyChooseUs: c.whyChooseUs,
          mainGoal: c.mainGoal,
          shortTermGoal: c.shortTermGoal,
          longTermGoal: c.longTermGoal,
          competitors: c.competitors,
          indirectCompetitors: c.indirectCompetitors,
          brandAssets: c.brandAssets,
          fontUsed: c.fontUsed,
          smmDriveLink: c.smmDriveLink,
          contractDeliverables: c.contractDeliverables,
          assignedUserId: assignedIds[0] ?? null,
          assignedUserIds: assignedIds,
          createdById,
          clientLinksId: clientLinks.id,
        },
      });
    }

    // Back-fill clientId on the ClientLinks record (schema stores it)
    await prisma.clientLinks.update({
      where: { id: clientLinks.id },
      data: { clientId: client.id },
    });

    const smmNames = c.assignedSmmEmails.map((e) => e.split('@')[0]).join(', ');
    console.log(`  🏢 [${c.industry.padEnd(28)}] ${c.name}  →  SMM: ${smmNames}`);
  }

  console.log('\n✅ Seed completed successfully!\n');
  console.log('─'.repeat(55));
  console.log('Default credentials:');
  console.log('  SUPER_ADMIN  admin@boombox.com          SuperAdmin123!');
  console.log('  ADMIN        maria.santos@boombox.com   Admin@Maria2024');
  console.log('  ADMIN        carlos.reyes@boombox.com   Admin@Carlos2024');
  console.log('  SMM          ana.lim@boombox.com        Smm@Ana2024!');
  console.log('  SMM          jake.mendoza@boombox.com   Smm@Jake2024!');
  console.log('  SMM          ria.cruz@boombox.com       Smm@Ria2024!');
  console.log('  SMM          dan.torres@boombox.com     Smm@Dan2024!');
  console.log('─'.repeat(55));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
