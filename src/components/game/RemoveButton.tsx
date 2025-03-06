import { useState, useEffect } from "react";

import { Button } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { useNotification } from "../../providers/NotificationProvider";

import { deleteGameDirectory, isInstalled } from "../../lib/helper/DownloadHelper";

import { IGame } from "../../types/GameTypes";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

export interface IPropsRemoveButton {
  game: IGame;
}

const RemoveButton = ({ game }: IPropsRemoveButton) => {
  const { showNotification } = useNotification();

  const [installed, setInstalled] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      setIsRemoving(true);
      await deleteGameDirectory(game);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.REMOVE_SUCCESS });
    } catch (err) {
      console.error("Failed to handleRemoveClick: ", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.REMOVE_FAIL, text: err.toString() });
    } finally {
      setIsRemoving(false);
    }
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
      {installed && (
        <Button className="button_navbar_common" disabled={isRemoving || !installed} onClick={handleClick}>
          <DeleteOutlineRoundedIcon
            sx={{
              color: "white",
            }}
          />
        </Button>
      )}
    </>
  );
};

export default RemoveButton;
