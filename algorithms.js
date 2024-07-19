const crypto = require("crypto"); // Import crypto module

class AlgoForServerSelection {
  serverFromRoundRobin(serverIndex, serverArray) {
    serverIndex = (serverIndex + 1) % serverArray.length;
    return serverIndex;
  }

  serverFromWeightedRoundRobin(serverIndex = -1, array) {
    if (!array || array.length === 0) {
      return null;
    }
    const weights = array.map((_, index) => array.length - index);
    const totalWeight = weights.reduce((acc, current) => acc + current, 0);
    const randomValue = Math.random() * totalWeight;
    let accumulatedWeight = 0;
    let currentIndex = (serverIndex + 1) % array.length;

    do {
      accumulatedWeight += weights[currentIndex];
      currentIndex = (currentIndex + 1) % array.length;
    } while (accumulatedWeight < randomValue);

    return currentIndex;
  }

  serverFromipHash(sourceIp, servers) {
    // Error handling for empty arguments
    if (!sourceIp || !servers || servers.length === 0) {
      throw new Error(
        "Invalid arguments: sourceIp and servers array are required"
      );
    }
    const hashValue = this.sha1Hash(sourceIp);

    const numericHash = parseInt(hashValue, 16);

    // Select server based on hash and number of servers
    const serverIndex = numericHash % servers.length;

    return serverIndex;
  }

  // Function to generate SHA-1 hash
  sha1Hash(str) {
    const hash = crypto.createHash("sha1").update(str).digest("hex");
    return hash;
  }
}

module.exports = AlgoForServerSelection;
