import { FieldStatus } from '@cloud-api/core-models';
import { Pos } from '@cloud-api/geometry';

export interface BattleField {
    pos: Pos;
    status: FieldStatus;
    shooting: boolean;
    shootable: boolean;
}

export interface Row {
    fields: BattleField[];
}

export interface BattleShip {
    pos: Pos;
    length: number;
    design: number;
    isVertical: boolean;
    isSunk: boolean;
}

export interface BattleBoard {
    rows: Row[];
    ships: BattleShip[];
    canShoot: boolean;
    isShooting: boolean;
    sunkShipsCount: number;
    currentShotTarget?: Pos;
    currentShotResult?: FieldStatus;
    currentShotDidSinkAShip?: boolean;
}
