import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { applyValue, JsonViewer, JsonViewerOnChange } from "@textea/json-viewer";

import { Box, Stack } from "@mui/material";

import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";

import AccountNextButton from "../../components/account/AccountNextButton";
import { addOneDeveloperGameList } from "../../store/DeveloperGameListSlice";

export interface IPropsDeveloperNewGame {
  setStatus: (_: number) => void;
}

const DeveloperNewGame = ({ setStatus }: IPropsDeveloperNewGame) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jsonData, setJsonData] = useState(CONST_GAME_DISTRICT53);

  const handleNextClick = useCallback(() => {
    dispatch(addOneDeveloperGameList(jsonData));
    setStatus(0);
  }, [jsonData]);

  return (
    <>
      <Stack gap={3}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF55",
            backdropFilter: "blur(5px)", // Applies the blur effect
            WebkitBackdropFilter: "blur(5px)", // Ensures compatibility with Safari
            padding: 2,
            borderRadius: "16px",
          }}
        >
          <JsonViewer
            theme="dark"
            value={jsonData}
            onChange={useCallback<JsonViewerOnChange>((path, _oldValue, newValue) => {
              setJsonData((src) => applyValue(src, path, newValue));
            }, [])}
            editable
          />
        </Box>
        <AccountNextButton text={t("ncca-7_next")} onClick={handleNextClick} />
      </Stack>
    </>
  );
};

export default DeveloperNewGame;
