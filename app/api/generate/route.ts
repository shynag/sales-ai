import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      prompt: productName,
      description,
      features,
      audience,
      price,
    } = await req.json();

    const result = await streamText({
      // Fallback ke model paling universal di ekosistem Google v1beta
      model: google("gemini-2.5-flash-lite"),

      // Trik arsitektural: Satukan instruksi sistem ke dalam prompt utama
      // untuk mem-bypass error "not supported for generateContent"
      prompt: `Anda adalah Copywriter dan CRO expert kelas dunia.
Tugas Anda adalah membuat struktur Sales Page persuasif murni dalam Markdown.
Jangan tambahkan teks pengantar atau penutup.

Format wajib:
# [Headline Utama yang Memikat]
### [Sub-headline Spesifik]

**Overview:**
[Deskripsi persuasif]

**Key Benefits:**
- [Benefit 1]
- [Benefit 2]

**Core Features:**
- [Feature 1]
- [Feature 2]

**Social Proof:**
> "[Testimoni fiktif yang realistis]" - [Nama Fiktif]

**Investment / Pricing:**
[Harga: ${price}] - [Kalimat urgensi]

**[Call to Action Button]**

---
DATA PRODUK:
Nama: ${productName}
Deskripsi: ${description}
Fitur: ${features}
Target Audiens: ${audience}
Harga: ${price}
`,
    });

    // Valid sesuai dengan library 'ai' versi lu
    return result.toTextStreamResponse();
  } catch (error: unknown) {
    // Type Narrowing: Memastikan object error memiliki property message
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Memaksa error muncul di terminal backend
    console.error("🔥 Bencana AI SDK:", errorMessage);

    // Melempar response 500 ke client agar useCompletion bisa menangkapnya
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
