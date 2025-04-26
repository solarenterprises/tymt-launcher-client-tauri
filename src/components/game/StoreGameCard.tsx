import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";

import { Box, Stack } from "@mui/material";

import { IGame } from "../../types/GameTypes";
import TooltipComponent from "../home/TooltipComponent";
import { useEffect, useRef, useState } from "react";
import { IPoint } from "../../types/HomeTypes";
import GameCardContextMenu from "../menu/GameCardContextMenu";

export interface IPropsStoreGameCard {
  game: IGame;
  mode?: string;
  index?: number;
}

const StoreGameCard = ({ game, mode, index }: IPropsStoreGameCard) => {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(10); // Default duration

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      // Calculate the total width of all tags
      // @ts-ignore
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      // Calculate the duration based on the width and desired speed
      const speed = 50; // Pixels per second (adjust as needed)
      const duration = contentWidth / speed;

      // Set the animation duration
      setAnimationDuration(duration);
    }
  }, [game?.projectMeta?.tags]);

  const titleContainerRef = useRef(null);
  const titleContentRef = useRef(null);
  const [titleAnimationDuration, setTitleAnimationDuration] = useState(10); // Default duration

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      // Calculate the total width of the title
      // @ts-ignore
      const titleContainerWidth = titleContainerRef.current.offsetWidth;
      const titleContentWidth = titleContentRef.current.scrollWidth;

      // Calculate the duration based on the width and desired speed
      const speed = 50; // Pixels per second (adjust as needed)
      const duration = titleContentWidth / speed;

      // Set the animation duration
      setTitleAnimationDuration(duration);
    }
  }, [game?.title]);

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  return (
    <>
      <div className="store-game-card">
        <div className="store-game-card2">
          <TooltipComponent placement="bottom" text={game?.title}>
            <Box
              onContextMenu={handleRightClick}
              sx={{
                width: "180px",
                height: "300px",
                flexShrink: "0",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                background: "rgba(255, 255, 255, 0.02)",
                backgroundBlendMode: "luminosity",
                backdropFilter: "blur(50px)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                "&:hover": {
                  backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.1))",
                  border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.1))",
                },
                "&:active": {
                  background: "var(--bg-stroke-icon-button-bg-active-30, rgba(128, 128, 128, 0.3))",
                },
              }}
              onClick={() => {
                // if (mode !== "coming-soon")
                navigate(`/game/${game?._id}`);
              }}
            >
              {mode === "trending" && (
                <Box
                  className={"fs-12-regular white"}
                  sx={{
                    position: "absolute",
                    top: "48px",
                    left: "-36px",
                    padding: "4px",
                    fontSize: "124px", // Adjusted font size
                    fontFamily: "Cobe-Bold-Italic",
                    WebkitTextFillColor: "#0B0B0B", // Fill color
                    WebkitTextStrokeWidth: "0.5px", // Stroke width
                    WebkitTextStrokeColor: "#F6E27A", // Stroke color
                  }}
                >
                  {index + 1}
                </Box>
              )}
              {mode === "coming-soon" && (
                <Box
                  className={"fs-12-regular white"}
                  sx={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "linear-gradient(to right, rgb(196, 176, 102), rgb(125, 108, 49))",
                    borderRadius: "50ch",
                    padding: "4px",
                  }}
                >
                  COMING SOON
                </Box>
              )}
              <Box
                component={"img"}
                src={game?.imageUrl}
                width={"100%"}
                height={"165px"}
                sx={{
                  borderRadius: "16px",
                  objectFit: "fill",
                }}
              />

              <Stack padding="16px 2px" gap={"16px"}>
                <Box
                  className="fs-20-regular white"
                  ref={titleContainerRef}
                  sx={{
                    color: "white",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <div
                    ref={titleContentRef}
                    className="marquee-element"
                    style={{
                      display: "inline-block",
                      paddingLeft: "100%",
                      animation: `marquee ${titleAnimationDuration}s linear infinite`,
                    }}
                  >
                    {/* Render the title twice to create a seamless loop */}
                    {`${game?.title} • ${game?.title} • ${game?.title} • ${game?.title} • ${game?.title}`}
                  </div>
                </Box>

                <Box
                  ref={containerRef}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  <Box
                    ref={contentRef}
                    sx={{
                      display: "inline-block",
                      paddingLeft: "100%",
                      animation: `marquee ${animationDuration}s linear infinite`,
                    }}
                  >
                    {/* Render the tags twice to create a seamless loop */}
                    {[
                      ...game?.projectMeta?.tags,
                      ...game?.projectMeta?.tags,
                      ...game?.projectMeta?.tags,
                      ...game?.projectMeta?.tags,
                      ...game?.projectMeta?.tags,
                    ]?.map((tag, index) => (
                      <Box
                        key={index}
                        className={"fs-14-regular white card_genre_label"}
                        sx={{
                          display: "inline-block",
                          marginRight: "6px", // Adjust spacing between tags
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
                {game?.projectMeta?.type === "native" ? (
                  <Box className={"fs-12-regular light"} pl={`15px`}>{`${game?.downloadCount} downloaded`}</Box>
                ) : (
                  <Box className={"fs-12-regular light"} pl={`15px`}>{`browser game`}</Box>
                )}
              </Stack>
            </Box>
          </TooltipComponent>
        </div>
      </div>
      {mode !== "coming-soon" && (
        <GameCardContextMenu contextMenuPosition={contextMenuPosition} view={showContextMenu} setView={setShowContextMenu} game={game} />
      )}
    </>
  );
};

export default StoreGameCard;
