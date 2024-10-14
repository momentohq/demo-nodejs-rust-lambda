<head>
  <meta name="Momento JavaScript Client Library Documentation" content="JavaScript client software development kit for Momento Cache">
</head>
<img src="https://docs.momentohq.com/img/momento-logo-forest.svg" alt="logo" width="400"/>

# Momento Node.js->Rust Lambda Demo

This repo contains the source code to go along with the "A Little Rust-y" workshop at QConSF 2024:

https://qconsf.com/training/nov2024/little-rust-y-using-rust-interop-boost-performance-existing-apps-any-language

In this demo we will start with an existing node.js application, intended to deploy to an AWS lambda environment. We will explore the functionality and performance of the application, use profiling tools to identify bottlenecks, and then surgically replace a small part of the application with some Rust code, called via the node.js program via interop. Afterward we’ll revisit the performance and celebrate the improvements!

This demo does not assume that you have any familiarity with or experience with Rust; we’ll cover the basics that you need to know. By the end of this project you should have enough familiarity to understand how you might apply these techniques to your own application, regardless of what language it’s written in. And you will see that it’s possible to achieve major performance wins (and cost reductions!) with a tiny bit of Rust, without needing to re-write your whole application!

To follow along with the steps of the demo, please refer to [this Google Doc](https://docs.google.com/document/d/1q2F1hEOvF0t6EEmJSxxtAwQif4VkLNaITIj2yN4p6o0/edit?usp=sharing) [(PDF version)](https://github.com/momentohq/demo-nodejs-rust-lambda/blob/main/Workshop-Overview.pdf) that outlines all of the steps.

----------------------------------------------------------------------------------------
For more info, visit our website at [https://gomomento.com](https://gomomento.com)!
