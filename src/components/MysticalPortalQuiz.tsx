import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Eye, Lock, Unlock, Star, Zap } from 'lucide-react';

// ==================================================
// QUIZ DATA & SCORING CONFIGURATION
// ==================================================

const QUESTIONS = [
  {
    id: "fog",
    headline: "The Veil",
    text: "How often does your mind feel clouded, as if covered by a fog?",
    options: [
      { label: "Never", points: 0 },
      { label: "Sometimes", points: 1 },
      { label: "Frequently", points: 2 },
      { label: "Almost every day", points: 3 }
    ]
  },
  {
    id: "wake",
    headline: "The Morning Sign", 
    text: "How do you usually wake up?",
    options: [
      { label: "Energized and clear", points: 0 },
      { label: "Tired, even after sleep", points: 1 },
      { label: "Anxious or empty", points: 2 },
      { label: "Lost, without direction", points: 3 }
    ]
  },
  {
    id: "spirituality",
    headline: "The Opening",
    text: "What is your relationship with spirituality today?",
    options: [
      { label: "I don't believe in it", points: 0 },
      { label: "Curious, but distant", points: 1 },
      { label: "I study or practice sometimes", points: 2 },
      { label: "It guides my life", points: 3 }
    ]
  },
  {
    id: "knowledge",
    headline: "Hidden Knowledge",
    text: "Have you heard of chakras, energy, or the pineal gland?",
    options: [
      { label: "Never, and I dismiss it", points: 0 },
      { label: "I've heard of it", points: 1 },
      { label: "I've studied a little", points: 2 },
      { label: "I practice it in my life", points: 3 }
    ]
  },
  {
    id: "fear",
    headline: "Shadow",
    text: "What weighs heaviest inside you?",
    options: [
      { label: "Losing clarity", points: 1 },
      { label: "Endless anxiety", points: 2 },
      { label: "Never realizing my dreams", points: 2 },
      { label: "A life without purpose", points: 3 }
    ]
  },
  {
    id: "gift",
    headline: "Choice",
    text: "If you could unlock one gift right now, which would you choose?",
    options: [
      { label: "Mental clarity", points: 1 },
      { label: "Emotional balance", points: 2 },
      { label: "Lucid dreams", points: 2 },
      { label: "Manifestation of abundance", points: 3 }
    ]
  },
  {
    id: "commitment",
    headline: "Will",
    text: "If there was a natural way, woven through science and ancient wisdom, to accelerate your clarity, you would…",
    options: [
      { label: "Laugh and ignore", points: 0 },
      { label: "Be curious but not try", points: 1 },
      { label: "Try carefully", points: 2 },
      { label: "Begin immediately", points: 3 }
    ]
  }
];

const ARCHETYPES = {
  asleep: {
    key: "asleep",
    title: "The Asleep Mind",
    unlocked: false,
    subtitle: "The Dormant Consciousness",
    prose: "The veil remains thick. The portal does not open yet.",
    reflection: "Your journey reveals patterns of resistance and skepticism, like shadows fleeing from light. This is not judgment—it's recognition. The mind builds walls when it fears transformation. Yet even in sleep, the soul stirs. Your skepticism is actually a form of protection, guarding against false promises. When genuine calling grows stronger, when questions become louder than comfort, you'll return. The portal waits with infinite patience, knowing that the deepest awakenings often come to those who once resisted most.",
    gifts: ["Discernment", "Groundedness", "Authentic questioning"],
    nextSteps: "Trust your inner compass. Question everything, including your resistance."
  },
  seeker: {
    key: "seeker", 
    title: "The Seeker",
    unlocked: true,
    subtitle: "The Awakening Soul",
    prose: "You unlocked the first gate. A gift reveals itself — a key to your next step.",
    reflection: "You stand at the threshold between worlds, curiosity lighting your path like stars through fog. Your choices reveal a mind beginning to question, to wonder, to seek beyond surface reality. This awakening carries both gift and responsibility. The fragments of clarity you've gathered form a sacred map. Your journey shows readiness for deeper mysteries—you've moved beyond mere belief into authentic exploration. Trust this inner compass guiding you toward truth.",
    gifts: ["Intuitive curiosity", "Open awareness", "Sacred questioning"],
    nextSteps: "Begin daily practices. Study ancient wisdom. Trust your unfolding."
  },
  alchemist: {
    key: "alchemist",
    title: "The Alchemist", 
    unlocked: true,
    subtitle: "The Transformer",
    prose: "You crossed deeper layers of shadow. Receive your key. Beyond it, the path deepens.",
    reflection: "Your journey reveals the heart of a true alchemist—one who transmutes shadow into light, confusion into clarity. You've walked through layers of self-knowledge that many avoid. This is the sacred work of transformation. Your answers show not just seeking, but genuine commitment to inner alchemy. You understand that growth requires facing both light and darkness within. The wisdom you carry is meant to be refined, expanded, and shared as you become a bridge between worlds.",
    gifts: ["Shadow integration", "Transformative power", "Sacred discernment"],
    nextSteps: "Practice energy work. Study advanced teachings. Begin teaching others."
  },
  visionary: {
    key: "visionary",
    title: "The Visionary",
    unlocked: true,
    subtitle: "The Illuminated Guide",
    prose: "You walked through the portal. The key reveals itself, yet it is only the beginning.",
    reflection: "You embody the rare qualities of a true visionary—one who sees beyond the veil with clarity and purpose. Your path shows deep integration of wisdom, authentic spiritual practice, and unwavering commitment to expansion. This level of awareness comes with sacred responsibility. You're called not just to personal transformation, but to guide others through their own portals of awakening. The deepest teachings await those who can hold this luminous frequency and serve as beacons for others.",
    gifts: ["Visionary sight", "Spiritual mastery", "Divine service"],
    nextSteps: "Master advanced practices. Channel divine wisdom. Guide others to awakening."
  }
};

const MILESTONES = [
  {
    percent: 25,
    title: "First Gate Opens",
    description: "The portal stirs... ancient energies awaken",
    ritual: "keyTurn"
  },
  {
    percent: 50, 
    title: "Inner Vision Awakens",
    description: "Your third eye begins to open...",
    ritual: "meditation"
  },
  {
    percent: 75,
    title: "Portal Alignment",
    description: "The mystical forces align in your favor...",
    ritual: "alignment"
  }
];

// Base64 encoded audio (enhanced for retention)
const AUDIO_DATA = {
  chime: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn",
  select: "data:audio/wav;base64,UklGRr4HAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZoHAAC2tba2tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1ta==",
  whoosh: "data:audio/wav;base64,UklGRo4GAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWoGAABUU1FSUFBMSTQ0MS9RSEFQSDFQU0lKRk1/bj9BTV9GUkVATD0/Sk1VRUhJRkVJSUpGSEhJSUdJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJ",
  gong: "data:audio/wav;base64,UklGRr4HAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZoHAAC2tba2tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1ta=="
};

// ==================================================
// ENHANCED AUDIO SYSTEM  
// ==================================================

interface SFXProviderProps {
  children: React.ReactNode;
  muted: boolean;
}

const SFXProvider: React.FC<SFXProviderProps> = ({ children, muted }) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload all audio
    Object.entries(AUDIO_DATA).forEach(([key, data]) => {
      const audio = new Audio(data);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });
  }, []);

  const play = useCallback((sound: keyof typeof AUDIO_DATA) => {
    if (muted) return;
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {}); // Ignore autoplay restrictions
    }
  }, [muted]);

  return (
    <SFXContext.Provider value={{ play }}>
      {children}
    </SFXContext.Provider>
  );
};

const SFXContext = React.createContext<{ play: (sound: keyof typeof AUDIO_DATA) => void }>({
  play: () => {}
});

const useSFX = () => React.useContext(SFXContext);

// ==================================================
// ENHANCED PARTICLE SYSTEMS
// ==================================================

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const EnhancedConfetti: React.FC<{ trigger: boolean; type?: 'choice' | 'milestone' | 'epic' }> = ({ 
  trigger, 
  type = 'choice' 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const configs = {
      choice: { count: 8, colors: ['#a855ff', '#ec4899', '#f59e0b'], duration: 1500 },
      milestone: { count: 20, colors: ['#8b5cf6', '#06d6a0', '#ffd60a'], duration: 2500 },
      epic: { count: 40, colors: ['#7c3aed', '#059669', '#d97706', '#dc2626'], duration: 4000 }
    };

    const config = configs[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      newParticles.push({
        id: Math.random(),
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 8 - 4,
        life: 1,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: 2 + Math.random() * 3
      });
    }

    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.4,
        vx: p.vx * 0.98,
        life: p.life - 0.015
      })).filter(p => p.life > 0));
    };

    const interval = setInterval(animate, 16);
    setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, config.duration);

    return () => clearInterval(interval);
  }, [trigger, type]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

const CosmicParticles: React.FC<{ intensity: number }> = ({ intensity }) => (
  <div className="fixed inset-0 pointer-events-none opacity-40">
    {[...Array(Math.floor(intensity * 30))].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-portal-accent rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 1, 0.2],
          scale: [0.5, 1.5, 0.5],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// ==================================================
// ENHANCED UI COMPONENTS
// ==================================================

const DynamicBackground: React.FC<{ stage: number; archetype?: string }> = ({ stage, archetype }) => {
  const getBackgroundStyle = () => {
    const base = "fixed inset-0 transition-all duration-1000";
    
    if (stage === 0) return `${base} bg-cosmic-background`;
    if (stage <= 2) return `${base} bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/20`;
    if (stage <= 4) return `${base} bg-gradient-to-br from-violet-800/30 via-fuchsia-800/40 to-purple-900/30`;
    if (stage <= 6) return `${base} bg-gradient-to-br from-indigo-700/40 via-purple-700/50 to-pink-800/40`;
    
    // Results stage - archetype specific
    if (archetype === 'visionary') return `${base} bg-gradient-to-br from-amber-600/30 via-orange-600/40 to-red-600/30`;
    if (archetype === 'alchemist') return `${base} bg-gradient-to-br from-emerald-600/30 via-teal-600/40 to-cyan-600/30`;
    if (archetype === 'seeker') return `${base} bg-gradient-to-br from-blue-600/30 via-indigo-600/40 to-purple-600/30`;
    
    return `${base} bg-cosmic-background`;
  };

  return (
    <div className={getBackgroundStyle()}>
      <CosmicParticles intensity={Math.min(stage / 7, 1)} />
    </div>
  );
};

const ProgressMandala: React.FC<{ progress: number; fragments: number }> = ({ progress, fragments }) => (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
    <div className="flex items-center space-x-4 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 border border-portal-primary/20">
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-8 h-8 relative"
          animate={{ rotate: progress * 3.6 }}
          transition={{ duration: 0.8 }}
        >
          <svg viewBox="0 0 32 32" className="w-full h-full text-portal-primary">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle 
              cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"
              strokeDasharray={`${progress * 0.88} 88`}
              strokeLinecap="round"
              transform="rotate(-90 16 16)"
              className="drop-shadow-sm"
            />
          </svg>
        </motion.div>
        <span className="text-mystical-ethereal text-sm font-medium">
          Portal: {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-px h-4 bg-portal-primary/30" />
      
      <div className="flex items-center space-x-2">
        <Sparkles size={16} className="text-portal-accent animate-pulse" />
        <span className="text-mystical-ethereal text-sm">
          {fragments} Fragment{fragments !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  </div>
);

const SacredOrnament: React.FC<{ intensity: number }> = ({ intensity }) => (
  <div className="fixed top-8 right-8 w-20 h-20 opacity-60 z-30">
    <motion.div
      className="w-full h-full relative"
      animate={{ 
        rotate: 360,
        scale: 1 + intensity * 0.2
      }}
      transition={{ 
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, ease: "easeInOut" }
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-portal-primary">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
        <path d="M50,5 L60,25 L50,35 L40,25 Z" fill="currentColor" opacity="0.9" />
        <path d="M95,50 L75,60 L65,50 L75,40 Z" fill="currentColor" opacity="0.9" />
        <path d="M50,95 L40,75 L50,65 L60,75 Z" fill="currentColor" opacity="0.9" />
        <path d="M5,50 L25,40 L35,50 L25,60 Z" fill="currentColor" opacity="0.9" />
      </svg>
      <motion.div
        className="absolute inset-0 rounded-full bg-portal-primary/20"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  </div>
);

// ==================================================
// IRRESISTIBLE INTRO SCREEN
// ==================================================

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const sfx = useSFX();
  const [currentHook, setCurrentHook] = useState(0);
  
  const hooks = [
    "What lies dormant in your consciousness?",
    "50,000+ seekers discovered their hidden archetype",
    "Ancient wisdom meets modern psychology",
    "Your spiritual DNA awaits activation"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHook((prev) => (prev + 1) % hooks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Background portal effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-portal-primary/10 via-transparent to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="text-center max-w-lg relative z-10">
        {/* Animated central mandala */}
        <motion.div
          className="w-40 h-40 mx-auto mb-8 relative"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-cosmic-portal opacity-20"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          <svg viewBox="0 0 160 160" className="w-full h-full text-portal-primary">
            <defs>
              <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            
            {/* Outer rings */}
            <circle cx="80" cy="80" r="70" fill="none" stroke="url(#portalGlow)" strokeWidth="3" />
            <circle cx="80" cy="80" r="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            <circle cx="80" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            
            {/* Sacred geometry */}
            <path d="M80,10 L95,35 L80,50 L65,35 Z" fill="currentColor" opacity="0.8" />
            <path d="M150,80 L125,95 L110,80 L125,65 Z" fill="currentColor" opacity="0.8" />
            <path d="M80,150 L65,125 L80,110 L95,125 Z" fill="currentColor" opacity="0.8" />
            <path d="M10,80 L35,65 L50,80 L35,95 Z" fill="currentColor" opacity="0.8" />
            
            {/* Inner star */}
            <circle cx="80" cy="80" r="8" fill="currentColor" />
          </svg>
          
          <motion.div
            className="absolute inset-4 rounded-full bg-portal-accent/10"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Dynamic headline */}
        <motion.h1
          className="text-5xl font-bold mb-6 bg-cosmic-mystical bg-clip-text text-transparent leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          The Portal Awakens
        </motion.h1>

        {/* Rotating hooks */}
        <motion.div
          className="h-16 mb-8 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentHook}
              className="text-mystical-ethereal text-lg font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {hooks[currentHook]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Mystical description */}
        <motion.p
          className="text-mystical-whisper mb-10 leading-relaxed text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Seven sacred questions will unveil your spiritual archetype and unlock 
          the wisdom that has been waiting within you. Each choice illuminates 
          another fragment of your true nature.
        </motion.p>

        {/* Epic CTA button */}
        <motion.button
          className="group relative px-12 py-5 bg-cosmic-portal text-white rounded-xl font-bold text-lg shadow-portal-glow hover:shadow-rune transition-all duration-500 overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sfx.play('whoosh');
            onStart();
          }}
        >
          {/* Button shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
          
          <span className="relative z-10 flex items-center justify-center space-x-3">
            <Eye size={24} />
            <span>Begin the Awakening</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </span>
        </motion.button>

        {/* Social proof */}
        <motion.div
          className="mt-8 flex items-center justify-center space-x-6 text-mystical-whisper text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-portal-primary to-portal-secondary border border-white/20" />
              ))}
            </div>
            <span>50,000+ awakened</span>
          </div>
          <div className="w-px h-4 bg-portal-primary/30" />
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-portal-accent fill-current" />
            ))}
            <span className="ml-1">Life-changing</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================================================
// ADDICTIVE QUESTION FLOW
// ==================================================

const QuestionCard: React.FC<{
  question: typeof QUESTIONS[0];
  questionIndex: number;
  totalQuestions: number;
  onSelect: (option: typeof QUESTIONS[0]['options'][0]) => void;
  fragments: number;
}> = ({ question, questionIndex, totalQuestions, onSelect, fragments }) => {
  const sfx = useSFX();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelect = (option: typeof QUESTIONS[0]['options'][0], index: number) => {
    setSelectedOption(index);
    setShowConfetti(true);
    sfx.play('select');
    
    // Auto-advance after brief celebration
    setTimeout(() => {
      onSelect(option);
    }, 800);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <EnhancedConfetti trigger={showConfetti} type="choice" />
      
      <div className="w-full max-w-2xl relative">
        {/* Question header with mystical ornament */}
        <motion.div
          className="text-center mb-12 relative"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Floating runes */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              className="flex space-x-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-portal-accent rounded-full opacity-60" />
              ))}
            </motion.div>
          </div>

          <motion.h2
            className="text-3xl font-bold text-mystical-text mb-4"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(168, 85, 247, 0.3)",
                "0 0 30px rgba(168, 85, 247, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {question.headline}
          </motion.h2>
          
          <p className="text-mystical-ethereal text-lg leading-relaxed max-w-lg mx-auto">
            {question.text}
          </p>
        </motion.div>

        {/* Options with staggered animation */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                selectedOption === index
                  ? 'border-portal-primary bg-portal-primary/20 shadow-portal-glow'
                  : 'border-portal-primary/30 bg-card/80 hover:border-portal-primary/60 hover:bg-choice-hover backdrop-blur-sm'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option, index)}
              disabled={selectedOption !== null}
            >
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-portal-primary/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-mystical-text font-medium text-lg group-hover:text-portal-primary transition-colors">
                  {option.label}
                </span>
                
                <motion.div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index
                      ? 'border-portal-primary bg-portal-primary text-white'
                      : 'border-portal-primary/50 group-hover:border-portal-primary'
                  }`}
                  animate={selectedOption === index ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {selectedOption === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              </div>
              
              {selectedOption === index && (
                <motion.div
                  className="absolute inset-0 border-2 border-portal-primary rounded-xl"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.05, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-mystical-whisper text-sm mb-2">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
          <div className="w-full max-w-xs mx-auto h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cosmic-portal"
              initial={{ width: 0 }}
              animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================================================
// EPIC MILESTONE EXPERIENCES
// ==================================================

const MilestoneRitual: React.FC<{
  milestone: typeof MILESTONES[0];
  onComplete: () => void;
}> = ({ milestone, onComplete }) => {
  const sfx = useSFX();
  const [ritualComplete, setRitualComplete] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const completeRitual = () => {
    setRitualComplete(true);
    sfx.play('gong');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const renderRitual = () => {
    switch (milestone.ritual) {
      case 'keyTurn':
        return (
          <div className="text-center">
            <motion.div
              className="w-32 h-32 mx-auto mb-6 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={completeRitual}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-portal-accent">
                <motion.path
                  d="M50,20 L50,45 M35,50 L65,50"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={{ rotate: ritualComplete ? 90 : 0 }}
                  transition={{ duration: 1 }}
                />
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </motion.div>
            <p className="text-mystical-ethereal">Click to turn the sacred key</p>
          </div>
        );

      case 'meditation':
        return (
          <div className="text-center">
            <motion.div
              className="w-40 h-40 mx-auto mb-6 cursor-pointer relative"
              onClick={completeRitual}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-portal-primary/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-8 rounded-full bg-portal-secondary/20" />
              <motion.div
                className="absolute inset-12 rounded-full bg-portal-accent"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(245, 158, 11, 0.5)",
                    "0 0 40px rgba(245, 158, 11, 0.8)",
                    "0 0 20px rgba(245, 158, 11, 0.5)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-mystical-ethereal">Click to focus your inner vision</p>
          </div>
        );

      case 'alignment':
        return (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-6 relative">
              <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                onDrag={(_, info) => {
                  setDragPosition({ x: info.offset.x, y: info.offset.y });
                  if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) {
                    completeRitual();
                  }
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-portal-primary">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                </svg>
              </motion.div>
            </div>
            <p className="text-mystical-ethereal">Drag the symbol to center to align the portal</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <EnhancedConfetti trigger={ritualComplete} type="milestone" />
      
      <div className="text-center max-w-md relative z-10">
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-16 h-1 bg-cosmic-portal mx-auto mb-4 rounded-full" />
          <h2 className="text-2xl font-bold text-mystical-text mb-2">
            {milestone.title}
          </h2>
          <p className="text-mystical-ethereal">
            {milestone.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {renderRitual()}
        </motion.div>

        <motion.div
          className="mt-8 text-portal-accent text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Portal: {milestone.percent}% Open
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================================================
// CLIMACTIC RESULTS EXPERIENCE
// ==================================================

const ResultScreen: React.FC<{
  archetype: typeof ARCHETYPES[keyof typeof ARCHETYPES];
  answers: Array<{ id: string; label: string; points: number }>;
  score: number;
  onComplete: () => void;
}> = ({ archetype, answers, score, onComplete }) => {
  const sfx = useSFX();
  const [stage, setStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const stages = [
      () => setTimeout(() => setStage(1), 1000),
      () => setTimeout(() => setStage(2), 2000),
      () => setTimeout(() => {
        setStage(3);
        setShowConfetti(true);
        sfx.play('gong');
      }, 3000),
    ];

    stages.forEach(stage => stage());
  }, [sfx]);

  const generatePersonalizedReflection = () => {
    const selectedChoices = answers.map(a => a.label).slice(0, 3);
    return `Your path revealed through "${selectedChoices[0]}", "${selectedChoices[1]}", and "${selectedChoices[2]}" shows a unique spiritual signature. ${archetype.reflection}`;
  };

  const generateMicroRituals = () => {
    const rituals = [
      "Morning clarity ritual: Take 3 deep breaths while visualizing golden light entering your crown chakra",
      "Evening integration: Journal one insight from today before sleep",
      "Daily activation: Hold a clear intention for 30 seconds when you wake",
      "Weekly practice: Spend 10 minutes in nature connecting with your deeper wisdom"
    ];
    return rituals.slice(0, Math.min(rituals.length, Math.floor(score / 5) + 2));
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <EnhancedConfetti trigger={showConfetti} type="epic" />
      
      <div className="w-full max-w-4xl relative z-10">
        {/* Epic reveal sequence */}
        <AnimatePresence mode="wait">
          {stage >= 1 && (
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="w-48 h-48 mx-auto mb-8 relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {/* Archetype symbol */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-cosmic-portal opacity-30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <svg viewBox="0 0 200 200" className="w-full h-full text-portal-primary">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                  
                  {/* Archetype-specific symbols */}
                  {archetype.key === 'visionary' && (
                    <>
                      <path d="M100,40 L130,80 L100,100 L70,80 Z" fill="currentColor" />
                      <circle cx="100" cy="100" r="15" fill="currentColor" />
                    </>
                  )}
                  {archetype.key === 'alchemist' && (
                    <>
                      <path d="M100,50 L150,100 L100,150 L50,100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="100" cy="100" r="20" fill="currentColor" />
                    </>
                  )}
                  {archetype.key === 'seeker' && (
                    <>
                      <path d="M100,60 L120,90 L100,120 L80,90 Z" fill="currentColor" opacity="0.8" />
                      <circle cx="100" cy="100" r="10" fill="currentColor" />
                    </>
                  )}
                  {archetype.key === 'asleep' && (
                    <>
                      <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                      <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.7" />
                    </>
                  )}
                </svg>
              </motion.div>

              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-5xl font-bold text-mystical-text mb-4 bg-cosmic-mystical bg-clip-text text-transparent">
                    {archetype.title}
                  </h1>
                  <p className="text-portal-accent text-xl font-medium mb-6">
                    {archetype.subtitle}
                  </p>
                  <p className="text-mystical-ethereal text-lg italic">
                    {archetype.prose}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {stage >= 3 && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {/* Personal reflection */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-portal-primary/20">
              <h3 className="text-2xl font-semibold text-mystical-text mb-4 flex items-center">
                <Eye className="mr-3 text-portal-accent" />
                Your Sacred Reflection
              </h3>
              <p className="text-mystical-ethereal leading-relaxed text-lg">
                {generatePersonalizedReflection()}
              </p>
            </div>

            {/* Spiritual gifts */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-portal-primary/20">
              <h3 className="text-2xl font-semibold text-mystical-text mb-6 flex items-center">
                <Sparkles className="mr-3 text-portal-accent" />
                Your Spiritual Gifts
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {archetype.gifts.map((gift, index) => (
                  <motion.div
                    key={index}
                    className="bg-portal-primary/10 rounded-lg p-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                  >
                    <div className="text-portal-accent font-medium">{gift}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Micro-rituals */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-portal-primary/20">
              <h3 className="text-2xl font-semibold text-mystical-text mb-6 flex items-center">
                <Zap className="mr-3 text-portal-accent" />
                Your Daily Practices
              </h3>
              <div className="space-y-4">
                {generateMicroRituals().map((ritual, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.3 }}
                  >
                    <div className="w-2 h-2 bg-portal-accent rounded-full mt-2 flex-shrink-0" />
                    <p className="text-mystical-ethereal">{ritual}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to action */}
            {archetype.unlocked ? (
              <motion.div
                className="text-center pt-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3 }}
              >
                <motion.a
                  href="https://cerebralshift.gumroad.com/l/uymfree"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-4 px-12 py-6 bg-cosmic-portal text-white rounded-xl font-bold text-xl shadow-portal-glow hover:shadow-rune transition-all duration-500 group relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sfx.play('chime')}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  />
                  
                  <Unlock size={28} />
                  <span>Receive Your Sacred Key</span>
                  <motion.div
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </motion.a>
                
                <p className="text-mystical-whisper mt-4 text-sm">
                  The complete wisdom of your archetype awaits within
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="text-center pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <div className="inline-flex items-center space-x-3 px-8 py-4 bg-secondary/50 rounded-xl border border-portal-primary/30">
                  <Lock className="text-mystical-whisper" />
                  <span className="text-mystical-whisper">
                    The portal remains closed... yet the book whispers louder
                  </span>
                </div>
                <p className="text-mystical-whisper mt-4 text-sm">
                  When the calling grows stronger, return to unlock your path
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ==================================================
// MAIN QUIZ APPLICATION
// ==================================================

const MysticalPortalQuiz: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'question' | 'milestone' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ id: string; label: string; points: number }>>([]);
  const [muted, setMuted] = useState(false);
  const [milestones, setMilestones] = useState({
    reached25: false,
    reached50: false,
    reached75: false
  });
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);

  const progress = ((currentQuestionIndex + (gameState === 'results' ? 1 : 0)) / QUESTIONS.length) * 100;
  const fragments = answers.length;

  const getArchetype = (score: number) => {
    if (score <= 5) return ARCHETYPES.asleep;
    if (score <= 12) return ARCHETYPES.seeker;
    if (score <= 18) return ARCHETYPES.alchemist;
    return ARCHETYPES.visionary;
  };

  const handleQuestionAnswer = (option: typeof QUESTIONS[0]['options'][0]) => {
    const newAnswers = [...answers, {
      id: QUESTIONS[currentQuestionIndex].id,
      label: option.label,
      points: option.points
    }];
    setAnswers(newAnswers);

    // Check for milestones
    const newProgress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
    const milestone = MILESTONES.find(m => 
      newProgress >= m.percent && 
      !milestones[`reached${m.percent}` as keyof typeof milestones]
    );

    if (milestone && currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentMilestone(milestone);
      setMilestones(prev => ({
        ...prev,
        [`reached${milestone.percent}`]: true
      }));
      setGameState('milestone');
    } else if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer.points, 0);
      console.log({
        score: totalScore,
        archetypeKey: getArchetype(totalScore).key,
        archetypeTitle: getArchetype(totalScore).title,
        unlocked: getArchetype(totalScore).unlocked,
        answers: newAnswers,
        milestones
      });
      setGameState('results');
    }
  };

  const handleMilestoneComplete = () => {
    setCurrentMilestone(null);
    setGameState('question');
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const currentArchetype = gameState === 'results' ? 
    getArchetype(answers.reduce((sum, answer) => sum + answer.points, 0)) : 
    null;

  return (
    <SFXProvider muted={muted}>
      <div className="relative min-h-screen overflow-hidden">
        {/* Dynamic background */}
        <DynamicBackground 
          stage={currentQuestionIndex} 
          archetype={currentArchetype?.key}
        />
        
        {/* Sacred ornament */}
        <SacredOrnament intensity={progress / 100} />
        
        {/* Progress display */}
        {gameState !== 'intro' && gameState !== 'results' && (
          <ProgressMandala progress={progress} fragments={fragments} />
        )}
        
        {/* Mute toggle */}
        <motion.button
          className="fixed top-6 right-6 z-50 p-3 bg-card/80 backdrop-blur-sm rounded-full border border-portal-primary/20 hover:bg-choice-hover transition-colors"
          onClick={() => setMuted(!muted)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {muted ? <VolumeX size={20} className="text-mystical-whisper" /> : <Volume2 size={20} className="text-portal-primary" />}
        </motion.button>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroScreen 
              key="intro"
              onStart={() => setGameState('question')} 
            />
          )}
          
          {gameState === 'question' && (
            <QuestionCard
              key={`question-${currentQuestionIndex}`}
              question={QUESTIONS[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={QUESTIONS.length}
              onSelect={handleQuestionAnswer}
              fragments={fragments}
            />
          )}
          
          {gameState === 'milestone' && currentMilestone && (
            <MilestoneRitual
              key={`milestone-${currentMilestone.percent}`}
              milestone={currentMilestone}
              onComplete={handleMilestoneComplete}
            />
          )}
          
          {gameState === 'results' && currentArchetype && (
            <ResultScreen
              key="results"
              archetype={currentArchetype}
              answers={answers}
              score={answers.reduce((sum, answer) => sum + answer.points, 0)}
              onComplete={() => {}}
            />
          )}
        </AnimatePresence>
      </div>
    </SFXProvider>
  );
};

export default MysticalPortalQuiz;