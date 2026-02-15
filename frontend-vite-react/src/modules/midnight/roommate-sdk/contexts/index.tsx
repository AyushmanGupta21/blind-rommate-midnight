import { DeployedProvider } from './roommate-deployment';
import { LocalStorageProvider } from './roommate-localStorage';
import { Provider } from './roommate-providers';
import { Logger } from 'pino';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';

export * from './roommate-providers';
export * from './roommate-localStorage';
export * from './roommate-localStorage-class';
export * from './roommate-deployment';
export * from './roommate-deployment-class';

interface AppProviderProps {
  children: React.ReactNode;
  logger: Logger;  
  contractAddress: ContractAddress;
}

export const RoommateAppProvider = ({ children, logger, contractAddress }: AppProviderProps) => {
  return (
    <LocalStorageProvider logger={logger}>
      <Provider logger={logger}>
        <DeployedProvider logger={logger} contractAddress={contractAddress}>
          {children}
        </DeployedProvider>
      </Provider>
    </LocalStorageProvider>
  );
};
