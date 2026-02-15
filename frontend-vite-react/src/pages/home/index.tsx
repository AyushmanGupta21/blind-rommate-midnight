import { useNavigate } from '@tanstack/react-router';
import { Wallet, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { motion } from 'framer-motion';
import { MagicBento, BentoCardProps } from '@/components/magic-bento';

export function Home() {
  const navigate = useNavigate();

  const bentoItems: BentoCardProps[] = [
    {
      title: 'Wallet Widget',
      description: 'Connect and manage your Midnight wallet with seamless integration.',
      label: 'Core',
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
      onClick: () => navigate({ to: '/wallet-ui' }),
      color: '#0f172a', // Slate 900
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'Roommate Match',
      description: 'Privacy-preserving matching using Zero-Knowledge proofs.',
      label: 'dApp',
      icon: <Users className="w-6 h-6 text-green-500" />,
      onClick: () => navigate({ to: '/roommate-match' }),
      color: '#052e16', // Green 950
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'Secure',
      description: 'Enterprise-grade encryption',
      label: 'Feature',
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      color: '#1e1b4b', // Indigo 950
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'Fast',
      description: 'Lightning speed performance',
      label: 'Performance',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      color: '#422006', // Yellow 950
      className: 'md:col-span-1 md:row-span-1'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-primary overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] opacity-30 dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-screen justify-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-start mb-12"
        >
           <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-widest font-bold mb-6">
                <Zap className="w-3 h-3" /> Midnight Network
             </div>
             <h1 className="text-6xl md:text-8xl font-anton uppercase tracking-tight mb-6 leading-[0.9]">
               Blind <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/40">Roommate</span>
             </h1>
             <p className="text-xl md:text-2xl font-serif italic text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
               <span>Find your perfect match.</span>
               <span className="hidden sm:inline w-1 h-1 bg-foreground/20 rounded-full" />
               <span className="flex items-center gap-2 text-foreground/80 not-italic font-sans text-base bg-foreground/5 px-3 py-1 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Private
               </span>
             </p>
           </div>
           <div className="hidden md:block">
             <ModeToggle />
           </div>
        </motion.div>
        
        {/* Magic Bento Grid */}
        <div className="w-full flex justify-center">
          <MagicBento 
            items={bentoItems}
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
          />
        </div>
        
        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-8 border-t border-border/40 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm"
        >
          <p>&copy; 2026 Midnight Starter Template</p>
          <p className="flex items-center gap-2 mt-2 md:mt-0">
            Powered by <span className="font-bold text-foreground">Midnight Network</span>
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}

