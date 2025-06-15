#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod window;
mod minecraft;
pub fn main() {

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init());

    builder
        .invoke_handler(tauri::generate_handler![
            commands::my_custom_command,
            commands::get_machine_id,
            commands::download_to_app_dir,
            commands::unzip_windows,
            commands::move_exe_windows,
            commands::unzip_macos,
            commands::untarbz2_macos,
            commands::unzip_linux,
            commands::move_appimage_linux,
            commands::install_deb_linux,
            commands::get_deb_package_name,
            commands::run_deb_linux,
            commands::delete_file,
            commands::delete_directory,
            commands::write_file,
            commands::run_url_args,
            commands::open_directory,
            #[cfg(target_family = "unix")]
            commands::set_permission,
            minecraft::get_system_info,
            window::create_child_window,
            window::destroy_child_window,
            window::is_window_visible,
            window::show_transaction_window,
            window::hide_transaction_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    let _ = app_lib::main();
}
