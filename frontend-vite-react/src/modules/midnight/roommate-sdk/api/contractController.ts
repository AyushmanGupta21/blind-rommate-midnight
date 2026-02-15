import { type Logger } from 'pino';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import * as Rx from 'rxjs';
import { RoommatePrivateStateId, RoommateProviders, DeployedRoommateContract, emptyState, UserAction, type DerivedState, type RoommateMatchPrivateState } from './common-types';
import { RoommateMatch } from '@eddalabs/roommate-contract';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';
import { CompiledContract } from '@midnight-ntwrk/compact-js';

// @ts-expect-error - Mismatch in generated contract types vs compact-js expectations
const roommateCompiledContract = CompiledContract.make('rommate-match', RoommateMatch.Contract as any).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(`${window.location.origin}/midnight/rommate-match`),
) as any;

export interface ContractControllerInterface {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Rx.Observable<DerivedState>;
  verifyProfile: () => Promise<void>;
  recordMatch: () => Promise<void>;
}

export class ContractController implements ContractControllerInterface {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Rx.Observable<DerivedState>;
  readonly privateStates$: Rx.Subject<RoommateMatchPrivateState>;
  readonly actions$: Rx.Subject<UserAction>;

  private constructor(
    public readonly contractPrivateStateId: typeof RoommatePrivateStateId,
    public readonly deployedContract: DeployedRoommateContract,
    public readonly providers: RoommateProviders,
    private readonly logger: Logger,
  ) {
    const combine = (_acc: DerivedState, value: DerivedState): DerivedState => {
      return {
        verifiedProfiles: value.verifiedProfiles,
        successfulMatches: value.successfulMatches,
        privateState: value.privateState,
        actions: value.actions,
      };
    };
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.actions$ = new Rx.Subject<UserAction>();
    this.privateStates$ = new Rx.Subject<RoommateMatchPrivateState>();
    this.state$ = Rx.combineLatest(
      [
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, { type: 'all' })
          .pipe(Rx.map((contractState) => RoommateMatch.ledger(contractState.data))),
        Rx.concat(
          Rx.from(
            Rx.defer(() => providers.privateStateProvider.get(contractPrivateStateId) as Promise<RoommateMatchPrivateState>),
          ),
          this.privateStates$,
        ),
        Rx.concat(Rx.of<UserAction>({ verifyProfile: undefined, recordMatch: undefined }), this.actions$),
      ],
      (ledgerState, privateState, userActions) => {
        const result: DerivedState = {
          verifiedProfiles: ledgerState.verifiedProfiles,
          successfulMatches: ledgerState.successfulMatches,
          privateState: privateState,
          actions: userActions,
        };
        return result;
      },
    ).pipe(
      Rx.scan(combine, emptyState),
      Rx.retry({
        delay: 500,
      }),
    );
  }

  async verifyProfile(): Promise<void> {
    this.logger?.info('verifying profile');
    this.actions$.next({ verifyProfile: 'verifying profile...', recordMatch: undefined });

    try {
      const txData = await this.deployedContract.callTx.verifyProfile();
      this.logger?.trace({
        verifyProfile: {
          message: 'profile verified - blockchain info',
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      this.actions$.next({
        verifyProfile: undefined,
        recordMatch: undefined,
      });
    } catch (e) {
      this.actions$.next({
        verifyProfile: undefined,
        recordMatch: undefined,
      });
      throw e;
    }
  }

  async recordMatch(): Promise<void> {
    this.logger?.info('recording match');
    this.actions$.next({ verifyProfile: undefined, recordMatch: 'recording match...' });

    try {
      const txData = await this.deployedContract.callTx.recordMatch();
      this.logger?.trace({
        recordMatch: {
          message: 'match recorded - blockchain info',
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
      this.actions$.next({
        verifyProfile: undefined,
        recordMatch: undefined,
      });
    } catch (e) {
      this.actions$.next({
        verifyProfile: undefined,
        recordMatch: undefined,
      });
      throw e;
    }
  }

  static async deploy(
    contractPrivateStateId: typeof RoommatePrivateStateId,
    providers: RoommateProviders,
    logger: Logger,
  ): Promise<ContractController> {
    logger.info({
      deployContract: {
        action: "Deploying contract",
        contractPrivateStateId,
        providers
      },
    });
    const deployedContract = await deployContract(providers, {
      compiledContract: roommateCompiledContract,
      privateStateId: contractPrivateStateId,
      initialPrivateState: await ContractController.getPrivateState(contractPrivateStateId, providers.privateStateProvider),
    });

    logger.trace({
      contractDeployed: {
        action: "Contract was deployed",
        contractPrivateStateId,
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    return new ContractController(contractPrivateStateId, deployedContract, providers, logger);
  }

  static async join(
    contractPrivateStateId: typeof RoommatePrivateStateId,
    providers: RoommateProviders,
    contractAddress: ContractAddress,
    logger: Logger,
  ): Promise<ContractController> {
    logger.info({
      joinContract: {
        action: "Joining contract",
        contractPrivateStateId,
        contractAddress,
      },
    });

    const deployedContract = await findDeployedContract(providers, {
      contractAddress,
      compiledContract: roommateCompiledContract,
      privateStateId: contractPrivateStateId,
      initialPrivateState: await ContractController.getPrivateState(contractPrivateStateId, providers.privateStateProvider),
    });

    logger.trace({
      contractJoined: {
        action: "Join the contract successfully",
        contractPrivateStateId,
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    return new ContractController(contractPrivateStateId, deployedContract, providers, logger);
  }

  private static async getPrivateState(
    roommatePrivateStateId: typeof RoommatePrivateStateId,
    privateStateProvider: PrivateStateProvider<typeof RoommatePrivateStateId, RoommateMatchPrivateState>,
  ): Promise<RoommateMatchPrivateState> {
    const existingPrivateState = await privateStateProvider.get(roommatePrivateStateId);
    const initialState = await this.getOrCreateInitialPrivateState(roommatePrivateStateId, privateStateProvider);
    return existingPrivateState ?? initialState;
  }

  static async getOrCreateInitialPrivateState(
    roommatePrivateStateId: typeof RoommatePrivateStateId,
    privateStateProvider: PrivateStateProvider<typeof RoommatePrivateStateId, RoommateMatchPrivateState>,
  ): Promise<RoommateMatchPrivateState> {
    let state = await privateStateProvider.get(roommatePrivateStateId);

    if (state === null) {
      state = this.createPrivateState(0);
      await privateStateProvider.set(roommatePrivateStateId, state);
    }
    return state;
  }

  private static createPrivateState(value: number): RoommateMatchPrivateState {
    return {} as RoommateMatchPrivateState;
  }
}
