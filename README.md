# Perception Test MVP - Driving Licence Assessment

A React-based web application for measuring visual perception, reaction time, and decision-making under time pressure. This is the first of three cognitive tests designed for driving licence applicants.

## 🎯 Features

- **Perception Test**: Moving car that becomes invisible, requiring users to stop before collision
- **Accurate Timing**: Uses `performance.now()` for high-precision timing measurements
- **Auto-save Results**: Automatically saves test attempts to Supabase
- **Dashboard**: View all attempts with filtering and CSV export
- **Responsive Design**: Works on desktop and mobile devices
- **No Authentication Required**: Guest mode for quick testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for data storage)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd Road_traffic_Accident_Test
   npm install
   ```

2. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase_schema.sql` in the Supabase SQL Editor
   - Get your project URL and anon key from Project Settings > API

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Supabase Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_schema.sql`
4. Run the SQL to create the `perception_attempts` table and policies

The schema includes:
- Table for storing test attempts
- Row Level Security (RLS) policies for public access
- Indexes for optimal query performance

## 🏗️ Project Structure

```
Road_traffic_Accident_Test/
├── src/
│   ├── components/
│   │   ├── CarIcon.jsx          # SVG car component
│   │   ├── TestCanvas.jsx       # Main test animation and logic
│   │   ├── ResultCard.jsx       # Test results display
│   │   └── HowItWorksModal.jsx  # Instructions modal
│   ├── pages/
│   │   ├── Home.jsx             # Main test page
│   │   └── Dashboard.jsx        # Analytics dashboard
│   ├── hooks/
│   │   └── useAnimationLoop.js  # Custom hooks for animation and utilities
│   ├── lib/
│   │   └── supabaseClient.js    # Supabase configuration and helpers
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles with Tailwind
├── supabase_schema.sql          # Database schema
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json                  # Vercel deployment config
```

## 🧪 How the Test Works

1. **Start**: User clicks "Start Test" and sees a 3-second countdown
2. **Visible Phase**: Car moves for 5 seconds (configurable)
3. **Hidden Phase**: Car becomes invisible but continues moving
4. **Stop Action**: User must press STOP button or spacebar before collision
5. **Results**: Shows outcome, reaction time, and distance to obstacle
6. **Auto-save**: Results are automatically saved to Supabase

### Test Metrics

- **Reaction Latency**: Time from car hiding to stop button press
- **Distance to Obstacle**: How far the car was from collision point
- **Outcome**: Success (stopped before collision) or Fail (collision)
- **Position at Stop**: Car's pixel position when stopped

## 🎨 Configuration

Test parameters can be adjusted in `src/components/TestCanvas.jsx`:

```javascript
const CONFIG = {
  VISIBLE_DURATION: 5000,  // 5 seconds visible
  SPEED: 100,              // pixels per second
  OBSTACLE_X: 700,         // obstacle position
  CAR_START_X: 50          // starting position
};
```

## 📊 Dashboard Features

- **Statistics**: Total attempts, success rate, average reaction time
- **Filtering**: View all, success, or failed attempts
- **Export**: Download attempts as CSV
- **Real-time**: Refresh to see latest results

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   Or push to GitHub and connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
   - Deploy

### Environment Variables on Vercel

Add these in your Vercel project settings:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

## 🧰 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security & Privacy

- **No Authentication**: Currently runs in guest mode
- **Row Level Security**: Supabase RLS policies protect data
- **Minimal Data**: Only test metrics and device info stored
- **No PII**: No personal information collected

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Supabase Connection Issues

If you see "Supabase not configured" warnings:
1. Check that `.env` file exists with correct credentials
2. Verify Supabase URL and key are correct
3. Ensure the table schema was created successfully

### Animation Performance

If the test runs slowly:
1. Close other browser tabs
2. Test on a different device
3. Check browser console for errors

## 🛠️ Development

### Adding New Test Variants

To create different difficulty levels, modify the CONFIG object:

```javascript
const EASY_CONFIG = {
  VISIBLE_DURATION: 7000,
  SPEED: 80
};

const HARD_CONFIG = {
  VISIBLE_DURATION: 3000,
  SPEED: 150
};
```

### Customizing the Car

Edit `src/components/CarIcon.jsx` to change the car's appearance.

## 📄 License

MIT License - Feel free to use for educational or commercial purposes.

## 🤝 Contributing

This is an MVP. Future enhancements could include:
- Multiple difficulty levels
- User authentication
- More detailed analytics
- Mobile app version
- Integration with other cognitive tests

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with:** React, Vite, TailwindCSS, Supabase, Vercel

**Last Updated:** November 30, 2025
