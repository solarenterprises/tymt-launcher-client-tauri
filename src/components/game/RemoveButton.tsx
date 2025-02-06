import { useState, useEffect } from "react";

import { Button } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { /*deleteGame*/ isInstalled } from "../../lib/helper/DownloadHelper";

import { IGame } from "../../types/GameTypes";

export interface IPropsRemoveButton {
  game: IGame;
}

const RemoveButton = ({ game }: IPropsRemoveButton) => {
  const [installed, setInstalled] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const handleClick = async () => {
    setIsRemoving(true);
    // await deleteGame(game);
    setIsRemoving(false);
  };

  useEffect(() => {
    const checkInstalled = async (game: IGame) => {
      setInstalled(await isInstalled(game));
    };

    const intervalId = setInterval(() => checkInstalled(game), 1 * 1e3);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [game]);

  return (
    <>
      <Button className="button_navbar_common" disabled={isRemoving || !installed} onClick={handleClick}>
        <DeleteOutlineRoundedIcon
          sx={{
            color: "white",
          }}
        />
      </Button>
    </>
  );
};

export default RemoveButton;
