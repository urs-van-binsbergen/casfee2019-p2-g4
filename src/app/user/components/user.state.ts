import { AuthUser } from 'src/app/auth/auth-state.service';
import { User, PlayerLevel } from '@cloud-api/core-models';

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
}

export function getInitialState(): State {
    console.log('getInitialState');
    return {
        isAuthenticated: false,
        isDataLoaded: false,
        isMissingData: false,
        delayHandle: 0
    };
}

export function reduceWithAuthUser(state: State, authUser: AuthUser): State {
    console.log('reduceWithAuthUser');
    const isAuthChange = state.uid !== authUser.uid; // means we expect the data will arrive soon after
    return {
        isAuthenticated: true,
        uid: authUser.uid,
        displayName: authUser.displayName,
        email: authUser.email,
        emailVerified: authUser.emailVerified,

        isDataLoaded: isAuthChange ? false : state.isDataLoaded,
        isMissingData: isAuthChange ? false : state.isMissingData,
        level: isAuthChange ? '...' : state.level,
        dataDisplayName: isAuthChange ? authUser.displayName : state.dataDisplayName,
        dataEmail: isAuthChange ? authUser.email : state.dataEmail,

        delayHandle: isAuthChange ? state.delayHandle + 1 : state.delayHandle
    }
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

export function reduceWithData(state: State, user: User): State {
    console.log('reduceWithData');
    return {
        ...state,
        isDataLoaded: true,
        isMissingData: false,
        level: PlayerLevel[user.level],
        dataDisplayName: user.displayName,
        dataEmail: user.email,
        delayHandle: state.delayHandle + 1
    }
}

export function reduceWithMissingData(state: State): State {
    console.log('reduceWithMissingData');
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
    }
}
