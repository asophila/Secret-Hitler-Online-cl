import React, { useState } from "react";
import ButtonPrompt from "./ButtonPrompt";
import { SERVER_TIMEOUT } from "../constants";
import { SendWSCommand, WSCommandType } from "../types";
import { useText } from "../hooks/useText";

type VetoPromptProps = {
  sendWSCommand: SendWSCommand;
  electionTracker: number;
};

function VetoPrompt(props: VetoPromptProps) {
  const { t } = useText();
  const [waitingForServer, setWaitingForServer] = useState(false);

  const onButtonClick = (accepted: boolean) => {
    setWaitingForServer(true);
    setTimeout(() => setWaitingForServer(false), SERVER_TIMEOUT);

    props.sendWSCommand({
      command: WSCommandType.REGISTER_PRESIDENT_VETO,
      veto: accepted,
    });
  };

  return (
    <ButtonPrompt
      label={t("veto.header")}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>{t("veto.requested")}</p>
            {props.electionTracker === 2 && (
              <p className={"left-align highlight"}>
                {t("veto.trackerWarning")}
              </p>
            )}
            {props.electionTracker !== 2 && (
              <p className={"left-align"}>{t("veto.normalCase")}</p>
            )}
            <p className={"left-align"}>{t("veto.otherwise")}</p>
            <br />
          </>
        );
      }}
      footerText={t("veto.question")}
      renderButton={() => {
        return (
          <>
            <button
              onClick={() => onButtonClick(false)}
              disabled={waitingForServer}
            >
              {t("veto.reject")}
            </button>
            <button
              onClick={() => onButtonClick(true)}
              disabled={waitingForServer}
            >
              {t("veto.accept")}
            </button>
          </>
        );
      }}
    />
  );
}

export default VetoPrompt;
