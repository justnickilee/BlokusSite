import { useId, useReducer, useEffect } from "react"
import { TPiece, getScoreOfPiece } from "../Piece/Piece"
import Board, { BoardNavigation } from "../Board/Board";
import Inventory from "../Inventory/Inventory";
import pageCSS from './page.module.css'
import GameStatusDisplay from "../GameStatusDisplay/GameStatusDisplay";


export type Coordinate = {
    row: number
    col: number
}

export type BoardPiece = {
    piece: TPiece
    coord: Coordinate
}


// use react context to pass this state down to all the children https://react.dev/learn/passing-data-deeply-with-context


export type GameState = {
    onBoard: BoardPiece[]
    p1Inventory: TPiece[]
    p2Inventory: TPiece[]
    turn: 'p1' | 'p2';
    score: [number, number];
    hasStoppedPlaying: [boolean, boolean]
    selectedPiece: TPiece | undefined
    selectedLocation: Coordinate
}

const initialPieceShapes: Boolean[][][] = [
    [[true]], [[true, true]], [[true, true, true]], [[true, true, true, true]],
    [[true, true], [true, false]], [[true, false], [true, true], [true, false]], [[true, true], [true, false], [true, false]],
    [[true, false], [true, true], [false, true]], [[true, true], [true, true]], [[true, true], [true, true], [true, false]],
    [[true, true], [false, true], [true, true]], [[false, true, false], [true, true, true], [false, true, false]],
    [[true, false, false], [true, true, true], [false, false, true]], [[true, true, false], [false, true, true], [false, false, true]],
    [[true, false], [true, true], [false, true], [false, true]], [[true, true, true, true], [false, true, false, false]],
    [[true, true, false], [false, true, true], [false, true, false]], [[true, true, true], [false, true, false], [false, true, false]],
    [[true, true, true], [true, false, false], [true, false, false]], [[true, true], [true, false], [true, false], [true, false]]
]

function getInitialShapes(player: 'p1' | 'p2'): TPiece[] {
    return (
        initialPieceShapes.map((shape) => {
            let thisKey = useId();
            return ({ key: thisKey, player: player, shape });
        })
    );
}

export default function GameController() {
    const [gameState, dispatch] = useReducer(reducer, {
        onBoard: [] as BoardPiece[],
        p1Inventory: getInitialShapes('p1'),
        p2Inventory: getInitialShapes('p2'),
        turn: 'p1',
        score: [0, 0],
        hasStoppedPlaying: [false, false],
        selectedPiece: undefined,
        selectedLocation: { row: 1, col: 1 }
    });


    const handleUpdateHasStoppedPlaying = (hasStoppedPlaying: [boolean, boolean], turn: 'p1' | 'p2') => {
        dispatch({
            type: 'updateHasStoppedPlaying',
            hasStoppedPlaying: hasStoppedPlaying,
            turn: turn
        })
    }

    const handlePieceClick = (piece: TPiece) => {
        if (piece.player == gameState.turn) {
            // check if move is legal
            dispatch({
                type: 'playerSelectedAPiece',
                piece
            });
        } else {
            alert('Wait your turn!');
        }
    }

    const handlePlayerMove = (piece: TPiece) => {
        dispatch({
            type: 'playerMadeAMove',
            piece,
            coord: { row: 1, col: 1 },
        })
    }


    const handleBoardNav = (dir: 'rot' | 'u' | 'd' | 'r' | 'l') => {
        if (dir === 'rot') {
            console.log('rotate')
        } else {
            console.log(dir)
        }
        dispatch({
            type: 'playerMovedSelectedPiece',
            dir
        })
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log(e.key)
            switch (e.key) {
                case 'ArrowLeft': { return handleBoardNav('l') }
                case 'ArrowUp': { return handleBoardNav('u') }
                case 'ArrowRight': { return handleBoardNav('r') }
                case 'ArrowDown': { return handleBoardNav('d') }
                case ' ': { console.log('place me!'); return}
                default: return;
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        // Don't forget to clean up
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    return (
        <div className={pageCSS.page}>
            <Inventory
                i={gameState.p1Inventory}
                player='p1'
                onPieceClick={handlePieceClick}
            />
            <span className={pageCSS.boardAndStatusSection}>
                <GameStatusDisplay
                    score={gameState.score}
                    turn={gameState.turn}
                />
                <Board gameState={gameState}></Board>
            </span>
            <Inventory
                i={gameState.p2Inventory}
                player='p2'
                onPieceClick={handlePieceClick}
            />

        </div>
    )

}

function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'playerSelectedAPiece': {
            return {
                ...state,
                selectedPiece: action.piece,
                selectedLocation: { row: 1, col: 1 }
            }
        }
        case 'playerMovedSelectedPiece': {

            const changedCoordinate = (dir: 'rot' | 'u' | 'd' | 'r' | 'l') => {
                switch (dir) {
                    case 'rot': {
                        // change later to rotate the shape
                        return { row: state.selectedLocation.row - 1 }
                    }
                    case 'u': {
                        return { row: state.selectedLocation.row - 1 }
                    }
                    case 'd': {
                        return { row: state.selectedLocation.row + 1 }
                    }
                    case 'r': {
                        return { col: state.selectedLocation.col + 1 }
                    }
                    case 'l': {
                        return { col: state.selectedLocation.col - 1 }
                    }
                }
            }
            return {
                ...state,
                selectedLocation: {
                    ...state.selectedLocation,
                    ...changedCoordinate(action.dir)
                }
            }
        }
        case 'playerMadeAMove': {
            const filterFn = (piece: TPiece) => piece.key != action.piece.key
            const p1Inventory = action.piece.player === 'p1' ? state.p1Inventory.filter(filterFn) : state.p1Inventory
            const p2Inventory = action.piece.player === 'p2' ? state.p2Inventory.filter(filterFn) : state.p2Inventory

            const pieceScore = getScoreOfPiece(action.piece);

            return {
                ...state,
                onBoard: [...state.onBoard, { piece: action.piece, coord: action.coord }],
                p1Inventory,
                p2Inventory,
                score: action.piece.player === 'p1'
                    ? [state.score[0] + pieceScore, state.score[1]]
                    : [state.score[0], state.score[1] + pieceScore],
                turn: state.turn == 'p1' ? 'p2' : 'p1'
            }
        }
        case 'updateHasStoppedPlaying': {
            return {
                ...state,
                hasStoppedPlaying: action.turn == 'p1'
                    ? [false, action.hasStoppedPlaying[1] as boolean]
                    : [action.hasStoppedPlaying[0] as boolean, false]
            }
        }
        default:
            return state;
    }

}

type Action =
    | { type: 'updateHasStoppedPlaying', turn: 'p1' | 'p2', hasStoppedPlaying: [boolean, boolean] }
    | { type: 'playerMadeAMove', piece: TPiece, coord: Coordinate }
    | { type: 'playerSelectedAPiece', piece: TPiece }
    | { type: 'playerMovedSelectedPiece', dir: 'rot' | 'u' | 'd' | 'r' | 'l' }
