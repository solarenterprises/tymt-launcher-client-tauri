use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl};

#[tauri::command]
pub async fn create_child_window(
    handle: tauri::AppHandle,
    url: String,
    width: f64,
    height: f64,
    x: f64,
    y: f64,
) -> Result<(), String> {
    let main_window = handle
        .get_window("tymtLauncher")
        .ok_or("Main window missing")?;

    // Create the child webview with the provided URL and specified dimensions/position
    let _webview = main_window
        .add_child(
            tauri::webview::WebviewBuilder::new(
                "child",
                WebviewUrl::External(url.parse().map_err(|_| "Invalid URL".to_string())?),
            )
            .auto_resize(),
            LogicalPosition::new(x, y),
            LogicalSize::new(width, height),
        )
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn destroy_child_window(handle: tauri::AppHandle) -> Result<(), String> {
    let child_webview = handle.get_webview("child").ok_or("Child webview missing")?;
    child_webview.close().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn is_window_visible(window: tauri::Window) -> bool {
    window.is_visible().unwrap_or(false)
}

#[tauri::command]
pub async fn show_transaction_window(app_handle: tauri::AppHandle) {
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
pub async fn hide_transaction_window(app_handle: tauri::AppHandle) {
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

pub fn show_window(app: &tauri::AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect(
            "Sorry, no wind
        ow found",
        )
        .set_focus()
        .expect("Can't Bring Window to Focus");
}
