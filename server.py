# AffordHome AI: Mathematical Analytics (Python)
# This module provides the logic used for ranking properties and predicting future price growth.

import math
import numpy as np
import pandas as pd
from typing import List, Dict, Any
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)
CORS(app)

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
        return {"predicted_price": historical_prices[0]['price'] if n == 1 else 0, "trend": "stable"}
        
    sum_x = sum(d['year'] for d in historical_prices)
    sum_y = sum(d['price'] for d in historical_prices)
    sum_xy = sum(d['year'] * d['price'] for d in historical_prices)
    sum_xx = sum(d['year'] * d['year'] for d in historical_prices)
    
    denominator = (n * sum_xx - sum_x * sum_x)
    if denominator == 0: 
        return {"predicted_price": sum_y / n, "trend": "stable"}
    
    m: float = (n * sum_xy - sum_x * sum_y) / denominator
    b: float = (sum_y - m * sum_x) / n
    
    prediction = round(m * target_year + b)
    trend = "rising" if m > 50 else "declining" if m < -50 else "stable"
    
    return {
        "predicted_price": int(prediction),
        "trend": trend,
        "annual_delta": float(f"{m:.2f}")
    }

def predict_rf(historical_prices: List[Dict[str, Any]], amenities_count: int, target_year: int = 2026) -> Dict[str, Any]:
    """
    Random Forest Regression predicting price growth (deltas) instead of absolute values.
    This allows the model to 'grow' beyond historical maximums.
    """
    if len(historical_prices) < 2:
        return forecast_rent_growth(historical_prices, target_year)

    df = pd.DataFrame(historical_prices)
    
    # Calculate year-over-year changes (deltas)
    df['delta'] = df['price'].diff().fillna(0)
    
    # For training, we use years 1 to N-1 to predict deltas
    # Since we have very few points, we'll augment the tiny dataset with synthetic variations
    # to give the trees something to work with for a 'demo' feel.
    train_X = df[['year']].values[1:] # Skip first year as delta is 0
    train_y = df['delta'].values[1:]
    
    # Initialize and train Random Forest to predict the CHANGE
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(train_X, train_y)
    
    # Predict the delta for the target year
    # We sum the predicted deltas for each year between last year and target year
    current_price = historical_prices[-1]['price']
    last_year = historical_prices[-1]['year']
    
    predicted_delta = model.predict([[target_year]])[0]
    
    # Simple extrapolation: apply predicted annual delta for the gap
    years_gap = target_year - last_year
    prediction = current_price + (predicted_delta * years_gap)
    
    m = prediction - current_price
    trend = "rising" if m > 50 else "declining" if m < -50 else "stable"

    return {
        "predicted_price": round(float(prediction)),
        "trend": trend,
        "model": "Random Forest (Delta Engine)"
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    historical_prices = data.get('historicalPrices', [])
    amenities_count = data.get('amenitiesCount', 0)
    target_year = data.get('targetYear', 2025)
    
    # Calculate both for comparison
    lr_result = forecast_rent_growth(historical_prices, target_year)
    rf_result = predict_rf(historical_prices, amenities_count, target_year)
    
    return jsonify({
        "linear_regression": lr_result,
        "random_forest": rf_result
    })

@app.route('/match', methods=['POST'])
def match():
    data = request.json
    house_price = data.get('housePrice', 0)
    user_income = data.get('userIncome', 0)
    amenities_count = data.get('amenitiesCount', 0)
    
    score = calculate_property_match(house_price, user_income, amenities_count)
    return jsonify({"match_score": score})

if __name__ == '__main__':
    print("AffordHome AI Backend running on http://localhost:5000")
    app.run(port=5000, debug=True)