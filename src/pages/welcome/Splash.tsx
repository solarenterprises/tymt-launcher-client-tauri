import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Box, LinearProgress } from "@mui/material";

import { getAccountList } from "../../store/AccountListSlice";

import { IAccountList } from "../../types/AccountTypes";

import SplashLogo from "../../assets/welcome/SplashLogo.svg";

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);

  const accountListStore: IAccountList = useSelector(getAccountList);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          return oldProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
    }
  }, [accountListStore, progress]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          alignSelf: "center",
        }}
      >
        <div className="splash-logo">
          <Box component={"img"} src={SplashLogo} />
        </div>
      </motion.div>
      <div className="red-blur" />
      <div className="blue-blur" />
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: "#00000000",
          height: "10px",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#EF4444",
          },
        }}
      />
    </>
  );
};

export default Splash;
