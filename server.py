# AffordHome AI: Mathematical Analytics (Python)
# This module provides the logic used for ranking properties and predicting future price growth.

import math
from typing import List, Dict, Any

def calculate_property_match(house_price: float, user_income: float, amenities_count: int) -> int:
    """
    Weighted scoring algorithm for matching homes to users.
    Weightings: 70% Financial Viability, 30% Feature Density.
    """
    if user_income <= 0: return 0
    
    # Financial Score: Ideal rent is <= 30% of income (The 30% Rule)
    rent_ratio = house_price / user_income
    financial_score = 0.0
    
    if rent_ratio <= 0.3:
        # Full points for being under budget
        financial_score = 70.0
    else:
        # Linear penalty for exceeding budget
        penalty = (rent_ratio - 0.3) * 100
        financial_score = max(0.0, 70.0 - penalty)
        
    # Amenity Score: 7.5 points per feature, max 30 points
    amenity_score = min(30.0, amenities_count * 7.5)
    
    match_score = round(financial_score + amenity_score)
    return min(100, match_score)

def forecast_rent_growth(historical_prices: List[Dict[str, Any]], target_year: int = 2025) -> Dict[str, Any]:
    """
    Simple Linear Regression implementation (y = mx + b) for rent forecasting.
    historical_prices: list of dicts [{'year': 2022, 'price': 10000}, ...]
    """
    n = len(historical_prices)
    if n < 2:
        return {"predicted": historical_prices[0]['price'] if n == 1 else 0, "trend": "stable"}
        
    sum_x = sum(d['year'] for d in historical_prices)
    sum_y = sum(d['price'] for d in historical_prices)
    sum_xy = sum(d['year'] * d['price'] for d in historical_prices)
    sum_xx = sum(d['year'] * d['year'] for d in historical_prices)
    
    denominator = (n * sum_xx - sum_x * sum_x)
    if denominator == 0: 
        return {"predicted": sum_y / n, "trend": "stable"}
    
    # Calculate Slope (m) and Intercept (b)
    m: float = (n * sum_xy - sum_x * sum_y) / denominator
    b: float = (sum_y - m * sum_x) / n
    
    # Calculate Prediction
    prediction = round(m * target_year + b)
    trend = "rising" if m > 50 else "declining" if m < -50 else "stable"
    
    return {
        "predicted_price": prediction,
        "trend": trend,
        "annual_delta": round(m, 2)
    }

# Usage Example:
# result = calculate_property_match(25000, 80000, 4)
# print(f"Match Score: {result}%")  