import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ask } from "@tauri-apps/plugin-dialog";
import { motion } from "framer-motion";

import { Box, LinearProgress } from "@mui/material";

import { getAccountList } from "../../store/AccountListSlice";

import { IAccountList, IAuth } from "../../types/AccountTypes";

import SplashLogo from "../../assets/welcome/SplashLogo.svg";
import { getAuth, setAuth } from "../../store/AuthSlice";

const Splash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<number>(0);

  const accountListStore: IAccountList = useSelector(getAccountList);
  const authStore: IAuth = useSelector(getAuth);

  useEffect(() => {
    const runUpdate = async () => {
      const update = await check();
      if (update) {
        console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
        const userAccepted = await ask(`A new version (${update.version}) is available.\n\nRelease notes:\n${update.body}\n\nDo you want to update now?`, {
          title: "Update Available",
          kind: "info",
          okLabel: "Update",
          cancelLabel: "Later",
        });
        if (userAccepted) {
          let downloaded = 0;
          let contentLength = 0;
          // Alternatively, we could also call update.download() and update.install() separately
          await update.downloadAndInstall((event) => {
            switch (event.event) {
              case "Started":
                contentLength = event.data.contentLength;
                console.log(`started downloading ${event.data.contentLength} bytes`);
                break;
              case "Progress":
                downloaded += event.data.chunkLength;
                console.log(`downloaded ${downloaded} from ${contentLength}`);
                break;
              case "Finished":
                console.log("download finished");
                break;
              default:
                break;
            }
          });
          console.log("update installed");
          await relaunch();
        }
      }
    };

    runUpdate();
  }, []);

  useEffect(() => {
    dispatch(setAuth({ ...authStore, isLoggedIn: false }));
  }, []);

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
