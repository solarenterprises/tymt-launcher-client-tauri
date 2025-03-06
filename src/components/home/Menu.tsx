import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, Box, Tooltip, Stack } from "@mui/material";
import home from "../../assets/main/Home.svg";
import library from "../../assets/main/Library.svg";
import store from "../../assets/main/Store.svg";
import chevronleftdouble from "../../assets/main/ChevronLeftDouble.svg";
import chevronrightdouble from "../../assets/main/ChevronRightDouble.svg";
// import { getCurrentPage, setCurrentPage } from "../../features/home/Navigation";
import { getCurrentLogo, setCurrentLogo } from "../../store/tymtLogoSlice";
// import { PaginationType } from "../../types/homeTypes";
import { tymtLogoType } from "../../types/HomeTypes";
import InstallingProcess from "./InstallingProcess";

const Menu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const currentpage: PaginationType = useSelector(getCurrentPage);
  const tymtlogo: tymtLogoType = useSelector(getCurrentLogo);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [isDrawerExpanded, setDrawerExpanded] = useState<boolean>(tymtlogo.isDrawerExpanded);

  const handleChevronClick = () => {
    setDrawerExpanded((prevExpanded) => !prevExpanded);
    dispatch(
      setCurrentLogo({
        ...tymtlogo,
        isDrawerExpanded: !tymtlogo.isDrawerExpanded,
      })
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        setDrawerExpanded(false);
        dispatch(setCurrentLogo({ ...tymtlogo, isDrawerExpanded: false }));
      } else {
        setDrawerExpanded(true);
        dispatch(setCurrentLogo({ ...tymtlogo, isDrawerExpanded: true }));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    location.pathname === "/home" && setSelectedItem(0);
    location.pathname.startsWith("/store") && setSelectedItem(1);
    location.pathname === "/library" && setSelectedItem(2);
  }, [location]);

  return (
    <Grid
      container
      sx={{
        width: isDrawerExpanded ? `203px` : "95px",
        position: "fixed",
        marginLeft: "0%",
        height: "600px",
        whiteSpace: "nowrap",
        transition: "width 0.1s ease-in-out",
        borderRadius: "var(--Angle-Number, 32px)",
        background: "var(--bg-stroke-side-menu-bg, rgba(29, 29, 29, 0.30))",
        backgroundBlendMode: "luminosity",
        backdropFilter: "blur(50px)",
        zIndex: 10,
      }}
    >
      <Grid item xs={12}>
        <Grid
          container
          sx={{
            width: "85%",
            height: "540px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <List sx={{ bgcolor: "none", marginTop: "20px" }}>
            {[`${t("hom-1_home")}`, `${t("hom-2_store")}`, `${t("hom-3_library")}`].map((text, index) => (
              <Tooltip
                key={index}
                title={
                  <Stack
                    spacing={"10px"}
                    sx={{
                      padding: "6px 8px 6px 8px",
                      borderRadius: "30px",
                      border: "1px",
                      borderColor: "#FFFFFF1A",
                      backgroundColor: "#8080804D",
                    }}
                  >
                    <Box className="fs-14-regular white">{text}</Box>
                  </Stack>
                }
                PopperProps={{
                  placement: "right",
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 5],
                      },
                    },
                  ],
                  sx: {
                    display: isDrawerExpanded ? "none" : "block",
                    [`& .MuiTooltip-tooltip`]: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  },
                }}
              >
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    background: selectedItem === index ? "linear-gradient(112deg, rgba(255, 255, 255, 0.24) 0%,rgba(255, 255, 255, 0.00) 100%)" : "transparent",
                    borderLeft: selectedItem === index ? "solid white 3px" : "transparent",
                    marginBottom: "25px",
                    display: "block",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                >
                  <ListItemButton
                    sx={{
                      marginBottom: "25px",
                      justifyContent: "initial",
                      height: "40px",
                      px: 2.5,
                      "&:hover": {
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                        background:
                          selectedItem === index
                            ? "transparent"
                            : "linear-gradient(112deg, rgba(239, 68, 68, 0.00) 0%, rgba(239, 68, 68, 0.24) 51.82%, rgba(239, 68, 68, 0.00) 98.49%)",
                      },
                    }}
                    onClick={() => {
                      // dispatch(
                      //   setCurrentPage({
                      //     ...currentpage,
                      //     index: index,
                      //     page: text?.toLowerCase(),
                      //   })
                      // );
                      setSelectedItem(index);
                      const path = index % 3 === 0 ? "/home" : index % 3 === 1 ? "/store" : "/library";

                      navigate(path);
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                      }}
                    >
                      <>
                        {index % 3 === 0 && <img src={home} />}
                        {index % 3 === 1 && <img src={store} />}
                        {index % 3 === 2 && <img src={library} />}
                      </>
                    </ListItemIcon>
                    {isDrawerExpanded && (
                      <Box sx={{ opacity: 1, color: "white" }} className={"fs-16-regular"} textTransform={"none"}>
                        {text}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          <InstallingProcess />
        </Grid>
        <Button className="menu_chevron_button" onClick={handleChevronClick}>
          {!isDrawerExpanded && <img src={chevronrightdouble}></img>}
          {isDrawerExpanded && <img src={chevronleftdouble}></img>}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Menu;
