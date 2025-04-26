import windows from "../assets/main/Windows.png";
import mac from "../assets/main/Mac.svg";
import linux from "../assets/main/Linux.svg";

export enum platformEnum {
  "windows",
  "mac",
  "linux",
}

export const platformIconMap: Map<number, string> = new Map([
  [platformEnum.windows, windows],
  [platformEnum.mac, mac],
  [platformEnum.linux, linux],
]);

export interface IGame {
  _id: string;
  addId: string;
  epic_game_url: string;
  imageUrl: string;
  launch_epic: boolean;
  link: string;
  external_url: string;
  projectMeta: {
    id: number;
    name: string;
    tags: string[];
    type: string; // native, browser
    image: string;
    gallery: Array<{
      src: string;
      name: string;
      type: string; // image, youtube
    }>;
    meta_uri: string;
    networks: Array<{
      icon: string;
      name: string;
      type: string; // nonFungible, fungible
      address: string;
      chain_id: string;
      marketplace_urls: string[];
      meta_mask_compatible: boolean;
    }>;
    repository: string;
    description: string;
    discord_url: string;
    launch_epic: boolean;
    twitter_url: string;
    youtube_url: string;
    external_url: string;
    main_capsule: string;
    uses_overlay: boolean;
    wine_support: {
      mac: boolean;
      linux: boolean;
    };
    epic_game_url: string;
    launch_external: string;
    prompt_donation: string;
    donation_address: string;
    short_description: string;
    system_requirements: {
      cpu: string;
      gpu: string;
      disk: string;
      memory: string;
    };
    is_hyperplay_exclusive: boolean;
  };
  project_name: string;
  rank: number;
  releaseMeta: {
    name: string;
    meta_uri: string;
    platforms: {
      windows_amd64?: IGameReleaseNative;
      windows_arm64?: IGameReleaseNative;
      darwin_amd64?: IGameReleaseNative;
      darwin_arm64?: IGameReleaseNative;
      linux_amd64?: IGameReleaseNative;
      linux_arm64?: IGameReleaseNative;
      web?: IGameReleaseBrowser;
    };
    project_id: string;
    release_id: string;
    description: string;
    external_url: string;
    release_name: string;
  };
  title: string;
  visibilityState: string; // active
  externalStoreId: string;

  heroes: string;
  developers: string;
  publisher: string;
  warning: string;
  warningLink: string;
  averageRating: number;
  feedbackCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IGameList {
  games: IGame[];
}

export interface IGameReleaseNative {
  name: string;
  executable: string;
  installSize: string;
  downloadSize: string;
  external_url: string;
}

export interface IGameReleaseBrowser {
  name: string;
  external_url: string;
}

export interface IFeedback {
  _id: string;
  rating: number;
  text: string;
  createdAt: Date;
  userNickname: string;
  userAvatar: string;
  userOnlineStatus: boolean;
}
