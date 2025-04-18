// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use actix_cors::Cors;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use futures_util::stream::StreamExt;
use machineid_rs::{Encryption, HWIDComponent, IdBuilder};
use reqwest::header::ACCEPT;
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use std::borrow::BorrowMut;
use std::cmp::min;
use std::fs::File;
use std::io::prelude::*;
#[cfg(target_family = "unix")]
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Mutex;
use std::sync::OnceLock;
use std::time::{Duration, Instant};
use std::{default, fs, io};
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri::{Builder, Emitter, Listener, Manager};
use tauri_plugin_http::reqwest;
use zip::read::ZipArchive; // For Unix-specific permissions

// use dotenv::dotenv;
// use std::env;

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

fn show_window(app: &tauri::AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect("Sorry, no wind
        ow found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
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

    use tauri_plugin_cli::CliExt;

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init());
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = show_window(app);
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
            download_to_app_dir,
            unzip_windows,
            unzip_macos,
            untarbz2_macos,
            unzip_linux,
            move_appimage_linux,
            delete_file,
            delete_directory,
            run_url_args,
            // set_permission,
            open_directory,
            get_machine_id,
            is_window_visible,
            show_transaction_window,
            hide_transaction_window,
            set_tray_items_enabled,
            write_file
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
fn run_url_args(url: String, args: Vec<String>) {
    println!("{}", url);
    for arg in args.clone() {
        println!("{}", arg);
    }

    let path = if url == "open" {
        Path::new(&args[1])
    } else {
        Path::new(&url)
    };
    let working_directory = match path.parent() {
        Some(dir) => dir,
        None => {
            eprintln!("Failed to determine directory for {}", url);
            return;
        }
    };

    let mut command = Command::new(&url);
    command.current_dir(working_directory);
    println!("Setting working directory to: {:?}", working_directory);

    if args.is_empty() {
        println!("No command provided");

        match command.spawn() {
            Ok(_) => println!("Process started successfully"),
            Err(e) => eprintln!("Failed to start process: {}", e),
        }
    } else {
        for arg in args {
            command.arg(arg);
        }

        match command.spawn() {
            Ok(_) => println!("Process started successfully"),
            Err(e) => eprintln!("Failed to start process: {}", e),
        }
    }
}

#[tauri::command]
fn open_directory(path: &str) {
    let mut cmd = if cfg!(target_os = "windows") {
        Command::new("explorer")
    } else if cfg!(target_os = "macos") {
        Command::new("open")
    } else {
        Command::new("xdg-open")
    };
    cmd.arg(path);

    match cmd.output() {
        Ok(output) => println!("Opened directory successfully: {:?}", output),
        Err(e) => println!("Failed to open directory: {}", e),
    }
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

#[tauri::command]
fn is_window_visible(window: tauri::Window) -> bool {
    window.is_visible().unwrap_or(false)
}

#[tauri::command]
async fn show_transaction_window(app_handle: tauri::AppHandle) {
    if let Some(window) = app_handle.get_webview_window("tymt_d53_transaction") {
        if let Err(e) = window.show() {
            eprintln!("Failed to show window: {}", e);
        }
    } else {
        eprintln!("Window 'tymt_d53_transaction' not found");
    }

    if let Some(window_to_hide) = app_handle.get_webview_window("tymtLauncher") {
        if let Err(e) = window_to_hide.hide() {
            eprintln!("Failed to hide window 'tymtLauncher': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncher' not found");
    }

    let item_ids = vec![
        "showVisible".to_string(),
        "fullscreen".to_string(),
        "games".to_string(),
        "wallet".to_string(),
        "about".to_string(),
        "signout".to_string(),
        "quit".to_string(),
        "disable_notifications".to_string(),
    ];
    let enabled = false;
    set_tray_items_enabled(app_handle, item_ids, enabled).await
}

#[tauri::command]
async fn hide_transaction_window(app_handle: tauri::AppHandle) {
    if let Some(window) = app_handle.get_webview_window("tymt_d53_transaction") {
        if let Err(e) = window.hide() {
            eprintln!("Failed to hide window: {}", e);
        }
    } else {
        eprintln!("Window 'tymt_d53_transaction' not found");
    }

    if let Some(window_to_hide) = app_handle.get_webview_window("tymtLauncher") {
        if let Err(e) = window_to_hide.show() {
            eprintln!("Failed to show window 'tymtLauncher': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncher' not found");
    }

    let item_ids = vec![
        "showVisible".to_string(),
        "fullscreen".to_string(),
        "games".to_string(),
        "wallet".to_string(),
        "about".to_string(),
        "signout".to_string(),
        "quit".to_string(),
        "disable_notifications".to_string(),
    ];
    let enabled = true;
    set_tray_items_enabled(app_handle, item_ids, enabled).await
}

#[tauri::command]
async fn set_tray_items_enabled(
    app_handle: tauri::AppHandle,
    item_ids: Vec<String>,
    enabled: bool,
) {
    for item_id in item_ids {
        let _ = app_handle
            .tray_by_id(&item_id)
            .unwrap()
            .set_visible(enabled);
    }
}

#[tauri::command]
fn write_file(content: String, filepath: String) -> Result<(), String> {
    std::fs::write(&filepath, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(serde::Serialize)]
struct DownloadProgress {
    downloaded: u64,
    speed: Option<f64>,
    total: u64,
    duration: f64,
    expectation: f64,
    game: String,
}

#[tauri::command]
async fn download_to_app_dir(
    app_handle: tauri::AppHandle,
    url: String,
    file_location: String,
    game: String,
) -> Result<(), String> {
    let path = Path::new(&file_location);

    if let Some(parent) = path.parent() {
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    // fs::create_dir_all("./download/").expect("Error at create_dir_all");
    let start_time = Instant::now();
    let client = Client::new();
    let res = client
        .get(&url)
        .header(ACCEPT, "application/octet-stream")
        .header(reqwest::header::USER_AGENT, "tymtLauncher/1.0")
        .send()
        .await
        .map_err(|e| format!("Failed to GET from '{}': {}", &url, e))?;
    let total = res
        .content_length()
        .ok_or(format!("Failed to get content length from '{}'", &url))?;

    let mut file =
        File::create(&path).or(Err(format!("Failed to create file '{}'", file_location)))?;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();

    let mut last_emit_time = Instant::now();

    while let Some(item) = stream.next().await {
        let chunk = item.or(Err(format!("Error while downloading file")))?;
        file.write_all(&chunk)
            .or(Err(format!("Error while writing to file")))?;
        downloaded = min(downloaded + (chunk.len() as u64), total);
        let duration = start_time.elapsed().as_secs_f64();
        let speed = if duration > 0.0 {
            Some((downloaded as f64) / duration / 1024.0 / 1024.0)
        } else {
            None
        };

        if last_emit_time.elapsed() >= Duration::new(1, 0) {
            let expectation = if let Some(s) = speed {
                (total - downloaded) as f64 / (s * 1024.0 * 1024.0)
            } else {
                0.0
            };

            let progress = DownloadProgress {
                downloaded,
                speed,
                total,
                duration,
                expectation,
                game: game.clone(),
            };

            app_handle
                .emit("game-download-progress", &progress)
                .map_err(|e| format!("Failed to emit progress event: {}", e))?;

            last_emit_time = Instant::now();
        }

        // println!("downloaded => {}", downloaded);
        // println!("total_size => {}", total_size);
        // println!("speed => {:?}", speed);
    }

    return Ok(());
}

#[tauri::command]
async fn unzip_windows(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String,
) -> Result<(), String> {
    let zip_path = PathBuf::from(file_location);
    let extract_path = PathBuf::from(install_dir);

    // Open the zip file
    let file = File::open(&zip_path).map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive =
        ZipArchive::new(file).map_err(|e| format!("Failed to read zip archive: {}", e))?;

    // Extract each file in the archive
    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to access file in zip: {}", e))?;
        let out_path = extract_path.join(file.name());

        if file.is_dir() {
            // Create directories
            fs::create_dir_all(&out_path)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            // Create parent directories if necessary
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent directory: {}", e))?;
            }

            // Write the file
            let mut outfile =
                File::create(&out_path).map_err(|e| format!("Failed to create file: {}", e))?;
            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to write file: {}", e))?;
        }
    }

    Ok(())
}

#[tauri::command]
async fn unzip_linux(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String,
) -> Result<(), String> {
    let zip_path = PathBuf::from(file_location);
    let extract_path = PathBuf::from(install_dir);

    // Open the zip file
    let file = File::open(&zip_path).map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive =
        ZipArchive::new(file).map_err(|e| format!("Failed to read zip archive: {}", e))?;

    // Extract each file in the archive
    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to access file in zip: {}", e))?;
        let out_path = extract_path.join(file.name());

        if file.is_dir() {
            // Create directories
            fs::create_dir_all(&out_path)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            // Create parent directories if necessary
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent directory: {}", e))?;
            }

            // Write the file
            let mut outfile =
                File::create(&out_path).map_err(|e| format!("Failed to create file: {}", e))?;
            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to write file: {}", e))?;
        }
    }

    Ok(())
}

// #[tauri::command]
// async fn unzip_windows(
//     app_handle: tauri::AppHandle,
//     file_location: String,
//     install_dir: String,
// ) -> Result<(), String> {
//     let zip_path = PathBuf::from(file_location);
//     let extract_path = PathBuf::from(install_dir);

//     let _ = zip_extensions::read::zip_extract(&zip_path, &extract_path)
//         .map_err(|e| format!("Failed to unzip file: {}", e))?;

//     Ok(())
// }

// #[tauri::command]
// async fn unzip_linux(
//     app_handle: tauri::AppHandle,
//     file_location: String,
//     install_dir: String,
// ) -> Result<(), String> {
//     let zip_path = PathBuf::from(file_location);
//     let extract_path = PathBuf::from(install_dir);

//     let _ = zip_extensions::read::zip_extract(&zip_path, &extract_path)
//         .map_err(|e| format!("Failed to unzip file: {}", e))?;

//     Ok(())
// }

#[tauri::command]
async fn move_appimage_linux(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String,
) -> Result<(), String> {
    let source_path = PathBuf::from(&file_location);
    let destination_path = PathBuf::from(&install_dir).join(
        source_path
            .file_name()
            .ok_or_else(|| "Invalid file name".to_string())?,
    );

    // Ensure the parent directory exists
    if let Some(parent) = destination_path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
        }
    }

    // Move the file
    fs::rename(&source_path, &destination_path)
        .map_err(|e| format!("Failed to move file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn unzip_macos(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String,
) -> Result<(), String> {
    let status = Command::new("ditto")
        .arg("-x")
        .arg("-k")
        .arg(&file_location)
        .arg(&install_dir)
        .status()
        .map_err(|e| format!("Failed to execute ditto: {}", e))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!(
            "Failed to unzip: exit code {}",
            status.code().unwrap_or(-1)
        ))
    }
}

#[tauri::command]
async fn untarbz2_macos(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String,
) -> Result<(), String> {
    let install_path = PathBuf::from(&install_dir);

    // Create the directory if it doesn't exist
    if !install_path.exists() {
        fs::create_dir_all(&install_path)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let status = Command::new("tar")
        .args(["-xvjf", &file_location, "-C", &install_dir])
        .output()
        .map_err(|e| format!("Failed to execute tar: {}", e))?;

    if status.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Failed to unzip: exit code {}",
            status.status.code().unwrap_or(-1)
        ))
    }
}

#[cfg(target_family = "unix")]
#[tauri::command]
async fn set_permission(
    app_handle: tauri::AppHandle,
    executable_path: String,
) -> Result<(), String> {
    let path = PathBuf::from(&executable_path);

    // Check if the file exists
    if !path.exists() {
        return Err(format!("File does not exist: {}", executable_path));
    }

    // Set the executable permission
    let mut permissions = fs::metadata(&path)
        .map_err(|e| format!("Failed to get metadata: {}", e))?
        .permissions();

    permissions.set_mode(0o755); // Set permissions to rwxr-xr-x

    fs::set_permissions(&path, permissions)
        .map_err(|e| format!("Failed to set permissions: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn delete_file(app_handle: tauri::AppHandle, file_location: String) -> Result<(), String> {
    let path = PathBuf::from(file_location);

    fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn delete_directory(
    app_handle: tauri::AppHandle,
    dir_location: String,
) -> Result<(), String> {
    let path = PathBuf::from(dir_location);

    // Attempt to remove the directory and all its contents recursively
    fs::remove_dir_all(&path).map_err(|e| format!("Failed to delete directory: {}", e))?;

    Ok(())
}
