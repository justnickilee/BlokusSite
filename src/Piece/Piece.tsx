import clsx from "clsx";
import pieceCSS from "./piece.module.css";

// the shape of pieces are defined with a 2d boolean array
// row = outer array, column = inner arrays
//
// ex. [[true, true, true],[false, true, false],[false, true, false]] transaltes to...
//
// [ X  X  X ]
// [    X    ]
// [    X    ]

export type TPiece = {
    key: string;
    player: "p1" | "p2";
    shape: boolean[][];
};

type PieceProps = {
    piece: TPiece;
    player: "p1" | "p2" | "stopped";
    onPieceClick: (piece: TPiece) => void;
};

export default function Piece(props: PieceProps) {
    return (
        <div
            className={clsx(pieceCSS.piece, {
                [pieceCSS.pieceStopped]: props.player == "stopped",
                [pieceCSS.pieceP1]: props.player == "p1",
                [pieceCSS.pieceP2]: props.player == "p2",
            })}
            key={props.piece.key}
            onClick={() => props.onPieceClick(props.piece)}
        >
            {props.piece.shape.map((_, index) => {
                return (
                    <RowComponent row={props.piece.shape[index]} key={index} />
                );
            })}
        </div>
    );
}

export function getScoreOfPiece(piece: TPiece): number {
    let score = 0;
    piece.shape.map((row) => {
        row.map((unit) => {
            unit ? score++ : null;
        });
    });
    return score;
}

type RowProps = {
    row: boolean[];
};

function RowComponent(props: RowProps) {
    const rowComponent = props.row.map((unit, index) => {
        return unit ? (
            <span key={index} className={pieceCSS.unit}>
                &#9632;
            </span>
        ) : (
            <span key={index} className={pieceCSS.blank}></span>
        );
    });
    return <span className={pieceCSS.row}>{rowComponent}</span>;
}
