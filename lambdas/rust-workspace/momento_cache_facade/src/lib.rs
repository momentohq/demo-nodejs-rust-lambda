#[derive(Debug)]
pub struct MomentoCacheFacade {
    foo: String,
    bar: u32
}

impl MomentoCacheFacade {
    pub fn new(foo: String, bar: u32) -> MomentoCacheFacade {
        MomentoCacheFacade {
            foo,
            bar
        }
    }

    pub fn get_foo(&self) -> String {
        self.foo.clone()
    }
}

