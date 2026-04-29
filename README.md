# SalesAI - High-Converting Sales Page Generator

SalesAI adalah _workspace_ berbasis AI yang dirancang untuk membantu _copywriter_, _marketer_, dan _developer_ men-_generate_ _sales page_ berbasis Markdown yang _high-converting_ dalam hitungan detik. Dibangun dengan arsitektur web modern, aplikasi ini memiliki fitur _real-time AI streaming_, _document management_, dan _standalone HTML exporting_ yang _seamless_.

## 🚀 Tech Stack & Tools

- **Framework:** Next.js 16.2 (App Router) & React 19.2
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 & shadcn/ui
- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/react`) & Google Gemini (`@ai-sdk/google`)
- **Database & Auth:** Supabase (`@supabase/ssr`) & PostgreSQL
- **ORM:** Prisma (dengan `@prisma/adapter-pg` untuk optimalisasi koneksi)
- **UI/UX:** `lucide-react` (Icons) & `sonner` (Toast Notifications)
- **Markdown Parsing:** `react-markdown`

---

## 🧠 Architecture Approach & Logic

Aplikasi ini dibangun dengan paradigma _separation of concerns_ yang memisahkan antara mutasi data di sisi server dan interaktivitas di sisi client, dengan memanfaatkan fitur-fitur modern dari Next.js App Router dan React 19.

### 1. Hybrid Rendering Strategy (Server & Client Components)

- **Server Components:** Halaman _Document Library_ (`/dashboard/saved`) di-_render_ secara eksklusif di server. Komponen ini melakukan _fetching_ data langsung dari database Supabase PostgreSQL melalui Prisma tanpa mengirimkan _JavaScript payload_ berlebih ke _browser_.
- **Client Components:** Form _Generator_ dan _Live Preview_ berjalan sebagai _Client Components_ (`"use client"`). Komponen ini menangani _local state_ yang kompleks dan memproses _real-time continuous stream_ dari AI _provider_.

### 2. State Management & Asynchronous Mutations

Daripada menggunakan _library state management_ sisi client yang berat, aplikasi ini memanfaatkan _primitives_ terbaru dari React 19:

- **`useFormStatus`:** Diimplementasikan pada alur autentikasi (Login/Register). _Hook_ ini membaca _pending state_ dari _Server Actions_ secara langsung untuk memberikan _visual feedback_ yang instan (animasi _loading_) tanpa perlu mengatur _toggle_ `useState` secara manual.
- **Server Actions:** _Form submission_ (Autentikasi, Menghapus dokumen) ditangani via _asynchronous Server Actions_ yang terhubung langsung ke database, mengeliminasi kebutuhan untuk menulis _boilerplate API Route_ terpisah.

### 3. AI Streaming & Generation Logic

Untuk memberikan _User Experience (UX)_ pengetikan dengan latensi rendah:

1. Client mengirimkan _prompt_ melalui _hook_ `useCompletion` dari Vercel AI SDK.
2. _API Route_ Next.js (`/api/generate`) mencegat _request_ tersebut dan merakit _system prompt_ yang sangat kontekstual.
3. _Request_ diteruskan ke **Google Gemini** untuk menghasilkan _text generation_ yang deterministik dan terstruktur.
4. _Response_ dipecah menjadi _chunk_ dan dialirkan kembali ke client menggunakan ekosistem _streaming_ bawaan Vercel AI SDK.
5. Komponen React kustom secara progresif merender _chunk_ Markdown tersebut, memberikan _feedback_ visual yang kontinu daripada menahan UI hingga proses _generation_ selesai.

### 4. Zero-Latency Navigation (HTML Streaming)

Navigasi antara tab _Generator_ dan _Document Library_ terasa instan. Hal ini dicapai dengan mengimplementasikan `loading.tsx` di sisi _page route_. Next.js secara otomatis membungkus rute tersebut dengan _boundary_ `<Suspense>`, lalu merender _Skeleton UI_ secara instan di client sementara _query_ Prisma berjalan di _background_. Setelah _resolved_, HTML yang sebenarnya akan di-_stream_ untuk menggantikan _skeleton_ tersebut.

### 5. Standalone HTML Export

Logika _export_ beroperasi murni di sisi _client-side_. Saat di-klik, sistem menggunakan `Blob API` untuk mem-_bundle_ hasil _generation_ dari `react-markdown` menjadi file `.html` statis yang siap diunduh, memungkinkan pengguna untuk langsung meng-_hosting_ _sales page_ mereka di mana saja.

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- Node.js 20+ (Direkomendasikan sesuai `@types/node` v20)
- Project Supabase (untuk PostgreSQL dan Auth)
- Google Gemini API Key

### Installation

1. **Clone repository ini:**
   \`\`\`bash
   git clone https://github.com/shynag/sales-ai.git
   cd sales-ai
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables:**
   Buat file `.env` di _root directory_ dan tambahkan _keys_ berikut:
   \`\`\`env
   DATABASE_URL="your-supabase-transaction-pooler-url"
   DIRECT_URL="your-supabase-session-url"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   \`\`\`

4. **Initialize Database:**
   _Push_ skema Prisma ke _instance_ Supabase dan jalankan _postinstall script_:
   \`\`\`bash
   npx prisma db push
   npm run postinstall
   \`\`\`

5. **Jalankan development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
