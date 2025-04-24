import { useEffect, useRef } from "react";
import { IGame } from "../../types/GameTypes";
import { invoke } from "@tauri-apps/api/core";

export interface IPropsGameSiteViewer {
  game: IGame;
}

const GameSiteViewer = ({ game }: IPropsGameSiteViewer) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log("Width:", rect.width);
      console.log("Height:", rect.height);
      console.log("Position (x, y):", rect.x, rect.y);
    }

    if (game?.external_url) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log(rect.width, rect.height, rect.x, rect.y);
        invoke("create_child_window", {
          url: game?.external_url,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
        }).catch((err) => {
          console.error("Failed to create child window:", err);
        });
      }
    }

    return () => {
      invoke("destroy_child_window").catch((err) => {
        console.error("Failed to destroy child window:", err);
      });
    };
  }, [game]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default GameSiteViewer;
