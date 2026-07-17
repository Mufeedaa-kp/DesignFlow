# Database Schema

## User (Week 1)

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| fullName | String | Required |
| email | String | Required, unique |
| password | String | Required, hashed with bcrypt |
| phone | String | Optional |
| role | String (enum) | admin / designer / client |
| status | String (enum) | active / inactive / blocked, default: active |
| profileImage | String | URL, default: "" |
| createdAt | Date | Auto (timestamps) |
| updatedAt | Date | Auto (timestamps) |

Relationships: none yet. Will be added in Week 2 (Project references User via clientId, designerId).