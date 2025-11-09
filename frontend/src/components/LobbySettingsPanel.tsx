import React, { useState } from "react";
import { useText } from "../hooks/useText";
import { SERVER_ADDRESS_HTTP } from "../constants";
import "./LobbySettingsPanel.css";

interface LobbySettingsPanelProps {
  lobbyCode: string;
  isVIP: boolean;
  initialIsPublic?: boolean;
  initialLobbyName?: string;
  onSettingsChanged?: () => void;
}

function LobbySettingsPanel(props: LobbySettingsPanelProps) {
  const { t } = useText();
  const [isPublic, setIsPublic] = useState(props.initialIsPublic || false);
  const [lobbyName, setLobbyName] = useState(props.initialLobbyName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${SERVER_ADDRESS_HTTP}/set-lobby-visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lobby: props.lobbyCode,
          isPublic: isPublic,
          name: lobbyName,
        }),
      });

      if (response.ok) {
        setMessage("✓ Guardado");
        if (props.onSettingsChanged) {
          props.onSettingsChanged();
        }
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error al guardar");
      }
    } catch (err) {
      setMessage("Error de conexión");
      console.error("Error saving lobby settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!props.isVIP) {
    return null;
  }

  return (
    <div className="lobby-settings-panel">
      <h3 className="lobby-settings-title">
        {t("lobbySettings.title")} {t("lobbySettings.hostOnly")}
      </h3>

      <div className="lobby-settings-content">
        <div className="lobby-settings-field">
          <label className="lobby-settings-label">
            {t("lobbySettings.visibility")}:
          </label>
          <div className="lobby-settings-radio-group">
            <label className="lobby-settings-radio">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
              <span>{t("lobbySettings.private")}</span>
            </label>
            <label className="lobby-settings-radio">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <span>{t("lobbySettings.public")}</span>
            </label>
          </div>
        </div>

        {isPublic && (
          <div className="lobby-settings-field">
            <label className="lobby-settings-label">
              {t("lobbySettings.lobbyName")}:
            </label>
            <input
              type="text"
              className="lobby-settings-input"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              placeholder={t("lobbySettings.lobbyNamePlaceholder")}
              maxLength={50}
            />
          </div>
        )}

        <button
          className="lobby-settings-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "..." : t("lobbySettings.save")}
        </button>

        {message && (
          <div className={`lobby-settings-message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default LobbySettingsPanel;
