import { House, User } from './types';

export const predictFuturePrice = (historicalData: { year: number, price: number }[], targetYear: number) => {
  const n = historicalData.length;
  if (n < 2) return { predictedPrice: historicalData[0]?.price || 0, trend: 'stable' };

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

  return { predictedPrice, trend };
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

export const rankProperties = (houses: House[], user: User) => {
  return houses
    .map(h => ({ ...h, matchScore: getMatchScore(h, user) }))
    .sort((a, b) => (b as any).matchScore - (a as any).matchScore);
};