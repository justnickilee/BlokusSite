import clsx from "clsx";
import Piece, { TPiece } from "../Piece/Piece";
import inventoryCSS from "./inventory.module.css";

type InventoryProps = {
    i: TPiece[];
    player: "p1" | "p2";
    isPlayersTurn: boolean;
    score: number;
    onPieceClick: (piece: TPiece) => void;
};

export default function Inventory(props: InventoryProps) {
    const title = props.player == "p1" ? "Player 1" : "Player 2";

    const inventoryList = props.i.map((piece) => {
        return (
            <Piece
                piece={piece}
                player={
                    props.isPlayersTurn
                        ? props.player == "p1"
                            ? "p1"
                            : "p2"
                        : "stopped"
                }
                onPieceClick={props.onPieceClick}
                key={piece.key}
            />
        );
    });

    return (
        <div className={inventoryCSS.inventorySection}>
            <div
                className={clsx(inventoryCSS.inventoryTitle, {
                    [inventoryCSS.p1]:
                        props.player == "p1" && props.isPlayersTurn,
                    [inventoryCSS.p2]:
                        props.player == "p2" && props.isPlayersTurn,
                })}
            >
                {title}
            </div>
            <div
                className={clsx(inventoryCSS.score, {
                    [inventoryCSS.p1]:
                        props.player == "p1" && props.isPlayersTurn,
                    [inventoryCSS.p2]:
                        props.player == "p2" && props.isPlayersTurn,
                })}
            >
                {props.score}
            </div>
            <div className={inventoryCSS.inventory}>{inventoryList}</div>
        </div>
    );
}
