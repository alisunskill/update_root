// recommendationUtils.js
export const getFilteredRecommendations = (recommendations, value) => {
  if (recommendations && recommendations.Recommendations.length > 0) {
    // Calculate the minimum and maximum values from the recommendations
    const minCost = Math.min(
      ...recommendations.Recommendations.map((post) => post.cost)
    );
    const maxCost = Math.max(
      ...recommendations.Recommendations.map((post) => post.cost)
    );

    // Adjust the current value if it exceeds the new range
    if (value[0] < minCost || value[1] > maxCost) {
      value = [minCost, maxCost];
    }

    // Filter the recommendations based on the selected price range
    const filtered = recommendations.Recommendations.filter(
      (post) => post.cost >= value[0] && post.cost <= value[1]
    );

    return filtered;
  }
  return [];
};
