import { PreparationDrop, PreparationShip, boardHeight, boardWidth, numberOfShips } from './preparation-models';
import { Orientation, Pos } from '@cloud-api/geometry';
import { Ship } from '@cloud-api/core-models';
import deepClone from 'clone-deep';

function isPreparationShipOnBoard(ship: PreparationShip): boolean {
    for (const pos of ship.positions) {
        if (pos.x < 0 || boardWidth <= pos.x || pos.y < 0 || boardHeight <= pos.y) {
            return false;
        }
    }
    return true;
}

function arePreparationShipsClashing(ship1: PreparationShip, ship2: PreparationShip) {
    if (ship1.key !== ship2.key) {
        for (const pos1 of ship1.positions) {
            for (const pos2 of ship2.positions) {
                if (pos1.x === pos2.x && pos1.y === pos2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

function updatePreparationShip(preparationShip: PreparationShip) {
    const rotation = preparationShip.rotation;
    const length = preparationShip.length;
    const center = preparationShip.center;
    let pos: Pos;
    switch (rotation) {
        case 0:
            switch (length) {
                case 2:
                    pos = { x: center.x, y: center.y };
                    break;
                case 3:
                    pos = { x: center.x, y: (center.y - 1) };
                    break;
                default:
                    pos = { x: center.x, y: (center.y - 1) };
                    break;
            }
            break;
        case 90:
            switch (length) {
                case 2:
                    pos = { x: (center.x - 1), y: center.y };
                    break;
                case 3:
                    pos = { x: (center.x - 1), y: center.y };
                    break;
                default:
                    pos = { x: (center.x - 2), y: center.y };
                    break;
            }
            break;
        case 180:
            switch (length) {
                case 2:
                    pos = { x: center.x, y: (center.y - 1) };
                    break;
                case 3:
                    pos = { x: center.x, y: (center.y - 1) };
                    break;
                default:
                    pos = { x: center.x, y: (center.y - 2) };
                    break;
            }
            break;
        default:
            switch (length) {
                case 2:
                    pos = { x: (center.x), y: center.y };
                    break;
                case 3:
                    pos = { x: (center.x - 1), y: center.y };
                    break;
                default:
                    pos = { x: (center.x - 1), y: center.y };
                    break;
            }
            break;
    }
    let centerVertical: number;
    let centerHorizontal: number;
    switch (rotation) {
        case 0:
            centerHorizontal = 50;
            switch (length) {
                case 2:
                    centerVertical = 25;
                    break;
                case 3:
                    centerVertical = 50;
                    break;
                default:
                    centerVertical = 37.5;
                    break;
            }
            break;
        case 90:
            centerVertical = 50;
            switch (length) {
                case 2:
                    centerHorizontal = 75;
                    break;
                case 3:
                    centerHorizontal = 50;
                    break;
                default:
                    centerHorizontal = 62.5;
                    break;
            }
            break;
        case 180:
            centerHorizontal = 50;
            switch (length) {
                case 2:
                    centerVertical = 75;
                    break;
                case 3:
                    centerVertical = 50;
                    break;
                default:
                    centerVertical = 62.5;
                    break;
            }
            break;
        default:
            centerVertical = 50;
            switch (length) {
                case 2:
                    centerHorizontal = 25;
                    break;
                case 3:
                    centerHorizontal = 50;
                    break;
                default:
                    centerHorizontal = 37.5;
                    break;
            }
            break;
    }
    let isVertical: boolean;
    const positions: Pos[] = [];
    switch (rotation) {
        case 0:
        case 180:
            isVertical = true;
            for (let y = pos.y; y < (pos.y + length); y++) {
                positions.push({ x: pos.x, y });
            }
            break;
        default:
            isVertical = false;
            for (let x = pos.x; x < (pos.x + length); x++) {
                positions.push({ x, y: pos.y });
            }
            break;
    }
    preparationShip.pos = pos;
    preparationShip.positions = positions;
    preparationShip.centerHorizontal = centerHorizontal;
    preparationShip.centerVertical = centerVertical;
    preparationShip.isVertical = isVertical;
}

function updatePreparationShips(ships: PreparationShip[]) {
    for (const ship of ships) {
        ship.isOk = true;
    }
    for (const ship1 of ships) {
        if (isPreparationShipOnBoard(ship1)) {
            for (const ship2 of ships) {
                if (arePreparationShipsClashing(ship1, ship2)) {
                    ship1.isOk = false;
                    ship2.isOk = false;
                }
            }
        } else {
            ship1.isOk = false;
        }
    }
}

export function initPreparationShips(ships: PreparationShip[]) {
    for (const ship of ships) {
        updatePreparationShip(ship);
    }
    updatePreparationShips(ships);
}

function updatePreparationShipWithDrop(state: PreparationShip, action: PreparationDrop): PreparationShip {
    const preparationShip: PreparationShip = deepClone(state);
    preparationShip.center = {
        x: state.center.x + action.pos.x - state.pos.x,
        y: state.center.y + action.pos.y - state.pos.y,
    };
    updatePreparationShip(preparationShip);
    return preparationShip;
}

export function updatePreparationWithDrop(
    state: PreparationShip[],
    action: PreparationDrop,
    yard: PreparationShip[]
): PreparationShip[] {
    const yardShips: PreparationShip[] = yard && action ? yard.filter((s: PreparationShip) => {
        return s.key === action.key;
    }) : [];
    const preparation: PreparationShip[] = state ? [...state, ...yardShips] : [...yardShips];
    const preparationShips: PreparationShip[] = preparation.map((s: PreparationShip) => {
        let preparationShip: PreparationShip;
        if (action && s.key === action.key) {
            preparationShip = updatePreparationShipWithDrop(s, action);
        } else {
            preparationShip = deepClone(s);
        }
        return preparationShip;
    });
    updatePreparationShips(preparationShips);
    return preparationShips;
}

function updatePreparationShipWithRotation(state: PreparationShip): PreparationShip {
    const preparationShip: PreparationShip = deepClone(state);
    preparationShip.rotation = (preparationShip.rotation + 90) % 360;
    updatePreparationShip(preparationShip);
    return preparationShip;
}

export function updatePreparationWithRotation(state: PreparationShip[], action: number): PreparationShip[] {
    if (state) {
        const preparationShips = state.map((s: PreparationShip) => {
            let preparationShip: PreparationShip;
            if (action && s.key === action) {
                preparationShip = updatePreparationShipWithRotation(s);
            } else {
                preparationShip = deepClone(s);
            }
            return preparationShip;
        });
        updatePreparationShips(preparationShips);
        return preparationShips;
    }
    return [];
}

export function updateYardWithDrop(state: PreparationShip[], action: PreparationDrop): PreparationShip[] {
    if (state) {
        const yard: PreparationShip[] = deepClone(state);
        if (action) {
            const preparationShips = yard.filter((s: PreparationShip) => {
                return s.key !== action.key;
            });
            return preparationShips;
        }
        return yard;
    }
    return [];
}

export function updateValidWithPreparation(state: boolean, action: PreparationShip[]): boolean {
    if (action) {
        if (action.length !== numberOfShips) {
            return false;
        }
        for (const ship of action) {
            if (!(ship.isOk)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function shipPos(preparationShip: PreparationShip): Pos {
    switch (preparationShip.rotation) {
        case 0:
            return preparationShip.pos;
        case 90:
            return {
                x: preparationShip.pos.x + preparationShip.length - 1,
                y: preparationShip.pos.y
            };
        case 180:
            return {
                x: preparationShip.pos.x,
                y: preparationShip.pos.y + preparationShip.length - 1
            };
        default:
            return preparationShip.pos;
    }
}

function shipOrientation(preparationShip: PreparationShip): Orientation {
    switch (preparationShip.rotation) {
        case 0:
            return Orientation.South;
        case 90:
            return Orientation.West;
        case 180:
            return Orientation.North;
        default:
            return Orientation.East;
    }
}

function shipDesign(preparationShip: PreparationShip) {
    return preparationShip.key;
}

export function createShips(preparationShips: PreparationShip[]): Ship[] {
    if (preparationShips) {
        const ships = preparationShips.map((preparationShip: PreparationShip) => {
            const pos = shipPos(preparationShip);
            const length = preparationShip.length;
            const orientation = shipOrientation(preparationShip);
            const design = shipDesign(preparationShip);
            const ship: Ship = {
                pos,
                length,
                orientation,
                design,
                isSunk: false,
                hits: [],
            };
            return ship;
        });
        return ships;
    }
    return [];
}
