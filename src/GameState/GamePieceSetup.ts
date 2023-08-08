import { useId } from "react";
import { TPiece } from "../Piece/Piece";

const initialPieceShapes: boolean[][][] = [
    [[true]],
    [[true, true]],
    [[true, true, true]],
    [[true, true, true, true]],
    [
        [true, true],
        [true, false],
    ],
    [
        [true, false],
        [true, true],
        [true, false],
    ],
    [
        [true, true],
        [true, false],
        [true, false],
    ],
    [
        [true, false],
        [true, true],
        [false, true],
    ],
    [
        [true, true],
        [true, true],
    ],
    [
        [true, true],
        [true, true],
        [true, false],
    ],
    [
        [true, true],
        [false, true],
        [true, true],
    ],
    [
        [false, true, false],
        [true, true, true],
        [false, true, false],
    ],
    [
        [true, false, false],
        [true, true, true],
        [false, false, true],
    ],
    [
        [true, true, false],
        [false, true, true],
        [false, false, true],
    ],
    [
        [true, false],
        [true, true],
        [false, true],
        [false, true],
    ],
    [
        [true, true, true, true],
        [false, true, false, false],
    ],
    [
        [true, true, false],
        [false, true, true],
        [false, true, false],
    ],
    [
        [true, true, true],
        [false, true, false],
        [false, true, false],
    ],
    [
        [true, true, true],
        [true, false, false],
        [true, false, false],
    ],
    [
        [true, true],
        [true, false],
        [true, false],
        [true, false],
    ],
];

export function getInitialShapes(player: "p1" | "p2"): TPiece[] {
    return initialPieceShapes.map((shape) => {
        return { key: useId(), player: player, shape };
    });
}
