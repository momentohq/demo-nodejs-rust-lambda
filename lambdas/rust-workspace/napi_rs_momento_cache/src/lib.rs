#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use momento_cache_facade::initialize_logging;

#[napi]
pub struct NapiRsMomentoCache {
  momento_cache: momento_cache_facade::MomentoCacheFacade
}

#[napi]
impl NapiRsMomentoCache {
  #[napi(factory)]
  pub fn create(log_level: String, cache_name: String, momento_api_key: String) -> Self {
    initialize_logging(&log_level);
    NapiRsMomentoCache {
      momento_cache: momento_cache_facade::MomentoCacheFacade::new(cache_name, momento_api_key)
    }
  }

  #[napi]
  pub async fn store(&self, key: String, value: String) {
    self.momento_cache.store(&key, &value).await
  }

  #[napi]
  pub async fn retrieve(&self, key: String) -> Option<String> {
      self.momento_cache.retrieve(&key).await
  }
}
