import { getBoard, TBoardUnit } from "../Board/Board";
import { TPiece } from "../Piece/Piece";
import { BoardPiece, Coordinate } from "./GameState";

export default function checkValidMove(
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

export function checkOpenBoardUnit(
    currentBoard: TBoardUnit[][],
    r: number,
    c: number,
): boolean {
    return currentBoard[r][c].status == "open";
}

export function checkSideNeighbors(
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

export function checkCornerNeighbors(
    board: TBoardUnit[][],
    piece: TPiece,
    coord: Coordinate,
): boolean {
    for (let rowIndex = 0; rowIndex < piece.shape.length; rowIndex++) {
        for (let colIndex = 0; colIndex < piece.shape[0].length; colIndex++) {
            if (piece.shape[rowIndex][colIndex]) {
                const r = rowIndex + coord.row;
                const c = colIndex + coord.col;
                if (
                    (r == 0 && c == 0 && piece.player == "p1") ||
                    (r == 14 && c == 14 && piece.player == "p2")
                ) {
                    return true;
                }
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
