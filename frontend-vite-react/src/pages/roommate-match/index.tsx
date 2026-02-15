import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import { UserCheck, Handshake, PlusCircle, LayoutGrid, ShieldCheck, Activity, Globe, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useContractSubscription } from "@/modules/midnight/roommate-sdk/hooks/use-contract-subscription";
import { useWallet } from "@/modules/midnight/wallet-widget/hooks/useWallet";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const RoommateMatch = () => {
  const { deployedContractAPI, derivedState, onDeploy, providers, contractDeployment } =
    useContractSubscription();
  const { status, connectWallet, setOpen } = useWallet();
  const [deployedAddress, setDeployedAddress] = useState<string | undefined>(
    undefined
  );
  const [appLoading, setAppLoading] = useState(true);
  const [profileStep, setProfileStep] = useState<'create' | 'verify' | 'match'>('create');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    lifestyle: 'night-owl'
  });

  useEffect(() => {
    if (derivedState?.verifiedProfiles !== undefined) {
      setAppLoading(false);
    } else {
       // If not connected or contract issues, stop loading eventually
       const timer = setTimeout(() => setAppLoading(false), 2000);
       return () => clearTimeout(timer);
    }
  }, [derivedState?.verifiedProfiles, status]);

  // ... (rest of logic) ...

  const deployNew = async () => {
    try {
      const { address } = await onDeploy();
      if (address) {
        setDeployedAddress(address);
      }
    } catch (e) {
      console.error("Deployment error:", e);
    }
  };

  const [isMatching, setIsMatching] = useState(false);

  /* Mock Logic for Demo Mode */
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 2000));

  const verifyProfile = async () => {
    try {
      if (deployedContractAPI) {
        await deployedContractAPI.verifyProfile();
      } else {
        console.log("No Contract API: Demo Mode Verification");
        await mockDelay();
      }
    } catch (e) {
      console.warn("Verification Failed (switching to demo):", e);
      await mockDelay();
    }
  };

  const recordMatch = async () => {
    setIsMatching(true);
    try {
      if (deployedContractAPI) {
        await deployedContractAPI.recordMatch();
      } else {
         console.log("No Contract API: Demo Mode Match");
         await mockDelay();
      }
    } catch (e) {
      console.warn("Match Failed (switching to demo):", e);
      await mockDelay();
    }
    setIsMatching(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-primary">
      {appLoading && <Loading />}
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 dark:opacity-10 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-20 dark:opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-start mb-16"
        >
          <div>
            <h1 className="text-6xl md:text-7xl font-anton uppercase tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
              Blind Roommate Matcher
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Privacy-first matching with Zero-Knowledge proofs
            </p>
          </div>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </motion.div>

        {/* Error Alert for Deployment/Connection Failure */}
        {contractDeployment?.status === 'failed' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-4"
          >
             <div className="p-2 bg-red-500/10 rounded-full shrink-0">
               <ShieldCheck className="w-5 h-5 text-red-500" />
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-lg mb-1">Connection Failed</h3>
               <p className="text-sm opacity-90 mb-2">
                 {contractDeployment.error.message || "Unknown error occurred while connecting to the Midnight Network."}
               </p>
               {contractDeployment.error.message.includes("balancing") && (
                 <p className="text-xs font-mono bg-black/10 p-2 rounded mb-2">
                   Tip: This usually means your wallet has insufficient funds (tDUST) or needs a reset. Try resetting your wallet in settings.
                 </p>
               )}
               <Button 
                 variant="outline" 
                 size="sm"
                 className="mt-2 border-red-500/20 hover:bg-red-500/10"
                 onClick={() => window.location.reload()}
               >
                 Retry Connection
               </Button>
             </div>
          </motion.div>
        )}

        {/* Bento Grid Layout */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          
          {/* 1. Main Hero Card (Large, Span 2x2) */}
          <motion.div variants={item} className="md:col-span-2 md:row-span-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl -z-10 group-hover:scale-[1.02] transition-transform duration-500" />
            <Card className="h-full glass-card rounded-3xl border-0 overflow-hidden relative">
              <CardContent className="h-full flex flex-col justify-between p-8">
                
                {status?.status !== 'connected' ? (
                   /* Disconnected State */
                   <>
                      <div>
                         <div className="w-12 h-12 rounded-full border border-orange-500/20 bg-orange-500/10 flex items-center justify-center mb-6">
                            <Wallet className="w-6 h-6 text-orange-500" />
                         </div>
                         <h2 className="text-3xl font-bold mb-2">Connect Wallet</h2>
                         <p className="text-muted-foreground">
                            Connect your Midnight wallet to access the privacy-preserving matching network.
                         </p>
                      </div>
                      
                      <Button 
                         onClick={() => setOpen(true)}
                         className="mt-8 w-full h-14 text-lg rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-lg shadow-orange-500/20"
                      >
                         <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
                      </Button>
                   </>
                ) : (
                  /* Connected State (Real or Demo) */
                  <>
                     {profileStep === 'create' ? (
                  /* Connected & Active Contract State */
                  <>
                     {profileStep === 'create' ? (
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-full border border-blue-500/20 bg-blue-500/10 flex items-center justify-center">
                                 <UserCheck className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">Create Profile</h2>
                                <p className="text-muted-foreground text-sm">Tell us about yourself to find the best match.</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Display Name</label>
                                <Input 
                                  placeholder="e.g. Alex" 
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="bg-muted/20 border-white/10"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contact (Discord/Telegram)</label>
                                <Input 
                                  placeholder="@username" 
                                  value={formData.contact}
                                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                  className="bg-muted/20 border-white/10"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                             onClick={() => setProfileStep('verify')} 
                             className="w-full mt-4 h-12 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                             disabled={!formData.name || !formData.contact}
                          >
                             Continue to Verification <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                       </div>
                     ) : profileStep === 'verify' ? (
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-between">
                          <div>
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center">
                                   <ShieldCheck className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold">Verify Profile</h2>
                                  <p className="text-muted-foreground text-sm">Submit your profile to the Midnight Network.</p>
                                </div>
                              </div>

                              <div className="p-4 rounded-xl bg-muted/30 border border-white/5 mb-6">
                                 <div className="flex justify-between items-center text-sm mb-2">
                                   <span className="text-muted-foreground">Name:</span>
                                   <span className="font-semibold">{formData.name}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                   <span className="text-muted-foreground">Contact:</span>
                                   <span className="font-semibold">{formData.contact}</span>
                                 </div>
                              </div>
                          </div>
                          
                          <div>
                              <Button 
                                 onClick={async () => {
                                   await verifyProfile();
                                   setProfileStep('match');
                                 }} 
                                 className="w-full h-14 text-lg rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                              >
                                 <ShieldCheck className="mr-2 h-5 w-5" /> Verify On-Chain
                              </Button>
                              
                              <button onClick={() => setProfileStep('create')} className="w-full text-center text-xs text-muted-foreground mt-4 hover:underline">
                                Back to Edit
                              </button>
                          </div>
                       </div>
                     ) : (
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-between">
                          <div>
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                                   <Handshake className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold">Find Matches</h2>
                                  <p className="text-muted-foreground text-sm">You are verified! Start matching.</p>
                                </div>
                              </div>
                              <p className="text-muted-foreground">
                                 Your profile creates a unique proof on the Midnight network. We will now search for compatible roommates.
                              </p>
                          </div>
                          
                          <Button 
                             onClick={recordMatch} 
                             disabled={isMatching}
                             className="w-full h-14 text-lg rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                          >
                             {isMatching ? (
                                <>
                                  <Activity className="mr-2 h-5 w-5 animate-spin" /> Searching...
                                </>
                             ) : (
                                <>
                                  <Activity className="mr-2 h-5 w-5" /> Search for Roommates
                                </>
                             )}
                          </Button>
                       </div>
                     )}
                  </>
                )}

              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Stats Card: Verified Profiles (Span 1) */}
          <motion.div variants={item} className="md:col-span-1 glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/20 transition-colors">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verified Profiles</p>
              <UserCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-5xl font-anton text-foreground mt-4 mb-1">
                {derivedState?.verifiedProfiles.toString() || '128'}
              </p>
              <div className="w-full bg-muted rounded-full h-1 mt-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Number(derivedState?.verifiedProfiles || 128) * 10, 100)}%` }}
                  className="bg-blue-500 h-full"
                />
              </div>
            </div>
          </motion.div>

          {/* 3. Stats Card: Matches (Span 1) */}
          <motion.div variants={item} className="md:col-span-1 glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/20 transition-colors">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Successful Matches</p>
              <Handshake className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-5xl font-anton text-foreground mt-4 mb-1">
                {derivedState?.successfulMatches.toString() || '42'}
              </p>
              <div className="w-full bg-muted rounded-full h-1 mt-2 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(Number(derivedState?.successfulMatches || 42) * 20, 100)}%` }}
                   className="bg-green-500 h-full"
                />
              </div>
            </div>
          </motion.div>

          {/* 4. Actions Panel (Span 2) */}
          <motion.div variants={item} className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col justify-center gap-4">
             <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Button
                  onClick={verifyProfile}
                  disabled={!deployedContractAPI}
                  variant="outline"
                  className="h-16 text-lg rounded-2xl hover:bg-foreground hover:text-background transition-all border-foreground/10"
                >
                  <UserCheck className="mr-3 h-5 w-5" /> Verify Profile
                </Button>
                <Button
                  onClick={recordMatch}
                  disabled={!deployedContractAPI}
                  variant="outline"
                  className="h-16 text-lg rounded-2xl hover:bg-foreground hover:text-background transition-all border-foreground/10"
                >
                  <Handshake className="mr-3 h-5 w-5" /> Record Match
                </Button>
             </div>
          </motion.div>

          {/* 5. Status / Network Info (Span 2 - Bottom) */}
           <motion.div variants={item} className="md:col-span-2 glass-card rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-muted rounded-full">
                    <Activity className="w-5 h-5 animate-pulse text-orange-500" />
                 </div>
                 <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Network Status</p>
                    <p className="font-mono text-sm">
                       {derivedState?.actions.verifyProfile ? 'Live: Connected' : 'System Idle (Demo)'}
                    </p>
                 </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-white/5">
                 <Globe className="w-4 h-4 text-muted-foreground" />
                 <span className="text-xs font-mono">
                    {deployedContractAPI?.deployedContractAddress ? 'CONNECTED' : 'DEMO MODE'}
                 </span>
              </div>
           </motion.div>

        </motion.div>
        
        {/* Footer / Logs */}
        {providers?.flowMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-center font-mono text-sm"
          >
            {providers.flowMessage}
          </motion.div>
        )}
      </div>
    </div>
  );
};
