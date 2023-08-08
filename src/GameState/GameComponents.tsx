import clsx from "clsx";
import pageCSS from "./page.module.css";
import Inventory from "../Inventory/Inventory";
import { TPiece } from "../Piece/Piece";

export function GameTitle() {
    return (
        <span className={pageCSS.gameTitle}>
            <span className={pageCSS.titleCoral}>B</span>
            <span className={pageCSS.titleGreen}>L</span>
            <span className={pageCSS.titleCoral}>O</span>
            <span className={pageCSS.titleGreen}>K</span>
            <span className={pageCSS.titleCoral}>U</span>
            <span className={pageCSS.titleGreen}>S</span>
        </span>
    );
}

type EndGameMessageProps = {
    score: [number, number];
    hasStoppedPlaying: [boolean, boolean];
};

export function EndGameMessage(props: EndGameMessageProps) {
    const endGameMessage =
        props.score[0] > props.score[1]
            ? "Congratulations, Player 1!"
            : props.score[0] < props.score[1]
            ? "Congratulations, Player 2!"
            : "Tie Game... Try again!";

    return (
        <div
            className={clsx(pageCSS.winnerMessage, {
                [pageCSS.p1Message]: props.score[0] > props.score[1],
                [pageCSS.p2Message]: props.score[1] > props.score[0],
            })}
        >
            {props.hasStoppedPlaying[0] && props.hasStoppedPlaying[1]
                ? endGameMessage
                : ""}
        </div>
    );
}

type InventoryDisplayProps = {
    player: "p1" | "p2";
    inventory: TPiece[];
    turn: "p1" | "p2";
    score: number;
    onPieceClick: (piece: TPiece) => void;
    onStopPlaying: (player: "p1" | "p2") => void;
};

export function InventoryDisplay(props: InventoryDisplayProps) {
    return (
        <span className={pageCSS.inventoryAndOutOfMovesSection}>
            <Inventory
                i={props.inventory}
                player={props.player}
                isPlayersTurn={props.turn == props.player}
                score={props.score}
                onPieceClick={props.onPieceClick}
            />
            <button
                type="button"
                className={clsx(pageCSS.outOfMovesButton, {
                    [pageCSS.p1Playing]:
                        props.turn == props.player && props.player == "p1",
                    [pageCSS.p2Playing]:
                        props.turn == props.player && props.player == "p2",
                })}
                onClick={() => props.onStopPlaying(props.player)}
            >
                No Moves Remaining
            </button>
        </span>
    );
}
