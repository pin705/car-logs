# CarLogs: Cộng Đồng Lỗi Xe 🚗

A community-driven platform for sharing and verifying car errors, symptoms, OBD-II codes, and solutions.

![CarLogs Homepage](https://github.com/user-attachments/assets/2897d08d-5ecd-4a35-9806-6264d1efa2bf)

## 🎯 Overview

CarLogs is a trusted and transparent platform that allows users to:
- **Contribute** car error reports with symptoms and OBD-II codes
- **Search** for common errors and verified solutions
- **Verify** solutions based on community experience
- **Save time and money** on diagnostics and repairs

## ✨ Features

### Phase 1 (Completed)
- ✅ **Modern UI/UX** - Navy Blue & Orange theme with vector SVG icons
- ✅ **Error Submission** - 3-step wizard form (car info → error details → additional info)
- ✅ **Error Listing** - Homepage with search, sorting, and filtering
- ✅ **Error Details** - Complete error information with solutions section
- ✅ **API Endpoints** - RESTful API for errors CRUD operations
- ✅ **PWA Ready** - Progressive Web App configuration
- ✅ **Mobile-First** - Responsive design with bottom navigation

### Phase 2 (Upcoming)
- ⏳ User authentication (registration/login)
- ⏳ Solution submission and upvoting
- ⏳ Reputation system with badges
- ⏳ Advanced search and filtering
- ⏳ Image/video upload support

### Phase 3 (Planned)
- 📋 Q&A community section
- 📋 Performance optimization
- 📋 Offline functionality
- 📋 Enhanced PWA features

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Nuxt 4 (Vue 3) | Server-side rendering and static generation |
| **Database** | MongoDB | Flexible document storage |
| **ODM** | Mongoose (via nuxt-mongoose) | Database modeling and validation |
| **Authentication** | nuxt-auth-utils | Secure user sessions |
| **PWA** | @vite-pwa/nuxt | Progressive Web App features |
| **Icons** | SVG (Line Art) | Vector graphics for sharp display |
| **Styling** | CSS Variables | Navy Blue (#1e3a8a) & Orange (#f97316) theme |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pin705/car-logs.git
   cd car-logs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure MongoDB connection:
   ```env
   MONGODB_URI=mongodb://localhost:27017/car-logs
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## 📁 Project Structure

```
car-logs/
├── app/
│   ├── assets/css/          # Global styles with CSS variables
│   ├── components/          # Reusable Vue components
│   ├── layouts/             # Layout components (default with navigation)
│   ├── pages/               # Application pages (auto-routed)
│   │   ├── index.vue        # Homepage with error listing
│   │   ├── submit.vue       # Error submission form
│   │   ├── errors/[id].vue  # Error detail page
│   │   ├── community.vue    # Community page (placeholder)
│   │   ├── diagnose.vue     # Diagnostic tools (placeholder)
│   │   └── profile.vue      # User profile (placeholder)
│   └── app.vue              # Root component
├── server/
│   ├── api/errors/          # API endpoints for errors
│   │   ├── index.get.ts     # List errors with search/sort
│   │   ├── index.post.ts    # Create new error
│   │   └── [id].get.ts      # Get error details
│   └── models/              # Mongoose schemas
│       ├── User.ts          # User model
│       ├── CarModel.ts      # Car model
│       └── ErrorPost.ts     # Error post model
├── public/                  # Static assets
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary (Navy Blue)**: `#1e3a8a` - Trust and reliability
- **Accent (Orange)**: `#f97316` - Action and emphasis
- **Background**: `#ffffff` - Clean and professional
- **Surface**: `#f8fafc` - Subtle elevation
- **Text**: `#0f172a` - High readability

### Typography
- **Font Family**: Inter, system fonts
- **Font Sizes**: 12px - 30px (responsive)
- **Line Height**: 1.6 (body text), 1.3 (headings)

### Icons
- **Style**: Line art / Outline
- **Format**: SVG (vector)
- **Size**: 16px, 20px, 24px, 32px, 64px

## 📊 Database Schema

### User
```typescript
{
  username: String,
  email: String,
  password: String,
  reputation: Number,
  badges: [String],
  savedCars: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### CarModel
```typescript
{
  make: String,
  model: String,
  year: Number,
  variant: String,
  createdAt: Date
}
```

### ErrorPost
```typescript
{
  title: String,
  description: String,
  symptoms: String,
  errorCode: String,
  car: ObjectId,
  author: ObjectId,
  images: [String],
  videos: [String],
  solutions: [{
    author: ObjectId,
    description: String,
    cost: Number,
    timeRequired: String,
    upvotes: Number,
    upvotedBy: [ObjectId],
    verified: Boolean,
    images: [String],
    createdAt: Date
  }],
  views: Number,
  popularity: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Reference

### List Errors
```http
GET /api/errors?sort=popularity&search=engine
```

**Query Parameters:**
- `sort`: `popularity`, `recent`, `views`
- `search`: Search term for title, symptoms, or error code
- `make`: Filter by car make
- `model`: Filter by car model

### Get Error Details
```http
GET /api/errors/:id
```

**Response:** Error object with populated car, author, and solutions

### Create Error
```http
POST /api/errors
Content-Type: application/json

{
  "title": "Engine misfiring at high RPM",
  "symptoms": "Car jerks when accelerating...",
  "errorCode": "P0300",
  "car": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "variant": "2.5Q"
  },
  "description": "Additional details...",
  "images": [],
  "videos": []
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons inspired by Heroicons
- Design inspired by modern automotive platforms
- Community-driven approach inspired by Stack Overflow

## 📞 Contact

- **Project Owner**: [@pin705](https://github.com/pin705)
- **Issues**: [GitHub Issues](https://github.com/pin705/car-logs/issues)

---

**Built with ❤️ for the car community**
