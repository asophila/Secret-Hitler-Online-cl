import React, { useState } from "react";
import ButtonPrompt from "./ButtonPrompt";
import { SERVER_TIMEOUT } from "../constants";

import "../util/PolicyDisplay.css";
import PolicyDisplay from "../util/PolicyDisplay";
import { PolicyType, SendWSCommand, WSCommandType } from "../types";
import { useText } from "../hooks/useText";

type PresidentLegislativePromptProps = {
  policyOptions: PolicyType[];
  sendWSCommand: SendWSCommand;
};

function PresidentLegislativePrompt(props: PresidentLegislativePromptProps) {
  const { t } = useText();
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const [waitingForServer, setWaitingForServer] = useState(false);

  const onButtonClick = () => {
    if (selection === undefined) {
      return;
    }
    // Lock the button so that it can't be pressed multiple times.
    setWaitingForServer(true);
    setTimeout(() => {
      setWaitingForServer(false);
    }, SERVER_TIMEOUT);

    // Contact the server using provided method.
    props.sendWSCommand({
      command: WSCommandType.REGISTER_PRESIDENT_CHOICE,
      choice: selection,
    });
  };

  return (
    <ButtonPrompt
      label={t("legislative.president.header")}
      headerText={t("legislative.president.instructions")}
      buttonText={t("legislative.president.button")}
      buttonOnClick={onButtonClick}
      buttonDisabled={selection === undefined || waitingForServer}
    >
      <PolicyDisplay
        policies={props.policyOptions}
        onClick={(index: number) => setSelection(index)}
        selection={selection}
        allowSelection={true}
      />
    </ButtonPrompt>
  );
}

export default PresidentLegislativePrompt;
