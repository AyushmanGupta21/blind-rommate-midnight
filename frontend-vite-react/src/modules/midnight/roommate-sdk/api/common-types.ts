import { RoommateMatch } from '@eddalabs/roommate-contract';
import type { ImpureCircuitId } from '@midnight-ntwrk/compact-js';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

export type RoommateMatchPrivateState = Record<string, never>;

export type RoommateCircuits = ImpureCircuitId<any>;

export const RoommatePrivateStateId = 'roommatePrivateState';

export type RoommateProviders = MidnightProviders<RoommateCircuits, typeof RoommatePrivateStateId, RoommateMatchPrivateState>;

export type RoommateContract = any;

export type DeployedRoommateContract = DeployedContract<RoommateContract> | FoundContract<RoommateContract>;

export type UserAction = {
  verifyProfile: string | undefined;
  recordMatch: string | undefined;
};

export type DerivedState = {
  readonly verifiedProfiles: bigint;
  readonly successfulMatches: bigint;
  readonly privateState: RoommateMatchPrivateState;
  readonly actions: UserAction;
};

export const emptyState: DerivedState = {
  verifiedProfiles: 0n,
  successfulMatches: 0n,
  privateState: {} as RoommateMatchPrivateState,
  actions: { verifyProfile: undefined, recordMatch: undefined },
};
