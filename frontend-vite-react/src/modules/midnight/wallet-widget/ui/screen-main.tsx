import { useWallet } from "../hooks/useWallet";
import { useWalletList } from "../hooks/useWalletList";
import { walletsListFormat } from "./common/common-values";
import { TooltipProvider } from "./common/tooltip";
import WalletIcon from "./wallet-icon";

export default function ScreenMain({ selectedNetwork, setOpen }: { selectedNetwork: string; setOpen: Function }) {
  const wallets = useWalletList();
  const { connectWallet } = useWallet();

  return (
    <TooltipProvider>
      <div
        className="grid gap-4 py-7 place-items-center gap-y-8"
        style={{
          gridTemplateColumns: `repeat(${wallets.length}, minmax(0, 1fr))`,
        }}
      >
        {wallets.map((wallet, index) => {
          const config = walletsListFormat[wallet.name];
          if (!config) return null; // Skip rendering if config is not found
          const displayName = config.displayName;
          const icon = config.icon;

          return (
            <WalletIcon
              key={index}
              iconReactNode={icon}
              name={displayName}
              action={async () => {
                 const rdns = wallet.rdns; 
                 if (connectWallet) {
                    await connectWallet(rdns, selectedNetwork);
                    // Do not close dialog here to allow error display in parent if connection fails.
                    // If successful, the user can close it or we can add a listener to status change.
                    // setOpen(false); 
                 }
              }}
            />
          );
        })}
      </div>
    </TooltipProvider>
  );
}

