// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod minecraft;
mod window;
mod file;

use actix_cors::Cors;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use machineid_rs::{Encryption, HWIDComponent, IdBuilder};
#[cfg(target_family = "unix")]
use std::os::unix::fs::PermissionsExt;
// use std::sync::Mutex;
use std::sync::OnceLock;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri::{Emitter, Listener, Manager};

static APPHANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

#[cfg(target_family = "unix")]
fn create_named_mutex(name: &str) -> std::io::Result<std::os::unix::net::UnixListener> {
    let socket_path = Path::new(name);
    if socket_path.exists() {
        match std::os::unix::net::UnixStream::connect(socket_path) {
            Ok(mut stream) => {
                stream.write_all(b"ping")?;
                return Err(io::Error::new(
                    io::ErrorKind::AlreadyExists,
                    "Socket already in use",
                ));
            }
            Err(_) => {
                // Previous instance did not clean up socket, remove it
                std::fs::remove_file(socket_path)?;
            }
        }
    }
    std::os::unix::net::UnixListener::bind(socket_path)
}

#[cfg(target_family = "windows")]
fn create_named_mutex(name: &str) -> std::io::Result<()> {
    use winapi::shared::winerror::ERROR_ALREADY_EXISTS;
    use winapi::um::errhandlingapi::GetLastError;
    use winapi::um::synchapi::CreateMutexA;

    let mutex_name = std::ffi::CString::new(name).expect("CString::new failed");
    let handle: *mut std::ffi::c_void =
        unsafe { CreateMutexA(std::ptr::null_mut(), 0, mutex_name.as_ptr()) };

    if handle.is_null() {
        return Err(std::io::Error::last_os_error());
    }
    if (unsafe { GetLastError() }) == ERROR_ALREADY_EXISTS {
        return Err(std::io::Error::new(
            std::io::ErrorKind::AlreadyExists,
            "Mutex already exists",
        ));
    }
    Ok(())
}

#[derive(Default)]
struct AppData {
    welcome_message: &'static str,
}

pub fn main() -> std::io::Result<()> {
    // let mutex_name = "tauri_single_instance";

    // if cfg!(target_os = "macos") {
    //     // Do nothing for macOS
    // } else if cfg!(target_family = "unix") {
    //     // This will apply to other Unix-like systems (Linux, etc.)
    //     if create_named_mutex(mutex_name).is_err() {
    //         println!("Another instance is already running.");
    //         std::process::exit(1);
    //     }
    // } else if cfg!(target_family = "windows") {
    //     // This applies to Windows
    //     if create_named_mutex(mutex_name).is_err() {
    //         println!("Another instance is already running.");
    //         std::process::exit(1);
    //     }
    // }

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init());
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = window::show_window(app);
        }));
    }

    builder
        //.manage(Mutex::new(AppState::default()))
        .manage(AppData {
            welcome_message: "Welcome to Tauri!",
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_machine_id,
            file::download_to_app_dir,
            file::unzip_windows,
            file::move_exe_windows,
            file::unzip_macos,
            file::untarbz2_macos,
            file::unzip_linux,
            file::move_appimage_linux,
            file::delete_file,
            file::delete_directory,
            file::write_file,
            file::run_url_args,
            file::open_directory,
            // file::set_permission,
            minecraft::get_system_info,
            window::create_child_window,
            window::destroy_child_window,
            window::is_window_visible,
            window::show_transaction_window,
            window::hide_transaction_window
        ])
        .setup(|app| {
            app.manage(AppData {
                welcome_message: "Welcome to Tauri!",
            });

            let app_handle = app.handle().clone();
            _ = APPHANDLE.set(app_handle.clone());

            // let cli_matches = app.cli().matches()?;

            // app.clipboard().write(ClipKind::PlainText {
            //     label: None,
            //     text: "tymt clipboard!".into(),
            // })?;

            let showvisible =
                MenuItemBuilder::with_id("showVisible", "Show tymtLauncher").build(app)?;
            let fullscreen =
                MenuItemBuilder::with_id("fullscreen", "Full-screen Mode  (F11)").build(app)?;
            let games = MenuItemBuilder::with_id("games", "Games").build(app)?;
            let wallet = MenuItemBuilder::with_id("wallet", "Wallet").build(app)?;
            let about = MenuItemBuilder::with_id("about", "About tymt").build(app)?;
            let signout = MenuItemBuilder::with_id("signout", "Sign Out").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            // let disable_notifications =
            //     MenuItemBuilder::with_id("disable_notifications", "Disable Notifications")
            //         .build(app)?;

            let menu = MenuBuilder::new(app)
                .items(&[
                    &showvisible,
                    &fullscreen,
                    &games,
                    &wallet,
                    &about,
                    // &disable_notifications,
                    &signout,
                    &quit,
                ])
                .build()?;

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("tymtLauncher").unwrap();
                window.open_devtools();
            }

            let _ = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(move |app, event| match event.id().as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.hide().unwrap();
                    }
                    "showVisible" => {
                        println!("showVisible received a left click");
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "fullscreen" => {
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                        window
                            .set_fullscreen(!window.is_fullscreen().unwrap())
                            .expect("failed to switch full-screen");
                    }
                    "wallet" => {
                        app.emit("wallet", "wallet")
                            .expect("failed to emit event wallet");
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "games" => {
                        app.emit("games", "games")
                            .expect("failed to emit event games");
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    "about" => {
                        println!("about-tymt");
                        app.emit("about-tymt", "about")
                            .expect("failed to emit event about-tymt");
                    }
                    "signout" => {
                        app.emit("signout", "signout")
                            .expect("failed to emit event signout");
                        let window = app.get_webview_window("tymtLauncher").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    // "disable_notifications" => {
                    //     app.emit("disable_notifications", "disable_notifications")
                    //         .expect("failed to emit event disable_notifications");
                    // }
                    _ => (),
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let apphandle = tray.app_handle();
                        if let Some(webview_window) = apphandle.get_webview_window("tymtLauncher") {
                            let _ = webview_window.show();
                            let _ = webview_window.set_focus();
                        }
                    }
                })
                .build(app)?;

            async fn rpc_request(
                request: HttpRequest,
                request_param: web::Json<serde_json::Value>,
            ) -> HttpResponse {
                println!("-------> POST /rpc_request");

                let json_data =
                    serde_json::to_string(&request_param).expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE
                    .get()
                    .expect("APPHANDLE is available")
                    .emit("POST-/rpc_request", json_data)
                    .expect("failed to emit event POST /rpc_request");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get().expect("APPHANDLE is available").listen_any(
                    "res-POST-/rpc_request",
                    move |event| {
                        let payload = event.payload().to_string();
                        println!("!!!----> res POST /rpc_request");
                        println!("{}", payload);
                        match tx.send(payload) {
                            Ok(()) => {}
                            Err(err) => {
                                println!("Error sending message: {:?}", err);
                            }
                        }
                    },
                );

                match rx.recv() {
                    Ok(received) => {
                        APPHANDLE
                            .get()
                            .expect("APPHANDLE is available")
                            .unlisten(response);
                        return HttpResponse::Ok().body(received);
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE
                            .get()
                            .expect("APPHANDLE is available")
                            .unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            tauri::async_runtime::spawn(
                HttpServer::new(move || {
                    App::new()
                        .wrap(
                            Cors::default()
                                .allow_any_origin()
                                .allow_any_method()
                                .allow_any_header(),
                        )
                        .route("/rpc", web::post().to(rpc_request))
                })
                .bind(("127.0.0.1", 9680))
                .expect("Failed to bind address")
                .run(),
            );

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .unwrap(); //.expect("error while running tymtLauncher");

    Ok(())
}



#[tauri::command]
fn get_machine_id() -> Result<String, String> {
    let mut builder = IdBuilder::new(Encryption::SHA256);
    builder.add_component(HWIDComponent::SystemID);
    let hwid = builder
        .build("tymtLauncher")
        .map_err(|err| err.to_string())?;

    Ok(hwid)
}




