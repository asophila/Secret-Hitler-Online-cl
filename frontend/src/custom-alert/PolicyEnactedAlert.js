import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonPrompt from "./ButtonPrompt";

import LiberalPolicy from "../assets/policy-liberal.png";
import FascistPolicy from "../assets/policy-fascist.png";
import FolderCoverFront from "../assets/policy-folder-cover-front.png";
import FolderCoverBack from "../assets/policy-folder-cover-back.png";
import FolderBack from "../assets/policy-folder-back.png";

import "./PolicyEnactedAlert.css";
import { LIBERAL } from "../constants";
import { useText } from "../hooks/useText";

function PolicyEnactedAlert(props) {
  const { t } = useText();
  const [className, setClassName] = useState("");

  useEffect(() => {
    // Set up animations
    const shiftTimeout = setTimeout(() => {
      setClassName("show-policy-shift");
    }, 500);
    const flipTimeout = setTimeout(() => {
      setClassName("show-policy-flip show-policy-shift");
    }, 1000);

    return () => {
      clearTimeout(shiftTimeout);
      clearTimeout(flipTimeout);
    };
  }, []);

  const policyTypeLower = props.policyType.toLowerCase();
  const isLiberal = props.policyType === LIBERAL;
  const altText = isLiberal
    ? t("policy.liberalAlt")
    : t("policy.fascistAlt");

  return (
    <ButtonPrompt
      renderLabel={() => {
        return <h2 className={"left-align"}>{t("policy.enacted")}</h2>;
      }}
      buttonText={t("common.okay")}
      buttonOnClick={props.hideAlert}
    >
      <div id={"policy-enacted-container"}>
        <img
          id={"policy-enacted-back"}
          className={className}
          src={FolderBack}
          alt={""}
        />
        <img
          id={"policy-enacted-policy"}
          className={className}
          src={isLiberal ? LiberalPolicy : FascistPolicy}
          alt={altText}
        />
        <img
          id={"policy-enacted-cover-back"}
          src={FolderCoverBack}
          className={className}
          alt={"A manila folder labeled 'New Policy.'"}
        />
        <img
          id={"policy-enacted-cover-front"}
          src={FolderCoverFront}
          className={className}
          alt={"A manila folder labeled 'New Policy.'"}
        />
      </div>
    </ButtonPrompt>
  );
}

PolicyEnactedAlert.propTypes = {
  hideAlert: PropTypes.func.isRequired,
  policyType: PropTypes.string.isRequired,
};

export default PolicyEnactedAlert;
