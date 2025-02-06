import { useState } from "react";

import { Grid } from "@mui/material";

import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";

import GameBarSticker from "../../components/home/GameBarSticker";
import Bottom from "../../components/home/Bottom";
import ComingsoonD53 from "../../components/home/ComingSoon-D53";
import District53Intro from "../../components/home/District53Intro";
import RecentlyAddedGames from "../../components/home/RecentlyAddedGames";
import UpdateModal from "../../components/home/UpdateModal";
import AnimatedComponent from "../../components/home/AnimatedComponent";

const Homepage = () => {
  const [image, setImage] = useState<string>(CONST_GAME_DISTRICT53?.imageUrl);
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  return (
    <>
      <AnimatedComponent>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "calc(100% - 353px)" }}>
            <Grid item xs={12}>
              <img
                className="District53"
                src={image}
                width={"100%"}
                style={{
                  aspectRatio: "1.78",
                  borderRadius: "16px",
                  opacity: 1.0,
                  flexShrink: 1,
                }}
                loading="lazy"
              />
            </Grid>
            <Grid item xs={12} container spacing={"32px"} mt={"0px"}>
              <GameBarSticker />
            </Grid>
          </div>
          <District53Intro setImage={setImage} />
        </Grid>
      </AnimatedComponent>
      <Grid container sx={{ marginTop: "80px" }}>
        <RecentlyAddedGames />
        <AnimatedComponent>
          <ComingsoonD53 />
        </AnimatedComponent>
        <AnimatedComponent>
          <Bottom />
        </AnimatedComponent>
      </Grid>
      <UpdateModal open={updateModal} setOpen={setUpdateModal} />
    </>
  );
};

export default Homepage;
