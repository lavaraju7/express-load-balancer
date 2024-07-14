const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

class LoadBalancer {
  constructor() {
    this.serverIndex = 0;
    this.serverArray = [];
    this.sessionMap = new Map();
    this.app = express();
    this.setupMiddleware();
    this.useStickySession = false
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  start(portForLB,useStickySession) {
    this.port = portForLB;
    this.useStickySession = useStickySession
    this.app.listen(this.port, () => {
      console.log(`Load balancer is running on http://localhost:${this.port}`);
    });
  }

  initializedServers(serverArray) {
    this.serverArray = serverArray;
  }

  getNextServer() {
    this.serverIndex = (this.serverIndex + 1) % this.serverArray.length;
    return this.serverArray[this.serverIndex];
  }

  getServerForSession(sessionId) {
    if(this.useStickySession){
      if (this.sessionMap.has(sessionId)) {
        return this.sessionMap.get(sessionId);
      } else {
        const server = this.getNextServer();
        this.sessionMap.set(sessionId, server);
        return server;
      }
    }else{
      const server = this.getNextServer();
      return server
    }
  }

  generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }

  handle(req, res) {
    let sessionId = req.cookies['SESSIONID'];
    if(this.useStickySession){
      if (!sessionId) {
        sessionId = this.generateSessionId();
        res.cookie('SESSIONID', sessionId, { httpOnly: true });
      }
    }
    const server = this.getServerForSession(sessionId);
    console.log(`Forwarding request to ${server}${req.url} for session ${sessionId}`);

    axios({
      method: req.method,
      url: `${server}${req.url}`,
      headers: req.headers,
      data: req.body
    })
      .then(response => res.send(response.data))
      .catch(error => {
        console.error('Error forwarding request:', error.message);
        return res.status(500).send('Internal Server Error');
      });
  }
}

module.exports = LoadBalancer;
