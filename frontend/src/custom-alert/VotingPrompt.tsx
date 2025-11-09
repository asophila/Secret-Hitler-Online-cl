import React, { useState, useRef, useEffect } from "react";
import ButtonPrompt from "./ButtonPrompt";
import {
  PARAM_CHANCELLOR,
  PARAM_PLAYERS,
  PARAM_PRESIDENT,
  PLAYER_IDENTITY,
  SERVER_TIMEOUT,
} from "../constants";
import "../selectable.css";
import "./VotingPrompt.css";
import YesVote from "../assets/vote-yes.png";
import NoVote from "../assets/vote-no.png";
import Player from "../player/Player";
import { GameState, Role, SendWSCommand, WSCommandType } from "../types";
import { useText } from "../hooks/useText";

type VotingPromptProps = {
  gameState: GameState;
  sendWSCommand: SendWSCommand;
  user: string;
};

function VotingPrompt(props: VotingPromptProps) {
  const { t } = useText();
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const timeoutID = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutID.current);
    };
  }, []);

  /**
   * Returns whether the chancellor's role should be shown on the card.
   * @return {boolean} Returns true iff the chancellor should be shown. This can happen if:
   *          - The player is fascist and the chancellor is fascist/hitler
   *          - The player is hitler, the chancellor is fascist, and there are 5-6 players.
   */
  const shouldChancellorRoleBeShown = () => {
    let game = props.gameState;
    let userRole = game[PARAM_PLAYERS][props.user][PLAYER_IDENTITY];
    let chancellor = game[PARAM_CHANCELLOR];
    let chancellorRole = game[PARAM_PLAYERS][chancellor][PLAYER_IDENTITY];
    switch (userRole) {
      case Role.LIBERAL:
        return false;
      case Role.FASCIST:
        if (chancellorRole === Role.HITLER || chancellorRole === Role.FASCIST) {
          return true;
        }
        break;
      case Role.HITLER:
        if (chancellorRole === Role.FASCIST && game.playerOrder.length <= 6) {
          return true;
        }
        break;
      default:
    }
    return false;
  };

  /**
   * Called when the confirm button is clicked.
   * @effects Attempts to send the server a command with the player's vote, and locks access to the button
   *          for {@code SERVER_TIMEOUT} ms.
   */
  const onButtonClick = () => {
    // Lock the button so that it can't be pressed multiple times.
    timeoutID.current = setTimeout(() => {
      setWaitingForServer(false);
    }, SERVER_TIMEOUT);
    setWaitingForServer(true);

    // Contact the server using provided method.
    props.sendWSCommand({
      command: WSCommandType.REGISTER_VOTE,
      vote: selection === "yes",
    });
  };

  let chancellorName = props.gameState[PARAM_CHANCELLOR];
  let shouldShowChancellorRole = shouldChancellorRoleBeShown();
  let chancellorRole =
    props.gameState[PARAM_PLAYERS][chancellorName][PLAYER_IDENTITY];
  let presidentName = props.gameState[PARAM_PRESIDENT];

  return (
    <ButtonPrompt
      label={t("voting.header")}
      renderHeader={() => {
        return (
          <>
            <Player
              id={"voting-player"}
              name={chancellorName}
              showRole={shouldShowChancellorRole}
              role={chancellorRole}
              style={{ marginRight: "10px" }}
              icon={props.gameState.icon[chancellorName]}
            />

            <p className="left-align">
              {t("voting.nominated", {
                president: presidentName,
                chancellor: chancellorName,
              })}
            </p>
            <p className="left-align">{t("voting.instructions")}</p>

            {/* These are two optional warnings that appear when player decisions are extra critical,
                                    such as if fascists can win the game or if the voting tracker will hit the end. */}
            {props.gameState.fascistPolicies >= 3 && (
              <p className="highlight left-align">
                {t("voting.hitlerWarning")}
              </p>
            )}
            {props.gameState.electionTracker === 2 && (
              <p className="highlight left-align">
                {t("voting.trackerWarning")}
              </p>
            )}
          </>
        );
      }}
      buttonDisabled={selection === undefined || waitingForServer}
      buttonOnClick={onButtonClick}
    >
      <div id={"voting-card-container"}>
        <img
          id={"voting-card"}
          className={
            "selectable " + (selection === "yes" ? "selected " : "")
          } /*Determines if this should be selected.*/
          src={YesVote}
          alt={t("voting.yes")}
          onClick={() => setSelection("yes")}
        />
        <img
          id={"voting-card"}
          className={"selectable " + (selection === "no" ? "selected " : "")}
          src={NoVote}
          alt={t("voting.no")}
          onClick={() => setSelection("no")}
        />
      </div>
    </ButtonPrompt>
  );
}

export default VotingPrompt;
