import clsx from "clsx";
import statusDisplayCSS from "./gameStatusDisplay.module.css";

type StatusDisplayProps = {
    score: [number, number];
    ongoingGame: boolean;
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

    const endGameMessage =
        props.score[0] > props.score[1]
            ? "Congratulations, Player 1!"
            : props.score[0] < props.score[1]
            ? "Congratulations, Player 2!"
            : "Tie Game... Try again!";

    return (
        <div className={statusDisplayCSS.statusSection}>
            <span
                className={
                    props.ongoingGame
                        ? statusDisplayCSS.turn
                        : clsx(statusDisplayCSS.winnerMessage, {
                              [statusDisplayCSS.p1Message]:
                                  props.score[0] > props.score[1],
                              [statusDisplayCSS.p2Message]:
                                  props.score[0] < props.score[1],
                          })
                }
            >
                {props.ongoingGame
                    ? "Turn: " + (props.turn == "p1" ? "Player 1" : "Player 2")
                    : endGameMessage}
            </span>
            <span className={statusDisplayCSS.scoreSection}>
                <ScoreComponent player={"p1"} />
                <ScoreComponent player={"p2"} />
            </span>
        </div>
    );
}
