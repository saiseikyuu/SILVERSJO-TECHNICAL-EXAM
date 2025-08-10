#!/bin/bash

# Health check
curl http://localhost:4000/health
echo -e "\n"

# Public listings query
curl "http://localhost:4000/api/listings?q=makati&minPrice=1000000&status=For%20Sale"
echo -e "\n"

# Get single listing (replace with real ID)
curl http://localhost:4000/api/listings/your-listing-id
echo -e "\n"

# Protected create listing (replace <token>)
curl -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Condo",
    "description": "Test description",
    "location": "Taguig",
    "price": 4200000,
    "property_type": "Apartment",
    "status": "For Sale",
    "images": ["https://example.com/test.jpg"]
  }'
echo -e "\n"
