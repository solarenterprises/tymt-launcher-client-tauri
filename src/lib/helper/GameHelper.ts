import { CONST_SYSINFO_CPU, CONST_SYSINFO_OS } from "../../const/SysInfoConsts";
import { decrypt } from "./EncryptHelper";
import { IGame, IGameReleaseNative } from "../../types/GameTypes";

export const getGameReleaseNative = async (game: IGame) => {
  try {
    if (game?.projectMeta?.type !== "native") {
      return null;
    }
    let res: IGameReleaseNative;
    // const sysInfo = await ElectronAPI.getSystemInfo();
    const sysInfo: any = {};

    const platform = sysInfo.osType;
    const cpu = sysInfo.cpuArch;
    switch (platform) {
      case CONST_SYSINFO_OS.LINUX:
        switch (cpu) {
          case CONST_SYSINFO_CPU.ARM64:
            res = game?.releaseMeta?.platforms?.linux_arm64;
            break;
          case CONST_SYSINFO_CPU.X86_64:
            res = game?.releaseMeta?.platforms?.linux_amd64;
            break;
        }
        break;
      case CONST_SYSINFO_OS.WINDOWS:
        switch (cpu) {
          case CONST_SYSINFO_CPU.ARM64:
            res = game?.releaseMeta?.platforms?.windows_arm64;
            break;
          case CONST_SYSINFO_CPU.X86_64:
            res = game?.releaseMeta?.platforms?.windows_amd64;
            break;
        }
        break;
      case CONST_SYSINFO_OS.MACOS:
        switch (cpu) {
          case CONST_SYSINFO_CPU.ARM64:
            res = game?.releaseMeta?.platforms?.darwin_arm64;
            break;
          case CONST_SYSINFO_CPU.X86_64:
            res = game?.releaseMeta?.platforms?.darwin_amd64;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getGameReleaseNative: ", err);
  }
};

export const getGameDownloadSize = async (game: IGame) => {
  try {
    let res = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.downloadSize;
    return res;
  } catch (err) {
    console.error("Failed to getGameDownloadSize: ", err);
    return "";
  }
};

export const getGameInstallSize = async (game: IGame) => {
  try {
    let res = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.installSize;
    return res;
  } catch (err) {
    console.error("Failed to getGameInstallSize: ", err);
    return "";
  }
};

export const getSupportOSList = (game: IGame) => {
  try {
    let res: string[] = [];
    if (game?.releaseMeta?.platforms?.darwin_amd64 || game?.releaseMeta?.platforms?.darwin_arm64) {
      res = [CONST_SYSINFO_OS.MACOS, ...res];
    }
    if (game?.releaseMeta?.platforms?.linux_amd64 || game?.releaseMeta?.platforms?.linux_arm64) {
      res = [CONST_SYSINFO_OS.LINUX, ...res];
    }
    if (game?.releaseMeta?.platforms?.windows_amd64 || game?.releaseMeta?.platforms?.windows_arm64) {
      res = [CONST_SYSINFO_OS.WINDOWS, ...res];
    }
    return res;
  } catch (err) {
    console.error("Failed to getSupportOSList: ", err);
    return [];
  }
};

export const decryptGameURL = async (_data: IGame, _secret: string) => {
  try {
    if (!_data || !_secret) return null;
    const data = { ..._data }; // Create a shallow copy of _data

    const decryptPromises = [];

    if (data?.imageUrl) {
      decryptPromises.push(
        decrypt(data.imageUrl, _secret).then((decrypted) => {
          data.imageUrl = decrypted;
        })
      );
    }
    if (data?.link) {
      decryptPromises.push(
        decrypt(data.link, _secret).then((decrypted) => {
          data.link = decrypted;
        })
      );
    }
    if (data?.projectMeta?.image) {
      decryptPromises.push(
        decrypt(data.projectMeta.image, _secret).then((decrypted) => {
          data.projectMeta.image = decrypted;
        })
      );
    }
    if (data?.projectMeta?.gallery?.length) {
      data.projectMeta.gallery.forEach((item, index) => {
        if (item.src) {
          decryptPromises.push(
            decrypt(item.src, _secret).then((decrypted) => {
              data.projectMeta.gallery[index].src = decrypted;
            })
          );
        }
      });
    }
    if (data?.projectMeta?.meta_uri) {
      decryptPromises.push(
        decrypt(data.projectMeta.meta_uri, _secret).then((decrypted) => {
          data.projectMeta.meta_uri = decrypted;
        })
      );
    }
    if (data?.projectMeta?.networks?.length) {
      data.projectMeta.networks.forEach((network, i) => {
        if (network?.icon) {
          decryptPromises.push(
            decrypt(network.icon, _secret).then((decrypted) => {
              data.projectMeta.networks[i].icon = decrypted;
            })
          );
        }
        if (network?.marketplace_urls?.length) {
          network.marketplace_urls.forEach((url, j) => {
            if (url) {
              decryptPromises.push(
                decrypt(url, _secret).then((decrypted) => {
                  data.projectMeta.networks[i].marketplace_urls[j] = decrypted;
                })
              );
            }
          });
        }
      });
    }
    if (data?.projectMeta?.discord_url) {
      decryptPromises.push(
        decrypt(data.projectMeta.discord_url, _secret).then((decrypted) => {
          data.projectMeta.discord_url = decrypted;
        })
      );
    }
    if (data?.projectMeta?.twitter_url) {
      decryptPromises.push(
        decrypt(data.projectMeta.twitter_url, _secret).then((decrypted) => {
          data.projectMeta.twitter_url = decrypted;
        })
      );
    }
    if (data?.projectMeta?.youtube_url) {
      decryptPromises.push(
        decrypt(data.projectMeta.youtube_url, _secret).then((decrypted) => {
          data.projectMeta.youtube_url = decrypted;
        })
      );
    }
    if (data?.projectMeta?.external_url) {
      decryptPromises.push(
        decrypt(data.projectMeta.external_url, _secret).then((decrypted) => {
          data.projectMeta.external_url = decrypted;
        })
      );
    }
    if (data?.projectMeta?.main_capsule) {
      decryptPromises.push(
        decrypt(data.projectMeta.main_capsule, _secret).then((decrypted) => {
          data.projectMeta.main_capsule = decrypted;
        })
      );
    }
    if (data?.releaseMeta?.meta_uri) {
      decryptPromises.push(
        decrypt(data.releaseMeta.meta_uri, _secret).then((decrypted) => {
          data.releaseMeta.meta_uri = decrypted;
        })
      );
    }
    if (data?.releaseMeta?.platforms) {
      Object.entries(data.releaseMeta.platforms).forEach(([platform, platformData]) => {
        if (platformData?.external_url) {
          decryptPromises.push(
            decrypt(platformData.external_url, _secret).then((decrypted) => {
              data.releaseMeta.platforms[platform as keyof typeof data.releaseMeta.platforms].external_url = decrypted;
            })
          );
        }
      });
    }
    if (data?.releaseMeta?.external_url) {
      decryptPromises.push(
        decrypt(data.releaseMeta.external_url, _secret).then((decrypted) => {
          data.releaseMeta.external_url = decrypted;
        })
      );
    }

    // Wait for all decryption promises to resolve
    await Promise.all(decryptPromises);

    return data;
  } catch (err) {
    // console.log("Failed to decryptDataURL:", err);
  }
};
