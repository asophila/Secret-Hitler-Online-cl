import React from "react";
import RoleHitler from "../assets/role-hitler.png";
import RoleLiberal1 from "../assets/role-liberal-1.png";
import RoleLiberal2 from "../assets/role-liberal-2.png";
import RoleLiberal3 from "../assets/role-liberal-3.png";
import RoleLiberal4 from "../assets/role-liberal-4.png";
import RoleLiberal5 from "../assets/role-liberal-5.png";
import RoleLiberal6 from "../assets/role-liberal-6.png";
import RoleFascist1 from "../assets/role-fascist-1.png";
import RoleFascist2 from "../assets/role-fascist-2.png";
import RoleFascist3 from "../assets/role-fascist-3.png";

import "./RoleAlert.css";
import { GameState, Role } from "../types";
import { useText } from "../hooks/useText";

const LiberalImages = [
  RoleLiberal1,
  RoleLiberal2,
  RoleLiberal3,
  RoleLiberal4,
  RoleLiberal5,
  RoleLiberal6,
];
const HitlerImages = [RoleHitler];
const FascistImages = [RoleFascist1, RoleFascist2, RoleFascist3];

type RoleAlertProps = {
  role?: Role;
  name: string;
  gameState: GameState;
  onClick: () => void;
};

/**
 * CustomAlert content that shows the player's current role and a quick guide on how to play
 * the game.
 * Parameters:
 *      - {@code role} [String]: The role of the player. Should be either LIBERAL, FASCIST, or HITLER.
 *      - {@code roleID} [int]: The integer roleID of the player. This is used to show unique role cards.
 *          The roleID can range from [1, 6] for LIBERALS, [1, 3] for FASCISTS, and [1] for HITLER. If out of bounds,
 *          the value is set to 1 (default).
 *      - {@code onClick} [()]: The callback function for when confirmation button ("OKAY") is pressed.
 */
function RoleAlert(props: RoleAlertProps) {
  const { t, tArray } = useText();

  const getRoleImageAndAlt = (): { image: string; alt: string } => {
    let images: string[];
    let altTextKey: string;

    switch (props.role) {
      case Role.LIBERAL:
        images = LiberalImages;
        altTextKey = "roleAltText.liberal";
        break;
      case Role.FASCIST:
        images = FascistImages;
        altTextKey = "roleAltText.fascist";
        break;
      default: // Hitler
        images = HitlerImages;
        altTextKey = "roleAltText.hitler";
    }

    const playerIndex = props.gameState.playerOrder.indexOf(props.name);
    const roleId = playerIndex % images.length;
    const altTexts = tArray(altTextKey);

    return {
      image: images[roleId],
      alt: altTexts[roleId] || altTexts[0],
    };
  };

  const getRoleTextKey = (): string => {
    switch (props.role) {
      case Role.LIBERAL:
        return "roleInstructions.liberal";
      case Role.FASCIST:
        return "roleInstructions.fascist";
      default: // Hitler
        return "roleInstructions.hitler";
    }
  };

  const { image, alt } = getRoleImageAndAlt();
  const roleKey = getRoleTextKey();
  const roleDisplayName = t(`roles.${props.role}`);

  return (
    <div>
      <div>
        <h2 id="alert-header" className={"left-align"}>
          ERES: {roleDisplayName}
        </h2>
        <img id="role" src={image} alt={alt} />

        <p className={"left-align"}>{t(`${roleKey}.win`)}</p>
        <p className={"left-align"}>{t(`${roleKey}.lose`)}</p>
        <p className="highlight left-align">{t(`${roleKey}.strategy`)}</p>
      </div>

      <button onClick={props.onClick}>{t("common.okay")}</button>
    </div>
  );
}

export default RoleAlert;
