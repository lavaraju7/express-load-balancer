Simple Load Balancer - A Node.js Package for Express Applications
This Node.js package provides a simple and efficient way to implement load balancing for your Express applications. It allows you to distribute incoming requests across multiple servers, improving performance and application scalability.

Features:

Express Integration: Seamlessly integrates with your existing Express setup.
Multiple Algorithms: Choose from various load balancing algorithms (initial functionality might focus on one specific algorithm, e.g., round robin).
Easy Configuration: Configure your load balancer with minimal code.
Improved Performance: Enhances application responsiveness under heavy load.
Benefits:

Scalability: Easily scale your application by adding more servers.
Availability: Ensure your application remains accessible even if a server encounters issues.
Simplified Management: Manage multiple servers from a central point.

Installation
npm i express-load-balancer


Usage

const LoadBalancer = require('express-load-balancer')
const dotenv = require('dotenv');
dotenv.config();

const loadBalancer = new LoadBalancer();
const lbPort = process.env.LOAD_BALANCER_PORT || 8000;
loadBalancer.start(lbPort,useStckySession = false,algorithm='ip-hash');

// Initialize servers with different ports
loadBalancer.initializedServers([
  `http://localhost:${process.env.SERVER_PORT_1}`,
  `http://localhost:${process.env.SERVER_PORT_2}`
]);

// Setup load balancer middleware
loadBalancer.app.use((req, res) => {
  loadBalancer.handle(req, res);
});

Now run this file or import this file in your express setup file. Bam your load balancer is up and running.
