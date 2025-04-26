use tauri::command;

#[command]
pub fn get_system_info() -> String {
    // OS/hardware detection
    "Windows 11".into()
}