import { useReducer, useEffect } from "react";
import { TPiece } from "../Piece/Piece";
import Board from "../Board/Board";
import pageCSS from "./page.module.css";
import checkValidMove from "./MoveValidation";
import reducer from "./StateReducer";
import { EndGameMessage, GameTitle, InventoryDisplay } from "./GameComponents";
import { getInitialShapes } from "./GamePieceSetup";

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
    page: "game" | "help";
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

export default function GameController() {
    const [gameState, dispatch] = useReducer(reducer, {
        page: "game",
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

    return (
        <div className={pageCSS.page}>
            <GameTitle />
            <EndGameMessage
                score={gameState.score}
                hasStoppedPlaying={gameState.hasStoppedPlaying}
            />
            <div className={pageCSS.game}>
                <span className={pageCSS.inventoryAndOutOfMovesSection}>
                    <InventoryDisplay
                        player={"p1"}
                        inventory={gameState.p1Inventory}
                        turn={gameState.turn}
                        score={gameState.score[0]}
                        onPieceClick={handlePieceClick}
                        onStopPlaying={handleUpdateHasStoppedPlaying}
                    />
                </span>
                <span className={pageCSS.boardAndStatusSection}>
                    <Board gameState={gameState}></Board>
                </span>
                <span className={pageCSS.inventoryAndOutOfMovesSection}>
                    <InventoryDisplay
                        player={"p2"}
                        inventory={gameState.p2Inventory}
                        turn={gameState.turn}
                        score={gameState.score[1]}
                        onPieceClick={handlePieceClick}
                        onStopPlaying={handleUpdateHasStoppedPlaying}
                    />
                </span>
            </div>
            <div className={pageCSS.pageFooter}>
                https://github.com/justnickilee/BlokusSite
            </div>
        </div>
    );
}
