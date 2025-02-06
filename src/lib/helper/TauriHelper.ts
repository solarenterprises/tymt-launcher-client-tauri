import { open } from "@tauri-apps/plugin-shell";

export async function openLink(url: string) {
  try {
    await open(url);
  } catch (err) {
    // console.error("Failed to open link:", err);
  }
}
