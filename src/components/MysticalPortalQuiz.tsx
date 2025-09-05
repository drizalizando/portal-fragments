import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

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
    prose: "The veil remains thick. The portal does not open yet.",
    reflection: "Your path shows patterns of resistance and avoidance, like shadows fleeing from light. This is not judgment, but recognition. The mind builds walls when it fears what lies beyond them. Yet even in sleep, the soul whispers. When the calling grows stronger, when the questions become louder than the comfort of unknowing, return. The portal waits with infinite patience."
  },
  seeker: {
    key: "seeker",
    title: "The Seeker",
    unlocked: true,
    prose: "You unlocked the first gate. A gift reveals itself — a key to your next step.",
    reflection: "You stand at the threshold between worlds, curiosity lighting your way like stars through fog. Your choices reveal a mind beginning to question, to wonder, to seek beyond the surface. This awakening carries both gift and responsibility. The fragments of clarity you've gathered are not random—they form a map. Trust this inner compass. The ancient wisdom recognizes you as ready for deeper teachings."
  },
  alchemist: {
    key: "alchemist",
    title: "The Alchemist",
    unlocked: true,
    prose: "You crossed deeper layers of shadow. Receive your key. Beyond it, the path deepens.",
    reflection: "Your journey reveals the heart of a true alchemist—one who transmutes shadow into light, confusion into clarity. You've walked through layers of self-knowledge that many avoid. This is the sacred work of transformation. Your answers show not just seeking, but genuine commitment to inner alchemy. The wisdom you carry is meant to be shared, refined, and expanded. You are becoming a bridge between worlds."
  },
  visionary: {
    key: "visionary",
    title: "The Visionary",
    unlocked: true,
    prose: "You walked through the portal. The key reveals itself, yet it is only the beginning.",
    reflection: "You embody the rare qualities of a true visionary—one who sees beyond the veil with clarity and purpose. Your path shows deep integration of wisdom, authentic spiritual practice, and unwavering commitment to growth. This level of awareness comes with sacred responsibility. You are called not just to your own transformation, but to guide others through their own portals of awakening. The deepest teachings await those who can hold this level of light."
  }
};

// Base64 encoded audio data (tiny chimes and whooshes)
const AUDIO_DATA = {
  chime: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkaDBSH0/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn",
  whoosh: "data:audio/wav;base64,UklGRo4GAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWoGAABUU1FSUFBMSTQ0MS9RSEFQSDFQU0lKRk1/bj9BTV9GUkVATD0/Sk1VRUhJRkVJSUpGSEhJSUdJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJSElJ",
  gong: "data:audio/wav;base64,UklGRr4HAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZoHAAC2tba2tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1ta=="
};

// ==================================================
// AUDIO SYSTEM
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
// CONFETTI PARTICLE SYSTEM
// ==================================================

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const ConfettiLight: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#a855ff', '#ec4899', '#f59e0b', '#10b981'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Math.random(),
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 3,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.3,
        life: p.life - 0.02
      })).filter(p => p.life > 0));
    };

    const interval = setInterval(animate, 16);
    setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 2000);

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            opacity: p.life
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
};

// ==================================================
// MYSTICAL UI COMPONENTS
// ==================================================

const CosmicBackground: React.FC = () => (
  <div className="fixed inset-0 bg-cosmic-background">
    <div className="absolute inset-0 opacity-30">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-portal-accent rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  </div>
);

const SacredOrnament: React.FC = () => (
  <div className="fixed top-8 right-8 w-16 h-16 opacity-60">
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full text-portal-primary"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="drop-shadow-sm"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M50,20 L55,30 L50,40 L45,30 Z M20,50 L30,45 L40,50 L30,55 Z M50,80 L45,70 L50,60 L55,70 Z M80,50 L70,55 L60,50 L70,45 Z"
        fill="currentColor"
        opacity="0.8"
      />
    </motion.svg>
  </div>
);

const PortalProgress: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="flex items-center space-x-2 text-mystical-ethereal">
    <Sparkles size={16} className="animate-rune-glow" />
    <div className="text-sm font-medium">
      Portal: {Math.round(progress)}%
    </div>
    <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-cosmic-portal"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

// ==================================================
// MAIN QUIZ COMPONENTS
// ==================================================

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const sfx = useSFX();

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-md">
        <motion.div
          className="w-32 h-32 mx-auto mb-8 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-cosmic-portal opacity-20 animate-portal-pulse" />
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full text-portal-primary animate-rune-glow"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            <path d="M50,10 L60,40 L50,50 L40,40 Z" fill="currentColor" />
            <path d="M90,50 L60,60 L50,50 L60,40 Z" fill="currentColor" />
            <path d="M50,90 L40,60 L50,50 L60,60 Z" fill="currentColor" />
            <path d="M10,50 L40,40 L50,50 L40,60 Z" fill="currentColor" />
          </motion.svg>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold mb-4 text-mystical-text bg-cosmic-mystical bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The Portal Awakens
        </motion.h1>

        <motion.p
          className="text-mystical-ethereal mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Beyond the veil of everyday consciousness lies a deeper truth.
          Seven questions will reveal your path through the mystical portal.
        </motion.p>

        <motion.button
          className="px-8 py-4 bg-cosmic-portal text-white rounded-lg font-semibold shadow-portal-glow hover:shadow-rune transition-all duration-300 relative overflow-hidden group"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sfx.play('whoosh');
            onStart();
          }}
        >
          <span className="relative z-10">Begin the Journey</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const QuestionCard: React.FC<{
  question: typeof QUESTIONS[0];
  questionIndex: number;
  totalQuestions: number;
  onSelect: (option: { label: string; points: number }) => void;
}> = ({ question, questionIndex, totalQuestions, onSelect }) => {
  const sfx = useSFX();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelect = (option: { label: string; points: number }) => {
    sfx.play('chime');
    setShowConfetti(true);
    setTimeout(() => {
      onSelect(option);
    }, 300);
  };

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
    >
      <ConfettiLight trigger={showConfetti} />
      
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-between items-center">
          <PortalProgress progress={progress} />
          <div className="text-mystical-whisper text-sm">
            {questionIndex + 1} of {totalQuestions}
          </div>
        </div>

        <motion.div
          className="bg-card/80 backdrop-blur-sm border border-portal-ring rounded-2xl p-8 shadow-portal-glow"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            className="text-2xl font-bold mb-2 text-portal-primary text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {question.headline}
          </motion.h2>

          <motion.p
            className="text-mystical-ethereal text-center mb-8 leading-relaxed"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {question.text}
          </motion.p>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                className="w-full p-4 text-left bg-secondary/50 hover:bg-choice-hover border border-portal-ring/30 rounded-xl transition-all duration-300 hover:shadow-sigil hover:border-portal-primary/50 group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option)}
              >
                <span className="text-mystical-text group-hover:text-portal-primary transition-colors">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const InterludePortal: React.FC<{
  percentage: number;
  onContinue: () => void;
}> = ({ percentage, onContinue }) => {
  const sfx = useSFX();
  const [ritualComplete, setRitualComplete] = useState(false);
  const [ritualStep, setRitualStep] = useState(0);

  const rituals = [
    { text: "Tap the glowing sigil to activate", action: "tap" },
    { text: "Breathe and align your energy", action: "align" },
    { text: "Feel the portal widening", action: "feel" }
  ];

  const currentRitual = rituals[ritualStep];

  const handleRitualAction = () => {
    sfx.play('chime');
    if (ritualStep < rituals.length - 1) {
      setRitualStep(prev => prev + 1);
    } else {
      setRitualComplete(true);
      sfx.play('gong');
      setTimeout(() => {
        onContinue();
      }, 1500);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-md">
        <motion.div
          className="w-40 h-40 mx-auto mb-8 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-cosmic-portal opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-portal-primary cursor-pointer hover:shadow-rune transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRitualAction}
            animate={ritualComplete ? { rotate: 360 } : {}}
            transition={ritualComplete ? { duration: 1 } : {}}
          >
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                className="w-8 h-8 bg-portal-primary rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-4 text-portal-primary"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The portal widens... {percentage}%
        </motion.h2>

        <motion.p
          className="text-mystical-ethereal mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {ritualComplete ? "Energy aligned. Continue your journey..." : currentRitual.text}
        </motion.p>

        {ritualComplete && (
          <motion.div
            className="text-portal-accent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✦ Ritual Complete ✦
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ResultScreen: React.FC<{
  archetype: typeof ARCHETYPES[keyof typeof ARCHETYPES];
  answers: Array<{ id: string; label: string; points: number }>;
  unlocked: boolean;
}> = ({ archetype, answers, unlocked }) => {
  const sfx = useSFX();

  useEffect(() => {
    sfx.play('gong');
  }, [sfx]);

  const generatePersonalizedReflection = () => {
    const selections = answers.map(a => `"${a.label}"`).join(", ");
    return `Your journey revealed choices of ${selections}. Each selection opens a window into your inner landscape, showing where light enters and where shadows still dance.`;
  };

  const generateMicroRituals = () => {
    return answers.map((answer, index) => {
      const rituals = [
        "Take three deep breaths, feeling clarity flow with each exhale.",
        "Write one word that captures your highest aspiration on paper.",
        "Place your hand on your heart and speak one truth aloud.",
        "Light a candle and meditate on your inner flame for 2 minutes.",
        "Draw a simple symbol that represents your spiritual path.",
        "Spend 5 minutes in nature, feeling your connection to all life.",
        "Practice gratitude by naming three things that expand your consciousness."
      ];
      return rituals[index] || "Trust your intuition in this sacred moment.";
    });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          className="bg-card/90 backdrop-blur-sm border border-portal-ring rounded-2xl p-8 shadow-portal-glow text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="absolute inset-0 rounded-full bg-cosmic-portal opacity-40 animate-portal-pulse" />
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                className={`w-12 h-12 rounded-full ${unlocked ? 'bg-portal-accent' : 'bg-muted'} shadow-fragment`}
                animate={unlocked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold mb-4 text-portal-primary"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {archetype.title}
          </motion.h1>

          <motion.p
            className="text-xl text-mystical-ethereal mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {archetype.prose}
          </motion.p>

          <motion.div
            className="text-left space-y-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div>
              <h3 className="text-lg font-semibold text-portal-secondary mb-3">Your Journey Reflection</h3>
              <p className="text-mystical-text leading-relaxed mb-4">
                {generatePersonalizedReflection()}
              </p>
              <p className="text-mystical-text leading-relaxed">
                {archetype.reflection}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-portal-secondary mb-3">Sacred Micro-Rituals</h3>
              <ul className="space-y-2">
                {generateMicroRituals().map((ritual, index) => (
                  <li key={index} className="flex items-start space-x-2 text-mystical-ethereal">
                    <span className="text-portal-accent mt-1">✦</span>
                    <span>{ritual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {unlocked ? (
            <motion.a
              href="https://cerebralshift.gumroad.com/l/uymfree"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-cosmic-portal text-white rounded-lg font-semibold shadow-portal-glow hover:shadow-rune transition-all duration-300 relative overflow-hidden group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sfx.play('chime')}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Receive the Gift</span>
                <motion.div
                  className="w-5 h-5 bg-portal-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.a>
          ) : (
            <motion.div
              className="text-mystical-whisper italic"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              The portal remains closed... yet the book whispers louder.
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================================================
// MAIN QUIZ APPLICATION
// ==================================================

const MysticalPortalQuiz: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'question' | 'interlude' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ id: string; label: string; points: number }>>([]);
  const [muted, setMuted] = useState(false);
  const [milestones, setMilestones] = useState({ reached25: false, reached50: false, reached75: false });

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const getArchetype = (totalScore: number) => {
    if (totalScore <= 5) return ARCHETYPES.asleep;
    if (totalScore <= 12) return ARCHETYPES.seeker;
    if (totalScore <= 18) return ARCHETYPES.alchemist;
    return ARCHETYPES.visionary;
  };

  const handleStart = () => {
    setGameState('question');
  };

  const handleAnswer = (option: { label: string; points: number }) => {
    const newAnswers = [...answers, {
      id: currentQuestion.id,
      label: option.label,
      points: option.points
    }];
    setAnswers(newAnswers);

    // Check for milestone interludes
    const newProgress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
    const shouldShowInterlude = 
      (newProgress >= 25 && !milestones.reached25) ||
      (newProgress >= 50 && !milestones.reached50) ||
      (newProgress >= 75 && !milestones.reached75);

    if (shouldShowInterlude && currentQuestionIndex < QUESTIONS.length - 1) {
      // Update milestones
      const newMilestones = { ...milestones };
      if (newProgress >= 75) newMilestones.reached75 = true;
      else if (newProgress >= 50) newMilestones.reached50 = true;
      else if (newProgress >= 25) newMilestones.reached25 = true;
      setMilestones(newMilestones);
      
      setGameState('interlude');
    } else if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer.points, 0);
      const archetype = getArchetype(totalScore);
      
      // Console log final data
      console.log('Quiz Complete:', {
        score: totalScore,
        archetypeKey: archetype.key,
        archetypeTitle: archetype.title,
        unlocked: archetype.unlocked,
        answers: newAnswers,
        milestones
      });
      
      setGameState('result');
    }
  };

  const handleInterludes = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setGameState('question');
  };

  const totalScore = answers.reduce((sum, answer) => sum + answer.points, 0);
  const archetype = getArchetype(totalScore);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CosmicBackground />
      <SacredOrnament />
      
      {/* Mute Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-card/80 backdrop-blur-sm border border-portal-ring rounded-lg hover:bg-choice-hover transition-colors"
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? (
          <VolumeX size={20} className="text-mystical-whisper" />
        ) : (
          <Volume2 size={20} className="text-portal-primary" />
        )}
      </button>

      <SFXProvider muted={muted}>
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroScreen key="intro" onStart={handleStart} />
          )}
          
          {gameState === 'question' && (
            <QuestionCard
              key={`question-${currentQuestionIndex}`}
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={QUESTIONS.length}
              onSelect={handleAnswer}
            />
          )}
          
          {gameState === 'interlude' && (
            <InterludePortal
              key="interlude"
              percentage={Math.round(progress)}
              onContinue={handleInterludes}
            />
          )}
          
          {gameState === 'result' && (
            <ResultScreen
              key="result"
              archetype={archetype}
              answers={answers}
              unlocked={archetype.unlocked}
            />
          )}
        </AnimatePresence>
      </SFXProvider>
    </div>
  );
};

export default MysticalPortalQuiz;