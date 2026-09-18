/**
 * Speech synthesis utility for Thai language TTS
 */

export function speakTextThai(text: string, roleName: string = 'เพื่อนสนิท', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean html tags if any
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 0.95;

    // Adjust pitch for different roles
    if (roleName === 'แม่' || roleName === 'ย่า / ยาย') {
      utterance.pitch = 1.15;
    } else if (roleName === 'พ่อ' || roleName === 'ตา / ปู่') {
      utterance.pitch = 0.9;
    } else {
      utterance.pitch = 1.0;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
    if (onEnd) onEnd();
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
