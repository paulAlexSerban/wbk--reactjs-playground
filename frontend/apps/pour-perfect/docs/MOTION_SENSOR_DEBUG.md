# Motion Sensor Debug Feature

## Changes Made

### ✅ Fixed: Automatic Pour Detection Now Works!

**Problem:** The automatic pour detection was not working because the `startListening()` function was never being called, even though it was defined in the `useDeviceMotion` hook.

**Solution:** Added two `useEffect` hooks to properly initialize automatic detection:

1. **Auto-request permission on mount**

    ```typescript
    useEffect(() => {
        if (isSupported && !permissionGranted) {
            requestPermission();
        }
    }, [isSupported, permissionGranted, requestPermission]);
    ```

2. **Enable automatic listening when permission granted**
    ```typescript
    useEffect(() => {
        if (permissionGranted && isSupported) {
            const cleanup = startListening();
            return cleanup;
        }
    }, [permissionGranted, isSupported, startListening]);
    ```

### 🐛 Added: Debug Modal

A comprehensive debug modal has been added to help you understand what's happening with the motion sensors in real-time.

#### Features:

1. **System Status**
    - Sensors Supported: Yes/No
    - Permission: Granted/Denied

2. **Current Motion Data** (real-time updates)
    - Alpha (Z-axis rotation): 0-360°
    - Beta (X-axis rotation): -180 to 180° (forward/backward tilt)
    - Gamma (Y-axis rotation): -90 to 90° (left/right tilt)

3. **Pour State**
    - Pouring: YES/NO
    - Tilt Angle: Current tilt
    - Velocity: Angular velocity in °/s
    - Duration: Current pour duration

4. **Auto-Detection Thresholds**
    - Start Velocity Required: 30 °/s
    - Start Angle Required: 35°
    - Start Duration: 150ms
    - Min Forward Tilt (Beta): 30°
    - Max Sideways (Gamma): ±45°

5. **Bottle-Like Motion Check** (real-time validation)
    - ✓/✗ Forward Tilt (Beta > 30°)
    - ✓/✗ Not Sideways (|Gamma| < 45°)
    - ✓/✗ Tilt Ratio (Beta/Gamma > 1.5)

6. **Instructions**
    - Step-by-step guide on how auto-detection works

## How to Use

### Access the Debug Modal

1. Navigate to **Free Practice** page
2. Click the **"Debug Sensors"** button below the pour visualization
3. Watch real-time sensor data update as you move your device

### Test Automatic Pour Detection

1. **Ensure Permission is Granted**
    - If not, click "Grant Motion Permission" in the debug modal
    - iOS 13+ will show a system permission prompt

2. **Trigger Auto-Start:**
    - Hold phone upright (portrait)
    - Tilt forward smoothly (like pouring from a bottle)
    - Watch the debug modal - all 3 "Bottle-Like Motion" checks should show ✓
    - Velocity should exceed 30 °/s
    - Tilt angle should exceed 35°
    - Hold for 150ms - pour starts automatically!

3. **Trigger Auto-Stop:**
    - Level the phone back to horizontal
    - Velocity drops below 8 °/s
    - Hold for 250ms - pour stops automatically!

### Manual vs Automatic

The app now supports BOTH modes simultaneously:

- **Automatic Detection**:
    - Tilt phone forward → auto-starts
    - Level phone → auto-stops
    - Works when permission is granted

- **Manual Controls**:
    - "Manual Start" button → starts immediately
    - "Stop Pour" button → stops immediately
    - Works even without sensors

## Understanding the Sensor Values

### Beta (Forward/Backward Tilt)

- **0°**: Phone flat on table
- **30-90°**: Forward tilt (pouring position)
- **Negative values**: Tilted backward

### Gamma (Left/Right Tilt)

- **0°**: Phone upright, no side tilt
- **Positive**: Tilted right
- **Negative**: Tilted left
- **Should stay near 0** for bottle-like pouring

### Velocity (Angular Speed)

- How fast the phone is rotating
- **> 30 °/s**: Fast enough to trigger pour start
- **< 8 °/s**: Slow enough to trigger pour stop
- Calculated from rate of change in orientation

### Tilt Angle

- Combined magnitude of Beta and Gamma
- Must exceed 35° to start pour

## Troubleshooting

### Pour Not Auto-Starting

Check the debug modal:

1. **Permission Granted?** → Must show "Granted"
2. **Beta > 30°?** → Tilt more forward
3. **Velocity > 30 °/s?** → Move smoother/faster
4. **Gamma < 45°?** → Keep phone more upright (less side tilt)
5. **Tilt Ratio > 1.5?** → Forward tilt should dominate sideways tilt

### Pour Not Auto-Stopping

- Level phone more completely
- Hold steady for 250ms
- Velocity must drop below 8 °/s

### Sensors Not Supported

- Some desktop browsers don't support device orientation
- Emulators typically don't have sensors
- Use manual mode instead

## Technical Details

### Detection Algorithm

```
AUTOMATIC POUR START:
1. Check: Beta (forward tilt) > 30°
2. Check: |Gamma (side tilt)| < 45°
3. Check: Beta/Gamma ratio > 1.5 (forward dominates)
4. Check: Velocity > 30 °/s
5. Check: Tilt angle > 35°
6. Hold ALL conditions for 150ms
→ Pour starts!

AUTOMATIC POUR STOP:
1. Check: Velocity < 8 °/s
2. Hold condition for 250ms
→ Pour stops!
```

### Why These Thresholds?

- **30° Beta minimum**: Ensures intentional forward tilt
- **45° Gamma maximum**: Prevents accidental sideways activation
- **1.5 tilt ratio**: Ensures bottle-like motion (forward > sideways)
- **30 °/s velocity**: Fast enough to be intentional, not accidental
- **150ms start delay**: Prevents false triggers from brief movements
- **250ms stop delay**: Allows slight wobbling without stopping pour

## Future Improvements

Consider adjusting thresholds in Settings if needed:

- Sensitivity slider for velocity threshold
- Angle threshold customization
- Delay timing preferences
- Per-user calibration for motion patterns

## Demo Video Ideas

1. Show debug modal while tilting phone
2. Highlight when all checks turn green
3. Show auto-start happening
4. Show auto-stop when leveling
5. Compare with manual mode
