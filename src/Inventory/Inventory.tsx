import Piece, { TPiece } from "../Piece/Piece";
import inventoryCSS from "./inventory.module.css";

type InventoryProps = {
    i: TPiece[];
    player: "p1" | "p2";
    onPieceClick: (piece: TPiece) => void;
};

export default function Inventory(props: InventoryProps) {
    const title = props.player == "p1" ? "Player 1" : "Player 2";

    const inventoryList = props.i.map((piece) => {
        return (
            <Piece
                piece={piece}
                onPieceClick={props.onPieceClick}
                key={piece.key}
            />
        );
    });

    return (
        <div className={inventoryCSS.inventorySection}>
            <div className={inventoryCSS.inventoryTitle}>{title}</div>
            <div className={inventoryCSS.inventory}>{inventoryList}</div>
        </div>
    );
}
