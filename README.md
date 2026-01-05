# Budaobu Portfolio

![Nuxt 4](https://img.shields.io/badge/Nuxt-v4.2.1-00DC82?style=flat&logo=nuxt.js)
![Nuxt UI 4](https://img.shields.io/badge/Nuxt_UI-v4.2.1-00DC82?style=flat&logo=nuxt.js)
![Vue 3.5](https://img.shields.io/badge/Vue-v3.5.25-4FC08D?style=flat&logo=vue.js)
![Vite 7](https://img.shields.io/badge/Vite-v7.2.4-646CFF?style=flat&logo=vite)
![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare_Pages-F38020?style=flat&logo=cloudflare)

> **"Non-dev, just vibe coding to stitch stuff together."**
>
> An introvert's playground where everything is built by prompt and intuition.

This is the source code for my personal portfolio, built on the bleeding edge of the Vue & Nuxt ecosystem. It serves as a showcase of projects, a blog for non-technical ramblings, and a curated list of digital/physical tools I use.

## ✨ Key Features

* **⚡️ Bleeding Edge Stack:** Built with **Nuxt 4**, **Nuxt UI v4**, and **Tailwind CSS v4** (configured via `@theme`).
* **🎨 AI-Stitched UI:** Clean, minimalist design with "Vibe Coding" aesthetics, featuring a custom **Retro TV 404 page** and CSS animations.
* **📝 Content System:** Markdown-based blogging powered by **Nuxt Content v3**, featuring auto-generated TOCs, Shiki highlighting, and infinite scroll.
* **🖼️ Media Handling:** Custom lightbox component (`ImageGallery`) and responsible image handling with fallbacks.
* **🔄 Infinite Scroll:** Custom composable `useInfiniteScroll` utilizing `IntersectionObserver` for seamless browsing on Projects and Uses pages.
* **☁️ Serverless & Static:** Optimized for **Cloudflare Pages** with full static generation (SSG) and localized API logic.
* **🔍 SEO Optimized:** Dynamic Sitemap, RSS Feed generation, and extensive meta tag configuration via `useSeoMeta`.

## 🛠 Tech Stack

| Package | Version | Description |
| :--- | :--- | :--- |
| **Framework** | `nuxt` v4.2.1 | The Intuitive Vue Framework |
| **UI Library** | `@nuxt/ui` v4.2.1 | UI components based on Tailwind 4 |
| **Core** | `vue` v3.5.25 | The Progressive JavaScript Framework |
| **Build Tool** | `vite` v7.2.4 | Next Generation Frontend Tooling |
| **Engine** | `nitro` v2.12.9 | Server side rendering engine |
| **Styling** | `tailwindcss` v4 | Utility-first CSS framework |
| **Deployment** | Cloudflare Pages | Static Site Generation (SSG) |

## 📂 Project Structure

```bash
portfolio/
├── app/
│   ├── components/      # Vue components (RetroTv, ImageGallery, etc.)
│   ├── composables/     # Logic reuse (useInfiniteScroll)
│   ├── layouts/         # Base layouts
│   ├── pages/           # File-based routing
│   └── assets/css/      # Tailwind v4 CSS configuration
├── content/             # Markdown blog posts
├── server/
│   ├── api/             # API routes (projects, uses, avatar)
│   └── routes/          # Server routes (RSS)
├── public/              # Static assets & _redirects
└── nuxt.config.ts       # Nuxt configuration
```

## 🚀 Local Development

Ensure you have [Node.js](https://nodejs.org/) (latest LTS recommended) and [pnpm](https://pnpm.io/) installed.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/budaobu/portfolio.git](https://github.com/budaobu/portfolio.git)
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Start the development server**
    ```bash
    pnpm dev
    ```
    Visit `http://localhost:3000` in your browser.

## 📦 Build & Deployment

When connecting your repository to Cloudflare Pages, use the following settings:

* **Framework Preset:** Nuxt
* **Build Command:** `npm run generate`
* **Output Directory:** `dist`
* **Environment Variables:**
    * `NUXT_PUBLIC_SITE_URL`: `https://your-domain.com` (Recommended for SEO/Sitemap)

## 🤖 AI Contributors

This project is "stitched" together with the help of:
* **Gemini 3.0 Pro**
* **Claude 4.5 Sonnet**

*Driven by prompts, refined by intuition.*

## 📄 License

[MIT](./LICENSE) License © 2026 Budaobu