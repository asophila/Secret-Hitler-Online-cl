import React from "react";
import ReactGA from "react-ga";
import "./LoginPageContent.css";
import "./util/CustomAliceCarousel.css";
import { useText } from "./hooks/useText";

function LoginPageContent() {
  const { t } = useText();

  const onClickAbout = () => {
    ReactGA.event({
      category: "Clicked About",
      action: "User clicked the link for the about page.",
    });
  };

  const onClickGameWebsite = () => {
    ReactGA.event({
      category: "Clicked Game Website",
      action: "User clicked the link for the board game website.",
    });
  };

  let handleDragStart = (e) => e.preventDefault();
  let items = [
    <img
      id={"login-page-gif"}
      src={"https://i.postimg.cc/zvnLRbqq/place-policy.gif"}
      onDragStart={handleDragStart}
      alt={"A policy tile being placed on the board."}
    />,
    <img
      id={"login-page-gif"}
      src={"https://i.postimg.cc/Wbvqcn7z/show-policy.gif"}
      onDragStart={handleDragStart}
      alt={"An animated folder revealing a policy tile."}
    />,
    <img
      id={"login-page-gif"}
      src={"https://i.postimg.cc/cCNCZxw2/show-votes.gif"}
      onDragStart={handleDragStart}
      alt={"An animation showing all the cast votes."}
    />,
  ];

  return (
    <>
      <div id={"#login-page-description-container"}>
        <div id={"login-page-description-text-container"}>
          <h2 id={"login-page-description-text-header"}>
            {t("login.title")}
          </h2>
          <p id={"login-page-description-text"}>
            {t("login.description1")} {t("login.description2")}
            <br />
            <br />
            {t("login.description3")}
            <br />
            <br />
          </p>
        </div>
        <div id={"login-page-gif-container"}>{items}</div>
        <div id={"login-page-description-text-container"}>
          <p id={"login-page-description-text"}>
            <br />
            {t("login.openSource")}{" "}
            <a
              href={"https://github.com/ShrimpCryptid/Secret-Hitler-Online/"}
              rel="noreferrer"
              target={"_blank"}
              onClick={onClickAbout}
            >
              {t("login.onGitHub")}
            </a>
            !
            <br />
            <br />
            {t("login.adaptedFrom")}{" "}
            <a
              href={"https://secrethitler.com"}
              target={"_blank"}
              rel="noreferrer"
              onClick={onClickGameWebsite}
            >
              {t("login.secretHitler")}
            </a>{" "}
            {t("login.credits")}
            <br />
            <br />
            {t("login.bugReport")}{" "}
            <a
              href={"https://github.com/ShrimpCryptid/Secret-Hitler-Online/issues"}
              rel="noreferrer"
              target={"_blank"}
            >
              {t("login.issuesPage")}
            </a>
            .
          </p>
          <br />
        </div>
      </div>
    </>
  );
}

export default LoginPageContent;
