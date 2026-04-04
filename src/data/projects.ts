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
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description:
      'A full-stack online store with real-time inventory, cart management, and Stripe integration for seamless checkout.',
    longDescription:
      'A full-stack online store with real-time inventory tracking, cart management, and Stripe integration for seamless checkout. Built to handle high traffic with optimized database queries and a responsive storefront.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    url: 'https://example.com/ecommerce',
    images: [],
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    description:
      'Kanban-style project tracker with drag-and-drop, real-time collaboration, and custom workflow automations.',
    longDescription:
      'A Kanban-style project tracker featuring drag-and-drop task management, real-time collaboration via WebSockets, and custom workflow automations to streamline team productivity.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'WebSocket'],
    url: 'https://example.com/tasks',
    images: [],
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description:
      'Interactive data visualization dashboard with live metrics, custom chart builder, and export capabilities.',
    longDescription:
      'An interactive data visualization dashboard with live metrics, a custom chart builder, and export capabilities. Powered by a Python FastAPI backend with D3.js rendering on the frontend.',
    tags: ['React', 'D3.js', 'Python', 'FastAPI'],
    url: 'https://example.com/analytics',
    images: [],
  },
  {
    slug: 'social-media-api',
    title: 'Social Media API',
    description:
      'RESTful API powering a social platform with authentication, feeds, real-time notifications, and media uploads.',
    longDescription:
      'A RESTful API powering a social platform with JWT authentication, algorithmic feeds, real-time notifications via WebSockets, and media uploads with image processing. Built with Go for performance and Redis for caching.',
    tags: ['Go', 'Redis', 'MongoDB', 'Docker'],
    url: 'https://example.com/social-api',
    images: [],
  },
]
