import { useId, useReducer, useEffect } from "react";
import { TPiece, getScoreOfPiece } from "../Piece/Piece";
import Board, { BoardNavigation, TBoardUnit, getBoard } from "../Board/Board";
import Inventory from "../Inventory/Inventory";
import pageCSS from "./page.module.css";
import GameStatusDisplay from "../GameStatusDisplay/GameStatusDisplay";

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
    console.log(piece.player);
    for (let rowIndex = 0; rowIndex < piece.shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < piece.shape[0].length; colIndex++) {
            if (piece.shape[rowIndex][colIndex]) {
                const r = rowIndex + coord.row;
                const c = colIndex + coord.col;
                if (
                    (r == 0 && c == 0 && piece.player == "p1") ||
                    (r == 14 && c == 14 && piece.player == "p2")
                ) {
                    console.log(r, c);
                    return true;
                }
                console.log(r, c);
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
        onBoard: [] as BoardPiece[],
        p1Inventory: getInitialShapes("p1"),
        p2Inventory: getInitialShapes("p2"),
        turn: "p1",
        score: [0, 0],
        hasStoppedPlaying: [false, false],
        selectedPiece: undefined,
        selectedLocation: { row: 1, col: 1 },
    });

    const handleUpdateHasStoppedPlaying = (
        hasStoppedPlaying: [boolean, boolean],
        turn: "p1" | "p2",
    ) => {
        dispatch({
            type: "updateHasStoppedPlaying",
            hasStoppedPlaying: hasStoppedPlaying,
            turn: turn,
        });
    };

    const handlePieceClick = (piece: TPiece) => {
        if (piece.player == gameState.turn) {
            dispatch({
                type: "playerSelectedAPiece",
                piece,
            });
        } else {
            alert("Wait your turn!");
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

        const handleBoardNav = (dir: "rot" | "u" | "d" | "r" | "l") => {
            dispatch({
                type: "playerMovedSelectedPiece",
                dir,
            });
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
                    case "Shift": {
                        return handleBoardNav("rot");
                    }
                    case " ": {
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

    return (
        <div className={pageCSS.page}>
            <Inventory
                i={gameState.p1Inventory}
                player="p1"
                onPieceClick={handlePieceClick}
            />
            <span className={pageCSS.boardAndStatusSection}>
                <GameStatusDisplay
                    score={gameState.score}
                    turn={gameState.turn}
                />
                <Board gameState={gameState}></Board>
            </span>
            <Inventory
                i={gameState.p2Inventory}
                player="p2"
                onPieceClick={handlePieceClick}
            />
        </div>
    );
}

function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "playerSelectedAPiece": {
            return {
                ...state,
                selectedPiece: action.piece,
                selectedLocation: { row: 1, col: 1 },
            };
        }
        case "playerMovedSelectedPiece": {
            const changedCoordinate = (dir: "rot" | "u" | "d" | "r" | "l") => {
                switch (dir) {
                    case "rot": {
                        // change later to rotate the shape
                        return { row: state.selectedLocation.row - 1 };
                    }
                    case "u": {
                        return { row: state.selectedLocation.row - 1 };
                    }
                    case "d": {
                        return { row: state.selectedLocation.row + 1 };
                    }
                    case "r": {
                        return { col: state.selectedLocation.col + 1 };
                    }
                    case "l": {
                        return { col: state.selectedLocation.col - 1 };
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
                turn: state.turn == "p1" ? "p2" : "p1",
                selectedPiece: undefined,
                selectedLocation: { row: 1, col: 1 },
            };
        }
        case "updateHasStoppedPlaying": {
            return {
                ...state,
                hasStoppedPlaying:
                    action.turn == "p1"
                        ? [false, action.hasStoppedPlaying[1]]
                        : [action.hasStoppedPlaying[0], false],
            };
        }
        default:
            return state;
    }
}

type Action =
    | {
          type: "updateHasStoppedPlaying";
          turn: "p1" | "p2";
          hasStoppedPlaying: [boolean, boolean];
      }
    | { type: "playerMadeAMove"; piece: TPiece; coord: Coordinate }
    | { type: "playerSelectedAPiece"; piece: TPiece }
    | { type: "playerMovedSelectedPiece"; dir: "rot" | "u" | "d" | "r" | "l" };
