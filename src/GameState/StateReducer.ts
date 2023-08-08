import { TPiece, getScoreOfPiece } from "../Piece/Piece";
import { Coordinate, GameState } from "./GameState";

export default function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "playerSelectedAPiece": {
            return {
                ...state,
                selectedPiece: action.piece,
                selectedLocation: shiftedLocation(
                    action.piece.shape.length,
                    action.piece.shape[0].length,
                    state.selectedLocation,
                ),
            };
        }
        case "playerMovedSelectedPiece": {
            const changedCoordinate = (dir: "u" | "d" | "r" | "l") => {
                switch (dir) {
                    case "u": {
                        return state.selectedLocation.row > 0
                            ? { row: state.selectedLocation.row - 1 }
                            : { row: state.selectedLocation.row };
                    }
                    case "d": {
                        return state.selectedLocation.row +
                            (state.selectedPiece?.shape.length || 0) <=
                            14
                            ? { row: state.selectedLocation.row + 1 }
                            : { row: state.selectedLocation.row };
                    }
                    case "r": {
                        return state.selectedLocation.col +
                            (state.selectedPiece?.shape[0].length || 0) <=
                            14
                            ? { col: state.selectedLocation.col + 1 }
                            : { col: state.selectedLocation.col };
                    }
                    case "l": {
                        return state.selectedLocation.col > 0
                            ? { col: state.selectedLocation.col - 1 }
                            : { col: state.selectedLocation.col };
                    }
                }
            };
            return {
                ...state,
                selectedLocation: {
                    ...state.selectedLocation,
                    ...changedCoordinate(action.dir),
                },
            };
        }
        case "playerRotatedSelectedPiece": {
            const prevShape: boolean[][] = action.piece.shape;
            const rotatedPiece = (): TPiece => {
                const newShape = Array(prevShape[0].length)
                    .fill(null)
                    .map((_, rowIndex) => {
                        return Array(prevShape.length)
                            .fill(null)
                            .map((_, colIndex) => {
                                return prevShape[colIndex][rowIndex];
                            })
                            .reverse();
                    });
                return {
                    key: action.piece.key,
                    player: action.piece.player,
                    shape: newShape,
                };
            };
            return {
                ...state,
                selectedPiece: rotatedPiece(),
                selectedLocation: shiftedLocation(
                    action.piece.shape[0].length,
                    action.piece.shape.length,
                    state.selectedLocation,
                ),
            };
        }

        case "playerMadeAMove": {
            const filterFn = (piece: TPiece) => piece.key != action.piece.key;
            const p1Inventory =
                action.piece.player === "p1"
                    ? state.p1Inventory.filter(filterFn)
                    : state.p1Inventory;
            const p2Inventory =
                action.piece.player === "p2"
                    ? state.p2Inventory.filter(filterFn)
                    : state.p2Inventory;

            const pieceScore = getScoreOfPiece(action.piece);

            return {
                ...state,
                onBoard: [
                    ...state.onBoard,
                    { piece: action.piece, coord: action.coord },
                ],
                p1Inventory,
                p2Inventory,
                score:
                    action.piece.player === "p1"
                        ? [state.score[0] + pieceScore, state.score[1]]
                        : [state.score[0], state.score[1] + pieceScore],
                turn:
                    state.turn == "p1"
                        ? state.hasStoppedPlaying[1]
                            ? "p1"
                            : "p2"
                        : state.hasStoppedPlaying[0]
                        ? "p2"
                        : "p1",
                selectedPiece: undefined,
                selectedLocation: { row: 6, col: 6 },
            };
        }
        case "updateHasStoppedPlaying": {
            if (state.turn == "p1") {
                return {
                    ...state,
                    ongoingGame: state.hasStoppedPlaying[1] ? false : true,
                    turn: "p2",
                    hasStoppedPlaying: [true, state.hasStoppedPlaying[1]],
                };
            } else {
                return {
                    ...state,
                    ongoingGame: state.hasStoppedPlaying[0] ? false : true,
                    turn: "p1",
                    hasStoppedPlaying: [state.hasStoppedPlaying[0], true],
                };
            }
        }
        case "playerClickedHelp": {
            return {
                ...state,
                page: state.page == "game" ? "help" : "game",
            };
        }
        default:
            return state;
    }
}

function shiftedLocation(
    newRowLength: number,
    newColLength: number,
    oldCoordinate: Coordinate,
): Coordinate {
    const shiftedCoord: Coordinate = { ...oldCoordinate };
    if (oldCoordinate.row + newRowLength > 15) {
        shiftedCoord.row -= oldCoordinate.row + newRowLength - 15;
    }
    if (oldCoordinate.col + newColLength > 15) {
        shiftedCoord.col -= oldCoordinate.col + newColLength - 15;
    }
    return shiftedCoord;
}

type Action =
    | {
          type: "updateHasStoppedPlaying";
      }
    | { type: "playerMadeAMove"; piece: TPiece; coord: Coordinate }
    | { type: "playerSelectedAPiece"; piece: TPiece }
    | { type: "playerMovedSelectedPiece"; dir: "u" | "d" | "r" | "l" }
    | { type: "playerRotatedSelectedPiece"; piece: TPiece }
    | { type: "playerClickedHelp" };
