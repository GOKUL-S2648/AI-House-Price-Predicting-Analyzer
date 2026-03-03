import { House, User } from './types';

export const predictFuturePrice = async (historicalData: { year: number, price: number }[], targetYear: number, amenitiesCount: number = 0) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historicalPrices: historicalData, targetYear, amenitiesCount })
    });


    if (!response.ok) throw new Error('Backend failed');

    const data = await response.json();
    return {
      rfPrice: data.random_forest.predicted_price,
      rfTrend: data.random_forest.trend,
      lrPrice: data.linear_regression.predicted_price,
      lrTrend: data.linear_regression.trend,
      // Default price for standard components
      predictedPrice: data.random_forest.predicted_price,
      trend: data.random_forest.trend,
      isRF: true
    };



  } catch (error) {
    console.error("ML Backend error, falling back to local LR:", error);
    // Fallback to local Linear Regression if backend is down
    const n = historicalData.length;
    if (n < 2) return { predictedPrice: historicalData[0]?.price || 0, trend: 'stable' as const, isRF: false };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    historicalData.forEach(d => {
      sumX += d.year;
      sumY += d.price;
      sumXY += d.year * d.price;
      sumXX += d.year * d.year;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const predictedPrice = Math.round(m * targetYear + b);
    const trend = m > 100 ? 'rising' : m < -100 ? 'declining' : 'stable';

    return {
      rfPrice: predictedPrice,
      rfTrend: trend,
      lrPrice: predictedPrice,
      lrTrend: trend,
      predictedPrice,
      trend,
      isRF: false
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
        targetYear: 2025
      })
    });

    if (!response.ok) throw new Error('Backend failed');
    const data = await response.json();
    return data.deals;
  } catch (error) {
    console.error("Error fetching cheap deals:", error);
    return [];
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
        targetYear: 2025
      })
    });

    if (!response.ok) throw new Error('Backend failed');
    const data = await response.json();
    return data.listings || houses;
  } catch (error) {
    console.error("Error detecting suspicious listings:", error);
    return Array.isArray(houses) ? houses : [];
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