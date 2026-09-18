import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CompanionSidebar } from './components/CompanionSidebar';
import { CrisisAlert } from './components/CrisisAlert';
import { EmotionalGauge } from './components/EmotionalGauge';
import { DynamicChecklist } from './components/DynamicChecklist';
import { ChatFeed } from './components/ChatFeed';
import { ArchitectureDrawer } from './components/ArchitectureDrawer';
import { PERSONA_ROLES, COMFORT_STYLES, DEFAULT_CHECKLIST } from './data/personaData';
import { PersonaRole, ComfortStyleId, ChatMessage, ChecklistTask } from './types';
import { analyzeAndGenerateReply } from './utils/responseGenerator';
import { speakTextThai, stopSpeech } from './utils/speechUtils';

export default function App() {
  // 1. Companion Persona State
  const [currentRole, setCurrentRole] = useState<PersonaRole>(PERSONA_ROLES[0]); // เพื่อนสนิท
  const [customSpec, setCustomSpec] = useState<string>('');
  const [comfortStyle, setComfortStyle] = useState<ComfortStyleId>('warm');

  // 2. Global Safety & Privacy
  const [isIncognito, setIsIncognito] = useState<boolean>(true);
  const [isCrisisVisible, setIsCrisisVisible] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // 3. Emotional Sentiment & Checklist
  const [valenceScore, setValenceScore] = useState<number>(38);
  const [badgeLabel, setBadgeLabel] = useState<string>('เหนื่อยล้า / ต้องการการฟัง');
  const [badgeType, setBadgeType] = useState<'critical' | 'fatigued' | 'balanced' | 'refreshed'>('fatigued');
  const [contextDetail, setContextDetail] = useState<string>(
    'ตรวจพบความเมื่อยล้าสะสม กำลังปรับโหมดโอบอุ้มเป็นพิเศษ'
  );
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>(DEFAULT_CHECKLIST);

  // 4. Mood Calendar
  const [todayMoodEmoji, setTodayMoodEmoji] = useState<string>('🌧️');

  // 5. Chat & Media States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'วางความเหนื่อยล้าหรือเรื่องหนักใจลงตรงนี้ได้หมดเลยนะแก จะพิมพ์ระบาย เล่าเรื่องอกหัก เรื่องงาน หรือส่งรูปภาพบรรยากาศมาแบ่งปันกันก็ได้ เราอยู่ตรงนี้พร้อมฟังแกเสมอ สบายใจได้เลยนะ 🤍',
      timestamp: 'พร้อมรับฟัง'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isGlobalTts, setIsGlobalTts] = useState<boolean>(false);
  const [activeTtsMsgId, setActiveTtsMsgId] = useState<string | null>(null);

  // Quick Escape (Esc key)
  const handleQuickEscape = useCallback(() => {
    stopSpeech();
    window.location.href = 'https://www.google.com';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleQuickEscape();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleQuickEscape]);

  // Handle Role Change
  const handleSelectRole = (role: PersonaRole) => {
    setCurrentRole(role);
  };

  // Handle Mood Update from Calendar
  const handleUpdateMood = (emoji: string, label: string) => {
    setTodayMoodEmoji(emoji);
    const scoreMap: Record<string, { score: number; type: 'refreshed' | 'balanced' | 'fatigued'; label: string }> = {
      '😊': { score: 80, type: 'refreshed', label: 'รู้สึกผ่อนคลาย / มีพลังใจ' },
      '🌿': { score: 85, type: 'refreshed', label: 'มีพลังใจพร้อมเริ่มต้นใหม่' },
      '😐': { score: 55, type: 'balanced', label: 'อารมณ์นิ่ง / สมดุล' },
      '🌧️': { score: 35, type: 'fatigued', label: 'เหนื่อยล้า / ต้องการการฟัง' }
    };

    const target = scoreMap[emoji] || scoreMap['😐'];
    setValenceScore(target.score);
    setBadgeLabel(target.label);
    setBadgeType(target.type);
  };

  // Toggle Checklist Task
  const handleToggleChecklistTask = (taskId: string) => {
    setChecklistTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // TTS playback on individual message
  const handlePlayTTS = (msgId: string, text: string) => {
    setActiveTtsMsgId(msgId);
    speakTextThai(text, currentRole.name, () => {
      setActiveTtsMsgId(null);
    });
  };

  // Reset conversation
  const handleResetChat = () => {
    stopSpeech();
    let resetGreeting = '';
    if (currentRole.name === 'แม่') {
      resetGreeting =
        'ล้างประวัติการคุยเรียบร้อยแล้วค่ะลูก ข้อมูลทั้งหมดปลอดภัยนะ มีอะไรที่ทำให้ใจหนักหนา เล่าให้แม่ฟังได้เสมอนะคะ 🤍';
    } else if (currentRole.name === 'พ่อ') {
      resetGreeting =
        'ล้างประวัติการคุยเรียบร้อยแล้วครับลูก ปลอดภัยหายห่วงได้เลย พ่อพร้อมฟังเสมอครับ 🤍';
    } else {
      resetGreeting =
        'ล้างประวัติการสนทนาเรียบร้อยแล้วแก ข้อมูลไม่ถูกบันทึก สบายใจได้เลยนะ มีเรื่องอะไรอยากระบาย เล่ามาได้หมดเลยนะ 🤍';
    }

    setMessages([
      {
        id: 'reset-' + Date.now(),
        role: 'assistant',
        content: resetGreeting,
        timestamp: 'ล้างประวัติแล้ว'
      }
    ]);
    setIsCrisisVisible(false);
  };

  // File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
  };

  // Voice recording simulation
  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech-to-text recognition
      setTimeout(() => {
        setInputText('ช่วงนี้เพิ่งเลิกกับแฟน ทำใจไม่ได้เลย รู้สึกเคว้งคว้างและเหนื่อยมาก');
        setIsRecording(false);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  // Trigger Crisis Demo
  const handleTriggerCrisisDemo = () => {
    setIsCrisisVisible(true);
    sendMessageWithText('รู้สึกหมดหวัง ไม่อยากอยู่แล้ว เหนื่อยเหลือเกิน ไม่ไหวแล้วลาก่อน');
  };

  // Quick preset button
  const handleQuickPreset = (text: string) => {
    sendMessageWithText(text);
  };

  // Core Send Message
  const sendMessageWithText = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !attachedFile) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'user-' + Date.now();
    const assistantMsgId = 'assistant-' + (Date.now() + 1);

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: trimmed || '(ส่งรูปภาพเพื่อแบ่งปันบรรยากาศ)',
      timestamp: timeNow,
      attachmentName: attachedFile?.name
    };

    setAttachedFile(null);
    setInputText('');

    // Pre-create streaming assistant message
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: timeNow,
      isStreaming: true
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMsg]);

    // 1. Analyze and generate response
    const analysis = analyzeAndGenerateReply(trimmed, currentRole, comfortStyle);

    // Update gauges & crisis
    if (analysis.isCrisis) {
      setIsCrisisVisible(true);
    }
    setValenceScore(analysis.valenceScore);
    setBadgeLabel(analysis.badgeLabel);
    setBadgeType(analysis.badgeType);
    setContextDetail(analysis.contextDetail);
    setChecklistTasks(analysis.checklistTasks);

    let fullReply = analysis.replyText;

    // Try server-side Gemini if not crisis
    if (!analysis.isCrisis) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            role: currentRole.name,
            customSpec,
            comfortStyle,
            history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.text) {
            fullReply = data.text;
          }
        }
      } catch (err) {
        // Graceful fallback to local response
        console.log('Using responsive local persona engine');
      }
    }

    // 2. Stream typing effect
    const tokens = fullReply.match(/<[^>]+>|[^<>\s]+|\s+/g) || [fullReply];
    let currentIdx = 0;
    let accumulated = '';

    const streamInterval = setInterval(() => {
      if (currentIdx < tokens.length) {
        accumulated += tokens[currentIdx];
        currentIdx++;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: accumulated, isStreaming: true } : msg
          )
        );
      } else {
        clearInterval(streamInterval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: fullReply, isStreaming: false } : msg
          )
        );

        if (isGlobalTts && !analysis.isCrisis) {
          speakTextThai(fullReply, currentRole.name);
        }
      }
    }, 15);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendMessageWithText(inputText);
  };

  const currentComfortObj = COMFORT_STYLES.find((c) => c.id === comfortStyle) || COMFORT_STYLES[0];

  return (
    <div className="text-stone-800 antialiased min-h-screen flex flex-col selection:bg-orange-100 selection:text-[#e54e1e]">
      {/* 1. TOP GLOBAL HEADER */}
      <Header
        currentRoleEmoji={currentRole.emoji}
        isIncognito={isIncognito}
        onToggleIncognito={setIsIncognito}
        onTriggerCrisisDemo={handleTriggerCrisisDemo}
        onQuickEscape={handleQuickEscape}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto p-3 md:p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
          {/* Left Sidebar */}
          <CompanionSidebar
            currentRole={currentRole}
            onSelectRole={handleSelectRole}
            customSpec={customSpec}
            onChangeCustomSpec={setCustomSpec}
            comfortStyle={comfortStyle}
            onChangeComfortStyle={setComfortStyle}
            todayMoodEmoji={todayMoodEmoji}
            onUpdateMood={handleUpdateMood}
          />

          {/* Right Main Area */}
          <main className="lg:col-span-8 xl:col-span-8.5 flex flex-col gap-4">
            {/* Crisis Alert Banner */}
            <CrisisAlert
              isVisible={isCrisisVisible}
              onDismiss={() => setIsCrisisVisible(false)}
            />

            {/* Sentiment Gauge & Dynamic Checklist Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <EmotionalGauge
                  score={valenceScore}
                  badgeLabel={badgeLabel}
                  badgeType={badgeType}
                  contextDetail={contextDetail}
                />
              </div>

              <div className="md:col-span-7">
                <DynamicChecklist
                  tasks={checklistTasks}
                  onToggleTask={handleToggleChecklistTask}
                  isCrisis={isCrisisVisible}
                />
              </div>
            </div>

            {/* Chat Feed */}
            <ChatFeed
              messages={messages}
              currentRole={currentRole}
              comfortStyleLabel={currentComfortObj.name}
              isGlobalTts={isGlobalTts}
              onToggleGlobalTts={() => setIsGlobalTts(!isGlobalTts)}
              onQuickPreset={handleQuickPreset}
              onTriggerCrisisDemo={handleTriggerCrisisDemo}
              onResetChat={handleResetChat}
              onPlayTTS={handlePlayTTS}
              activeTtsMsgId={activeTtsMsgId}
              attachedFile={attachedFile}
              onFileSelect={handleFileSelect}
              onRemoveAttachment={handleRemoveAttachment}
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              inputText={inputText}
              onChangeInputText={setInputText}
              onSendMessage={handleSendMessage}
            />
          </main>
        </div>
      </div>

      {/* 3. ARCHITECTURE CODEBASE DRAWER */}
      <ArchitectureDrawer
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
