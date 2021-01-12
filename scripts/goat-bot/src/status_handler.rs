use anyhow::anyhow;
use anyhow::Result;

struct StatusHandler {
  client: reqwest::Client,
}

impl StatusHandler {
  pub fn new() -> Self {
    StatusHandler {
      client: reqwest::Client::new(),
    }
  }
  pub async fn handle_status_change(&self, endpoint: &str) -> Result<bool> {
    let res = self
      .client
      .post(&format!("http://localhost:8000{}", endpoint))
      // .header("Authorization", "")
      .send()
      .await?;

    match res.status().as_u16() {
      200 => Ok(true),
      409 => Ok(false),
      _ => Err(anyhow!("[Unexpected Response] {}", res.status())),
    }
  }
  pub async fn activate(&self) -> Result<bool> {
    self.handle_status_change("/start").await
  }

  pub async fn deactivate(&self) -> Result<bool> {
    self.handle_status_change("/stop").await
  }
}

pub async fn activate() -> Result<&'static str> {
  let res = StatusHandler::new().activate().await;

  if res.is_ok() {
    match res.unwrap() {
      true => Ok("[Activation Success] - Bot activated"),
      false => Ok("[Activation Warning] - Bot already activated, not activating again"),
    }
  } else {
    println!("[Activation Error] - {:?}", res.unwrap_err());
    Err(anyhow!("Error setting bot status"))
  }
}

pub async fn deactivate() -> Result<&'static str> {
  let res = StatusHandler::new().deactivate().await;

  if res.is_ok() {
    match res.unwrap() {
      true => Ok("[Deactivation Success] - Bot deactivated"),
      false => Ok("[Deactivation Warning] - Bot already deactivated, not deactivating again"),
    }
  } else {
    println!("[Deactivation Error] - {:?}", res.unwrap_err());
    Err(anyhow!("Error setting bot status"))
  }
}
