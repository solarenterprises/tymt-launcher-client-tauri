use tauri::{
  Manager,
  LogicalPosition,
  LogicalSize,
  WebviewUrl
};

#[tauri::command]
pub async fn create_child_window(
  handle: tauri::AppHandle,
  url: String,
  width: f64,
  height: f64,
  x: f64,
  y: f64,
) -> Result<(), String> {
  let main_window = handle.get_window("tymtLauncher").ok_or("Main window missing")?;

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
