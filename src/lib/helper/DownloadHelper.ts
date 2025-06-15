import { readDir } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { platform, arch } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import GameAPI from "../api/GameAPI";
import { IGame, IGameReleaseNative } from "../../types/GameTypes";
import { AuthAPI } from "../api/AuthAPI";

export async function runUrlArgs(url: string, args: string[]) {
  return invoke("run_url_args", {
    url: url,
    args: args,
  });
}

const installCache: Record<string, boolean> = {};

export async function isInstalled(game: IGame): Promise<boolean> {
  if (installCache[game.project_name] !== undefined) {
    return installCache[game.project_name];
  }

  const originalDir = await appDataDir();
  const baseDir = originalDir.replace(/tymtLauncher\/?$/, 'Tymt/TymtApps/');
  const gameDir = `${baseDir}games/${game.project_name}`;

  try {
    await readDir(gameDir);
    installCache[game.project_name] = true;
    return true;
  } catch {
    installCache[game.project_name] = false;
    return false;
  }
}


export const runNewGame = async (game: IGame) => {
  try {
    const fullExecutablePath = await getFullExecutablePathNewGame(game);
    const gameExtension = (await getExecutableFileExtension(game)).toLowerCase();
    const currentPlatform = platform();

    const drmToken = game?.drmProtected ? await AuthAPI.getDrmToken(game?._id) : null;

    const runArgs = (args: string[] = []) => (drmToken ? [...args, `--tymt`, drmToken] : args);

    switch (currentPlatform) {
      case "linux":
        if (gameExtension === "appimage") {
          await runUrlArgs(fullExecutablePath, runArgs([`--appimage-extract-and-run`]));
        } else if (gameExtension === "deb") {
          const packageName = await invoke<string>("get_deb_package_name", { executablePath: fullExecutablePath });
          await invoke("run_deb_linux", { packageName, args: runArgs() });
        } else {
          await runUrlArgs(fullExecutablePath, runArgs());
        }
        break;

      case "windows":
        if (["exe", "bat"].includes(gameExtension)) {
          await runUrlArgs(fullExecutablePath, runArgs());
        }
        break;

      case "macos":
        if (gameExtension === "app") {
          await runUrlArgs("open", [`-a`, fullExecutablePath, ...runArgs()]);
        } else {
          await runUrlArgs(fullExecutablePath, runArgs());
        }
        break;
    }

    return true;
  } catch (err) {
    console.error("Failed to runNewGame: ", err);
    return false;
  }
};

// export const runD53 = async (serverIp: string, autoMode: boolean) => {
//   try {
//     const fullExePath: string = await getFullExecutablePathNewGame(District53);
//     const d53_server = serverIp.split(":")[0];
//     const d53_port = serverIp.split(":")[1];
//     const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
//     const token = saltTokenStore.token;
//     const launcherUrl = `http://localhost:${local_server_port}`;

//     if (!fullExePath || !d53_server || !d53_port || !token || !launcherUrl) {
//       // console.log(`Failed to runD53: fullExePath ${fullExePath}, d53_server ${d53_server}, d53_port ${d53_port}, token ${token}, launcherUrl ${launcherUrl}`);
//       return false;
//     }

//     const currentPlatform = platform();
//     let args: string[] = [];

//     switch (currentPlatform) {
//       case "linux":
//         args = [`--appimage-extract-and-run`, `--launcher_url`, launcherUrl, `--token`, token];
//         break;
//       case "windows":
//         args = [`--launcher_url`, launcherUrl, `--token`, token];
//         break;
//       case "macos":
//         args = [`--launcher_url`, launcherUrl, `--token`, token];
//         break;
//     }
//     if (autoMode) args.push(`--address`, d53_server, `--port`, d53_port, `--go`);

//     switch (currentPlatform) {
//       case "linux":
//         await runUrlArgs(fullExePath, args);
//         break;
//       case "windows":
//         await runUrlArgs(fullExePath, args);
//         break;
//       case "macos":
//         await runUrlArgs("open", ["-a", fullExePath, "--args", ...args]);
//         break;
//     }

//     return true;
//   } catch (err) {
//     // console.log("Failed to runD53: ", err);
//     return false;
//   }
// };

export async function openDir() {
  const originalDir = await appDataDir();
  const baseDir = originalDir.replace(/tymtLauncher\/?$/, 'Tymt/');

  return invoke("open_directory", {
    path: await baseDir,
  });
}

export const checkOnline = async (): Promise<boolean> => {
  try {
    await fetch("https://www.google.com", {
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const downloadFileToAppDir = async (game: IGame) => {
  try {
    // const url: string = await getDownloadLinkNewGame(game);
    const downloadPath: string = await getDownloadFileFullPath(game);
    const currentPlatform = platform();

    let archeOsType;

    switch (currentPlatform) {
      case "windows":
        archeOsType = "windows_amd64";
        break;
      case "macos":
        archeOsType = "darwin_amd64";
        break;
      case "linux":
        archeOsType = "linux_amd64";
        break;
      default:
        console.log("OS is not supported!");
        break;
    }

    const downloadUrl = game?.releaseMeta.platforms?.[archeOsType].external_url;
    const appId = game?.appId;
    const imageUrl = game?.projectMeta.image;
    const gameTitle = game?.title;

    if (!downloadPath || !archeOsType || !downloadUrl || !appId || !imageUrl || !gameTitle) {
      if (!downloadPath) console.error("Missing: downloadPath");
      if (!archeOsType) console.error("Missing: archeOsType");
      if (!downloadUrl) console.error("Missing: downloadUrl");
      if (!appId) console.error("Missing: appId");
      if (!imageUrl) console.error("Missing: imageUrl");
      if (!gameTitle) console.error("Missing: gameTitle");
      return false;
    }    

    const formattedTitle = gameTitle.toLowerCase().replace(/\s+/g, "");

    await invoke("download_to_app_dir", {
      fileLocation: downloadPath,
      downloadUrl: downloadUrl,
      gameTitle: formattedTitle,
    });

    return true;
  } catch (err) {
    console.error("Failed to downloadFileToAppDir: ", err);
    return false;
  }
};

export const downloadAndInstallNewGame = async (game: IGame) => {
  try {
    await GameAPI.increaseDownloadCount(game?._id);
    await downloadFileToAppDir(game);
  } catch (err) {
    throw new Error(err.toString());
  }
};

export const getDownloadLinkNewGame = async (game: IGame) => {
  try {
    const fullExecutablePath = await getFullExecutablePathNewGame(game);
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const currentPlatform = platform();
    const cpu = await arch();
    switch (currentPlatform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.external_url;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.external_url;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.external_url;
            break;
        }
        break;
    }
    if (fullExecutablePath && !res) {
      res = await getDownloadLinkFromMetaUri(game);
    }
    return res;
  } catch (err) {
    // console.error("Failed to getDownloadLinkNewGame: ", err);
    return "";
  }
};

export const getFullExecutablePathNewGame = async (game: IGame) => {
  try {
    const originalDir = await appDataDir();
    const baseDir = originalDir.replace(/tymtLauncher\/?$/, 'Tymt/TymtApps/');
    const fullPathGameDir = `${baseDir}games/${game.project_name}`;

    // console.log("getFullExecutablePathNewGame", fullPath);
    return fullPathGameDir;
  } catch (err) {
    // console.log("Failed to getFullExecutablePathNewGame: ", err);
    return "";
  }
};

export const getExecutablePathNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const currentPlatform = platform();
    const cpu = await arch();
    switch (currentPlatform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.executable;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.executable;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.executable;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    // console.error("Failed to getExecutablePathNewGame: ", err);
    return "";
  }
};

export const getDownloadFileNameNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const currentPlatform = platform();
    const cpu = await arch();
    switch (currentPlatform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.name;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.name;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.name;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    // console.error("Failed to getDownloadFileNameNewGame: ", err);
    return "";
  }
};

export const getGameType = (game: IGame) => {
  try {
    const res = game?.projectMeta?.type;
    return res;
  } catch (err) {
    // console.log("Failed to getGameType: ", err);
  }
};

export const getGameReleaseBrowser = (game: IGame) => {
  try {
    if (game?.projectMeta?.type !== "browser") {
      return null;
    }
    const res = game?.releaseMeta?.platforms?.web;
    return res;
  } catch (err) {
    // console.log("Failed to getGameReleaseBrowser: ", err);
    return null;
  }
};

export const getGameReleaseNative = async (game: IGame) => {
  try {
    if (game?.projectMeta?.type !== "native") {
      return null;
    }
    let res: IGameReleaseNative;
    const currentPlatform = platform();
    const cpu = await arch();
    switch (currentPlatform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    // console.log("Failed to getGameOsCpu: ", err);
    return null;
  }
};

export const getDownloadSizeNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.downloadSize;
    return res;
  } catch (err) {
    // console.error("Failed to getDownloadSizeNewGame: ", err);
    return "";
  }
};

export const getInstallSizeNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.installSize;
    return res;
  } catch (err) {
    // console.error("Failed to getInstallSizeNewGame: ", err);
    return "";
  }
};

export const getSupportOSList = (game: IGame) => {
  try {
    let res: string[] = [];
    if (game?.releaseMeta?.platforms?.darwin_amd64 || game?.releaseMeta?.platforms?.darwin_arm64) {
      res = ["darwin", ...res];
    }
    if (game?.releaseMeta?.platforms?.linux_amd64 || game?.releaseMeta?.platforms?.linux_arm64) {
      res = ["linux", ...res];
    }
    if (game?.releaseMeta?.platforms?.windows_amd64 || game?.releaseMeta?.platforms?.windows_arm64) {
      res = ["windows", ...res];
    }
    return res;
  } catch (err) {
    // console.log("Failed to getSupportOSList: ", err);
    return [];
  }
};

export const getDownloadFileFullPath = async (game: IGame) => {
  try {
    const fileName = await getDownloadFileNameNewGame(game);
    const originalDir = await appDataDir();
    const baseDir = originalDir.replace(/tymtLauncher\/?$/, 'Tymt/TymtApps/');
    const fullPathGameDir = `${baseDir}games/${fileName}`;
    
    return fullPathGameDir;
  } catch (err) {
    // console.log("Failed to getDownloadFileFullPath: ", err);
    return "";
  }
};

export const getInstallDir = async (game: IGame) => {
  try {
    const originalDir = await appDataDir();
    const baseDir = originalDir.replace(/tymtLauncher\/?$/, 'Tymt/TymtApps/');
    const fullPathGameDir = `${baseDir}games/${game?.project_name}`;

    return fullPathGameDir;
  } catch (err) {
    // console.log("Failed to getInstallDir: ", err);
    return "";
  }
};

export const getDownloadFileExtension = async (game: IGame) => {
  try {
    const fileName = await getDownloadFileNameNewGame(game);
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop() || null : null;
  } catch (err) {
    // console.log("Failed to getDownloadFileExtension: ", err);
    return "";
  }
};

export const getExecutableFileExtension = async (game: IGame) => {
  try {
    const url = await getExecutablePathNewGame(game);
    const parts = url.split(".");
    return parts.length > 1 ? parts.pop() || "" : "";
  } catch (err) {
    // console.log("Failed to getExecutableFileExtension:", err);
    return "";
  }
};

export const deleteDownloadFile = async (game: IGame) => {
  try {
    const fullPath = await getDownloadFileFullPath(game);
    // console.log("deleteDownloadFile", fullPath);

    await invoke("delete_file", {
      fileLocation: fullPath,
    });

    return true;
  } catch (err) {
    // console.log("Failed to deleteDownloadFile: ", err);
    return false;
  }
};

export const deleteGameDirectory = async (game: IGame) => {
  try {
    const directoryLocation = await getInstallDir(game);
    await invoke("delete_directory", {
      dirLocation: directoryLocation,
    });
  } catch (err) {
    console.error("Failed to deleteGameDirectory: ", err);
    throw new Error(err.toString());
  }
};

export const getOsCpu = async () => {
  try {
    const currentPlatform = platform();
    const cpu = await arch();

    let resPlatform: string = "";
    let resCpu: string = "";

    switch (currentPlatform) {
      case "linux":
        resPlatform = "linux";
        break;
      case "windows":
        resPlatform = "windows";
        break;
      case "macos":
        resPlatform = "darwin";

        break;
    }

    switch (cpu) {
      case "arm":
        resCpu = "arm64";
        break;
      case "x86_64":
        resCpu = "amd64";
        break;
    }
    const res = `${resPlatform}_${resCpu}`;
    return res;
  } catch (err) {
    // console.log("Failed to getOsCpu: ", err);
  }
};

export const fetchMetaUri = async (game) => {
  try {
    const metaUri = game?.releaseMeta?.meta_uri;
    if (!metaUri) return null;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const res1 = await fetch(metaUri, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const res = await res1.json();
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.error('Fetch timed out');
      }
      throw err;
    }
  } catch (err) {
    // console.log("Failed to fetchMetaUri: ", err);
  }
};

export const getDownloadLinkFromMetaUri = async (game) => {
  try {
    const data = await fetchMetaUri(game);
    const osCpu = await getOsCpu();
    const res: string = data?.platforms[osCpu]?.external_url;
    return res;
  } catch (err) {
    // console.log("Failed to getDownloadLinkFromMetaUri: ", err);
  }
};
