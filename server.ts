import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const CRISIS_KEYWORDS = [
  "อยากตาย", "ไม่อยากอยู่", "ไม่อยากอยู่แล้ว", "ฆ่าตัวตาย", "ทำร้ายตัวเอง",
  "เหนื่อยจนอยากหลับไปตลอด", "จบชีวิต", "กรีดข้อมือ", "โดดตึก",
  "กินยาตาย", "ไม่อยากตื่น", "อยู่ไปก็ไร้ค่า", "โลกนี้ไม่มีเราคงดีกว่า",
  "อยากหายไป", "ไม่ไหวแล้วลาก่อน", "ลาก่อนทุกคน", "ไม่อยากมีชีวิต"
];

function buildSystemPrompt(role: string, customSpec: string, comfortStyle: string): string {
  const roleRules: Record<string, { pronoun: string; particles: string; tone: string }> = {
    "แม่": {
      pronoun: "แทนตัวเองว่า 'แม่'",
      particles: "ลงท้ายด้วย 'ค่ะ / จ้ะ / นะลูก' เสมอ (ห้ามใช้ 'ครับ' เด็ดขาด 100%)",
      tone: "อบอุ่น อ่อนโยน โอบอุ้ม ไม่ด่วนสั่งสอน คอยปลอบโยนเหมือนแม่กอดลูก"
    },
    "พ่อ": {
      pronoun: "แทนตัวเองว่า 'พ่อ'",
      particles: "ลงท้ายด้วย 'ครับ / นะลูก' เสมอ",
      tone: "มั่นคง สุขุม อบอุ่น ให้ความรู้สึกปลอดภัย เป็นที่พึ่งทางใจ"
    },
    "เพื่อนสนิท": {
      pronoun: "แทนตัวเองว่า 'เรา'",
      particles: "ลงท้ายด้วย 'นะแก / นะ / ว่ะ' อย่างสนิทสนมเป็นกันเอง ('แก'/'เรา')",
      tone: "เพื่อนแท้ที่อยู่ข้างๆ เสมอ รับฟังทุกเรื่องโดยไม่ตัดสิน ไม่ใช้ภาษาทางการ"
    },
    "ย่า/ยาย": {
      pronoun: "แทนตัวเองว่า 'ยาย' หรือ 'ย่า'",
      particles: "ลงท้ายด้วย 'จ้ะ / นะลูก / นะหลาน'",
      tone: "เปี่ยมเมตตา ลูบหัวปลอบโยน ให้ความรู้สึกปลอดภัย"
    },
    "ตา/ปู่": {
      pronoun: "แทนตัวเองว่า 'ตา' หรือ 'ปู่'",
      particles: "ลงท้ายด้วย 'ครับ / นะหลาน'",
      tone: "ใจเย็น รับฟังอย่างลึกซึ้ง ให้ความสงบและมั่นคง"
    },
    "พี่/น้อง": {
      pronoun: "แทนตัวเองว่า 'พี่' หรือ 'เรา'",
      particles: "ลงท้ายด้วย 'นะ / แก / พี่อยู่ตรงนี้'",
      tone: "คนรุ่นเดียวกัน เข้าใจความเหนื่อยล้าของชีวิตยุคนี้อย่างแท้จริง"
    }
  };

  const selectedRule = roleRules[role] || roleRules["เพื่อนสนิท"];

  return `
[MISSION & ROLEPLAY IDENTITY]
คุณกำลังสวมบทบาทเป็น '${role}' ในแอปพลิเคชัน HeartHeal AI: Personalized Companion & Safe Space
สรรพนามประจำตัว: ${selectedRule.pronoun}
คำลงท้ายที่ต้องใช้เคร่งครัด: ${selectedRule.particles}
โทนเสียง: ${selectedRule.tone}
โหมดการปลอบประโลม (Comfort Style): ${comfortStyle}
สเปกเพิ่มเติม: ${customSpec || "รับฟังอย่างจริงใจ เข้าอกเข้าใจ ไม่ตัดสิน"}

[CRITICAL CONVERSATIONAL RULES - ZERO ROBOTIC TEMPLATES]
1. ห้ามใช้คำขึ้นต้นซ้ำซากสำเร็จรูป เช่น 'ลูกจ้า แม่ฟังอยู่นะคนเก่ง...' หรือ 'สวัสดีครับ' ซ้ำๆ
2. เข้าสู่การตอบรับและสะท้อนอารมณ์ตามเรื่องที่ผู้ใช้พิมพ์มาโดยตรงทันที (เช่น เพิ่งอกหัก, เหนื่อยงาน, นอนไม่หลับ, ปัญหาชีวิต)
3. ตรวจจับคำลงท้ายและสรรพนามของผู้ใช้ (เช่น ถ้าผู้ใช้พูด 'หนู / ค่ะ' ให้ตอบรับอย่างเข้ากัน)
4. ห้ามหลุดบทบาท ห้ามพูดว่า 'ในฐานะ AI' หรือ 'ฉันเป็นโมเดลภาษา'
5. ห้ามวินิจฉัยโรคทางการแพทย์ หากตรวจพบความคิดทำร้ายตัวเอง แนะนำโทร 1323 ทันทีด้วยความห่วงใย
`.trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, role, customSpec, comfortStyle, history = [] } = req.body;
      const userText = (message || "").trim();

      // Crisis Guardrail Check
      const lower = userText.toLowerCase();
      const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));

      const ai = getAI();
      if (!ai) {
        // Fallback flag for client-side local engine
        return res.json({
          fallback: true,
          isCrisis,
          note: "Gemini API key not configured, local persona engine will handle this."
        });
      }

      const systemInstruction = buildSystemPrompt(role, customSpec, comfortStyle);

      // Build contents from last 10 messages for low latency
      const recentHistory = (history || []).slice(-10);
      const contents = recentHistory.map((item: { role: string; content: string }) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }]
      }));

      contents.push({
        role: "user",
        parts: [{ text: userText }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.85
        }
      });

      const text = response.text || "";
      res.json({
        success: true,
        text,
        isCrisis
      });
    } catch (err: any) {
      console.error("Gemini API error:", err?.message || err);
      res.status(500).json({
        error: err?.message || "Failed to generate response",
        fallback: true
      });
    }
  });

  // Vite middleware in dev or static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HeartHeal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
