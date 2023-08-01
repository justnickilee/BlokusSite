import statusDisplayCSS from "./gameStatusDisplay.module.css";

type StatusDisplayProps = {
    score: [number, number];
    turn: "p1" | "p2";
};

type ScoreProps = {
    player: "p1" | "p2";
};

export default function GameStatusDisplay(props: StatusDisplayProps) {
    const ScoreComponent = (scoreProps: ScoreProps) => {
        return (
            <div className={statusDisplayCSS.scoreComponent}>
                <span className={statusDisplayCSS.scoreLabel}>{`${
                    scoreProps.player === "p1" ? "Player 1" : "Player 2"
                }`}</span>
                <span className={statusDisplayCSS.score}>{`${
                    scoreProps.player === "p1" ? props.score[0] : props.score[1]
                }`}</span>
            </div>
        );
    };

    return (
        <div className={statusDisplayCSS.statusSection}>
            <span className={statusDisplayCSS.turn}>{`Turn: ${
                props.turn === "p1" ? "Player 1" : "Player 2"
            }`}</span>
            <span className={statusDisplayCSS.scoreSection}>
                <ScoreComponent player={"p1"} />
                <ScoreComponent player={"p2"} />
            </span>
        </div>
    );
}
