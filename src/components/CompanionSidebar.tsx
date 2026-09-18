import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Terminal, Wind, Play, Pause, CalendarHeart, Music2, Volume2 } from 'lucide-react';
import { PersonaRole, ComfortStyle, ComfortStyleId } from '../types';
import { PERSONA_ROLES, COMFORT_STYLES, GROUNDING_STEPS } from '../data/personaData';
import { soundscapePlayer } from '../utils/audioSynthesizer';

interface CompanionSidebarProps {
  currentRole: PersonaRole;
  onSelectRole: (role: PersonaRole) => void;
  customSpec: string;
  onChangeCustomSpec: (spec: string) => void;
  comfortStyle: ComfortStyleId;
  onChangeComfortStyle: (styleId: ComfortStyleId) => void;
  todayMoodEmoji: string;
  onUpdateMood: (emoji: string, label: string) => void;
}

export const CompanionSidebar: React.FC<CompanionSidebarProps> = ({
  currentRole,
  onSelectRole,
  customSpec,
  onChangeCustomSpec,
  comfortStyle,
  onChangeComfortStyle,
  todayMoodEmoji,
  onUpdateMood
}) => {
  // Grounding Tool Tab state
  const [activeGroundingTab, setActiveGroundingTab] = useState<'breathing' | 'grounding'>('breathing');

  // Box Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhaseIdx, setBreathPhaseIdx] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);

  const breathPhases = [
    { text: "หายใจเข้า...", dur: 4, cssClass: "inhale", tip: "สูดลมหายใจเข้าช้าๆ ให้ท้องขยายตัว ผ่อนคลายหัวไหล่" },
    { text: "กลั้นหายใจ...", dur: 4, cssClass: "hold-in", tip: "กลั้นไว้นิ่งๆ สบายๆ ไม่เกร็งกล้ามเนื้อ สัมผัสความนิ่ง" },
    { text: "หายใจออก...", dur: 4, cssClass: "exhale", tip: "ค่อยๆ ผ่อนลมหายใจออกทางปากช้าๆ ปล่อยความตึงเครียด" },
    { text: "พักนิ่ง...", dur: 4, cssClass: "hold-out", tip: "พักใจนิ่งๆ สัมผัสความเบาสบาย คืนสมดุลให้ร่างกาย" }
  ];

  useEffect(() => {
    let timer: any = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            setBreathPhaseIdx((pIdx) => (pIdx + 1) % breathPhases.length);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathSecondsLeft(4);
      setBreathPhaseIdx(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive]);

  // 5-4-3-2-1 Grounding state
  const [groundingStepIdx, setGroundingStepIdx] = useState(0);

  // Soundscape state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleSoundscape = () => {
    if (isMusicPlaying) {
      soundscapePlayer.stop();
      setIsMusicPlaying(false);
    } else {
      soundscapePlayer.start();
      setIsMusicPlaying(true);
    }
  };

  const selectedComfort = COMFORT_STYLES.find((s) => s.id === comfortStyle) || COMFORT_STYLES[0];
  const currentGrounding = GROUNDING_STEPS[groundingStepIdx];

  return (
    <aside id="companion-sidebar-panel" className="lg:col-span-4 xl:col-span-3.5 flex flex-col gap-4">
      {/* 1. Companion Persona Settings Card */}
      <div
        id="card-companion-settings"
        className="card-glass rounded-2xl p-4 shadow-sm border border-orange-100/90 flex flex-col gap-3.5"
      >
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h2 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#f86f3f]" />
            <span>COMPANION PERSONA SETTINGS</span>
          </h2>
          <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-mono">
            st.sidebar
          </span>
        </div>

        {/* Role Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-700">1. ผู้ร่วมเดินทางใจดี (Role):</span>
            <span id="display-selected-role-label" className="font-bold text-[#e54e1e] flex items-center gap-1">
              {currentRole.emoji} {currentRole.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {PERSONA_ROLES.map((role) => {
              const isSelected = currentRole.id === role.id;
              return (
                <button
                  key={role.id}
                  id={`role-btn-${role.id}`}
                  type="button"
                  onClick={() => onSelectRole(role)}
                  className={`p-2.5 rounded-xl font-medium text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#ff956b] bg-orange-50/90 text-[#e54e1e] shadow-2xs'
                      : 'border border-stone-200 bg-white text-stone-700 hover:border-orange-300'
                  }`}
                >
                  <span className="text-xl">{role.emoji}</span>
                  <span className="text-[11px] font-semibold">{role.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Persona Spec */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Custom Persona Specification:</span>
            </span>
          </div>
          <textarea
            id="input-custom-persona-spec"
            rows={2}
            value={customSpec}
            onChange={(e) => onChangeCustomSpec(e.target.value)}
            placeholder="เช่น 'เพื่อนสนิทที่คอยรับฟัง ไม่รีบตัดสิน พูดตรงประเด็น โอบกอดด้วยความอบอุ่นและจริงใจ'"
            className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#f86f3f] focus:border-transparent text-stone-700 leading-relaxed"
          />
          <p className="text-[10px] text-stone-400">
            ระบบจะนำ Role + ไวยากรณ์เพศสภาพ + สเปกนี้ ไปประกอบเข้ากับบทสนทนาแบบเรียลไทม์
          </p>
        </div>

        {/* Comfort Style */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-700">2. โหมดการปลอบ (Comfort Style):</span>
            <span id="display-selected-style-label" className="font-bold text-[#e54e1e]">
              {selectedComfort.name}
            </span>
          </div>
          <select
            id="select-comfort-style"
            value={comfortStyle}
            onChange={(e) => onChangeComfortStyle(e.target.value as ComfortStyleId)}
            className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#f86f3f] text-stone-700 cursor-pointer"
          >
            {COMFORT_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.description}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Persona & Gender Rules Card */}
        <div
          id="card-dynamic-persona-preview"
          className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] space-y-1"
        >
          <div className="flex items-center justify-between text-amber-900 font-semibold">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              <span>Dynamic Persona &amp; Gender Rules</span>
            </span>
            <span className="text-[9px] font-mono bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-bold">
              100% Strict Role
            </span>
          </div>
          <p
            id="prompt-preview-snippet"
            className="font-mono text-[10px] text-stone-700 leading-relaxed max-h-20 overflow-y-auto pr-1 bg-white/60 p-1.5 rounded-lg border border-amber-100"
          >
            "บทบาท: {currentRole.emoji} {currentRole.name} • โทน: {currentRole.tone} • สไตล์: {selectedComfort.name} • {currentRole.genderRuleSummary} • ไม่ขึ้นต้นด้วยประโยคสำเร็จรูป • เข้าประเด็นทันทีด้วยความเข้าใจแท้จริง"
          </p>
          <div className="flex items-center justify-between text-[9px] text-amber-800 pt-1 font-mono">
            <span>⚡ Sliding Window Context: 10 Messages</span>
            <span className="text-emerald-700 font-semibold">Latency: ~18ms</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Tool Grounding Widget */}
      <div
        id="card-grounding-tools"
        className="card-glass rounded-2xl p-4 shadow-sm border border-emerald-100/90 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl text-[11px] font-medium">
            <button
              id="tab-btn-box-breathing"
              type="button"
              onClick={() => setActiveGroundingTab('breathing')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeGroundingTab === 'breathing'
                  ? 'bg-white shadow-2xs text-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              💨 Box Breathing
            </button>
            <button
              id="tab-btn-grounding-54321"
              type="button"
              onClick={() => setActiveGroundingTab('grounding')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeGroundingTab === 'grounding'
                  ? 'bg-white shadow-2xs text-emerald-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🖐️ 5-4-3-2-1 สติ
            </button>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Grounding Tool
          </span>
        </div>

        {/* View A: Box Breathing */}
        {activeGroundingTab === 'breathing' ? (
          <div id="grounding-view-breathing" className="flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>หายใจช้าๆ ผ่อนคลายประสาท</span>
              </span>
              <button
                id="btn-toggle-breathing"
                type="button"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                  isBreathingActive
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {isBreathingActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isBreathingActive ? 'หยุดชั่วคราว' : 'เริ่มฝึกหายใจ'}</span>
              </button>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center my-1">
              <div
                id="breathing-halo-glow"
                className={`absolute inset-2 rounded-full bg-emerald-100/60 filter blur-md transition-all duration-1000 ${
                  isBreathingActive ? 'scale-110 opacity-90' : 'scale-90 opacity-40'
                }`}
              />
              <div
                id="breathing-interactive-circle"
                className={`breathing-box w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 shadow-md shadow-emerald-400/20 flex flex-col items-center justify-center text-white z-10 select-none ${
                  isBreathingActive ? breathPhases[breathPhaseIdx].cssClass : ''
                }`}
              >
                <span id="breath-phase-label" className="text-xs font-bold tracking-wide">
                  {isBreathingActive ? breathPhases[breathPhaseIdx].text : 'เตรียมพร้อม'}
                </span>
                <span id="breath-seconds-counter" className="text-[10px] opacity-90 font-mono">
                  {isBreathingActive ? `${breathSecondsLeft} วินาที` : '4 วินาที'}
                </span>
              </div>
            </div>

            <p id="breathing-guidance-tip" className="text-[11px] text-stone-500">
              {isBreathingActive
                ? breathPhases[breathPhaseIdx].tip
                : 'มองวงกลมขยายตัวแล้วสูดลมหายใจเข้าช้าๆ เพื่อคืนความสงบให้ระบบประสาท'}
            </p>
          </div>
        ) : (
          /* View B: 5-4-3-2-1 Grounding */
          <div id="grounding-view-54321" className="flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span>🖐️ เทคนิคดึงสติสู่ปัจจุบัน (5-4-3-2-1)</span>
              </span>
              <span
                id="grounding-step-badge"
                className="text-[10px] font-semibold text-[#e54e1e] bg-orange-50 px-2 py-0.5 rounded-full"
              >
                {currentGrounding.badge}
              </span>
            </div>

            <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/80 flex flex-col gap-1.5">
              <div id="grounding-current-title" className="flex items-center gap-2 font-bold text-xs text-[#e54e1e]">
                {currentGrounding.title}
              </div>
              <p id="grounding-current-description" className="text-[11px] text-stone-600 leading-relaxed">
                {currentGrounding.desc}
              </p>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-stone-200">
                <button
                  id="btn-grounding-prev"
                  type="button"
                  onClick={() =>
                    setGroundingStepIdx((prev) => (prev - 1 + GROUNDING_STEPS.length) % GROUNDING_STEPS.length)
                  }
                  className="text-[10px] text-stone-500 hover:text-stone-800 px-2 py-1 rounded bg-white border border-stone-200 cursor-pointer"
                >
                  ย้อนกลับ
                </button>
                <button
                  id="btn-grounding-next"
                  type="button"
                  onClick={() => setGroundingStepIdx((prev) => (prev + 1) % GROUNDING_STEPS.length)}
                  className="text-[10px] text-white px-3 py-1 rounded bg-[#f86f3f] hover:bg-[#e54e1e] transition font-medium cursor-pointer"
                >
                  เสร็จแล้ว ข้อถัดไป ➔
                </button>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 text-center">
              ช่วยดึงความคิดที่ฟุ้งซ่านหรือวิตกกังวลให้กลับมาอยู่ที่ผัสสะทางกาย
            </p>
          </div>
        )}
      </div>

      {/* 3. Daily Mood Calendar */}
      <div
        id="card-daily-mood-calendar"
        className="card-glass rounded-2xl p-3.5 shadow-sm border border-orange-100/90 flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
          <span className="flex items-center gap-1.5">
            <CalendarHeart className="w-4 h-4 text-[#f86f3f]" />
            <span>บันทึกอารมณ์รายวัน (Mood Calendar)</span>
          </span>
          <span
            id="badge-today-mood-tag"
            className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-medium"
          >
            วันนี้: {todayMoodEmoji === '🌧️' ? 'เหนื่อยล้า 🌧️' : todayMoodEmoji === '😊' ? 'ผ่อนคลาย 😊' : todayMoodEmoji === '🌿' ? 'มีพลังใจ 🌿' : 'ปานกลาง 😐'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">จ.</span>
            <span className="text-xs">😊</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">อ.</span>
            <span className="text-xs">🌿</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">พ.</span>
            <span className="text-xs">😐</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">พฤ.</span>
            <span className="text-xs">😊</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">ศ.</span>
            <span className="text-xs">🌧️</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-stone-50 rounded-lg">
            <span className="text-stone-400">ส.</span>
            <span className="text-xs">🌿</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1 bg-orange-50 border border-orange-300 rounded-lg font-bold">
            <span className="text-[#e54e1e]">อา.</span>
            <span id="calendar-today-emoji" className="text-xs">
              {todayMoodEmoji}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-stone-500 text-[10px]">อัปเดตอารมณ์:</span>
          <div className="flex items-center gap-1">
            <button
              id="btn-mood-happy"
              type="button"
              onClick={() => onUpdateMood('😊', 'ผ่อนคลาย 😊')}
              className="px-2 py-0.5 rounded-md hover:bg-stone-100 transition border border-stone-200 cursor-pointer text-xs"
            >
              😊
            </button>
            <button
              id="btn-mood-neutral"
              type="button"
              onClick={() => onUpdateMood('😐', 'ปานกลาง 😐')}
              className="px-2 py-0.5 rounded-md hover:bg-stone-100 transition border border-stone-200 cursor-pointer text-xs"
            >
              😐
            </button>
            <button
              id="btn-mood-tired"
              type="button"
              onClick={() => onUpdateMood('🌧️', 'เหนื่อยล้า 🌧️')}
              className="px-2 py-0.5 rounded-md hover:bg-stone-100 transition border border-stone-200 cursor-pointer text-xs"
            >
              🌧️
            </button>
            <button
              id="btn-mood-refreshed"
              type="button"
              onClick={() => onUpdateMood('🌿', 'มีพลังใจ 🌿')}
              className="px-2 py-0.5 rounded-md hover:bg-stone-100 transition border border-stone-200 cursor-pointer text-xs"
            >
              🌿
            </button>
          </div>
        </div>
      </div>

      {/* 4. Soundscape Widget */}
      <div
        id="card-calm-soundscape"
        className="card-glass rounded-2xl p-3.5 shadow-sm border border-orange-100/90 flex flex-col gap-2"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Music2 className="w-4 h-4 text-[#f86f3f]" />
            <span>ดนตรีบำบัดใจ (Calm Soundscape)</span>
          </span>
          <span
            id="badge-soundscape-tag"
            className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
              isMusicPlaying ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-[#e54e1e]'
            }`}
          >
            {isMusicPlaying ? 'กำลังเล่นดนตรีผ่อนคลาย 🎵' : 'ลดความวิตกกังวล'}
          </span>
        </div>

        <div className="bg-amber-50/70 rounded-xl p-2.5 flex items-center justify-between border border-amber-200/60 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div
              id="soundscape-visual-box"
              className="w-8 h-8 rounded-lg bg-orange-200/80 text-[#e54e1e] flex items-center justify-center shrink-0 relative overflow-hidden"
            >
              {isMusicPlaying ? (
                <div id="soundscape-animated-bars" className="flex items-end justify-center gap-0.5 h-4 w-5">
                  <span className="w-1 bg-[#e54e1e] rounded-full eq-bar-1" />
                  <span className="w-1 bg-[#e54e1e] rounded-full eq-bar-2" />
                  <span className="w-1 bg-[#e54e1e] rounded-full eq-bar-3" />
                  <span className="w-1 bg-[#e54e1e] rounded-full eq-bar-4" />
                </div>
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </div>
            <div className="truncate">
              <div className="font-bold text-stone-800 text-xs truncate">Marconi Union - Weightless</div>
              <div className="text-[10px] text-stone-500">แอมเบียนต์ช่วยลดอัตราการเต้นของหัวใจ</div>
            </div>
          </div>
          <button
            id="btn-play-pause-soundscape"
            type="button"
            onClick={toggleSoundscape}
            className={`shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-sm transition cursor-pointer ${
              isMusicPlaying ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#f86f3f] hover:bg-[#e54e1e]'
            }`}
          >
            {isMusicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
