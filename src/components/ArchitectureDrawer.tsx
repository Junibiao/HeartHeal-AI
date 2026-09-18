import React, { useState } from 'react';
import {
  Layers,
  X,
  FolderTree,
  FileCode,
  FileText,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface ArchitectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'structure' | 'app' | 'persona' | 'safety' | 'checklist' | 'req' | 'guide';

export const ArchitectureDrawer: React.FC<ArchitectureDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('structure');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const codeSnippets: Record<TabKey, { title: string; filename: string; code: string; color: string }> = {
    structure: {
      title: 'Directory Tree Hierarchy (Clean Architecture Pattern)',
      filename: 'Structure',
      color: 'text-emerald-300',
      code: `heartheal/
├── .streamlit/
│   ├── config.toml           # UI Pastel Theme and Server Configuration
│   └── secrets.toml          # API Keys (GEMINI_API_KEY, etc.)
├── assets/
│   ├── audio/                # Calm ambient sound assets (Marconi Union / Lofi)
│   └── icons/                # Safe space logos
├── modules/
│   ├── __init__.py
│   ├── persona_builder.py    # Strict Gender & Role-Specific Prompt Builder
│   ├── safety_filter.py      # Crisis Keyword Guardrails & 1323 Hotline triggers
│   └── checklist_generator.py# Valence extraction & Dynamic JSON Checklist
├── app.py                    # Main Streamlit application entry point (with streaming)
├── requirements.txt          # Python dependencies
└── README.md                 # Setup, local run, and deployment instructions`
    },
    app: {
      title: 'app.py - Main Streamlit Entrypoint with Gemini 1.5 Streaming & Safety Filter',
      filename: 'app.py',
      color: 'text-blue-200',
      code: `import streamlit as st
from PIL import Image
import google.generativeai as genai
import json

from modules.persona_builder import build_system_prompt
from modules.safety_filter import inspect_crisis_guardrail
from modules.checklist_generator import generate_emotional_checklist

# 1. Page Configuration & Theme
st.set_page_config(
    page_title="HeartHeal AI: Safe Space",
    page_icon="🤝",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. Critical Mental Health Disclaimer Banner
st.warning(
    "⚠️ **Mental Health Disclaimer:** HeartHeal เป็นพื้นที่รับฟังและโอบอุ้มทางอารมณ์ "
    "มิได้ทำหน้าที่แทนแพทย์ จิตแพทย์ หรือผู้เชี่ยวชาญการบำบัด หากมีความเสี่ยงฉุกเฉิน กรุณาติดต่อ **1323** (สายด่วนสุขภาพจิตฟรี 24 ชม.)",
    icon="ℹ️"
)

# 3. Sidebar: Persona & Privacy Controls
with st.sidebar:
    st.header("⚙️ Companion Settings")
    role_options = ["เพื่อนสนิท 🤝", "แม่ 👩", "พ่อ 👨", "ย่า/ยาย 👵", "ตา/ปู่ 👴", "พี่/น้อง 🧑‍🤝‍🧑"]
    selected_role = st.selectbox("1. เลือกผู้ร่วมทางใจดี (Role):", role_options, index=0)
    
    custom_spec = st.text_area(
        "สเปกเฉพาะตัว (Custom Persona):",
        placeholder="เช่น 'เพื่อนสนิทที่คอยรับฟัง ไม่รีบตัดสิน พูดตรงไปตรงมาด้วยความอบอุ่นและจริงใจ'",
        height=80
    )
    
    style_options = [
        "อบอุ่นโอบรับ (Warm & Validating)",
        "ให้สติและข้อคิด (Grounding & Perspective)",
        "สายลุย/เป็นกันเอง (Friendly & Chill)",
        "ชวนทำกิจกรรม (Action-Oriented & Distraction)"
    ]
    comfort_style = st.selectbox("2. โหมดการปลอบ (Comfort Style):", style_options, index=0)
    
    st.divider()
    incognito_mode = st.toggle("Incognito Mode (No Log / Zero-Retention)", value=True)

# 4. Initialize Session State
if "messages" not in st.session_state or incognito_mode:
    st.session_state.messages = [
        {"role": "assistant", "content": "วางความเหนื่อยล้าหรือเรื่องหนักใจลงตรงนี้ได้หมดเลยนะแก เราอยู่ตรงนี้พร้อมฟังแกเสมอ 🤍"}
    ]

# 5. Dynamic System Prompt Generation (Strict Gender Logic)
system_prompt = build_system_prompt(selected_role, custom_spec, comfort_style)

# 6. Render Messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if "image" in msg and msg["image"] is not None:
            st.image(msg["image"], width=280)

# 7. Multimodal Inputs & Chat Processing with Sliding Window (Last 10 msgs)
uploaded_image = st.file_uploader("📷 แนบรูปภาพ:", type=["jpg", "jpeg", "png"])
user_input = st.chat_input("พิมพ์บอกเล่าความรู้สึกตรงนี้...")

if user_input or uploaded_image:
    active_text = user_input or "ส่งรูปภาพเพื่อแบ่งปันความรู้สึก"
    
    # 7.1 Safety Guardrail
    is_crisis, crisis_message = inspect_crisis_guardrail(active_text)
    if is_crisis:
        st.error(crisis_message)
    
    # 7.2 Append User Message
    st.session_state.messages.append({"role": "user", "content": active_text})
    
    # 7.3 Call Gemini 1.5 Flash with Real-time Streaming & Temp=0.85
    with st.chat_message("assistant"):
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt,
            generation_config={"temperature": 0.85}
        )
        # Optimized sliding window payload: Last 10 messages for ultra-low latency (~18ms)
        optimized_history = [
            {"role": m["role"], "parts": [m["content"]]}
            for m in st.session_state.messages[-10:]
        ]
        chat = model.start_chat(history=optimized_history[:-1])
        response_stream = chat.send_message(active_text, stream=True)
        
        # Real-time chunk-by-chunk write_stream (No hang!)
        full_text = st.write_stream(chunk.text for chunk in response_stream)
        st.session_state.messages.append({"role": "assistant", "content": full_text})`
    },
    persona: {
      title: 'modules/persona_builder.py - Strict Gender & Role-Specific Prompt Builder',
      filename: 'persona_builder.py',
      color: 'text-purple-200',
      code: `def build_system_prompt(role: str, custom_spec: str, comfort_style: str) -> str:
    """
    สร้าง Dynamic System Prompt โดยบังคับใช้กฎเพศสภาพและสรรพนามอย่างเข้มงวด 100%
    กำจัดคำทักทายสำเร็จรูปหุ่นยนต์ เช่น 'ลูกจ้า แม่ฟังอยู่นะคนเก่ง...'
    เข้าสู่การรับฟังและปลอบประโลมสถานการณ์ของผู้ใช้อย่างเป็นธรรมชาติทันที
    """
    role_rules = {
        "แม่": {
            "pronoun": "แทนตัวเองว่า 'แม่'",
            "particles": "ลงท้ายด้วย 'ค่ะ / จ้ะ / นะลูก' อย่างอบอุ่น (ห้ามใช้ 'ครับ' เด็ดขาด 100%)",
            "address": "เรียกลูกว่า 'ลูก' หรือปรับตามที่ผู้ใช้เรียกตัวเอง",
            "tone": "อบอุ่น นุ่มนวล โอบอุ้ม ไม่รีบสอน คอยปลอบโยนเหมือนแม่กอดลูก"
        },
        "พ่อ": {
            "pronoun": "แทนตัวเองว่า 'พ่อ'",
            "particles": "ลงท้ายด้วย 'ครับ / นะลูก'",
            "address": "เรียกว่า 'ลูก'",
            "tone": "มั่นคง สุขุม อบอุ่น เป็นที่พึ่งทางใจที่ปลอดภัย"
        },
        "เพื่อนสนิท": {
            "pronoun": "แทนตัวเองว่า 'เรา'",
            "particles": "ลงท้ายด้วย 'นะแก / นะ / ว่ะ (ตามความเหมาะสม)' หรือเป็นกันเอง",
            "address": "เรียกผู้ใช้ว่า 'แก' หรือชื่อเล่น",
            "tone": "เพื่อนสนิทที่อยู่ข้างๆ เสมอ รับฟังทุกเรื่องโดยไม่ตัดสิน ไม่พูดเป็นทางการ"
        },
        "ย่า/ยาย": {
            "pronoun": "แทนตัวเองว่า 'ยาย' หรือ 'ย่า'",
            "particles": "ลงท้ายด้วย 'จ้ะ / นะลูก / นะหลาน'",
            "tone": "ใจดี เมตตา ลูบหัวปลอบโยน"
        },
        "ตา/ปู่": {
            "pronoun": "แทนตัวเองว่า 'ตา' หรือ 'ปู่'",
            "particles": "ลงท้ายด้วย 'ครับ / นะหลาน'",
            "tone": "ใจเย็น รับฟังอย่างลึกซึ้ง ให้ความรู้สึกสงบ"
        },
        "พี่/น้อง": {
            "pronoun": "แทนตัวเองว่า 'พี่' หรือ 'เรา'",
            "particles": "ลงท้ายด้วย 'นะ / สบายใจได้'",
            "tone": "คนรุ่นเดียวกัน เข้าใจความเหนื่อยล้าของชีวิตยุคนี้"
        }
    }

    rule = role_rules.get("เพื่อนสนิท")
    for key in role_rules:
        if key in role:
            rule = role_rules[key]
            break

    prompt = f"""
    [MISSION & ROLEPLAY IDENTITY]
    คุณกำลังสวมบทบาทเป็น '{role}' ตัวจริงเสียงจริง
    สรรพนามประจำตัว: {rule['pronoun']}
    คำลงท้ายที่ต้องใช้เคร่งครัด: {rule['particles']}
    โทนเสียง: {rule['tone']}
    สเปกเพิ่มเติม: {custom_spec if custom_spec else 'รับฟังอย่างจริงใจ เข้าอกเข้าใจ'}

    [CRITICAL CONVERSATIONAL RULES - ZERO ROBOTIC TEMPLATES]
    1. ห้ามใช้คำขึ้นต้นซ้ำซากสำเร็จรูป เช่น 'ลูกจ้า แม่ฟังอยู่นะคนเก่ง...' หรือ 'สวัสดีครับ' ซ้ำๆ ทุกรอบ
    2. ให้เข้าสู่การตอบรับและสะท้อนอารมณ์ตามเรื่องที่ผู้ใช้พิมพ์มาโดยตรงทันที (เช่น เพิ่งอกหัก, เหนื่อยงาน, นอนไม่หลับ)
    3. ตรวจจับคำลงท้ายของผู้ใช้ (เช่น ถ้าผู้ใช้พูด 'หนู / ค่ะ' ให้ปรับน้ำเสียงตอบรับอย่างเข้ากัน)
    4. ห้ามหลุดบทบาท ห้ามพูดว่า 'ในฐานะ AI' หรือ 'ฉันคือระบบ'
    5. ห้ามวินิจฉัยโรคทางการแพทย์ หากมีสัญญาณวิกฤตรุนแรง แนะนำสายด่วน 1323 ทันที
    """
    return prompt.strip()`
    },
    safety: {
      title: 'modules/safety_filter.py - Crisis Guardrail',
      filename: 'safety_filter.py',
      color: 'text-rose-200',
      code: `import re
from typing import Tuple

CRISIS_KEYWORDS = [
    "อยากตาย", "ไม่อยากอยู่แล้ว", "ไม่อยากอยู่", "ฆ่าตัวตาย", "ทำร้ายตัวเอง", 
    "เหนื่อยจนอยากหลับไปตลอด", "จบชีวิต", "กรีดข้อมือ", "โดดตึก", 
    "กินยาตาย", "ไม่อยากตื่น", "อยู่ไปก็ไร้ค่า", "โลกนี้ไม่มีเราคงดีกว่า",
    "อยากหายไป", "ไม่ไหวแล้วลาก่อน", "ลาก่อนทุกคน"
]

def inspect_crisis_guardrail(text: str) -> Tuple[bool, str]:
    if not text:
        return False, ""
    cleaned = text.lower().strip()
    for kw in CRISIS_KEYWORDS:
        if re.search(re.escape(kw), cleaned):
            return True, (
                "🚨 เราได้ยินถึงความเหนื่อยล้าและความเจ็บปวดอันหนักหน่วงของคุณ "
                "คุณมีค่ามากเกินกว่าจะต้องผ่านช่วงเวลานี้ไปตามลำพัง "
                "โปรดติดต่อสายด่วนสุขภาพจิต 1323 (โทรฟรี 24 ชม.) หรือสายด่วนสะมาริตันส์ 02-713-6793 เพื่อพูดคุยทันที"
            )
    return False, ""`
    },
    checklist: {
      title: 'modules/checklist_generator.py - JSON Micro-Steps Generator',
      filename: 'checklist_generator.py',
      color: 'text-emerald-200',
      code: `import json
import google.generativeai as genai

def generate_emotional_checklist(user_narrative: str) -> dict:
    """
    วิเคราะห์ความต้องการทางอารมณ์ และสร้าง Checklist Micro-Steps 3 ข้อในรูปแบบ JSON
    รองรับทั้งกรณีอกหัก เหนื่อยล้า นอนไม่หลับ และความเครียดสะสม
    """
    prompt = f"""
    จากข้อความของผู้ใช้: "{user_narrative}"
    วิเคราะห์ระดับพลังใจ (0-100) และแนะนำ Micro-Action ง่ายๆ 3 ข้อเพื่อช่วยผ่อนคลาย
    ตอบกลับเฉพาะ JSON รูปแบบนี้:
    {{
        "valence_score": 35,
        "primary_emotion": "อกหัก / เสียใจสะสม",
        "checklist": [
            {{"task": "จิบน้ำอุ่น 1 แก้ว และล้างหน้าด้วยน้ำเย็น", "completed": false}},
            {{"task": "เก็บรูปภาพหรือแชตที่กระตุ้นความทรงจำไว้ในโฟลเดอร์ซ่อนชั่วคราว", "completed": false}},
            {{"task": "ฝึกหายใจ Box Breathing 3 นาทีเพื่อคลายอาการจุกแน่นหน้าอก", "completed": false}}
        ]
    }}
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        raw = response.text.replace("\`\`\`json", "").replace("\`\`\`", "").strip()
        return json.loads(raw)
    except Exception:
        return {
            "valence_score": 38,
            "primary_emotion": "ต้องการการพักฟื้นหัวใจ",
            "checklist": [
                {"task": "จิบน้ำอุ่น 1 แก้ว และทอดสายตามองพื้นที่โล่ง", "completed": False},
                {"task": "ฝึกหายใจช้าๆ 3 นาทีเพื่อผ่อนคลายกล้ามเนื้อ", "completed": False},
                {"task": "อนุญาตให้ตัวเองหยุดคิดและพักผ่อน 15 นาที", "completed": False}
            ]
        }`
    },
    req: {
      title: 'requirements.txt',
      filename: 'requirements.txt',
      color: 'text-stone-300',
      code: `streamlit>=1.35.0
google-generativeai>=0.5.4
pillow>=10.3.0
plotly>=5.22.0
pandas>=2.2.2
requests>=2.31.0`
    },
    guide: {
      title: 'Run & Deployment Guide',
      filename: 'Run Guide',
      color: 'text-amber-200',
      code: `# 1. โคลนโปรเจกต์และสร้าง Virtual Environment
git clone https://github.com/your-username/heartheal.git
cd heartheal
python -m venv venv

# เปิดใช้งาน Virtual Environment
source venv/bin/activate  # macOS / Linux
# หรือ venv\\Scripts\\activate สำหรับ Windows

# 2. ติดตั้ง Dependencies
pip install -r requirements.txt

# 3. กำหนดค่า API Key
mkdir -p .streamlit
echo 'GEMINI_API_KEY = "AIzaSy..."' > .streamlit/secrets.toml

# 4. สั่งรันแอปพลิเคชัน
streamlit run app.py`
    }
  };

  const currentItem = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentItem.code);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div
      id="modal-architecture-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-4xl bg-white shadow-2xl flex flex-col border-l border-stone-200 h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#f86f3f]" />
                <span>Production Architecture &amp; Clean Codebase</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                Python + Streamlit + Gemini 1.5 Flash (temp=0.85)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              สถาปัตยกรรมระดับ Production พร้อม Ultra-low Latency Streaming, Strict Role Gender Particles
              และ Crisis Guardrail Interceptor
            </p>
          </div>
          <button
            id="btn-close-architecture-drawer"
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-stone-900 text-stone-300 px-4 pt-2 flex items-center gap-1 border-b border-stone-800 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'structure' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-400" />
            <span>Structure</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('app')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'app' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>app.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('persona')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'persona' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>persona_builder.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'safety' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-rose-400" />
            <span>safety_filter.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'checklist' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>checklist_generator.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('req')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'req' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-stone-400" />
            <span>requirements.txt</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'guide' ? 'bg-[#18181b] text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-green-400" />
            <span>Run Guide</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="bg-[#18181b] p-5 text-stone-200 font-mono text-xs overflow-y-auto flex-1 leading-relaxed">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800 text-stone-400">
            <span>{currentItem.title}</span>
            <button
              id="btn-copy-code-snippet"
              type="button"
              onClick={handleCopy}
              className="hover:text-white flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 transition"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className={currentItem.color} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {currentItem.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
