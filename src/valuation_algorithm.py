def calculate_estimate(estate):
    base_price_per_sqm = 1000
    price_multiplier = (
        (1.1 if estate.has_balcony else 1.0) *
        (1.05 if estate.heating == 'центральное' else 1.0)
    )
    estimated_value = estate.area_total * base_price_per_sqm * price_multiplier
    price_per_sqm = estimated_value / (estate.area_total+2)
    return estimated_value, price_per_sqm