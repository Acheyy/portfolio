export const porfoMessages = [
  "🤦 You're already here, genius.",
  "🔄 Congratulations, you just navigated to... here.",
  "🪞 It's like looking in a mirror, but for websites.",
  "📍 You are here. You were always here.",
  "🧠 Big brain move. Really.",
  "♾️ Recursion detected. Stack overflow imminent.",
  "🫠 The site is coming from inside the site.",
]

export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  url: string
  image?: string
  images: string[]
}

export const projects: Project[] = [
  {
    slug: 'porfo',
    title: 'Porfo.io',
    description:
      'This very website you\'re looking at right now. Yes, I put myself in my own portfolio. It\'s portfolios all the way down.',
    longDescription: `You\'re literally on it. Porfo.io is the portfolio that showcases itself — a recursive flex, if you will.

Built with TanStack Start and TypeScript for blazing-fast server-side rendering, styled with Tailwind CSS for that dark, moody developer aesthetic, and sprinkled with Framer Motion animations because static pages are boring.

Features include a projects showcase (you\'re in it), an about page, a contact form, and a mini-games section — because why not add Snake to your portfolio?

Is it a bit meta to list your portfolio inside your portfolio? Absolutely. Do I regret it? Not even a little.`,
    tags: ['TanStack Start', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    url: 'https://porfo.io',
    images: [],
  },
  {
    slug: 'carshift',
    title: 'CarShift',
    description:
      'Platform that lets users sell their cars quickly and hassle-free. Submit your car details, get a fair offer, and get paid — all in a few simple steps.',
    longDescription: `CarShift makes selling your car dead simple. Instead of dealing with endless listings, lowball offers, and tire-kickers, users just fill out a quick form with their car details and photos, and receive a fair valuation offer within 24 hours. Accept the offer, and CarShift handles everything else — paperwork, pickup, and payment.

The platform also features a public inventory where buyers can browse quality second-hand cars with advanced filters (body type, fuel, price range, transmission) and image carousels for every listing.

Behind the scenes, a complete admin dashboard gives the team full control — managing inventory, reviewing incoming sell requests, scheduling test drives, and tracking key metrics like total listings, active ads, and completed sales.

The platform is built entirely with TanStack Start and TypeScript — both the frontend and backend — for a fast, SEO-friendly experience with server-side rendering. Styled with Tailwind CSS and backed by MongoDB for flexible data storage.`,
    tags: ['TanStack Start', 'TypeScript', 'Tailwind CSS', 'MongoDB'],
    url: 'https://carshift.ro',
    image: '/projects/carshift.png',
    images: [
      '/projects/carshift.png',
      '/projects/carshift-sell.png',
      '/projects/carshift-admin.png',
    ],
  },
  {
    slug: 'lasercraft',
    title: 'LaserCraft',
    description:
      'Professional laser cutting and engraving service website. Showcases services, portfolio, and lets clients request custom quotes — all with a sleek, modern design.',
    longDescription: `LaserCraft is the online presence for a professional laser cutting and engraving business based in Bucharest, Romania. The site is designed to showcase their full range of services — acrylic cutting, wood cutting, and precision laser engraving — while making it dead simple for potential clients to request a free custom quote.

The homepage highlights key selling points at a glance: sub-0.1mm precision, 10+ years of experience, 2000+ completed projects, and a 99% client satisfaction rate. A dedicated services section breaks down each offering with clear descriptions, and a "Why Choose Us" section builds trust with details on fast delivery, material versatility, competitive pricing, free consultations, and quality guarantees.

The site features a clean, dark-themed design with bold typography and orange accent colors, creating a premium and professional feel. Fully responsive and optimized for SEO to attract local and national clients searching for laser processing services.`,
    tags: ['TanStack Start', 'TypeScript', 'Tailwind CSS'],
    url: 'https://laser-craft.ro',
    image: '/projects/lasercraft.png',
    images: [
      '/projects/lasercraft.png',
      '/projects/lasercraft-portfolio.png',
      '/projects/lasercraft-contact.png',
    ],
  },
]
