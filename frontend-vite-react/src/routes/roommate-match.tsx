import { createFileRoute } from '@tanstack/react-router';
import { RoommateMatch } from '@/pages/roommate-match';
import { MidnightMeshProvider } from "@/modules/midnight/wallet-widget/contexts/wallet";
import { RoommateAppProvider } from "@/modules/midnight/roommate-sdk/contexts";
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import * as pino from "pino";

const logger = pino.pino({
  level: "trace",
});

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as ContractAddress;

function RoommateMatchWithProviders() {
  if (!contractAddress) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
        <p className="text-muted-foreground">
          Contract address not found. Please set VITE_CONTRACT_ADDRESS in your .env file.
        </p>
      </div>
    );
  }

  return (
    <MidnightMeshProvider logger={logger}>
      <RoommateAppProvider logger={logger} contractAddress={contractAddress}>
        <RoommateMatch />
      </RoommateAppProvider>
    </MidnightMeshProvider>
  );
}

export const Route = createFileRoute('/roommate-match')({
  component: RoommateMatchWithProviders,
});
