import { Link, useRouterState } from '@tanstack/react-router';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Wallet, Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/roommate-match', label: 'Roommate Match', icon: Users },
    { to: '/wallet-ui', label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      
      {/* Floating Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-4",
          scrolled ? "py-2" : "py-6"
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto rounded-full transition-all duration-300 flex items-center justify-between px-6 py-3",
          scrolled 
            ? "bg-background/70 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5" 
            : "bg-transparent border border-transparent"
        )}>
           
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                 <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-anton font-bold text-lg tracking-wider group-hover:opacity-80 transition-opacity">
                MIDNIGHT
              </span>
           </Link>

           {/* Desktop Nav */}
           <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = router.location.pathname === item.to;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 group",
                      isActive 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover Glow Effect */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-muted/50 scale-0 group-hover:scale-100 transition-transform duration-200 -z-10" />
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
           </nav>

           {/* Mobile Menu Toggle */}
           <button 
             className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-4 right-4 z-40 bg-card/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl md:hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const isActive = router.location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24">
        {children}
      </main>
    </div>
  );
};