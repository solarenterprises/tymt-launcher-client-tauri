import { useNavigate } from "react-router-dom";
import { Grid, Button, Box, Stack } from "@mui/material";

import { CONST_GAME_LIST } from "../../const/games/GameConsts";

const GameBarSticker = () => {
  const navigate = useNavigate();

  return (
    <>
      {CONST_GAME_LIST?.map((game, index) => (
        <Grid item key={index}>
          <Button
            className="button_gamecontent"
            key={game?.project_name}
            onClick={() => {
              navigate(`/game/${game?._id}`);
            }}
          >
            <Stack direction={"row"} alignItems={"center"} width={"100%"}>
              <img
                src={game?.imageUrl}
                width={"60px"}
                height={"60px"}
                style={{
                  borderRadius: "16px",
                  marginLeft: "-2px",
                }}
                loading="lazy"
              />
              <Box className={"fs-14-light white t-center"} textTransform={"none"} sx={{ whiteSpace: "nowrap", padding: "0px 20px" }}>
                {game?.title}
              </Box>
            </Stack>
          </Button>
        </Grid>
      ))}
    </>
  );
};

export default GameBarSticker;
