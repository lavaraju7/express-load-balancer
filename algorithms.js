
class AlgoForServerSelection{
    serverFromRoundRobin(serverIndex,serverArray){
        serverIndex = (serverIndex + 1) % serverArray.length;
        return serverIndex;
    }
    serverFromWeightedRoundRobin(serverIndex = -1,array) {
      if (!array || array.length === 0) {
        return null;
      }
    
      // Calculate pseudo-weights based on position (higher index, lower weight)
      const weights = array.map((_, index) => array.length - index);
    
      // Calculate total weight
      const totalWeight = weights.reduce((acc, current) => acc + current, 0);
    
      // Generate a random number between 0 (inclusive) and total weight (exclusive)
      const randomValue = Math.random() * totalWeight;
    
      // Loop through the array, accumulating weights
      let accumulatedWeight = 0;
      let currentIndex = (serverIndex + 1) % array.length; // Start from next index after last used
    
      do {
        accumulatedWeight += weights[currentIndex];
        currentIndex = (currentIndex + 1) % array.length;
      } while (accumulatedWeight < randomValue);
    
      return currentIndex;
      }
}

module.exports = AlgoForServerSelection