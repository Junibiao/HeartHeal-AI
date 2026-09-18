import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface EmotionalGaugeProps {
  score: number;
  badgeLabel: string;
  badgeType: 'critical' | 'fatigued' | 'balanced' | 'refreshed';
  contextDetail: string;
}

export const EmotionalGauge: React.FC<EmotionalGaugeProps> = ({
  score,
  badgeLabel,
  badgeType,
  contextDetail
}) => {
  const getBadgeClass = () => {
    switch (badgeType) {
      case 'critical':
        return 'bg-rose-200 text-rose-800';
      case 'fatigued':
        return 'bg-rose-100 text-rose-700';
      case 'balanced':
        return 'bg-blue-100 text-blue-800';
      case 'refreshed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-rose-100 text-rose-700';
    }
  };

  return (
    <div
      id="card-emotional-sentiment-gauge"
      className="card-glass rounded-2xl p-3.5 shadow-sm border border-orange-100/90 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#e54e1e] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">Emotional Sentiment Gauge</h4>
            <p className="text-[10px] text-stone-500">วิเคราะห์ระดับพลังใจ &amp; อารมณ์ในปัจจุบัน</p>
          </div>
        </div>
        <span
          id="badge-emotional-status"
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition ${getBadgeClass()}`}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="my-2.5">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-stone-500 flex items-center gap-1">
            <span>ระดับแบตเตอรี่หัวใจ</span>
            <span className="text-[10px] text-stone-400 font-mono">(Valence)</span>
          </span>
          <span id="label-valence-percent" className="font-bold text-[#e54e1e]">
            {score}%
          </span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60 relative">
          <div
            id="bar-valence-progress"
            className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-stone-400 mt-1 px-1">
          <span>วิกฤต (0%)</span>
          <span>เหนื่อยล้า (35%)</span>
          <span>สมดุล (70%)</span>
          <span>สดใส (100%)</span>
        </div>
      </div>

      <div
        id="box-sentiment-context-detail"
        className="text-[11px] text-stone-500 flex items-center gap-1.5 bg-stone-50 p-2 rounded-xl"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span id="text-sentiment-context-detail">{contextDetail}</span>
      </div>
    </div>
  );
};
