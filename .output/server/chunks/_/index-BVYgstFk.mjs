import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" }
];
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxs(
    motion.nav,
    {
      initial: { y: -80 },
      animate: { y: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-bg/70 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl flex items-center justify-between px-6 py-4", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#home",
              className: "font-display text-xl font-bold tracking-tight text-text-heading hover:text-accent-light transition-colors",
              children: [
                "Portfolio",
                /* @__PURE__ */ jsx("span", { className: "text-accent", children: "." })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-8", children: links.map((link) => /* @__PURE__ */ jsxs(
            "a",
            {
              href: link.href,
              className: "text-sm font-medium text-text-muted hover:text-text-heading transition-colors relative group",
              children: [
                link.label,
                /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" })
              ]
            },
            link.href
          )) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setMobileOpen(!mobileOpen),
              className: "md:hidden flex flex-col gap-1.5 p-2",
              "aria-label": "Toggle menu",
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `block w-6 h-0.5 bg-text-heading transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `block w-6 h-0.5 bg-text-heading transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `block w-6 h-0.5 bg-text-heading transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "md:hidden bg-bg/95 backdrop-blur-xl border-b border-border overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 px-6 py-4", children: links.map((link) => /* @__PURE__ */ jsx(
              "a",
              {
                href: link.href,
                onClick: () => setMobileOpen(false),
                className: "text-base font-medium text-text-muted hover:text-text-heading py-2 transition-colors",
                children: link.label
              },
              link.href
            )) })
          }
        ) })
      ]
    }
  );
}
function Hero() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "home",
      className: "relative min-h-screen flex items-center justify-center overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "orb w-[500px] h-[500px] bg-accent -top-40 -right-40 animate-pulse-glow" }),
        /* @__PURE__ */ jsx("div", { className: "orb w-[400px] h-[400px] bg-indigo -bottom-32 -left-32 animate-pulse-glow [animation-delay:2s]" }),
        /* @__PURE__ */ jsx("div", { className: "orb w-[300px] h-[300px] bg-accent-dark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow [animation-delay:1s]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto max-w-4xl px-6 text-center", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              children: /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm font-medium uppercase tracking-[0.3em] text-accent-light", children: "Welcome to my portfolio" })
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.h1,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
              className: "font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-heading", children: "I build" }),
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "things for" }),
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-text-heading", children: "the web" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
              className: "mx-auto mt-8 max-w-xl text-lg text-text-muted leading-relaxed",
              children: "A developer passionate about crafting beautiful, performant digital experiences. Turning ideas into reality, one pixel at a time."
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] },
              className: "mt-10 flex flex-wrap items-center justify-center gap-4",
              children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "#projects",
                    className: "inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5",
                    children: [
                      "View Projects",
                      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "#about",
                    className: "inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-semibold text-text-heading transition-all hover:border-accent hover:text-accent-light hover:-translate-y-0.5",
                    children: "About Me"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" })
      ]
    }
  );
}
const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack online store with real-time inventory, cart management, and Stripe integration for seamless checkout.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    url: "https://example.com/ecommerce",
    image: "/projects/ecommerce.png"
  },
  {
    title: "Task Management App",
    description: "Kanban-style project tracker with drag-and-drop, real-time collaboration, and custom workflow automations.",
    tags: ["TypeScript", "Next.js", "Prisma", "WebSocket"],
    url: "https://example.com/tasks",
    image: "/projects/tasks.png"
  },
  {
    title: "Analytics Dashboard",
    description: "Interactive data visualization dashboard with live metrics, custom chart builder, and export capabilities.",
    tags: ["React", "D3.js", "Python", "FastAPI"],
    url: "https://example.com/analytics",
    image: "/projects/analytics.png"
  },
  {
    title: "Social Media API",
    description: "RESTful API powering a social platform with authentication, feeds, real-time notifications, and media uploads.",
    tags: ["Go", "Redis", "MongoDB", "Docker"],
    url: "https://example.com/social-api",
    image: "/projects/social.png"
  }
];
function ProjectCard({ project, index }) {
  return /* @__PURE__ */ jsxs(
    motion.a,
    {
      href: project.url,
      target: "_blank",
      rel: "noopener noreferrer",
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      },
      className: "glow-card block p-6 group cursor-pointer",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative mb-5 aspect-video overflow-hidden rounded-lg bg-border/30", children: [
          project.image ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-text-muted/30", children: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) : null,
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-semibold text-text-heading group-hover:text-accent-light transition-colors", children: project.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-text-muted line-clamp-2", children: project.description }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: project.tags.map((tag) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-light border border-accent/20",
            children: tag
          },
          tag
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-1.5 text-xs font-medium text-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: [
          "View Project",
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
        ] })
      ]
    }
  );
}
function Projects() {
  return /* @__PURE__ */ jsx("section", { id: "projects", className: "relative py-28 px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        className: "mb-16",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3", children: "Portfolio" }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl sm:text-5xl font-bold text-text-heading", children: "Featured Projects" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-lg text-text-muted leading-relaxed", children: "A selection of things I've built. Each one taught me something new and pushed my skills further." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2", children: projects.map((project, i) => /* @__PURE__ */ jsx(ProjectCard, { project, index: i }, project.title)) })
  ] }) });
}
function About() {
  return /* @__PURE__ */ jsxs("section", { id: "about", className: "relative py-28 px-6", children: [
    /* @__PURE__ */ jsx("div", { className: "orb w-[350px] h-[350px] bg-indigo top-0 right-0 animate-pulse-glow" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-2 lg:gap-20 items-center", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -40 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          className: "relative",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl bg-bg-card border border-border overflow-hidden relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-indigo/10" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-accent-light", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-muted", children: "Your photo here" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-accent/20 -z-10 hidden lg:block" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 40 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3", children: "About" }),
            /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl sm:text-5xl font-bold text-text-heading", children: "A bit about me" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4 text-text-muted leading-relaxed", children: [
              /* @__PURE__ */ jsx("p", { children: "Hey there! I'm a developer who loves turning complex problems into simple, beautiful solutions. I've been building for the web for several years, and every project still excites me." }),
              /* @__PURE__ */ jsx("p", { children: "My approach blends clean code with thoughtful design. I believe great software isn't just functional \u2014 it should feel effortless to use and delightful to interact with." }),
              /* @__PURE__ */ jsx("p", { children: "When I'm not coding, you can find me exploring new technologies, contributing to open source, or enjoying a good cup of coffee while sketching out the next big idea." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-wrap gap-6", children: [
              { label: "Years Experience", value: "5+" },
              { label: "Projects Built", value: "20+" },
              { label: "Technologies", value: "15+" }
            ].map((stat) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-bold text-accent-light", children: stat.value }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-text-muted uppercase tracking-wider", children: stat.label })
            ] }, stat.label)) })
          ]
        }
      )
    ] }) })
  ] });
}
const skills = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TanStack", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "HTML / CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "MongoDB", category: "Backend" },
  { name: "Redis", category: "Backend" },
  { name: "Go", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "Linux", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Figma", category: "Tools" },
  { name: "CI/CD", category: "Tools" }
];
const categories = ["Frontend", "Backend", "Tools"];
function Skills() {
  return /* @__PURE__ */ jsxs("section", { id: "skills", className: "relative py-28 px-6", children: [
    /* @__PURE__ */ jsx("div", { className: "orb w-[400px] h-[400px] bg-accent-dark -bottom-20 left-1/4 animate-pulse-glow" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          className: "mb-16",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3", children: "Expertise" }),
            /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl sm:text-5xl font-bold text-text-heading", children: "Skills & Technologies" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-lg text-text-muted leading-relaxed", children: "The tools and technologies I work with to bring ideas to life." })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid gap-12 md:grid-cols-3", children: categories.map((category, catIdx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: {
            duration: 0.6,
            delay: catIdx * 0.1,
            ease: [0.22, 1, 0.36, 1]
          },
          children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-display text-lg font-semibold text-text-heading mb-5 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-8 h-0.5 bg-accent rounded-full" }),
              category
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2.5", children: skills.filter((s) => s.category === category).map((skill, i) => /* @__PURE__ */ jsx(
              motion.span,
              {
                initial: { opacity: 0, scale: 0.8 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                transition: {
                  duration: 0.4,
                  delay: catIdx * 0.1 + i * 0.04
                },
                className: "rounded-lg bg-bg-card border border-border px-4 py-2.5 text-sm font-medium text-text hover:border-accent/50 hover:text-accent-light hover:bg-bg-card-hover transition-all duration-300 cursor-default",
                children: skill.name
              },
              skill.name
            )) })
          ]
        },
        category
      )) })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border py-10 px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-muted", children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Portfolio. All rights reserved."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://github.com",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-text-muted hover:text-accent-light transition-colors",
          "aria-label": "GitHub",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://linkedin.com",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-text-muted hover:text-accent-light transition-colors",
          "aria-label": "LinkedIn",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "mailto:hello@example.com",
          className: "text-text-muted hover:text-accent-light transition-colors",
          "aria-label": "Email",
          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" }) })
        }
      )
    ] })
  ] }) });
}
function HomePage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx("div", { className: "section-divider" }),
      /* @__PURE__ */ jsx(Projects, {}),
      /* @__PURE__ */ jsx("div", { className: "section-divider" }),
      /* @__PURE__ */ jsx(About, {}),
      /* @__PURE__ */ jsx("div", { className: "section-divider" }),
      /* @__PURE__ */ jsx(Skills, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}

export { HomePage as component };
//# sourceMappingURL=index-BVYgstFk.mjs.map
