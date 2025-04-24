use tauri::{
  Manager,
  LogicalPosition,
  LogicalSize,
  WebviewUrl
};

#[tauri::command]
pub async fn create_child_window(handle: tauri::AppHandle) -> Result<(), String> {
//   let main_window = handle.get_webview_window("tymtLauncher").ok_or("Main window missing")?;
//   let size = main_window.inner_size().map_err(|e| e.to_string())?;

//   // Create the child webview
//   let _webview = main_window.add_child(
//     tauri::window::WebviewBuilder::new(
//       "child",
//         WebviewUrl::External("https://github.com/tauri-apps/tauri".parse().unwrap()),
//     )
//     .auto_resize(),
//     LogicalPosition::new(size.width as f64 / 2., 0.),
//     LogicalSize::new(size.width as f64 / 2., size.height as f64 / 2.)
//   ).map_err(|e| e.to_string())?;

  Ok(())
}