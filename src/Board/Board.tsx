import boardCSS from "./board.module.css";
import { BoardPiece, Coordinate, GameState } from "../GameState/GameState";
import { TPiece } from "../Piece/Piece";
import clsx from "clsx";

export type TBoardUnit = { status: "p1" | "p2" | "open" };

const makeEmptyBoard = (): TBoardUnit[][] => {
    return Array(15)
        .fill(null)
        .map(() => {
            return Array(15)
                .fill(null)
                .map(() => {
                    return { status: "open" };
                });
        });
};

type BoardProps = { gameState: GameState };

export default function Board(props: BoardProps) {
    const boardDisplay = getBoard(props.gameState.onBoard).map(
        (row, rowIndex) => {
            const isASelectedUnit = (r: number, c: number) => {
                for (const coordinate of selectedPieceCoordinates(
                    props.gameState.selectedPiece,
                    props.gameState.selectedLocation,
                )) {
                    if (coordinate.row == r && coordinate.col == c) {
                        return true;
                    }
                }
                return false;
            };

            return (
                <div key={rowIndex} className={boardCSS.boardRow}>
                    {row.map((unit, colIndex) => {
                        return (
                            <span
                                key={`${rowIndex}-${colIndex}`}
                                className={clsx(boardCSS.unit, {
                                    [boardCSS.p1Unit]: unit.status === "p1",
                                    [boardCSS.p2Unit]: unit.status === "p2",
                                    [boardCSS.selectedUnit]: isASelectedUnit(
                                        rowIndex,
                                        colIndex,
                                    ),
                                })}
                            />
                        );
                    })}
                </div>
            );
        },
    );

    return <div className={boardCSS.boardSection}>{boardDisplay}</div>;
}

function selectedPieceCoordinates(
    selectedPiece: TPiece | undefined,
    selectedLocation: Coordinate,
): Coordinate[] {
    const coordinates: Coordinate[] = [];
    if (selectedPiece) {
        const coord = selectedLocation;
        selectedPiece.shape.forEach((row, r) => {
            row.forEach((unit, c) => {
                if (unit) {
                    coordinates.push({
                        row: r + coord.row,
                        col: c + coord.col,
                    });
                }
            });
        });
        return coordinates;
    } else {
        return coordinates;
    }
}

type BoardNavProps = {
    onArrowClick: (dir: "rot" | "u" | "d" | "r" | "l") => void;
};

export function BoardNavigation(props: BoardNavProps) {
    return (
        <span className={boardCSS.boardNavSection}>
            <button type="button" onClick={() => props.onArrowClick("rot")}>
                &#10227;
            </button>
            <button type="button" onClick={() => props.onArrowClick("u")}>
                &#8593;
            </button>
            <button type="button" onClick={() => props.onArrowClick("d")}>
                &#8595;
            </button>
            <button type="button" onClick={() => props.onArrowClick("r")}>
                &#8594;
            </button>
            <button type="button" onClick={() => props.onArrowClick("l")}>
                &#8592;
            </button>
        </span>
    );
}

export function getBoard(newBoardPieces: BoardPiece[]): TBoardUnit[][] {
    const newBoard = makeEmptyBoard();
    for (const piece of newBoardPieces) {
        const coord = piece.coord;

        piece.piece.shape.forEach((row, r) => {
            row.forEach((unit, c) => {
                if (unit) {
                    newBoard[r + coord.row][c + coord.col] =
                        piece.piece.player == "p1"
                            ? { status: "p1" }
                            : { status: "p2" };
                }
            });
        });
    }
    return newBoard;
}
