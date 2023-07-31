import boardCSS from './board.module.css'
import { BoardPiece, GameState } from '../GameState/GameState'
import { useEffect, useId, useState } from 'react'
import { TPiece } from '../Piece/Piece'
import clsx from 'clsx';

export type TBoardUnit = { status: 'p1' | 'p2' | 'open' }

const makeEmptyBoard = (): TBoardUnit[][] => {
    return Array(15).fill(null).map(() => {
        return Array(15).fill(null).map(() => {
            return { status: 'open' }
        })
    })
}



type BoardProps = { gameState: GameState }

export default function Board(props: BoardProps) {
    const [selectedPiece, setSelectedPiece] = useState<TPiece | undefined>(undefined)

    const boardDisplay = getNewBoard(props.gameState.onBoard).map((row, rowIndex) => {
        return (
            <div
                key={rowIndex}
                className={boardCSS.boardRow}
            >
                {row.map((unit, colIndex) => {
                    return (
                        <span
                            key={`${rowIndex}-${colIndex}`}
                            className={clsx(boardCSS.unit, {
                                [boardCSS.p1Unit]: unit.status === 'p1',
                                [boardCSS.p2Unit]: unit.status === 'p2',
                            })}
                        />
                    );
                })}
            </div>
        );
    });

    return (
        <div className={boardCSS.boardSection}>{boardDisplay}</div>
    );
}

function getNewBoard(newBoardPieces: BoardPiece[]): TBoardUnit[][] {
    const newBoard = makeEmptyBoard();
    for (let piece of newBoardPieces) {
        let coord = piece.coord;

        (piece.piece.shape).forEach((row, r) => {
            row.forEach((unit, c) => {
                if (unit) {
                    newBoard[r + coord.row][c + coord.col] = piece.piece.player == 'p1' ? { status: 'p1' } : { status: 'p2' };
                }
            })
        })
    }
    return newBoard
}
