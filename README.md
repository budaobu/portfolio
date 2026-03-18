# Budaobu Portfolio

![Nuxt](https://img.shields.io/badge/Nuxt-4.3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

> "Non-dev, just vibe coding to stitch stuff together."

An introvert's playground where everything is built by prompt and intuition.

This is the source code for my personal portfolio, built on the **bleeding edge** of the Vue & Nuxt ecosystem. It serves as a showcase of projects, a blog for non-technical ramblings, and a curated list of digital/physical tools I use.

---

## ✨ Key Features

* **⚡️ Bleeding Edge Stack**: Built with **Nuxt 4.3**, **Nuxt UI v4.4**, and **Tailwind CSS v4** (configured via `@theme` in CSS).
* **🎨 Editorial Design**: Neo-Editorial aesthetic with warm earth tones, Playfair Display + Outfit typography, and coral accents.
* **📨 Serverless Contact Form**: Fully functional `/connect` page powered by Nitro server API (`/api/send`) and **Resend**, running seamlessly on Cloudflare Pages.
* **📝 Content System**: Markdown-based blogging powered by **Nuxt Content**, featuring auto-generated TOCs, Shiki highlighting, and metadata handling.
* **🖼️ Media Handling**: Custom lightbox component (`ImageGallery`) and optimized image delivery.
* **🔄 Infinite Scroll**: Custom composable `useInfiniteScroll` utilizing `IntersectionObserver` for seamless browsing on Projects and Uses pages.
* **☁️ Serverless & Static**: Optimized for **Cloudflare Pages** with full static generation (SSG) for content and serverless functions for dynamic APIs.
* **🔍 SEO Optimized**: Dynamic Sitemap, RSS Feed generation, LLM context file (`llms.txt`), and extensive meta tag configuration via `useSeoMeta`.

---

## 🛠 Tech Stack

| Package | Version | Description |
| :--- | :--- | :--- |
| **Framework** | `nuxt v4.3.0` | The Intuitive Vue Framework |
| **UI Library** | `@nuxt/ui v4.4.0` | UI components based on Tailwind 4 |
| **Core** | `vue v3.5.27` | The Progressive JavaScript Framework |
| **Build Tool** | `vite v7.3.0` | Next Generation Frontend Tooling |
| **Engine** | `nitro v2.12.9` | Server side rendering engine |
| **Styling** | `tailwindcss v4` | Utility-first CSS framework |
| **Deployment** | `Cloudflare Pages` | Static Site Generation (SSG) + Edge Functions |

---

## 📂 Project Structure

```bash
portfolio/
├── app/
│   ├── components/      # Vue components (RetroTv, ImageGallery, etc.)
│   ├── composables/     # Logic reuse (useInfiniteScroll, useSiteSeo)
│   ├── layouts/         # Base layouts
│   ├── pages/           # File-based routing (blog, projects, connect, etc.)
│   └── assets/css/      # Tailwind v4 CSS configuration
├── content/             # Markdown blog posts
├── server/
│   ├── api/             # API routes (projects, uses, avatar, send)
│   ├── routes/          # Server routes (RSS, llms.txt, short-links)
│   └── utils/           # Server-side data processing
├── public/              # Static assets & _redirects
└── nuxt.config.ts       # Nuxt configuration
```

---

## 🚀 Local Development

Ensure you have **Node.js** (latest LTS recommended) and **pnpm** installed.

1.  **Clone the repository**

    ```bash
    git clone https://github.com/budaobu/portfolio.git
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

---

## 📦 Build & Deployment

When connecting your repository to **Cloudflare Pages**, use the following settings:

* **Framework Preset**: `Nuxt`
* **Build Command**: `npm run generate` (or `nuxt build`)
* **Output Directory**: `dist`

### Environment Variables

| Variable | Description | Where to Configure |
| :--- | :--- | :--- |
| `NUXT_PUBLIC_SITE_URL` | `https://your-domain.com` (Recommended for SEO/Sitemap) | wrangler.toml or Dashboard |
| `NUXT_RESEND_API_KEY` | Your **Resend** API key (Required for Contact Form) | Dashboard (Secrets) |
| `NUXT_RESEND_TO_EMAIL` | Target email address for contact form messages | Dashboard (Secrets) |

---

## 🤖 AI Contributors

This project is "stitched" together with the help of:

* **Gemini 3.0 Pro**
* **Claude 4.5 Sonnet**

Driven by prompts, refined by intuition.

---

## 📄 License

[MIT License](LICENSE) © 2026 Budaobu