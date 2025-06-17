use std::path::{Path, PathBuf};
use std::fs::File;
use zip::read::ZipArchive; // For Unix-specific permissions
use std::fs;
use std::process::Command;
use std::io::Write;
use debpkg::DebPkg;
use std::io;

#[cfg(target_family = "unix")]
use std::os::unix::fs::PermissionsExt;

#[derive(Clone, serde::Serialize)]
#[serde(tag = "event", content = "data")]
pub enum DownloadEvent {
    Started {
        game_title: String,
    },
    Progress {
        game_title: String,
        file_index: usize,
        percent: u8,
    },
    Finished {
        game_title: String,
    },
}

#[tauri::command]
pub async fn download_to_app_dir(
    _app_handle: tauri::AppHandle,
    file_location: String,
    download_url: String,
    game_title: String,
    on_event: tauri::ipc::Channel<DownloadEvent>,
) -> Result<i32, String> {
    on_event
        .send(DownloadEvent::Started {
            game_title: game_title.clone(),
        })
        .unwrap();

    let zip_temp_dir = PathBuf::from(&file_location).join("zip_temp");
    let zip_path = zip_temp_dir.join(format!("{}.zip", game_title));
    let extract_dir = PathBuf::from(&file_location);

    if !zip_temp_dir.exists() {
        fs::create_dir_all(&zip_temp_dir).map_err(|e| e.to_string())?;
    }
    if !extract_dir.exists() {
        fs::create_dir_all(&extract_dir).map_err(|e| e.to_string())?;
    }

    println!("Downloading zip to: {}", zip_path.display());

    let mut resp = reqwest::get(&download_url)
        .await
        .map_err(|e| e.to_string())?;
    let mut zip_file = fs::File::create(&zip_path).map_err(|e| e.to_string())?;

    let total_size = resp.content_length().unwrap_or(0); // fallback to 0 if unknown
    let mut downloaded = 0;

    let mut last_percent = 0;

    while let Some(chunk) = resp.chunk().await.map_err(|e| e.to_string())? {
        downloaded += chunk.len() as u64;
        zip_file.write_all(&chunk).map_err(|e| e.to_string())?;

        if total_size > 0 {
            let percent = ((downloaded as f64 / total_size as f64) * 50.0) as u8;
            if percent > last_percent {
                last_percent = percent;
                on_event
                    .send(DownloadEvent::Progress {
                        game_title: game_title.clone(),
                        file_index: 0,
                        percent,
                    })
                    .unwrap();
            }
        }
    }

    let reader = fs::File::open(&zip_path).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(reader).map_err(|e| e.to_string())?;
    let archive_len = archive.len();

    let mut last_extract_percent = 50;

    for i in 0..archive_len {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = match file.enclosed_name() {
            Some(path) => extract_dir.join(path),
            None => continue,
        };

        println!("Extracting: {}", outpath.display());

        if file.is_dir() {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = outpath.parent() {
                if !parent.exists() {
                    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
                }
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
            io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;

            #[cfg(unix)]
            {
                if let Some(mode) = file.unix_mode() {
                    fs::set_permissions(&outpath, fs::Permissions::from_mode(mode))
                        .map_err(|e| e.to_string())?;
                } else {
                    fs::set_permissions(&outpath, fs::Permissions::from_mode(0o644))
                        .map_err(|e| e.to_string())?;
                }
            }
        }

        let extract_percent = 50.0 + ((i + 1) as f32 / archive_len as f32 * 50.0);
        let extract_percent_u8 = extract_percent as u8;

        if extract_percent_u8 > last_extract_percent {
            last_extract_percent = extract_percent_u8;
            on_event
                .send(DownloadEvent::Progress {
                    game_title: game_title.clone(),
                    file_index: i,
                    percent: extract_percent_u8,
                })
                .unwrap();
        }
    }

    let launcher_app = extract_dir.join("Launcher.app");
    let renamed_app = extract_dir.join(format!("{}.app", game_title));
    if launcher_app.exists() {
        if renamed_app.exists() {
            fs::remove_dir_all(&renamed_app).map_err(|e| e.to_string())?;
        }
        fs::rename(&launcher_app, &renamed_app).map_err(|e| e.to_string())?;
    }

    fs::remove_dir_all(&zip_temp_dir).map_err(|e| e.to_string())?;

    on_event
        .send(DownloadEvent::Finished {
            game_title: game_title,
        })
        .unwrap();
    Ok(0)
}

#[tauri::command]
pub fn launch_game(path: String) -> Result<(), String> {
    if !std::path::Path::new(&path).exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    // Match OS-specific launch methods
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn unzip_linux(
    _app_handle: tauri::AppHandle,
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
pub async fn move_appimage_linux(
    _app_handle: tauri::AppHandle,
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
pub async fn install_deb_linux(
    _app_handle: tauri::AppHandle,
    executable_path: String,
) -> Result<(), String> {
    let status = Command::new("sudo")
        .arg("apt")
        .arg("install")
        .arg(&executable_path)
        .status()
        .map_err(|e| format!("Failed to execute sudo apt install: {}", e))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!(
            "Failed to install deb package: exit code {}",
            status.code().unwrap_or(-1)
        ))
    }
}

#[tauri::command]
pub async fn get_deb_package_name(
    _app_handle: tauri::AppHandle,
    executable_path: String,
) -> Result<String, String> {
    let file = File::open(&executable_path)
        .map_err(|e| format!("Failed to open deb file '{}': {}", executable_path, e))?;
    let mut pkg = DebPkg::parse(file)
        .map_err(|e| format!("Failed to parse deb package '{}': {}", executable_path, e))?;
    let control_tar = pkg
        .control()
        .map_err(|e| format!("Failed to extract control.tar from '{}': {}", executable_path, e))?;
    let control = debpkg::Control::extract(control_tar)
        .map_err(|e| format!("Failed to extract control information from '{}': {}", executable_path, e))?;
    Ok(control.name().to_string())
}

#[tauri::command]
pub async fn run_deb_linux(
    _app_handle: tauri::AppHandle,
    package_name: String,
    args: Vec<String>,
) -> Result<(), String> {
    let status = Command::new(&package_name)
        .args(&args)
        .status()
        .map_err(|e| format!("Failed to run deb package: {}", e))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!(
            "Failed to run deb package: exit code {}",
            status.code().unwrap_or(-1)
        ))
    }
}

#[cfg(target_family = "unix")]
#[tauri::command]
pub async fn set_permission(
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
pub async fn unzip_windows(
    _app_handle: tauri::AppHandle,
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
pub async fn move_exe_windows(
    _app_handle: tauri::AppHandle,
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
pub async fn unzip_macos(
    _app_handle: tauri::AppHandle,
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
pub async fn untarbz2_macos(
    _app_handle: tauri::AppHandle,
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

#[derive(serde::Serialize)]
pub struct DownloadProgress {
    downloaded: u64,
    speed: Option<f64>,
    total: u64,
    duration: f64,
    expectation: f64,
    game_id: String,
    game_image_url: String,
    game_title: String,
}

#[tauri::command]
pub fn write_file(content: String, filepath: String) -> Result<(), String> {
    std::fs::write(&filepath, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn delete_file(_app_handle: tauri::AppHandle, file_location: String) -> Result<(), String> {
    let path = PathBuf::from(file_location);

    fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn delete_directory(
    _app_handle: tauri::AppHandle,
    dir_location: String,
) -> Result<(), String> {
    let path = PathBuf::from(dir_location);

    // Attempt to remove the directory and all its contents recursively
    fs::remove_dir_all(&path).map_err(|e| format!("Failed to delete directory: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn run_url_args(url: String, args: Vec<String>) {
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
pub fn open_directory(path: &str) {
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