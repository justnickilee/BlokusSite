import { GameTitle } from "../GameComponents";
import pageCSS from "../page.module.css";
import helpCSS from "./help.module.css";

type HelpPageProps = {
    onHelpClick: () => void;
};

export default function HelpPage(props: HelpPageProps) {
    return (
        <>
            <span className={pageCSS.titleAndHelp}>
                <GameTitle />
                <button
                    type="button"
                    className={pageCSS.helpButton}
                    onClick={props.onHelpClick}
                >
                    ?
                </button>
            </span>
            <div className={helpCSS.helpPage}>
                <ObjectiveSection />
                <HowToPlaySection />
                <ValidMovesSection />
            </div>
        </>
    );
}

const ObjectiveSection = () => {
    return (
        <div className={helpCSS.helpSubSection}>
            <span className={helpCSS.sectionTitle}>Game Objective:</span>
            <div className={helpCSS.bodyText}>
                The objective of Blokus is simple... Get as many of your pieces
                on the board as possible! Take turns placing one of your pieces
                on the board, and when both players no longer have any valid
                moves, the player with the higher number of units on the board
                wins. Note that each piece has a different number of units
                ranging from 1 to 5, so pick your pieces carefully. Baracade
                your own territory with your pieces or weave your way through
                enemy lines... It's up to you!
            </div>
        </div>
    );
};

const HowToPlaySection = () => {
    return (
        <div className={helpCSS.helpSubSection}>
            <span className={helpCSS.sectionTitle}>How To Play:</span>
            <div className={helpCSS.bodyText}>
                Take turns placing one of your pieces on the board. If your
                inventory is gray colored, that means it's not your turn. On
                your turn, click on a piece in your inventory. It will show up
                on the board as a green piece, indicating you have not placed it
                yet. You can now move and rotate your piece around the board
                using the <b>arrow keys</b> and <b>space bar</b> on your
                keyboard respectively. At any time, you may click on a different
                piece in your inventory to move around the board. Once you're
                happy with the placement and rotation of your piece, click
                <b> enter</b> on your keyboard to place it. If your piece is in
                a valid location, it will change from green to your color.
                Otherwise, an on-screen alert will tell you that it is not a
                valid move.
            </div>
            <div className={helpCSS.bodyText}>
                The board will quickly begin to fill up with pieces from both
                you and your opponent... this will likely happen before you run
                out of pieces. When you no longer have any valid moves left,
                click the <b>No Moves Remaining</b> button located below your
                inventory. Note that once you click this button, your turn will
                be skipped until the other player finishes placing their pieces
                or clicks their button. Once both players have clicked the
                button, the game ends, and the winner is decided!
            </div>
        </div>
    );
};

const ValidMovesSection = () => {
    return (
        <div className={helpCSS.helpSubSection}>
            <span className={helpCSS.sectionTitle}>Valid Moves:</span>
            <div className={helpCSS.rule}>
                <span className={helpCSS.ruleTitle}>Corner Rule: </span>
                <div className={helpCSS.ruleText}>
                    Every piece you place must have at least one corner touching
                    the corner of another one of your pieces. On the first turn
                    of the game, Player 1 must place a piece with a unit in the
                    top-left corner of the board while Player 2 must place a
                    piece with a unit in the bottom-right corner.
                </div>
            </div>
            <div className={helpCSS.rule}>
                <span className={helpCSS.ruleTitle}>Side Rule: </span>
                <div className={helpCSS.ruleText}>
                    You may not place a piece where one of its sides will touch
                    the side of another of your pieces. Note that the sides of
                    your pieces are allowed to touch those of your opponent's,
                    just not your own.
                </div>
            </div>
        </div>
    );
};
