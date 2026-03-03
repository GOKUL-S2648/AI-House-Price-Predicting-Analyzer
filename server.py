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
    amenity_score = min(30.0, float(amenities_count) * 7.5)
    
    match_score = int(round(financial_score + amenity_score))
    return min(100, match_score)

def forecast_rent_growth(historical_prices: List[Dict[str, Any]], target_year: int = 2025) -> Dict[str, Any]:
    """
    Simple Linear Regression implementation (y = mx + b) for rent forecasting.
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
    
    m = (n * sum_xy - sum_x * sum_y) / denominator
    b = (sum_y - m * sum_x) / n
    
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
    """
    if len(historical_prices) < 2:
        return forecast_rent_growth(historical_prices, target_year)

    df = pd.DataFrame(historical_prices)
    df['delta'] = df['price'].diff().fillna(0.0)
    
    train_X = df[['year']].values[1:] 
    train_y = df['delta'].values[1:]
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(train_X, train_y)
    
    current_price = historical_prices[-1]['price']
    last_year = historical_prices[-1]['year']
    
    predicted_delta = model.predict([[target_year]])[0]
    years_gap = target_year - last_year
    prediction = current_price + (predicted_delta * years_gap)
    
    m = prediction - current_price
    trend = "rising" if m > 50 else "declining" if m < -50 else "stable"

    return {
        "predicted_price": int(round(float(prediction))),
        "trend": trend,
        "model": "Random Forest (Delta Engine)"
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    historical_prices = data.get('historicalPrices', [])
    amenities_count = data.get('amenitiesCount', 0)
    target_year = data.get('targetYear', 2025)
    
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

@app.route('/cheap-deals', methods=['POST'])
def cheap_deals():
    data = request.json
    houses = data.get('houses', [])
    target_year = data.get('targetYear', 2025)
    threshold = data.get('threshold', 0.85)
    
    deals = []
    for house in houses:
        historical_prices = house.get('historicalPrices', [])
        amenities_count = house.get('amenitiesCount', 0)
        current_price = house.get('price', 0)
        
        prediction = predict_rf(historical_prices, amenities_count, target_year)
        market_value = prediction['predicted_price']
        
        if current_price > 0 and market_value > 0:
            if current_price < (market_value * threshold):
                house['market_predicted_price'] = market_value
                house['discount_percentage'] = round((1.0 - (float(current_price) / float(market_value))) * 100.0)
                deals.append(house)
                
    return jsonify({"deals": deals})

@app.route('/district-analysis', methods=['POST'])
def district_analysis():
    """
    Aggregate neighborhood data to identify risk factors and investment potential.
    Risk Score (0-100): Lower is better. High risk indicates 'slum risk' or declining value.
    """
    data = request.json
    houses_list = data.get('houses', [])
    
    # Initialize separate dictionaries for each metric to help linter inference
    houses_by_district = {}
    amenities_by_district = {}
    growth_by_district = {}
    
    for house in houses_list:
        d_name = str(house.get('district', 'Unknown'))
        
        if d_name not in houses_by_district:
            houses_by_district[d_name] = []
            amenities_by_district[d_name] = 0
            growth_by_district[d_name] = []
        
        houses_by_district[d_name].append(house)
        amenities_by_district[d_name] += len(house.get('amenities', []))
        
        historical = house.get('historicalPrices', [])
        if len(historical) >= 2:
            s_price = float(historical[0].get('price', 0))
            e_price = float(historical[-1].get('price', 0))
            if s_price > 0:
                growth_rate = (e_price - s_price) / s_price
                growth_by_district[d_name].append(growth_rate)
            
    final_analysis = []
    # Iterate over the collected districts
    all_districts = list(houses_by_district.keys())
    
    for d_name in all_districts:
        current_houses = houses_by_district[d_name]
        count = len(current_houses)
        if count == 0: continue
        
        # Calculate averages safely
        avg_amenities = float(amenities_by_district[d_name]) / count
        growth_values = growth_by_district[d_name]
        avg_growth = sum(growth_values) / len(growth_values) if growth_values else 0.0
        
        # Risk Logic (explicit float conversions to satisfy linter)
        f_amenities = float(avg_amenities)
        f_growth = float(avg_growth)
        
        amenity_risk = max(0.0, 40.0 - (f_amenities * 5.0))
        growth_risk = max(0.0, 30.0 - (f_growth * 100.0))
        
        # Manual average price calculation
        total_price = 0.0
        for h in current_houses:
            total_price += float(h.get('price', 0))
        avg_price = total_price / count
        
        price_risk = 30.0 if avg_price < 5000.0 else 0.0
        
        calculated_risk = min(100.0, amenity_risk + growth_risk + price_risk)
        risk_score_int = int(round(calculated_risk))
        
        status_text = "High Risk (Potential Slum Zone)" if risk_score_int > 70 else \
                      "Emerging Area" if risk_score_int > 40 else "Prime/Stable Zone"
                 
        final_analysis.append({
            "district": d_name,
            "risk_score": risk_score_int,
            "status": status_text,
            "avg_growth": int(round(f_growth * 100.0)),
            "house_count": count
        })
        
    return jsonify({"analysis": final_analysis})

@app.route('/detect-suspicious', methods=['POST'])
def detect_suspicious():
    """
    AI-driven transparency engine to flag overpriced or potential scam listings.
    """
    data = request.json
    houses = data.get('houses', [])
    target_year = data.get('targetYear', 2025)
    
    results = []
    for house in houses:
        historical_prices = house.get('historicalPrices', [])
        # Handle both list and direct count if sent from frontend
        amenities = house.get('amenities', [])
        amenities_count = len(amenities) if isinstance(amenities, list) else house.get('amenitiesCount', 0)
        current_price = house.get('price', 0)
        
        # Predict market value using RF
        prediction = predict_rf(historical_prices, amenities_count, target_year)
        market_value = prediction['predicted_price']
        
        is_suspicious = False
        suspicious_reason = ""
        is_overpriced = False
        
        if current_price > 0 and market_value > 0:
            # Overpriced: > 30% above market
            if current_price > (market_value * 1.3):
                is_overpriced = True
                suspicious_reason = "Listed 30%+ above AI market valuation."
            
            # Underpriced/Scam: < 40% of market
            elif current_price < (market_value * 0.4):
                is_suspicious = True
                suspicious_reason = "Price is suspiciously low compared to market value."
                
        # Scam Profile: low/no amenities + low price
        if amenities_count == 0 and current_price < 5000:
            is_suspicious = True
            suspicious_reason = "Incomplete profile/zero amenities with unusually low price."

        house['is_suspicious'] = is_suspicious
        house['suspicious_reason'] = suspicious_reason
        house['is_overpriced'] = is_overpriced
        house['market_predicted_price'] = market_value
        results.append(house)
                
    return jsonify({"listings": results})

if __name__ == '__main__':
    print("AffordHome AI Backend running on http://localhost:5000")
    app.run(port=5000, debug=True)