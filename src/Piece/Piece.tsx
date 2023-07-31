import pieceCSS from './piece.module.css'
import { useId } from "react"

// the shape of pieces are defined with a 2d boolean array
// row = outer array, column = inner arrays
//
// ex. [[true, true, true],[false, true, false],[false, true, false]] transaltes to...
//
// [ X  X  X ]
// [    X    ]
// [    X    ]


export type TPiece = { key: string, player: 'p1' | 'p2', shape: Boolean[][] }

type PieceProps = {
    piece: TPiece
    onPieceClick: (piece: TPiece) => void
}

export default function Piece(props: PieceProps) {
    
    return (
        <div 
            className={props.piece.player == 'p1' ? pieceCSS.pieceP1 : pieceCSS.pieceP2}
            key={props.piece.key}
            onClick={() => props.onPieceClick(props.piece)}
        >
            {props.piece.shape.map((row, index) => {
                return (
                    <RowComponent row={props.piece.shape[index]} key={useId()} />
                );
            })}
        </div>
    ); 
}

export function rotatePiece(piece: TPiece) : TPiece {
    // function which takes a piece, rotates it, then returns the new piece
    return {key: useId(), player: 'p1', shape: [[]] as Boolean[][]}; // just for now obv
}

export function getScoreOfPiece(piece: TPiece): number {
    let score: number = 0;
    piece.shape.map((row) => {
        row.map((unit) => {unit ? score++ : null})
    })
    return score;
}

type RowProps = {
    row: Boolean[]
}

function RowComponent(props: RowProps) {
    let rowComponent = props.row.map((unit) => {
        let thisId = useId();
        return (
            unit 
            ? <span key={thisId} className={pieceCSS.unit}>&#9632;</span> 
            : <span key={thisId} className={pieceCSS.blank}></span> 
        );
    });
    return (<span className={pieceCSS.row}>{rowComponent}</span>);
}
