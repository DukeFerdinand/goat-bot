use clap::{App, Arg, SubCommand};
use dotenv;

const APP_NAME: &str = "[🐐 Goat Bot Manager 🐐]";

mod status_handler;

use status_handler::{activate, deactivate};

#[tokio::main]
async fn main() {
    // ===================
    // App setup
    // ===================
    let res = dotenv::dotenv();
    if res.is_ok() {
        #[cfg(debug_assertions)]
        println!("[Debug] Loaded env file\n")
    } else {
        println!("[Env Error] Unable to find env file");
        return;
    }

    let status_sub = SubCommand::with_name("set")
        .about("Subcommand to set a variety of statuses")
        .arg(Arg::with_name("target_status").possible_values(&["active", "inactive"]));

    let matches = App::new(APP_NAME).subcommand(status_sub).get_matches();

    // ===================
    // Run App
    // ===================
    println!("{}", APP_NAME);

    if let Some(v) = matches.subcommand_matches("set") {
        let target_status = v.value_of("target_status");
        match target_status {
            Some("active") => {
                println!("Activating bot...");
                let res = activate().await;

                match res {
                    Ok(m) => println!("{}", m),
                    Err(e) => println!("{:?}", e),
                }
            }
            Some("inactive") => {
                println!("Deactivating bot...");
                let res = deactivate().await;

                match res {
                    Ok(m) => println!("{}", m),
                    Err(e) => println!("{:?}", e),
                }
            }
            // Should NEVER get to this line
            _ => {
                println!(
                    "target_status missing or invalid. See `goat-bot set --help` for more info"
                )
            }
        }
    }
}
