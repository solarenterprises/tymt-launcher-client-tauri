use std::path::{Path, PathBuf};
use std::fs::File;
use tauri::Emitter;
use zip::read::ZipArchive; // For Unix-specific permissions
use std::fs;
use std::process::Command;
use std::time::{Duration, Instant};
use reqwest::Client;
use reqwest::header::ACCEPT;
use futures_util::stream::StreamExt;
use std::cmp::min;
use std::io::Write;

#[tauri::command]
pub async fn unzip_linux(
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
pub async fn move_appimage_linux(
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
pub async fn move_exe_windows(
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
pub async fn unzip_macos(
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
pub async fn untarbz2_macos(
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

#[derive(serde::Serialize)]
pub struct DownloadProgress {
    downloaded: u64,
    speed: Option<f64>,
    total: u64,
    duration: f64,
    expectation: f64,
    game: String,
}

#[tauri::command]
pub async fn download_to_app_dir(
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
pub fn write_file(content: String, filepath: String) -> Result<(), String> {
    std::fs::write(&filepath, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn delete_file(app_handle: tauri::AppHandle, file_location: String) -> Result<(), String> {
    let path = PathBuf::from(file_location);

    fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn delete_directory(
    app_handle: tauri::AppHandle,
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