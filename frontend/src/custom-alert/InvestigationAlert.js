import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonPrompt from "./ButtonPrompt";

import PartyBack from "../assets/party-membership.png";
import PartyLiberal from "../assets/party-membership-liberal.png";
import PartyFascist from "../assets/party-membership-fascist.png";
import { LIBERAL } from "../constants";
import { useText } from "../hooks/useText";

import "./InvestigationAlert.css";

/**
 * The contents for a CustomAlert that show a party membership card.
 * The card and related text are animated for effect.
 */
function InvestigationAlert(props) {
  const { t } = useText();
  const [flipCard, setFlipCard] = useState(false);
  const [showText, setShowText] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    const flipTimeout = setTimeout(() => {
      setFlipCard(true);
    }, 1000);
    const showTextTimeout = setTimeout(() => {
      setShowText(true);
      setDisableButton(false);
    }, 1500);

    return () => {
      clearTimeout(flipTimeout);
      clearTimeout(showTextTimeout);
    };
  }, []);

  const partyName = t(`parties.${props.party}`);
  const alt = t("investigation.resultText", {
    target: props.target,
    party: partyName,
  });
  let cardFrontSrc = props.party === LIBERAL ? PartyLiberal : PartyFascist;
  let footerClass = showText
    ? "investigation-text-show"
    : "investigation-text-hide";
  let cardClass = flipCard
    ? "investigation-container-flip"
    : "investigation-container-default";

  return (
    <ButtonPrompt
      label={t("investigation.resultsHeader")}
      renderFooter={() => {
        return (
          <p id="investigation-text" className={footerClass}>
            {t("investigation.resultText", {
              target: props.target,
              party: partyName,
            })}
          </p>
        );
      }}
      buttonOnClick={props.hideAlert}
      buttonDisabled={disableButton}
      buttonText={t("common.okay")}
    >
      <div id={"party-card-container"}>
        <img
          id={"party-card-back"}
          className={cardClass}
          src={PartyBack}
          alt={alt}
        />
        <img
          id={"party-card-front"}
          className={cardClass}
          src={cardFrontSrc}
          alt={alt}
        />
      </div>
    </ButtonPrompt>
  );
}

InvestigationAlert.propTypes = {
  party: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  hideAlert: PropTypes.func.isRequired,
};

export default InvestigationAlert;
