import React, { useState, useRef, useEffect } from "react";
import { SERVER_TIMEOUT } from "../constants";
import PolicyDisplay from "../util/PolicyDisplay";
import ButtonPrompt from "./ButtonPrompt";
import { PolicyType, SendWSCommand, WSCommandType } from "../types";
import { useText } from "../hooks/useText";

type PeekPromptProps = {
  policies: PolicyType[];
  sendWSCommand: SendWSCommand;
};

function PeekPrompt(props: PeekPromptProps) {
  const { t } = useText();
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const timeoutID = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutID.current);
    };
  }, []);

  const onButtonClick = () => {
    // Lock the button so that it can't be pressed multiple times.
    setWaitingForServer(true);
    timeoutID.current = setTimeout(() => {
      setWaitingForServer(false);
    }, SERVER_TIMEOUT);

    // Contact the server using provided method.
    props.sendWSCommand({ command: WSCommandType.REGISTER_PEEK });
  };

  return (
    <ButtonPrompt
      label={t("peek.header")}
      headerText={t("peek.instructions")}
      buttonText={t("common.okay")}
      buttonOnClick={onButtonClick}
      buttonDisabled={waitingForServer}
    >
      <PolicyDisplay
        policies={props.policies}
        onClick={(index: number) => setSelection(index)}
        allowSelection={false}
      />
    </ButtonPrompt>
  );
}

export default PeekPrompt;
