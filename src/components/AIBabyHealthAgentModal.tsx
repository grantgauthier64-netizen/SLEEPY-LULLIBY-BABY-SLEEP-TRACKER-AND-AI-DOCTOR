import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Moon, 
  HeartPulse, 
  Milk, 
  Baby, 
  ShieldAlert, 
  RotateCcw, 
  Copy, 
  Check, 
  Lightbulb, 
  ArrowRight,
  AlertCircle,
  Stethoscope,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BabyProfile } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'sleep' | 'health' | 'feeding' | 'milestones' | 'general';
}

interface AIBabyHealthAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyProfile?: BabyProfile;
}

const PRESET_TOPICS = [
  {
    id: 'lactose_cmpa',
    label: 'Lactose & Dairy Allergy',
    icon: Milk,
    color: 'bg-[#FFF7ED] text-[#C2410C] border-[#EA580C]/40',
    headerSummary: 'Lactose intolerance vs. Cow\'s Milk Protein Allergy (CMPA), frothy stools, and formula remedies',
    defaultInquiry: 'My baby is showing gassy fussiness, cramping, and digestive discomfort. What is the clinical difference between Lactose Intolerance and Cow\'s Milk Protein Allergy (CMPA), what are the key symptoms, and what are the best pediatrician-recommended remedies and formulas?',
    questions: [
      "What are the main symptoms of lactose intolerance vs CMPA in babies?",
      "Why does baby have frothy, acidic diarrhea with a burning diaper rash?",
      "What formulas (Nutramigen, Alimentum, Gentle) help with milk sensitivity?",
      "How does a nursing mother do a dairy elimination diet?",
      "What is secondary (temporary) lactose intolerance after a stomach bug?"
    ]
  },
  {
    id: 'spitup_poop',
    label: 'Spit-Up & Poop Decoder',
    icon: Milk,
    color: 'bg-[#FFEDD5] text-[#9A3412] border-[#EA580C]/30',
    headerSummary: 'Poop color & texture decoder (Diarrhea, Runny, Pasty, Soft, Firm) and curdled formula spit-up triage',
    defaultInquiry: 'Provide a complete pediatric breakdown of baby poop colors (Yellow, Green, Brown, Red, White, Black) and stool texture types (Diarrhea, Runny seedy, Pasty, Soft, Firm/Hard pellets), plus why formula spit-up curdles.',
    questions: [
      "What do different baby poop colors & textures (diarrhea, pasty, runny, soft, firm) mean?",
      "Why does baby spit up curd-like cottage cheese after formula?",
      "Is watery diarrhea vs runny seedy breastfed poop different?",
      "How to treat firm pellet constipation in infants?",
      "Is army-green or dark green poop normal for formula-fed babies?"
    ]
  },
  {
    id: 'health',
    label: 'Infant Health & Fevers',
    icon: HeartPulse,
    color: 'bg-[#FFE4E6] text-[#9F1239] border-[#FF5A5F]/30',
    headerSummary: 'Fever thresholds, safe cold/congestion relief, AAP urgency matrix, and diaper rash care',
    defaultInquiry: 'Provide a comprehensive clinical pediatric guide on infant fever safety thresholds, cold & congestion relief, medication dosing, and dehydration warning signs for my baby.',
    questions: [
      "What is a fever threshold in babies and when to call the doctor?",
      "Safe, proven remedies to soothe teething gums and fussiness?",
      "How to help a congested baby sleep comfortably and safely?",
      "What are the best treatments for stubborn diaper rash?",
      "Safe medication rules (Infant Tylenol vs Motrin by weight)?"
    ]
  },
  {
    id: 'feeding',
    label: 'Feeding & Nutrition',
    icon: Milk,
    color: 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/30',
    headerSummary: 'Daily milk/formula volumes, solid readiness, BLW, and allergen safety',
    defaultInquiry: 'Provide an evidence-based pediatric feeding and nutrition guide including recommended daily milk/formula ounces, starting solids readiness signs, allergen introduction timeline, and gas/reflux relief.',
    questions: [
      "How do I know if baby is ready for solid foods?",
      "How many ounces of milk or formula does baby need daily?",
      "How to introduce major allergen foods (peanut, egg) safely?",
      "Tips to relieve gas and reflux after feeding?",
      "Sample daily feeding and nursing schedule for my baby's age?"
    ]
  },
  {
    id: 'sleep',
    label: 'Sleep & Regressions',
    icon: Moon,
    color: 'bg-[#EDE9FE] text-[#5B21B6] border-[#8B5CF6]/30',
    headerSummary: 'Wake windows, nap transitions, circadian rhythms, and bedtime routines',
    defaultInquiry: 'What are the ideal wake windows, daily nap schedule, and sleep regression management strategies for my baby?',
    questions: [
      "What are the ideal wake windows for my baby's age?",
      "How do I handle the 4-month sleep regression?",
      "What is a safe and gentle bedtime routine to reduce night wakings?",
      "When and how should we transition from 3 naps to 2 naps?"
    ]
  },
  {
    id: 'milestones',
    label: 'Milestones & Growth',
    icon: Baby,
    color: 'bg-[#DCFCE7] text-[#166534] border-[#22C55E]/30',
    headerSummary: 'Motor development, tummy time progression, rolling, and early communication',
    defaultInquiry: 'What developmental milestones, tummy time tips, and sensory play activities are recommended for my baby this month?',
    questions: [
      "What developmental milestones should we look for this month?",
      "My baby dislikes tummy time—how can I make it engaging?",
      "When do babies usually start rolling over and sitting up?",
      "How to support early language and babbling skills?"
    ]
  }
];

export const AIBabyHealthAgentModal: React.FC<AIBabyHealthAgentModalProps> = ({
  isOpen,
  onClose,
  babyProfile
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 👋 Hello! I'm Dr. Lullaby & Nurse Daisy
I'm your **24/7 AI Pediatric Sleep & Infant Health Consultant**, powered by clinical pediatric best practices and AAP (American Academy of Pediatrics) guidelines.

${babyProfile?.name ? `I see you're caring for **${babyProfile.name}** (${babyProfile.ageMonths} months old)! I'll tailor my answers directly to their age and schedule.` : "I can help you with personalized sleep schedules, illness & fever advice, feeding guidance, soothing techniques, and developmental milestones."}

**How can I assist you and your baby today?** Feel free to choose a quick topic below or type any question!`,
      timestamp: 'Just now',
      category: 'general'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<'spitup_poop' | 'sleep' | 'health' | 'feeding' | 'milestones'>('spitup_poop');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Prepare payload with previous messages (excluding system welcome if desired, or all)
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          babyProfile: babyProfile || {
            name: 'Baby',
            ageMonths: 5
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I'm sorry, I couldn't generate a response. Please try again.";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Error communicating with AI Agent:", err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**⚠️ Connection Note:** I encountered a temporary issue connecting to the AI consultant service. 

*Quick Pediatric Advice on this topic:*
- For **sleep**: Ensure baby's sleep space is flat, firm, with no loose items (AAP safe sleep).
- For **fevers**: If your infant is under 3 months with a rectal temperature of 100.4°F (38°C) or higher, contact your pediatrician or emergency care immediately.
- For **feeding**: Keep baby upright for 15–20 minutes after feeds to ease digestion.

Please try sending your message again in a moment!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `### 🔄 Chat Cleared
I'm ready for your new questions regarding sleep, infant health, feeding, and baby development. How can I help?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const activeTopicObj = PRESET_TOPICS.find((t) => t.id === selectedTopic) || PRESET_TOPICS[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-agent-modal-title"
    >
      <div 
        id="ai-baby-health-agent-dialog"
        className="bg-[#FFFBF7] rounded-[32px] border-2 border-[#E7DDD5] shadow-2xl max-w-3xl w-full h-[92vh] max-h-[850px] flex flex-col overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-white border-b border-[#F0E6DD] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE4E6] border-2 border-[#FECDD3] flex items-center justify-center shadow-xs">
                <Bot className="w-6 h-6 text-[#FF5A5F]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full" title="Online and Ready" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-agent-modal-title" className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                  Lullaby AI • Pediatric & Health Agent
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE]">
                  <Sparkles className="w-3 h-3" />
                  Gemini 3.7 AI
                </span>
              </div>
              <p className="text-xs text-[#57534E] font-medium flex items-center gap-2">
                <span>AAP-Aligned Guidance</span>
                {babyProfile?.name && (
                  <>
                    <span>•</span>
                    <span className="text-[#FF5A5F] font-bold">Profile: {babyProfile.name} ({babyProfile.ageMonths}m)</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-[#57534E] hover:text-[#1C1917] hover:bg-[#F0E6DD] transition-colors cursor-pointer"
              title="Clear conversation"
              aria-label="Clear chat history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-agent-modal-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border-2 border-[#D6C7BC] flex items-center justify-center text-[#1C1917] hover:bg-[#F0E6DD] transition-colors cursor-pointer"
              aria-label="Close AI Agent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Topic Selector Bar */}
        <div className="px-4 py-2.5 bg-[#F9F5F0] border-b border-[#F0E6DD] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-[#57534E] uppercase tracking-wider whitespace-nowrap pl-1">
              Topics:
            </span>
            {PRESET_TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  id={`topic-btn-${topic.id}`}
                  onClick={() => setSelectedTopic(topic.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? `${topic.color} border shadow-xs scale-102 ring-2 ring-current/20`
                      : 'bg-white text-[#57534E] border border-[#E0D7D0] hover:bg-[#FFFBF7]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleSendMessage(activeTopicObj.defaultInquiry)}
            disabled={isLoading}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#FF5A5F] text-white hover:bg-[#FF4147] shadow-xs cursor-pointer transition-all shrink-0 active:scale-95 disabled:opacity-50"
            title={`Get full clinical report for ${activeTopicObj.label}`}
          >
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Consult {activeTopicObj.label}</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs relative group ${
                    isUser
                      ? 'bg-[#FF5A5F] text-white rounded-br-none'
                      : 'bg-white border-2 border-[#E7DDD5] text-[#1C1917] rounded-bl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed text-[#1C1917] space-y-2 prose prose-stone max-w-none">
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <h3 className="font-serif text-base font-bold text-[#1C1917] mt-1 mb-2">
                              {children}
                            </h3>
                          ),
                          h4: ({ children }) => (
                            <h4 className="font-bold text-sm text-[#1C1917] mt-2 mb-1">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm text-[#1C1917] leading-relaxed mb-2 last:mb-0">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-1 my-2 text-sm text-[#1C1917]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1 my-2 text-sm text-[#1C1917]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm text-[#1C1917]">
                              {children}
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-[#1C1917]">
                              {children}
                            </strong>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-[#FF5A5F] pl-3 py-1 my-2 bg-[#FFF1F2] rounded-r-lg text-xs font-semibold text-[#9F1239]">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {/* Copy action */}
                      <div className="pt-2 border-t border-[#F0E6DD]/60 flex items-center justify-between text-[10px] text-[#57534E]">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[#57534E] hover:text-[#1C1917] font-bold transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#22C55E]" />
                              <span className="text-[#22C55E]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-white border-2 border-[#E7DDD5] rounded-2xl rounded-bl-none p-4 shadow-xs flex items-center gap-3 text-xs font-bold text-[#57534E]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Consulting pediatric database & analyzing sleep patterns...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions for Selected Topic */}
        <div className="px-4 py-2 bg-white/70 border-t border-[#F0E6DD] shrink-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold text-[#57534E]">
              Suggested questions for {activeTopicObj.label}:
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeTopicObj.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-[#FFFBF7] border border-[#D6C7BC] text-xs font-semibold text-[#1C1917] hover:border-[#FF5A5F] hover:bg-[#FFE4E6]/40 transition-all text-left whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & Disclaimer */}
        <div className="p-4 bg-white border-t border-[#F0E6DD] space-y-2 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-[#FFFBF7] border-2 border-[#D6C7BC] focus-within:border-[#FF5A5F] rounded-2xl p-2 transition-all">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Dr. Lullaby anything (e.g. fever symptoms, wake windows, soothing, starting solids)..."
                className="w-full bg-transparent resize-none text-sm text-[#1C1917] placeholder:text-[#57534E]/60 focus:outline-none px-1"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="h-12 px-5 rounded-2xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-sm shadow-lg shadow-[#FF5A5F]/35 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              aria-label="Send query"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Pediatric Disclaimer */}
          <div className="flex items-center justify-between text-[10px] text-[#57534E] px-1">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Educational Pediatric Advice</strong> • In medical emergencies or high infant fevers, call emergency services or your pediatrician immediately.
              </span>
            </div>
            <span className="hidden sm:inline text-[#57534E]/70 font-mono">Press Enter ↵</span>
          </div>
        </div>
      </div>
    </div>
  );
};
