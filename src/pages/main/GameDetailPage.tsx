import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Skeleton } from "@mui/material";

import GameSiteViewer from "./GameSiteViewer";
import GameOverview from "./GameOverview";
import ErrorComponent from "../../components/common/ErrorComponent";

import GameAPI from "../../lib/api/GameAPI";

import { IGame } from "../../types/GameTypes";

const GameDetailPage = () => {
  const { gameId } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [game, setGame] = useState<IGame>(null);

  useEffect(() => {
    setLoading(true);
    GameAPI.fetchGame(gameId)
      .then(setGame)
      .catch((err) => {
        console.error("Failed to fetch game details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameId]);

  return (
    <>
      {loading && <Skeleton variant="rounded" sx={{ width: "100%", height: "100%", borderRadius: "32px", backgroundColor: "rgba(0, 0, 0, 0.5)" }} />}
      {!loading && !game && <ErrorComponent />}
      {!loading && game && (game?.external_url ? <GameSiteViewer game={game} /> : <GameOverview game={game} />)}
    </>
  );
};

export default GameDetailPage;
