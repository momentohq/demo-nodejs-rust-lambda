use std::time::Duration;
use log::debug;
use momento::cache::{configurations, GetResponse};
use momento::{CacheClient, CredentialProvider};

pub fn initialize_logging(log_level: &str) {
    match log_level {
        "debug" => colog::default_builder().filter_level(log::LevelFilter::Debug).init(),
        "info" => colog::default_builder().filter_level(log::LevelFilter::Info).init(),
        _ => colog::default_builder().filter_level(log::LevelFilter::Info).init(),
    }
}

#[derive(Debug)]
pub struct MomentoCacheFacade {
    cache_name: String,
    cache_client: CacheClient,
}

impl MomentoCacheFacade {
    pub fn new(cache_name: String, momento_api_key: String) -> MomentoCacheFacade {
        MomentoCacheFacade {
            cache_name,
            cache_client: CacheClient::builder()
                .default_ttl(Duration::from_secs(60 * 10))
                .configuration(configurations::InRegion::latest())
                .credential_provider(
                    CredentialProvider::from_string(momento_api_key)
                        .expect("Failed to get API key from environment variable"))
                .with_num_connections(10)
                .build()
                .expect("Failed to build cache client"),
        }
    }

    pub async fn store(&self, key: &str, value: &str) {
        debug!("Rust MomentoCacheFacade storing key {} with value {}", key, value);
        self.cache_client.set(&self.cache_name, key, value).await.expect("Failed to store value in cache");
    }

    pub async fn retrieve(&self, key: &str) -> Option<String> {
        debug!("Rust MomentoCacheFacade retrieving key {}", key);
        let response = self.cache_client.get(&self.cache_name, key)
            .await
            .expect("Failed to retrieve value from cache");

        match response {
            GetResponse::Hit { value } => Some(value.try_into().expect("Failed to convert value to string")),
            GetResponse::Miss => None
        }
    }
}

