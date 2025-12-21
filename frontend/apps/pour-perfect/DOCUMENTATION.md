# Pour Perfect - Bartending Free Pouring Practice App

## Overview

**Pour Perfect** (originally named "Jigger Free") is a mobile-first Progressive Web App (PWA) designed to help aspiring and professional bartenders master the art of free pouring using device motion sensors. The app provides real-time feedback, calibration tools, practice modes, challenges, and detailed statistics tracking to improve pouring accuracy.

## Table of Contents

1. [Key Features](#key-features)
2. [Technical Architecture](#technical-architecture)
3. [Getting Started](#getting-started)
4. [User Guide](#user-guide)
5. [Implementation Analysis](#implementation-analysis)
6. [Development Guide](#development-guide)
7. [Recommendations](#recommendations)

---

## Key Features

### 🎯 Core Functionality

- **Device Motion Detection**: Uses DeviceOrientation API to detect phone tilting and pouring motions
- **Real-time Pour Tracking**: Estimates poured volume based on tilt duration and calibrated pour rate
- **Multiple Practice Modes**: Free practice, recipe-based practice, and timed challenges
- **Haptic Feedback**: Provides tactile responses for pour start, pour end, and accuracy feedback
- **Local Data Storage**: Uses IndexedDB for offline-first data persistence

### 📱 Practice Modes

#### Free Practice

- Select target volumes (1oz, 1.5oz, 2oz)
- Real-time visual feedback with circular progress indicator
- Accuracy scoring after each pour
- Automatic session logging

#### Recipe Practice

- Pre-loaded classic cocktail recipes
- Sequential ingredient pouring
- Multi-ingredient accuracy tracking
- Total session time recording

#### Challenges

- Progressive difficulty tiers (Beginner → Master)
- Time-limited accuracy challenges
- Unlockable challenges based on performance
- Personal best tracking

### ⚙️ Settings & Customization

- **Handedness**: Left or right-handed configuration
- **Volume Units**: Toggle between oz and ml
- **Counting Method**: Different counting techniques for timing
- **Spout Types**: 15+ spout types with different flow rate multipliers
- **Haptic Controls**: Enable/disable vibration feedback
- **Visual Options**: High contrast mode

---

## Technical Architecture

### Technology Stack

```json
{
    "framework": "React 18",
    "language": "TypeScript",
    "build": "Vite",
    "ui": "shadcn/ui + Radix UI",
    "styling": "Tailwind CSS",
    "routing": "React Router v6",
    "state": "React Query + React Hooks",
    "database": "IndexedDB",
    "sensors": "DeviceOrientation API"
}
```

### Project Structure

```
pour-perfect/
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx          # Main app layout wrapper
│   │   ├── BottomNav.tsx          # Bottom navigation bar
│   │   ├── PageHeader.tsx         # Reusable page header
│   │   ├── NavLink.tsx            # Active route-aware link
│   │   └── ui/                    # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx              # Home/menu page
│   │   ├── CalibratePage.tsx      # Calibration wizard
│   │   ├── FreePracticePage.tsx   # Free pouring practice
│   │   ├── RecipePracticePage.tsx # Recipe-based practice
│   │   ├── ChallengePage.tsx      # Challenge mode
│   │   ├── SettingsPage.tsx       # App settings
│   │   ├── StatsPage.tsx          # Statistics dashboard
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   ├── useDeviceMotion.ts     # Motion sensor integration
│   │   ├── useAppState.ts         # Global app state
│   │   ├── useHaptics.ts          # Haptic feedback patterns
│   │   ├── useBattery.ts          # Battery status tracking
│   │   ├── use-mobile.tsx         # Mobile detection
│   │   └── use-toast.ts           # Toast notifications
│   ├── lib/
│   │   ├── db.ts                  # IndexedDB wrapper
│   │   ├── seed-data.ts           # Initial recipes & challenges
│   │   ├── volume-utils.ts        # Volume conversion utilities
│   │   ├── confetti.ts            # Celebration effects
│   │   └── utils.ts               # General utilities
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # App root component
│   └── main.tsx                   # Entry point
├── public/                        # Static assets
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies
```

### Database Schema

The app uses **IndexedDB** with the following stores:

#### 1. `calibration_profiles`

```typescript
{
    id: string;
    spout_id: string;
    device_id: string;
    calibration_factor: number; // oz per second
    baseline_tilt: {
        (alpha, beta, gamma);
    }
    grip_offset: {
        (alpha, beta, gamma);
    }
    timestamp: number;
    handedness: 'left' | 'right';
}
```

#### 2. `pour_sessions`

```typescript
{
  id: string;
  timestamp: number;
  volume_actual: number;
  volume_target: number;
  accuracy_percentage: number;
  pour_duration: number;
  ingredient_name: string;
  recipe_name?: string;
  spout_used: string;
  handedness: 'left' | 'right';
  counting_method: CountingMethod;
}
```

#### 3. `recipes`

```typescript
{
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  total_time_target: number;
  description?: string;
}
```

#### 4. `challenges`

```typescript
{
  id: string;
  name: string;
  description: string;
  tier: Difficulty;
  target_volume: number;
  time_limit: number;
  accuracy_threshold: number;
  unlock_requirement: number;
  pours_required?: number;
}
```

#### 5. `challenge_progress`

```typescript
{
  challenge_id: string;
  unlocked: boolean;
  personal_best_time?: number;
  personal_best_accuracy?: number;
  attempts: number;
  completions: number;
}
```

#### 6. `preferences`

```typescript
{
  handedness: 'left' | 'right';
  counting_method: '1-and-a-2' | 'beats' | 'seconds';
  spout_id: string;
  current_profile_id?: string;
  high_contrast: boolean;
  haptic_enabled: boolean;
  volume_unit: 'oz' | 'ml';
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern mobile browser with DeviceOrientation API support
- Mobile device with accelerometer/gyroscope (for full functionality)

### Installation

```bash
# Navigate to the app directory
cd frontend/apps/pour-perfect

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod
```

### Environment Configuration

The app uses Vite environment variables:

```typescript
// vite.config.ts
const DOMAIN_PATH = command === 'serve' ? '/' : `/wbk--reactjs-playground/apps/pour-perfect`;
```

---

## User Guide

### First Time Setup

#### 1. **Grant Motion Sensor Permission**

- On iOS 13+, the app will request permission to access motion sensors
- Tap "Enable Sensors" when prompted
- This is required for automatic pour detection

#### 2. **Complete Calibration**

The calibration process establishes your device's baseline and pour characteristics:

**Step 1: Baseline Tilt (3s)**

- Place phone flat on a table
- Hold steady while app captures baseline orientation

**Step 2: Grip Offset (3s)**

- Hold phone like a bottle (natural grip position)
- Maintains steady position

**Step 3-5: Calibration Pours (5s each)**

- Pour exactly 1oz of water three times
- App calculates your personal calibration factor
- Uses consistent pouring motion

> **Important**: Calibration greatly improves accuracy. Complete it before practicing!

### Using Free Practice Mode

1. Navigate to **Practice > Free Practice** from home
2. Select target volume (1oz, 1.5oz, or 2oz)
3. Hold phone like a bottle
4. Tilt forward to start pouring (automatic detection)
5. Level the phone to stop
6. Review accuracy feedback

**Visual Feedback:**

- **Green** (90%+): Excellent pour
- **Yellow** (80-89%): Good pour
- **Red** (<80%): Needs improvement

### Recipe Practice Mode

1. Navigate to **Practice > Recipe Practice**
2. Browse available recipes (Margarita, Old Fashioned, Mojito, etc.)
3. Select a recipe and tap "Start Practice"
4. Pour each ingredient sequentially
5. App tracks timing and accuracy for each ingredient
6. View overall session results at the end

**Recipe Difficulty Levels:**

- **Beginner**: Simple 2-3 ingredient cocktails
- **Intermediate**: Complex 3-4 ingredient recipes
- **Advanced**: Challenging multi-ingredient recipes

### Challenge Mode

1. Navigate to **Challenges** from home
2. View available challenges (locked/unlocked)
3. Tap an unlocked challenge to view details
4. Tap "Start Challenge" to begin
5. Complete required pours within time limit
6. Achieve accuracy threshold to unlock next tier

**Challenge Tiers:**

- Beginner → Intermediate → Advanced → Expert → Master
- Progressive unlock system based on performance
- Personal best tracking for each challenge

### Statistics & Analytics

Navigate to **Statistics** to view:

- Total practice sessions
- 7-day and 30-day accuracy averages
- Overall accuracy trend
- Per-ingredient performance breakdown
- Identified weaknesses
- Recent session history

**Filters:**

- Time period (7 days, 30 days, all time)
- Specific ingredients
- Practice type

### Settings Configuration

Access **Settings** to customize:

**User Preferences:**

- Handedness (left/right)
- Counting method (different timing techniques)
- Volume unit (oz/ml)

**Device Configuration:**

- Spout type (affects flow rate calibration)
- Active calibration profile management

**Appearance:**

- High contrast mode

**System:**

- Haptic feedback toggle

---

## Implementation Analysis

### ✅ Strengths

1. **Robust Motion Detection**
    - Sophisticated pour detection algorithm with bottle-like motion validation
    - Filters out non-pouring movements (sideways tilts, shakes)
    - Debouncing for pour start/end to prevent false triggers
2. **Well-Architected Code**
    - Clean separation of concerns (hooks, components, utilities)
    - TypeScript for type safety
    - Reusable components with consistent patterns

3. **Excellent User Experience**
    - Mobile-first design with touch-optimized UI
    - Real-time visual feedback
    - Haptic feedback for tactile confirmation
    - Progressive disclosure (calibration → practice → challenges)

4. **Offline-First Architecture**
    - IndexedDB for local data persistence
    - No backend dependencies
    - Works completely offline after initial load

5. **Comprehensive Feature Set**
    - Multiple practice modes
    - Detailed statistics
    - Progressive challenge system
    - Extensive customization options

### ⚠️ Areas for Improvement

1. **Motion Detection Calibration**

    ```typescript
    // Current implementation in useDeviceMotion.ts
    const POUR_START_VELOCITY = 30; // deg/sec
    const POUR_START_ANGLE = 35; // degrees

    // Issue: Fixed thresholds may not work for all devices/users
    // Recommendation: Make thresholds configurable or adaptive
    ```

2. **Error Handling**
    - Limited error recovery for failed sensor access
    - No graceful degradation for unsupported browsers
    - Missing error boundaries for component crashes

3. **Testing Coverage**
    - No unit tests for critical hooks (useDeviceMotion)
    - No integration tests for pour detection logic
    - No E2E tests for user flows

4. **Performance Optimizations**

    ```typescript
    // In useDeviceMotion.ts - runs on every motion update
    useEffect(() => {
        if (!state.pourState.isPouring) return;
        // This could be throttled for better performance
        animationFrameRef.current = requestAnimationFrame(updateDuration);
    }, [state.pourState.isPouring]);
    ```

5. **Accessibility**
    - Limited keyboard navigation support
    - No screen reader optimizations
    - Missing ARIA labels on interactive elements

6. **Data Export**
    - No ability to export statistics
    - No data backup/restore functionality
    - No cross-device sync

### 🔍 Code Quality Assessment

**Positive Patterns:**

- ✅ Custom hooks for reusable logic
- ✅ TypeScript interfaces for type safety
- ✅ Consistent naming conventions
- ✅ Modular component structure
- ✅ Proper use of React best practices (useCallback, useMemo, etc.)

**Code Smells:**

```typescript
// 1. Magic numbers should be constants
const calibrationFactor = 0.5; // Should be: CALIBRATION_FACTOR_DEFAULT

// 2. Long component files (RecipePracticePage: 402 lines)
// Recommendation: Extract sub-components

// 3. Duplicate logic across pages
// Example: Accuracy color calculation repeated in multiple files
// Should be extracted to utility function
```

### 🔒 Security Considerations

1. **Local Storage Only**: No sensitive data transmission
2. **No Authentication**: App is entirely client-side
3. **Device Fingerprinting**: Uses `navigator.userAgent` for device ID (privacy concern)

---

## Development Guide

### Adding a New Recipe

Edit `src/lib/seed-data.ts`:

```typescript
export const SEED_RECIPES: Recipe[] = [
    // ... existing recipes
    {
        id: 'my-cocktail',
        name: 'My Cocktail',
        description: 'Description here',
        difficulty: 'intermediate',
        total_time_target: 15,
        ingredients: [
            { name: 'Spirit', volume_oz: 2, sugar_density: 0 },
            { name: 'Mixer', volume_oz: 1, sugar_density: 30 },
        ],
    },
];
```

### Adding a New Challenge

Edit `src/lib/seed-data.ts`:

```typescript
export const SEED_CHALLENGES: Challenge[] = [
    // ... existing challenges
    {
        id: 'my-challenge',
        name: 'Speed Challenge',
        description: 'Pour 2oz in under 3 seconds',
        tier: 'advanced',
        target_volume: 2,
        time_limit: 3,
        accuracy_threshold: 85,
        unlock_requirement: 90, // % accuracy needed to unlock
        pours_required: 1,
    },
];
```

### Modifying Motion Detection Thresholds

Edit `src/hooks/useDeviceMotion.ts`:

```typescript
// Adjust these constants for sensitivity
const POUR_START_VELOCITY = 30; // Increase = less sensitive
const POUR_START_ANGLE = 35; // Increase = require more tilt
const POUR_START_DURATION = 150; // Increase = slower response
const POUR_END_VELOCITY = 8; // Decrease = more sensitive
const POUR_END_DURATION = 250; // Increase = delay before stopping
```

### Adding a New Spout Type

Edit `src/lib/seed-data.ts`:

```typescript
export const SPOUT_TYPES: SpoutType[] = [
    // ... existing spouts
    {
        id: 'custom-spout',
        name: 'Custom Spout',
        flow_rate_multiplier: 1.0,
        description: 'Your custom spout',
    },
];
```

### Custom Haptic Pattern

Edit `src/hooks/useHaptics.ts`:

```typescript
export function useHaptics() {
    // ... existing patterns

    const myCustomPattern = useCallback(() => {
        vibrate([100, 50, 100]); // [vibrate, pause, vibrate] in ms
    }, [vibrate]);

    return { /* ... */ myCustomPattern };
}
```

---

## Recommendations

### High Priority

1. **Add Unit Tests**

    ```bash
    npm install -D vitest @testing-library/react @testing-library/jest-dom
    ```

    Focus on:
    - `useDeviceMotion` hook logic
    - Volume conversion utilities
    - Pour accuracy calculations

2. **Implement Error Boundaries**

    ```tsx
    // src/components/ErrorBoundary.tsx
    class ErrorBoundary extends React.Component {
        // Catch component errors gracefully
    }
    ```

3. **Add Progressive Web App Features**
    - Service Worker for offline caching
    - Add to Home Screen prompt
    - Web App Manifest (already have `robots.txt`)

4. **Improve Calibration Process**
    - Add visual feedback during calibration
    - Allow re-calibration for specific steps
    - Validate calibration quality

### Medium Priority

5. **Data Export/Import**

    ```typescript
    // Add to db.ts
    export async function exportData() {
        const data = {
            sessions: await sessionsDB.getAll(),
            profiles: await calibrationDB.getAll(),
            preferences: await preferencesDB.get(),
        };
        return JSON.stringify(data);
    }
    ```

6. **Accessibility Improvements**
    - Add keyboard navigation
    - ARIA labels for all interactive elements
    - Screen reader announcements for pour feedback

7. **Performance Optimization**
    - Throttle motion event handlers
    - Lazy load chart libraries
    - Virtual scrolling for long session lists

8. **Enhanced Analytics**
    - Accuracy trends over time (charts)
    - Heat map for best/worst times
    - Comparative statistics

### Low Priority

9. **Social Features**
    - Leaderboards (would require backend)
    - Share achievements
    - Compare with friends

10. **Additional Practice Modes**
    - Speed pouring mode
    - Blind pouring (no visual feedback)
    - Accuracy streaks

---

## Browser Compatibility

### Supported Browsers

✅ **Mobile:**

- iOS Safari 13+
- Chrome Android 80+
- Samsung Internet 12+

✅ **Desktop (limited functionality):**

- Chrome 80+
- Edge 80+
- Firefox 72+
- Safari 13+

⚠️ **Motion sensors only work on mobile devices**

### Feature Detection

The app implements graceful degradation:

```typescript
// Checks for sensor support
if (!('DeviceOrientationEvent' in window)) {
    // Shows fallback message
    // Offers manual timing mode
}
```

---

## Performance Metrics

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 85+
- Best Practices: 90+
- SEO: 90+

### Bundle Size

- Initial: ~200KB (with code splitting)
- Vendors: ~150KB (React, React Router, etc.)
- UI Components: ~80KB (Radix UI components)

---

## Troubleshooting

### Common Issues

**1. Motion sensors not working**

- Ensure HTTPS (required for sensor APIs)
- Grant permission when prompted
- Check device has accelerometer/gyroscope
- Try refreshing the page

**2. Calibration seems inaccurate**

- Redo calibration in consistent environment
- Use same grip position each time
- Pour at consistent speed during calibration
- Use actual measured water for calibration

**3. App not detecting pours**

- Check calibration is complete
- Ensure sufficient tilt angle (35°+)
- Hold steady before/after pour
- Check motion permission is granted

**4. Poor accuracy scores**

- Re-calibrate device
- Check spout type setting matches actual spout
- Practice consistent pouring motion
- Adjust counting method in settings

---

## Contributing

This app is part of a larger React playground workspace. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make changes following existing code patterns
4. Test on mobile device
5. Submit pull request

---

## License

Part of the wbk--reactjs-playground project. See root LICENSE file.

---

## Credits

- **Framework**: React + TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Build Tool**: Vite

---

## Contact & Support

For issues specific to this app, please file an issue in the main repository with the `pour-perfect` label.

---

## Changelog

### v0.0.0 (Current)

- Initial implementation
- Core pour detection
- Calibration system
- Free practice mode
- Recipe practice mode
- Challenge system
- Statistics tracking
- Settings management
