use momento_cache_facade::MomentoCacheFacade;

fn main() {
    println!("Hello, world!");
    let foo = "Hello";
    let cache_facade = MomentoCacheFacade::new(foo.to_string(), 42);
    println!("Constructed an instance of the cache facade struct! {:?}", cache_facade);
    println!("The foo field of the cache facade struct is: {}", cache_facade.get_foo());
}
