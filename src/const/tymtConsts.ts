export interface IConstTymtLinks {
  documentation: string;
  policy: string;
  twitter: string;
  discord: string;
  solarcard: string;
  youtube: string;
  telegram: string;
  medium: string;
  instagram: string;
  facebook: string;
  website: string;
}

export const CONST_TYMT_LINKS = {
  documentation: "https://solar.org/core#documentation/",
  policy: "https://solarenterprises.com/privacy/",
  twitter: "https://twitter.com/tymt_com/",
  discord: "https://discord.solar.org/",
  solarcard: "https://solarcard.app/",
  youtube: "https://staging.tymt.com/api/uploads/tymt-Solar_Enterprises_(720p,_h264).mp4",
  telegram: "https://t.me/Solar/",
  medium: "https://blog.solar.org/",
  instagram: "https://www.instagram.com/solarnetworkofficial/",
  facebook: "https://www.facebook.com/SolarBlockchainFoundation/",
  website: "https://tymt.com/",
};

// export async function getConstTymtLinks(): Promise<IConstTymtLinks | null> {
//   try {
//     const response = await fetch("/CONST_TYMT_LINKS.json");
//     if (!response.ok) {
//       throw new Error(`Failed to fetch CONST_TYMT_LINKS: ${response.status} ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching CONST_TYMT_LINKS:", error);
//     return null;
//   }
// }
