import { AuthUser } from 'src/app/auth/auth-state.service';
import * as BattleListState from './my-battle-list.state';
import { User, PlayerLevel, HistoricBattle, HallEntry } from '@cloud-api/core-models';


interface DataState {
    isDataLoaded: boolean;
    isMissingData: boolean;
    level?: string;
    dataDisplayName?: string;
    dataEmail?: string;
}

export interface State extends DataState {
    isAuthenticated: boolean;
    uid?: string;
    displayName?: string;
    email?: string;
    emailVerified?: boolean;

    delayHandle: number;

    myBattleList?: BattleListState.MyBattleListState;
}

function getInitialDataState(): DataState {
    return {
        isDataLoaded: false,
        isMissingData: false,
        level: undefined,
        dataDisplayName: undefined,
        dataEmail: undefined,
    }
}

export function getInitialState(): State {
    console.log('getInitialState');
    return {
        isAuthenticated: false,
        ...getInitialDataState(),
        delayHandle: 0,
    };
}

export function reduceWithAuthUser(state: State, authUser: AuthUser): State {
    console.log('reduceWithAuthUser');
    const authState = {
        isAuthenticated: true,
        uid: authUser.uid,
        displayName: authUser.displayName,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
    };

    const isAuthChange = state.uid !== authUser.uid;
    if (isAuthChange) {
        return {
            ...authState,
            ...getInitialDataState(),
            dataDisplayName: authState.displayName,
            dataEmail: authState.email,
            delayHandle: state.delayHandle + 1,
            myBattleList: BattleListState.getInitialState(authUser.uid)
        };
    }

    return {
        ...state,
        ...authState
    };
}

export function reduceWithUnauthenticatedState(): State {
    console.log('reduceWithUnauthenticatedState');
    return {
        isAuthenticated: false,
        ...getInitialDataState(),
        delayHandle: 0,
    };
}

export function reduceWithUserData(state: State, user: User): State {
    console.log('reduceWithUserData');
    return {
        ...state,
        isDataLoaded: true,
        isMissingData: false,
        level: PlayerLevel[user.level],
        dataDisplayName: user.displayName,
        dataEmail: user.email,
        delayHandle: state.delayHandle + 1
    };
}

export function reduceWithUserDataMissing(state: State): State {
    console.log('reduceWithMissingUserData');
    return {
        ...state,
        ...getInitialDataState(),
        isDataLoaded: true,
        isMissingData: true,
        delayHandle: state.delayHandle + 1
    };
}

export function reduceWithUserDataLoadFailure(state: State): State {
    console.log('reduceWithUserDataLoadFailure');
    return {
        ...state,
        ...getInitialDataState(),
        delayHandle: state.delayHandle + 1
    };
}

export function reduceWithDelayCancel(state: State, handle: number): State {
    if (!handle) {
        console.log('reduceWithDelayCancel', 'no delay');
        return state;
    }
    if (handle !== state.delayHandle) {
        console.log('reduceWithDelayCancel', 'ignore handle', handle, 'when handle in state is', state.delayHandle);
        return state;
    }
    console.log('reduceWithDelayCancel', 'cancel', handle);
    return {
        ...state,
        delayHandle: 0
    };
}

export function reduceWithHistoricBattles(state: State, battles: HistoricBattle[], hallEntries: HallEntry[]): State {
    console.log('reduceWithHistoricBattles');
    return {
        ...state,
        myBattleList: BattleListState.reduceFromData(state.myBattleList, battles, hallEntries)
    };
}

export function reduceWithHistoricBattlesLoadFailure(state: State): State {
    console.log('reduceWithHistoricBattlesLoadFailure');
    return {
        ...state,
        myBattleList: BattleListState.reduceFromLoadFailure(state.myBattleList)
    };
}
