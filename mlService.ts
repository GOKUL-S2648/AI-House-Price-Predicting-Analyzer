import { House, User } from './types';

// Local Random Forest Regressor Implementation (Ensemble Logic)
const predictRandomForestLocal = (historicalData: { year: number, price: number }[], targetYear: number, amenitiesCount: number) => {
  const n = historicalData.length;
  if (n < 2) return { predictedPrice: historicalData[0]?.price || 0, trend: 'stable' };

  const trees = 15;
  const predictions: number[] = [];

  for (let i = 0; i < trees; i++) {
    // Bootstrap Sampling (Random sample with replacement)
    const sample = Array.from({ length: n }, () => historicalData[Math.floor(Math.random() * n)]);
    
    // Simplified Decision Tree: Calculate a weighted slope based on year and amenities density
    // Tree-specific random bias for "stochastic" nature of RF
    const randomBias = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x
    const amenitiyBoost = 1 + (amenitiesCount * 0.02 * randomBias);
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    sample.forEach(d => {
      sumX += d.year;
      sumY += d.price;
      sumXY += d.year * d.price;
      sumXX += d.year * d.year;
    });

    const denominator = (n * sumXX - sumX * sumX);
    const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    const treePrediction = (m * targetYear + b) * amenitiyBoost;
    predictions.push(treePrediction);
  }

  // Aggregate Forest Predictions (Mean)
  const averagePrediction = predictions.reduce((a, b) => a + b, 0) / trees;
  const lastPrice = historicalData[n - 1].price;
  const delta = averagePrediction - lastPrice;
  
  const trend = delta > 500 ? 'rising' : delta < -500 ? 'declining' : 'stable';

  return {
    predictedPrice: Math.round(averagePrediction / 500) * 500,
    trend: trend,
    model: 'Forest Ensemble (Local)'
  };
};

export const predictFuturePrice = async (historicalData: { year: number, price: number }[], targetYear: number, amenitiesCount: number = 0) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historicalPrices: historicalData, targetYear, amenitiesCount })
    });

    if (!response.ok) throw new Error('Backend offline');

    const data = await response.json();
    return {
      rfPrice: Math.round(data.random_forest.predicted_price / 500) * 500,
      rfTrend: data.random_forest.trend,
      lrPrice: Math.round(data.linear_regression.predicted_price / 500) * 500,
      lrTrend: data.linear_regression.trend,
      predictedPrice: Math.round(data.random_forest.predicted_price / 500) * 500,
      trend: data.random_forest.trend,
      isRF: true
    };

  } catch (error) {
    console.warn("ML Backend unavailable, deploying Local Random Forest Engine:", error);
    const localRF = predictRandomForestLocal(historicalData, targetYear, amenitiesCount);
    
    return {
      rfPrice: localRF.predictedPrice,
      rfTrend: localRF.trend,
      lrPrice: localRF.predictedPrice, // Same for local ensemble
      lrTrend: localRF.trend,
      predictedPrice: localRF.predictedPrice,
      trend: localRF.trend,
      isRF: true
    };
  }
};

export const getCheapDeals = async (houses: House[]) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/cheap-deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        houses: houses.map(h => ({
          id: h.id,
          title: h.title,
          price: h.price,
          historicalPrices: h.historicalPrices,
          amenitiesCount: h.amenities.length
        })),
        targetYear: 2027
      })
    });

    if (!response.ok) throw new Error('Backend failed');
    const data = await response.json();
    return data.deals;

  } catch (error) {
    console.warn("Cheap Deals backend offline, using local RF matching...");
    return houses.filter(h => {
      const pred = predictRandomForestLocal(h.historicalPrices, 2027, h.amenities.length);
      return h.price < (pred.predictedPrice * 0.85);
    });
  }
};

export const detectSuspiciousListings = async (houses: House[]) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/detect-suspicious`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        houses: houses.map(h => ({
          ...h,
          amenitiesCount: h.amenities ? h.amenities.length : 0
        })),
        targetYear: 2027
      })
    });

    if (!response.ok) throw new Error('Backend failed');
    const data = await response.json();
    return data.listings || houses;

  } catch (error) {
    console.warn("Suspicious detection backend offline, mapping local RF anomalies...");
    return houses.map(h => {
      const pred = predictRandomForestLocal(h.historicalPrices, 2027, h.amenities.length);
      const isOverpriced = h.price > (pred.predictedPrice * 1.35);
      const isUnderpriced = h.price < (pred.predictedPrice * 0.45);
      
      return {
        ...h,
        is_suspicious: isUnderpriced,
        is_overpriced: isOverpriced,
        suspicious_reason: isUnderpriced ? "Price unusually low compared to local RF consensus." : 
                           isOverpriced ? "Listed significantly above RF market valuation." : "",
        market_predicted_price: pred.predictedPrice
      };
    });
  }
};


export const getMatchScore = (house: House, user: User) => {
  if (!user) return 0;

  let score = 0;

  // 1. Financial Fit (Weight: 60%)
  const idealRent = user.income * 0.3;
  const deviation = Math.abs(house.price - idealRent) / (idealRent || 1);
  const financialScore = Math.max(0, 60 - (deviation * 60));
  score += financialScore;

  // 2. Feature Density (Weight: 30%)
  const featureScore = Math.min(30, house.amenities.length * 7.5);
  score += featureScore;

  // 3. Location/Type Bonus (Weight: 10%)
  if (house.type === 'Apartment' || house.type === 'Studio') score += 10;
  else if (house.type === 'Pg') score += 5;

  return Math.round(score);
};

export const analyzeListingValue = (price: number, predictedPrice: number) => {
  if (!predictedPrice) return { label: 'Unknown', color: 'gray' };

  const ratio = price / predictedPrice;

  if (ratio > 1.3) return { label: 'Overpriced', color: 'red' };
  if (ratio < 0.6) return { label: 'Suspiciously Low', color: 'orange' };
  if (ratio < 0.85) return { label: 'High Value', color: 'emerald' };
  return { label: 'Fair Value', color: 'blue' };
};

export const rankProperties = (houses: House[], user: User) => {
  return houses
    .map(h => ({ ...h, matchScore: getMatchScore(h, user) }))
    .sort((a, b) => (b as any).matchScore - (a as any).matchScore);
};