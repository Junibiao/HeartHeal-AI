import React from 'react';
import { PhoneCall, ShieldCheck, ShieldAlert, Code2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentRoleEmoji: string;
  isIncognito: boolean;
  onToggleIncognito: (checked: boolean) => void;
  onTriggerCrisisDemo: () => void;
  onQuickEscape: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoleEmoji,
  isIncognito,
  onToggleIncognito,
  onTriggerCrisisDemo,
  onQuickEscape,
  onOpenArchitecture
}) => {
  return (
    <div className="w-full flex flex-col sticky top-0 z-40">
      {/* 1. Top Mental Health Disclaimer */}
      <div
        id="mental-health-disclaimer-banner"
        className="bg-amber-50 border-b border-amber-200/80 text-amber-950 text-xs px-4 py-2 text-center flex items-center justify-center gap-2 relative z-50 shadow-2xs"
      >
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold shrink-0 text-[10px]">
          !
        </span>
        <p className="leading-tight">
          <strong>Mental Health Disclaimer:</strong> HeartHeal เป็นพื้นที่รับฟังและโอบอุ้มทางอารมณ์
          มิได้ทำหน้าที่แทนแพทย์ จิตแพทย์ หรือผู้เชี่ยวชาญการบำบัด หากมีความเสี่ยงฉุกเฉิน
          กรุณาติดต่อสายด่วนสุขภาพจิต 1323 ทันที
        </p>
      </div>

      {/* 2. Global Header Bar */}
      <header
        id="app-main-header"
        className="bg-white/95 border-b border-orange-100/80 backdrop-blur-md px-4 lg:px-6 py-2.5 shadow-sm"
      >
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              id="brand-logo-badge"
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f86f3f] via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0 text-xl select-none transition-transform hover:scale-105"
            >
              {currentRoleEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-stone-800">
                  HeartHeal AI
                </h1>
                <span className="text-[11px] font-semibold bg-orange-50 text-[#e54e1e] px-2.5 py-0.5 rounded-full border border-orange-200/80 hidden sm:inline-block">
                  Personalized Companion &amp; Safe Space
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block">
                พื้นที่ปลอดภัยสำหรับพักใจ • โอบอุ้มด้วยความเข้าอกเข้าใจและสติ
              </p>
            </div>
          </div>

          {/* Quick Action Badges & Emergency Navigation */}
          <div className="flex items-center flex-wrap gap-2 md:gap-3 text-xs">
            <div className="hidden xl:flex items-center gap-2">
              <a
                id="header-hotline-1323"
                className="flex items-center gap-1.5 text-rose-700 bg-rose-50/90 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 transition font-medium"
                href="tel:1323"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  สายด่วนสุขภาพจิต: <strong>1323</strong> (24 ชม.)
                </span>
              </a>
              <a
                id="header-hotline-samaritans"
                className="flex items-center gap-1.5 text-stone-700 bg-stone-100/90 hover:bg-stone-200 px-2.5 py-1 rounded-xl border border-stone-200 transition"
                href="tel:027136793"
              >
                <span>
                  สะมาริตันส์: <strong>02-713-6793</strong>
                </span>
              </a>
            </div>

            {/* Test Crisis Guardrail Button */}
            <button
              id="header-btn-test-crisis"
              type="button"
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              onClick={onTriggerCrisisDemo}
              title="ทดสอบระบบ Crisis Guardrail Interceptor ทันที"
            >
              <span className="text-xs">🚨</span>
              <span className="hidden sm:inline">ทดสอบ Crisis Guardrail</span>
            </button>

            {/* Incognito Toggle */}
            <div
              id="header-incognito-container"
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100/80 px-2.5 py-1 rounded-xl border border-stone-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-medium text-stone-700">Incognito</span>
              <label className="relative inline-flex items-center cursor-pointer ml-1">
                <input
                  id="header-incognito-input"
                  type="checkbox"
                  checked={isIncognito}
                  onChange={(e) => onToggleIncognito(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Quick Escape Panic Button */}
            <button
              id="header-btn-quick-escape"
              type="button"
              className="bg-stone-900 hover:bg-black text-stone-100 px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              onClick={onQuickEscape}
              title="ซ่อนหน้าจอฉุกเฉิน สลับเป็น Google ทันที (หรือกดปุ่ม Esc)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Quick Escape</span>
              <kbd className="text-[9px] bg-stone-700 px-1 py-0.2 rounded text-stone-300">Esc</kbd>
            </button>

            {/* Architecture Drawer Trigger */}
            <button
              id="header-btn-open-architecture"
              type="button"
              className="bg-orange-50 hover:bg-orange-100 text-[#e54e1e] border border-orange-200/80 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition cursor-pointer"
              onClick={onOpenArchitecture}
            >
              <Code2 className="w-3.5 h-3.5 text-[#f86f3f]" />
              <span className="hidden sm:inline">Full Architecture &amp; Codebase</span>
              <span className="sm:hidden">Code</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
