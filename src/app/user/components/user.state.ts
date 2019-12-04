import { AuthUser } from 'src/app/auth/auth-state.service';
import * as BattleListState from './my-battle-list.state';
import { User, PlayerLevel, HistoricBattle } from '@cloud-api/core-models';


export interface State {

    isAuthenticated: boolean;
    uid?: string;
    displayName?: string;
    email?: string;
    emailVerified?: boolean;

    isDataLoaded: boolean;
    isMissingData: boolean;
    level?: string;
    dataDisplayName?: string;
    dataEmail?: string;

    delayHandle: number;

    myBattleList?: BattleListState.MyBattleListState;
}

export function getInitialState(): State {
    console.log('getInitialState');
    return {
        isAuthenticated: false,
        isDataLoaded: false,
        isMissingData: false,
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
            isDataLoaded: false,
            isMissingData: false,
            level: '...',
            dataDisplayName: authUser.displayName,
            dataEmail: authUser.email,
            delayHandle: state.delayHandle + 1,
            myBattleList: BattleListState.getInitialState(authUser.uid)
        };
    }

    return {
        ...state,
        ...authState
    };
}

export function reduceWithUnauthenticedState(): State {
    console.log('reduceWithUnauthenticedState');
    return {
        isAuthenticated: false,
        isDataLoaded: false,
        isMissingData: false,
        delayHandle: 0
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

export function reduceWithMissingUserData(state: State): State {
    console.log('reduceWithMissingUserData');
    return {
        ...state,
        isDataLoaded: true,
        isMissingData: true,
        level: undefined,
        dataDisplayName: undefined,
        dataEmail: undefined,
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

export function reduceWithHistoricBattles(state: State, battles: HistoricBattle[]): State {
    return {
        ...state,
        myBattleList: BattleListState.reduceFromData(state.myBattleList, battles)
    };
}
