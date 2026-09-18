import React from 'react';
import { PhoneOutgoing, X } from 'lucide-react';

interface CrisisAlertProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({ isVisible, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div
      id="crisis-alert-banner"
      className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm text-lg select-none">
          🚨
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <span>ตรวจพบสัญญาณสภาวะอารมณ์วิกฤต (Crisis Guardrail Activated)</span>
            </h3>
            <span className="text-[10px] font-mono bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-bold">
              Priority High
            </span>
          </div>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">
            เราห่วงใยคุณมากๆ และอยากให้คุณได้รับความปลอดภัยสูงสุด HeartHeal ไม่สามารถช่วยเหลือในภาวะวิกฤตแทนบุคลากรผู้เชี่ยวชาญได้
            โปรดโทรหาสายด่วนทันที หรือติดต่อคนใกล้ชิดที่คุณไว้วางใจ
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <a
              id="crisis-dial-1323"
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow transition"
              href="tel:1323"
            >
              <PhoneOutgoing className="w-4 h-4" />
              <span>โทรสายด่วนสุขภาพจิต 1323 ทันที (ฟรี 24 ชม.)</span>
            </a>
            <a
              id="crisis-dial-samaritans"
              className="inline-flex items-center gap-1.5 bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-medium text-xs px-3.5 py-2 rounded-xl transition"
              href="tel:027136793"
            >
              <span>สมาคมสะมาริตันส์: 02-713-6793</span>
            </a>
            <button
              id="crisis-btn-dismiss"
              type="button"
              onClick={onDismiss}
              className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded hover:bg-rose-100 cursor-pointer transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>ปิดการแจ้งเตือน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
