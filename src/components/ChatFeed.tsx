import React, { useRef, useEffect } from 'react';
import {
  Volume2,
  RotateCcw,
  Image as ImageIcon,
  Mic,
  Send,
  X,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage, PersonaRole } from '../types';

interface ChatFeedProps {
  messages: ChatMessage[];
  currentRole: PersonaRole;
  comfortStyleLabel: string;
  isGlobalTts: boolean;
  onToggleGlobalTts: () => void;
  onQuickPreset: (text: string) => void;
  onTriggerCrisisDemo: () => void;
  onResetChat: () => void;
  onPlayTTS: (msgId: string, text: string) => void;
  activeTtsMsgId: string | null;
  attachedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  inputText: string;
  onChangeInputText: (text: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  messages,
  currentRole,
  comfortStyleLabel,
  isGlobalTts,
  onToggleGlobalTts,
  onQuickPreset,
  onTriggerCrisisDemo,
  onResetChat,
  onPlayTTS,
  activeTtsMsgId,
  attachedFile,
  onFileSelect,
  onRemoveAttachment,
  isRecording,
  onToggleRecording,
  inputText,
  onChangeInputText,
  onSendMessage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div
      id="chat-container-panel"
      className="card-glass rounded-2xl shadow-sm border border-orange-100 flex-1 flex flex-col h-[540px]"
    >
      {/* 1. Header of Chat Container */}
      <div
        id="chat-top-bar"
        className="p-3 border-b border-stone-100 flex items-center justify-between bg-white/70 rounded-t-2xl flex-wrap gap-2"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              id="chat-active-persona-avatar"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f86f3f] to-rose-400 flex items-center justify-center text-white text-base shadow-2xs select-none relative"
            >
              {currentRole.emoji}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span id="chat-persona-title-label" className="text-xs font-bold text-stone-800">
                {currentRole.name}
              </span>
              <span
                id="chat-style-badge"
                className="text-[9px] bg-orange-100 text-[#e54e1e] px-1.5 py-0.5 rounded font-medium"
              >
                โหมด{comfortStyleLabel}
              </span>
              <span
                id="chat-gender-rules-badge"
                className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-mono hidden md:inline"
              >
                {currentRole.genderRuleSummary}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ⚡ Gemini 1.5 Flash • Streaming (temp=0.85)
              </span>
              <span className="text-[10px] text-stone-400 hidden sm:inline">
                Sliding Window 10 msgs • Latency ~18ms
              </span>
            </div>
          </div>
        </div>

        {/* Quick controls on the right */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-toggle-global-tts"
            type="button"
            onClick={onToggleGlobalTts}
            className={`text-[10px] px-2 py-1 rounded-lg transition border flex items-center gap-1 cursor-pointer ${
              isGlobalTts
                ? 'bg-orange-50 text-[#e54e1e] border-orange-300'
                : 'text-stone-600 hover:text-[#e54e1e] bg-stone-50 hover:bg-orange-50 border-stone-200'
            }`}
            title="เปิด/ปิดการอ่านออกเสียงอัตโนมัติ"
          >
            <Volume2 className="w-3 h-3 text-[#f86f3f]" />
            <span>TTS: {isGlobalTts ? 'เปิด' : 'ปิด'}</span>
          </button>

          <button
            id="btn-quick-breakup"
            type="button"
            onClick={() => onQuickPreset('เพิ่งโดนบอกเลิก ทำใจไม่ได้เลย ร้องไห้ไม่หยุด')}
            className="text-[10px] text-stone-600 hover:text-[#e54e1e] bg-stone-100 hover:bg-orange-50 px-2 py-1 rounded-lg transition border border-stone-200 cursor-pointer hidden sm:inline-flex"
          >
            💔 'เพิ่งโดนบอกเลิก'
          </button>

          <button
            id="btn-quick-work-fatigue"
            type="button"
            onClick={() => onQuickPreset('เหนื่อยกับงานมาก หมดพลังใจ ทำอะไรก็ไม่ดีพอ')}
            className="text-[10px] text-stone-600 hover:text-[#e54e1e] bg-stone-100 hover:bg-orange-50 px-2 py-1 rounded-lg transition border border-stone-200 cursor-pointer hidden sm:inline-flex"
          >
            💼 'เหนื่อยงาน'
          </button>

          <button
            id="btn-quick-crisis-demo"
            type="button"
            onClick={onTriggerCrisisDemo}
            className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg transition border border-rose-200 font-semibold cursor-pointer"
          >
            🚨 เทสต์ Crisis
          </button>

          <button
            id="btn-reset-chat-session"
            type="button"
            onClick={onResetChat}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer transition"
            title="รีเซ็ตการสนทนา"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages List */}
      <div id="chat-messages-scroll-area" className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/40">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          const isSpeakingThis = activeTtsMsgId === msg.id;

          if (isAI) {
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff956b] to-rose-400 text-white flex items-center justify-center text-sm shrink-0 shadow-sm select-none">
                  {currentRole.emoji}
                </div>
                <div className="max-w-[85%] md:max-w-[75%] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-600">{currentRole.name}</span>
                    <span className="text-[9px] text-stone-400">{msg.timestamp}</span>
                    {msg.isStreaming && (
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        streaming
                      </span>
                    )}
                  </div>
                  <div className="card-glass p-3.5 rounded-2xl rounded-tl-sm text-xs text-stone-800 leading-relaxed shadow-sm border border-orange-100">
                    <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                    {msg.isStreaming && <span className="stream-cursor" />}
                  </div>

                  {!msg.isStreaming && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => onPlayTTS(msg.id, msg.content)}
                        className="text-[10px] text-stone-500 hover:text-[#e54e1e] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white border border-transparent hover:border-stone-200 transition cursor-pointer"
                      >
                        {isSpeakingThis ? (
                          <div className="flex items-center gap-1 text-[#e54e1e] font-medium">
                            <span className="inline-block w-1 bg-[#f86f3f] rounded-full voice-bar-1" />
                            <span className="inline-block w-1 bg-[#f86f3f] rounded-full voice-bar-2" />
                            <span className="inline-block w-1 bg-[#f86f3f] rounded-full voice-bar-3" />
                            <span className="inline-block w-1 bg-[#f86f3f] rounded-full voice-bar-4" />
                            <span className="ml-1 text-[10px]">กำลังอ่านออกเสียงด้วยน้ำเสียงนุ่มนวล...</span>
                          </div>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-[#f86f3f]" />
                            <span>🔊 ฟังเสียงปลอบใจ (TTS)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // User message
          return (
            <div key={msg.id} className="flex items-start justify-end gap-3">
              <div className="max-w-[85%] md:max-w-[75%] space-y-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[9px] text-stone-400">{msg.timestamp}</span>
                  <span className="text-[11px] font-semibold text-stone-700">คุณ</span>
                </div>
                <div className="bg-gradient-to-r from-[#f86f3f] to-rose-400 text-white p-3.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-sm text-left inline-block">
                  <p>{msg.content}</p>
                  {msg.attachmentName && (
                    <div className="mt-2 p-1.5 bg-white/20 backdrop-blur-xs rounded-xl inline-flex items-center gap-1.5 text-[11px] text-white">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{msg.attachmentName}</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-orange-200 text-stone-700 flex items-center justify-center text-xs shrink-0 shadow-2xs border border-orange-200 select-none font-medium"
                title="บัญชีของคุณ"
              >
                👤
              </div>
            </div>
          );
        })}
        <div ref={feedBottomRef} />
      </div>

      {/* 3. Attachment Preview */}
      {attachedFile && (
        <div
          id="box-attachment-preview"
          className="px-4 py-2 bg-orange-50/90 border-t border-orange-200/60 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-lg bg-orange-200/70 overflow-hidden shrink-0 flex items-center justify-center text-[#e54e1e]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-medium text-stone-800 text-[11px] truncate">
                {attachedFile.name}
              </div>
              <div className="text-[9px] text-stone-500">พร้อมส่งรูปภาพเพื่อร่วมพูดคุย</div>
            </div>
          </div>
          <button
            id="btn-remove-attachment"
            type="button"
            onClick={onRemoveAttachment}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Quick Suggestions Bar */}
      <div
        id="quick-suggestions-bar"
        className="px-3 pt-2 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] text-stone-600 border-t border-stone-100"
      >
        <span className="text-[10px] text-stone-400 shrink-0 font-medium">ลองถาม/ระบาย:</span>
        <button
          type="button"
          onClick={() => onQuickPreset('💔 เพิ่งโดนบอกเลิก ทำใจไม่ได้ ร้องไห้ไม่หยุดเลย')}
          className="shrink-0 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200/70 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          💔 เพิ่งโดนบอกเลิก ทำใจไม่ได้
        </button>
        <button
          type="button"
          onClick={() => onQuickPreset('💼 เหนื่อยงาน หมดพลัง ทำอะไรก็รู้สึกไม่ดีพอ')}
          className="shrink-0 bg-stone-100 hover:bg-orange-50 hover:text-[#e54e1e] hover:border-orange-200 border border-stone-200/70 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          💼 เหนื่อยงาน หมดพลัง
        </button>
        <button
          type="button"
          onClick={() => onQuickPreset('🌙 คิดมาก นอนไม่หลับ ความคิดตีกันในหัวตลอดเวลา')}
          className="shrink-0 bg-stone-100 hover:bg-orange-50 hover:text-[#e54e1e] hover:border-orange-200 border border-stone-200/70 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          🌙 คิดมาก นอนไม่หลับ
        </button>
        <button
          type="button"
          onClick={() => onQuickPreset('💡 ควรทำไงต่อดี ช่วยแนะนำวิธีตั้งหลักหน่อย')}
          className="shrink-0 bg-stone-100 hover:bg-orange-50 hover:text-[#e54e1e] hover:border-orange-200 border border-stone-200/70 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          💡 ควรทำไงต่อดี?
        </button>
      </div>

      {/* 5. Input Area */}
      <div id="chat-input-controls-area" className="p-3 bg-white rounded-b-2xl">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileSelect}
          />
          <button
            id="btn-upload-image"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-stone-500 hover:text-[#f86f3f] hover:bg-orange-50 rounded-xl transition border border-stone-200 cursor-pointer"
            title="แนบรูปภาพเพื่อแบ่งปันความรู้สึก"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            id="btn-voice-recording"
            type="button"
            onClick={onToggleRecording}
            className={`p-2.5 rounded-xl transition border relative cursor-pointer ${
              isRecording
                ? 'bg-rose-100 text-rose-600 border-rose-300'
                : 'text-stone-500 hover:text-rose-500 hover:bg-rose-50 border-stone-200'
            }`}
            title="อัดเสียงพูดระบาย (Speech-to-Text)"
          >
            <Mic className="w-4 h-4" />
            {isRecording && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <div className="flex-1 relative">
            <textarea
              id="input-chat-message"
              rows={1}
              value={inputText}
              onChange={(e) => onChangeInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording
                  ? '🔴 กำลังรับฟังเสียงพูดของคุณ... (Speech-to-Text)'
                  : 'พิมพ์บอกเล่าความรู้สึก หรือสิ่งที่อยากระบายตรงนี้...'
              }
              className="w-full text-xs p-2.5 pr-8 rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f86f3f] focus:border-transparent resize-none leading-relaxed text-stone-800"
            />
          </div>

          <button
            id="btn-send-message"
            type="submit"
            className="bg-[#f86f3f] hover:bg-[#e54e1e] text-white p-2.5 rounded-xl shadow-sm transition flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5 px-1">
          <span>
            กด <kbd className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">Enter</kbd> เพื่อส่ง •{' '}
            <kbd className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">Shift + Enter</kbd>{' '}
            เพื่อขึ้นบรรทัดใหม่
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero-Retention Incognito Protection</span>
          </span>
        </div>
      </div>
    </div>
  );
};
