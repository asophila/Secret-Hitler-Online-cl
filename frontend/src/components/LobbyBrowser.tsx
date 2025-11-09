import React, { useState, useEffect } from "react";
import { useText } from "../hooks/useText";
import { SERVER_ADDRESS_HTTP } from "../constants";
import "./LobbyBrowser.css";

interface LobbyListItem {
  code: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  createdAt: number;
}

interface LobbyBrowserProps {
  onJoinLobby: (code: string) => void;
  onCreatePrivate: () => void;
}

function LobbyBrowser(props: LobbyBrowserProps) {
  const { t } = useText();
  const [lobbies, setLobbies] = useState<LobbyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLobbies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${SERVER_ADDRESS_HTTP}/list-lobbies`);
      if (response.ok) {
        const data = await response.json();
        setLobbies(data);
      } else {
        setError("Error al cargar salas");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error fetching lobbies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lobbies on mount
  useEffect(() => {
    fetchLobbies();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLobbies();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lobby-browser">
      <h2>{t("lobbyBrowser.title")}</h2>

      <div className="lobby-browser-actions">
        <button onClick={fetchLobbies} disabled={loading}>
          {t("lobbyBrowser.refresh")}
        </button>
        <button onClick={props.onCreatePrivate}>
          {t("lobbyBrowser.createPrivate")}
        </button>
      </div>

      {loading && lobbies.length === 0 && (
        <p className="lobby-browser-message">{t("lobbyBrowser.loading")}</p>
      )}

      {error && <p className="lobby-browser-error">{error}</p>}

      {!loading && lobbies.length === 0 && !error && (
        <p className="lobby-browser-message">{t("lobbyBrowser.noLobbies")}</p>
      )}

      <div className="lobby-list">
        {lobbies.map((lobby) => (
          <div key={lobby.code} className="lobby-item">
            <div className="lobby-item-header">
              <h3 className="lobby-item-name">
                {lobby.name || `Sala ${lobby.code}`}
              </h3>
              <span className="lobby-item-players">
                {t("lobbyBrowser.playerCount", {
                  current: lobby.playerCount.toString(),
                  max: lobby.maxPlayers.toString(),
                })}{" "}
                {t("lobbyBrowser.players")}
              </span>
            </div>
            <div className="lobby-item-footer">
              <span className="lobby-item-code">
                {t("lobbyBrowser.lobbyCode")} {lobby.code}
              </span>
              <button
                className="lobby-item-join"
                onClick={() => props.onJoinLobby(lobby.code)}
              >
                {t("lobbyBrowser.joinButton")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LobbyBrowser;
