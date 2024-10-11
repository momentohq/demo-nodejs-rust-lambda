use log::info;
use momento_cache_facade::{initialize_logging, MomentoCacheFacade};

#[tokio::main]
async fn main() {
    dotenv::from_path("../../../.env").expect("Failed to load .env file");
    let momento_cache_name = dotenv::var("MOMENTO_CACHE_NAME").expect("Failed to get MOMENTO_CACHE_NAME from .env file");
    let momento_api_key = dotenv::var("MOMENTO_API_KEY").expect("Failed to get MOMENTO_API_KEY from .env file");
    let log_level = dotenv::var("LOG_LEVEL").expect("Failed to get LOG_LEVEL from .env file");
    initialize_logging(&log_level);
    let cache_facade = MomentoCacheFacade::new(momento_api_key, momento_cache_name);
    info!("Storing value in cache");
    cache_facade.store("foo", "FOO").await;
    let value = cache_facade.retrieve("foo").await;
    info!("Retrieved value from cache: {:?}", value);
}
