import { useId, useReducer, useEffect } from "react";
import { TPiece, getScoreOfPiece } from "../Piece/Piece";
import Board, { BoardNavigation, TBoardUnit, getBoard } from "../Board/Board";
import Inventory from "../Inventory/Inventory";
import pageCSS from "./page.module.css";
import clsx from "clsx";

export type Coordinate = {
    row: number;
    col: number;
};

export type BoardPiece = {
    piece: TPiece;
    coord: Coordinate;
};

// use react context to pass this state down to all the children https://react.dev/learn/passing-data-deeply-with-context

export type GameState = {
    ongoingGame: boolean;
    onBoard: BoardPiece[];
    p1Inventory: TPiece[];
    p2Inventory: TPiece[];
    turn: "p1" | "p2";
    score: [number, number];
    hasStoppedPlaying: [boolean, boolean];
    selectedPiece: TPiece | undefined;
    selectedLocation: Coordinate;
};

const initialPieceShapes: boolean[][][] = [
    [[true]],
    [[true, true]],
    [[true, true, true]],
    [[true, true, true, true]],
    [
        [true, true],
        [true, false],
    ],
    [
        [true, false],
        [true, true],
        [true, false],
    ],
    [
        [true, true],
        [true, false],
        [true, false],
    ],
    [
        [true, false],
        [true, true],
        [false, true],
    ],
    [
        [true, true],
        [true, true],
    ],
    [
        [true, true],
        [true, true],
        [true, false],
    ],
    [
        [true, true],
        [false, true],
        [true, true],
    ],
    [
        [false, true, false],
        [true, true, true],
        [false, true, false],
    ],
    [
        [true, false, false],
        [true, true, true],
        [false, false, true],
    ],
    [
        [true, true, false],
        [false, true, true],
        [false, false, true],
    ],
    [
        [true, false],
        [true, true],
        [false, true],
        [false, true],
    ],
    [
        [true, true, true, true],
        [false, true, false, false],
    ],
    [
        [true, true, false],
        [false, true, true],
        [false, true, false],
    ],
    [
        [true, true, true],
        [false, true, false],
        [false, true, false],
    ],
    [
        [true, true, true],
        [true, false, false],
        [true, false, false],
    ],
    [
        [true, true],
        [true, false],
        [true, false],
        [true, false],
    ],
];

function getInitialShapes(player: "p1" | "p2"): TPiece[] {
    return initialPieceShapes.map((shape) => {
        return { key: useId(), player: player, shape };
    });
}

function checkValidMove(
    piece: TPiece,
    coord: Coordinate,
    onBoard: BoardPiece[],
) {
    const currentBoard = getBoard(onBoard);

    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[0].length; c++) {
            if (
                !piece.shape[r][c] ||
                (checkOpenBoardUnit(
                    currentBoard,
                    r + coord.row,
                    c + coord.col,
                ) &&
                    checkSideNeighbors(
                        currentBoard,
                        r + coord.row,
                        c + coord.col,
                        piece.player,
                    ))
            ) {
                continue;
            } else {
                alert(
                    "That is not a valid move! Failed Open Board or Side Neighbor Rule",
                );
                return false;
            }
        }
    }
    if (checkCornerNeighbors(currentBoard, piece, coord)) {
        return true;
    } else {
        alert("That is not a valid move! Failed Corner Neighbor Rule");
        return false;
    }
}

function checkOpenBoardUnit(
    currentBoard: TBoardUnit[][],
    r: number,
    c: number,
): boolean {
    return currentBoard[r][c].status == "open";
}

function checkSideNeighbors(
    board: TBoardUnit[][],
    r: number,
    c: number,
    player: "p1" | "p2",
): boolean {
    return (
        !(r > 0 && board[r - 1][c].status == player) &&
        !(r < board.length - 1 && board[r + 1][c].status == player) &&
        !(c > 0 && board[r][c - 1].status == player) &&
        !(c < board[0].length - 1 && board[r][c + 1].status == player)
    );
}

function checkCornerNeighbors(
    board: TBoardUnit[][],
    piece: TPiece,
    coord: Coordinate,
): boolean {
    for (let rowIndex = 0; rowIndex < piece.shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < piece.shape[0].length; colIndex++) {
            if (piece.shape[rowIndex][colIndex]) {
                const r = rowIndex + coord.row;
                const c = colIndex + coord.col;
                if (
                    (r == 0 && c == 0 && piece.player == "p1") ||
                    (r == 14 && c == 14 && piece.player == "p2")
                ) {
                    return true;
                }
                const cornerCoordinates = [
                    { row: r - 1, col: c - 1 },
                    { row: r - 1, col: c + 1 },
                    { row: r + 1, col: c - 1 },
                    { row: r + 1, col: c + 1 },
                ];
                const validCorners = cornerCoordinates.map((c) =>
                    c.row >= 0 &&
                    c.row < board.length &&
                    c.col >= 0 &&
                    c.col < board[0].length
                        ? c
                        : undefined,
                );
                for (const coordinate of validCorners) {
                    if (
                        coordinate &&
                        board[coordinate.row][coordinate.col].status ==
                            piece.player
                    ) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export default function GameController() {
    const [gameState, dispatch] = useReducer(reducer, {
        ongoingGame: true,
        onBoard: [] as BoardPiece[],
        p1Inventory: getInitialShapes("p1"),
        p2Inventory: getInitialShapes("p2"),
        turn: "p1",
        score: [0, 0],
        hasStoppedPlaying: [false, false],
        selectedPiece: undefined,
        selectedLocation: { row: 6, col: 6 },
    });

    const handleUpdateHasStoppedPlaying = (player: "p1" | "p2") => {
        if (player == gameState.turn) {
            dispatch({
                type: "updateHasStoppedPlaying",
            });
        } else {
            if (gameState.ongoingGame) {
                alert("Please wait for your turn!");
            }
        }
    };

    const handlePieceClick = (piece: TPiece) => {
        if (piece.player == gameState.turn && gameState.ongoingGame) {
            dispatch({
                type: "playerSelectedAPiece",
                piece,
            });
        } else {
            if (gameState.ongoingGame) {
                alert("Wait your turn!");
            }
        }
    };

    useEffect(() => {
        const handlePlayerMove = () => {
            if (
                gameState.selectedPiece &&
                checkValidMove(
                    gameState.selectedPiece,
                    gameState.selectedLocation,
                    gameState.onBoard,
                )
            ) {
                dispatch({
                    type: "playerMadeAMove",
                    piece: gameState.selectedPiece,
                    coord: gameState.selectedLocation,
                });
            }
        };

        const handleBoardNav = (dir: "u" | "d" | "r" | "l") => {
            dispatch({
                type: "playerMovedSelectedPiece",
                dir,
            });
        };

        const handlePieceRotation = () => {
            if (gameState.selectedPiece) {
                dispatch({
                    type: "playerRotatedSelectedPiece",
                    piece: gameState.selectedPiece,
                });
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState.selectedPiece) {
                switch (e.key) {
                    case "ArrowLeft": {
                        return handleBoardNav("l");
                    }
                    case "ArrowUp": {
                        return handleBoardNav("u");
                    }
                    case "ArrowRight": {
                        return handleBoardNav("r");
                    }
                    case "ArrowDown": {
                        return handleBoardNav("d");
                    }
                    case " ": {
                        return handlePieceRotation();
                    }
                    case "Enter": {
                        return handlePlayerMove();
                    }
                    default:
                        return;
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    const endGameMessage =
        gameState.score[0] > gameState.score[1]
            ? "Congratulations, Player 1!"
            : gameState.score[0] < gameState.score[1]
            ? "Congratulations, Player 2!"
            : "Tie Game... Try again!";

    return (
        <div className={pageCSS.page}>
            <span className={pageCSS.gameTitle}>
                <span className={pageCSS.titleCoral}>B</span>
                <span className={pageCSS.titleGreen}>L</span>
                <span className={pageCSS.titleCoral}>O</span>
                <span className={pageCSS.titleGreen}>K</span>
                <span className={pageCSS.titleCoral}>U</span>
                <span className={pageCSS.titleGreen}>S</span>
            </span>
            <div
                className={clsx(pageCSS.winnerMessage, {
                    [pageCSS.p1Message]:
                        gameState.score[0] > gameState.score[1],
                    [pageCSS.p2Message]:
                        gameState.score[1] > gameState.score[0],
                })}
            >
                {gameState.hasStoppedPlaying[0] &&
                gameState.hasStoppedPlaying[1]
                    ? endGameMessage
                    : ""}
            </div>
            <div className={pageCSS.game}>
                <span className={pageCSS.inventoryAndOutOfMovesSection}>
                    <Inventory
                        i={gameState.p1Inventory}
                        player="p1"
                        isPlayersTurn={gameState.turn == "p1"}
                        score={gameState.score[0]}
                        onPieceClick={handlePieceClick}
                    />
                    <button
                        type="button"
                        className={`${pageCSS.outOfMovesButton} ${
                            gameState.turn == "p1"
                                ? pageCSS.p1Playing
                                : pageCSS.playerStopped
                        }`}
                        onClick={() => handleUpdateHasStoppedPlaying("p1")}
                    >
                        No Moves Remaining
                    </button>
                </span>
                <span className={pageCSS.boardAndStatusSection}>
                    {/* <GameStatusDisplay
                        score={gameState.score}
                        turn={gameState.turn}
                        ongoingGame={gameState.ongoingGame}
                    /> */}
                    <Board gameState={gameState}></Board>
                </span>
                <span className={pageCSS.inventoryAndOutOfMovesSection}>
                    <Inventory
                        i={gameState.p2Inventory}
                        player="p2"
                        isPlayersTurn={gameState.turn == "p2"}
                        score={gameState.score[1]}
                        onPieceClick={handlePieceClick}
                    />
                    <button
                        type="button"
                        className={`${pageCSS.outOfMovesButton} ${
                            gameState.turn == "p2"
                                ? pageCSS.p2Playing
                                : pageCSS.playerStopped
                        }`}
                        onClick={() => handleUpdateHasStoppedPlaying("p2")}
                    >
                        No Moves Remaining
                    </button>
                </span>
            </div>
            <div className={pageCSS.pageFooter}>
                https://github.com/justnickilee/BlokusSite
            </div>
        </div>
    );
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

function reducer(state: GameState, action: Action): GameState {
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
                    .map((row, rowIndex) => {
                        return Array(prevShape.length)
                            .fill(null)
                            .map((col, colIndex) => {
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
        default:
            return state;
    }
}

type Action =
    | {
          type: "updateHasStoppedPlaying";
      }
    | { type: "playerMadeAMove"; piece: TPiece; coord: Coordinate }
    | { type: "playerSelectedAPiece"; piece: TPiece }
    | { type: "playerMovedSelectedPiece"; dir: "u" | "d" | "r" | "l" }
    | { type: "playerRotatedSelectedPiece"; piece: TPiece };
