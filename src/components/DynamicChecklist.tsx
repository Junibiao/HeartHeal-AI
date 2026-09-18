import React from 'react';
import { CheckSquare } from 'lucide-react';
import { ChecklistTask } from '../types';

interface DynamicChecklistProps {
  tasks: ChecklistTask[];
  onToggleTask: (taskId: string) => void;
  isCrisis?: boolean;
}

export const DynamicChecklist: React.FC<DynamicChecklistProps> = ({
  tasks,
  onToggleTask,
  isCrisis = false
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      id="card-dynamic-micro-checklist"
      className="card-glass rounded-2xl p-3.5 shadow-sm border border-orange-100/90 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">Dynamic Personalized Checklist (Micro-Steps)</h4>
            <p className="text-[10px] text-stone-500">ภารกิจเล็กๆ เพื่อฟื้นฟูใจตามบริบทอารมณ์</p>
          </div>
        </div>
        <span
          id="badge-checklist-score"
          className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200"
        >
          {completedCount} / {totalCount} ข้อ ({percent}%)
        </span>
      </div>

      {isCrisis ? (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] leading-relaxed">
          <strong className="block font-semibold">ภารกิจเพื่อความปลอดภัยทันที:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>กดโทรหาสายด่วนสุขภาพจิต 1323 หรือสะมาริตันส์ 02-713-6793</li>
            <li>ย้ายตัวเองไปอยู่ในที่ที่มีคนอยู่ หรือโทรหาเพื่อน/ครอบครัวที่ไว้วางใจ</li>
            <li>ดื่มน้ำเย็น 1 แก้วเพื่อดึงสติสัมผัสสู่ร่างกายช้าๆ</li>
          </ul>
        </div>
      ) : (
        <div id="checklist-tasks-container" className="space-y-1.5 text-xs text-stone-700">
          {tasks.map((task) => (
            <label
              key={task.id}
              id={`checklist-item-${task.id}`}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer transition border border-transparent hover:border-stone-200"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-3.5 h-3.5 rounded text-[#f86f3f] focus:ring-[#f86f3f] accent-[#f86f3f] cursor-pointer"
              />
              <span
                className={`transition-colors ${
                  task.completed ? 'line-through text-stone-400' : 'text-stone-700'
                }`}
              >
                {task.task}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
