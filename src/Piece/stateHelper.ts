import { useId } from "react";
import { TPiece } from "./Piece";

function getRotatedPiece(piece: TPiece): TPiece {
    return {key: useId(), player: 'p1', shape: [[]] as Boolean[][]}; 
}

function getPointsOfPiece(piece: TPiece): number {return 0;}