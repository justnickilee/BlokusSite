/**
 * gameState: TGameState {
        States: 
            p1Turn: Boolean
            onBoard: BoardPiece[] {
                piece: TPiece {
                    id: string
                    player: string
                    shape: Boolean[][]
                }
                coord: Coordinate {
                    row: Number
                    col: Number
                }
            }
            p1Inventory: TPiece[] {
                piece: TPiece {
                    id: string
                    player: string
                    shape: Boolean[][]
                }
            }
            p2Inventory: TPiece[] {
                piece: TPiece {
                    id: string
                    player: string
                    shape: Boolean[][]
                }
            }
            score: Number[0,0]
            hasStoppedPlaying: Boolean[false, false]
    }
 */

// import { TPiece } from "../Piece/Piece";
// import { BoardPiece, Coordinate } from "./GameState";

// type newMoveProps = {
//     newPiece: TPiece,
//     coord: Coordinate,
//     currentOnBoard: BoardPiece[],
//     p1Inventory: TPiece[],
//     p2Inventory: TPiece[],
//     p1Turn: Boolean,
//     currentScore: number[]
// }

// function registerMove(props: newMoveProps): void {
//     getNewOnBoardState(props.newPiece, props.coord, props.currentOnBoard);
//     getNewPlayerInventoryState(props.newPiece, props.p1Inventory, props.p2Inventory);
//     getNewScoreState(props.newPiece, props.currentScore);
// }

// function getNewOnBoardState(newPiece: TPiece, coord: Coordinate, currentOnBoard: BoardPiece[]): BoardPiece[] {return [];}

// function getNewPlayerInventoryState(playedPiece: TPiece, p1Inventory: TPiece[], p2Inventory: TPiece[]): TPiece[] {return [];}

// function getNewScoreState(playedPiece: TPiece, currentScore: number[]): number[] {return [];}

// function registerPlayingState(currentPlayingState: Boolean[], p1Turn: Boolean): void {
//     getNewPlayingState(currentPlayingState, p1Turn);
// }

// function getNewPlayingState(currentState: Boolean[], p1Turn: Boolean): Boolean[] {return []}

// function changeTurn(p1Turn: Boolean): void {}
