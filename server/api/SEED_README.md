# Database Seeding

## Overview

This directory contains an API endpoint for seeding the database with sample data including:
- An admin user
- Common Vietnamese car models (Toyota, Honda, Mazda, Hyundai, Kia, Mitsubishi, VinFast)
- Common car errors with Vietnamese descriptions

## Usage

To seed the database with sample data, make a POST request to the `/api/seed` endpoint:

```bash
curl -X POST http://localhost:3000/api/seed
```

Or use tools like Postman, Thunder Client, or any HTTP client.

## What Gets Seeded

### Admin User
- **Username**: admin
- **Email**: admin@carlogs.vn
- **Password**: admin123 (for demo purposes)
- **Reputation**: 1000
- **Badges**: All badges (beginner, contributor, expert, trusted, master)

### Car Models (25 total)
Popular car models in the Vietnamese market including:
- **Toyota**: Vios, Corolla Cross, Camry, Fortuner
- **Honda**: City, Civic, CR-V, Accord
- **Mazda**: Mazda3, CX-5, CX-30
- **Hyundai**: Accent, Elantra, Tucson, Santa Fe
- **Kia**: Seltos, Sonet, Sorento
- **Mitsubishi**: Xpander, Attrage
- **VinFast**: VF 8, Fadil

### Error Posts (10 total)
Common car errors with Vietnamese descriptions:
1. Engine misfiring during acceleration (P0300)
2. CVT transmission jerking on startup
3. Air conditioning not cooling at noon
4. ABS brake warning light (C1201)
5. Rattling noise over speed bumps
6. Check engine light - oxygen sensor (P0420)
7. Vibration at 100-110 km/h
8. Abnormal fuel consumption (P0171)
9. Hard start in the morning
10. Blind spot warning system not working

## API Response

Success response:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "adminUser": "admin",
    "carModels": 25,
    "errorPosts": 10
  }
}
```

## Notes

- The seed script is **idempotent** - it checks for existing data and only creates what doesn't exist
- Running the endpoint multiple times won't create duplicate data
- The admin user is only created if it doesn't already exist
- Car models are matched by make, model, year, and variant to avoid duplicates
- Error posts are matched by title and car to avoid duplicates
