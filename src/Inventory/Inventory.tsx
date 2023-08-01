import Piece, { TPiece } from "../Piece/Piece";
import inventoryCSS from "./inventory.module.css";

type InventoryProps = {
    i: TPiece[];
    player: "p1" | "p2";
    playerHasStoppedPlaying: boolean;
    onPieceClick: (piece: TPiece) => void;
};

export default function Inventory(props: InventoryProps) {
    const title = props.player == "p1" ? "Player 1" : "Player 2";

    const inventoryList = props.i.map((piece) => {
        return (
            <Piece
                piece={piece}
                player={
                    props.playerHasStoppedPlaying
                        ? "stopped"
                        : props.player == "p1"
                        ? "p1"
                        : "p2"
                }
                onPieceClick={props.onPieceClick}
                key={piece.key}
            />
        );
    });

    return (
        <div className={inventoryCSS.inventorySection}>
            <div
                className={`${inventoryCSS.inventoryTitle} ${
                    props.player == "p1"
                        ? inventoryCSS.inventoryTitleP1
                        : inventoryCSS.inventoryTitleP2
                }`}
            >
                {title}
            </div>
            <div className={inventoryCSS.inventory}>{inventoryList}</div>
        </div>
    );
}
