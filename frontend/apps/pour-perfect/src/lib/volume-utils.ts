import type { VolumeUnit } from '@/types';

// Conversion constants
const ML_PER_OZ = 29.5735;

/**
 * Convert ounces to milliliters
 */
export function ozToMl(oz: number): number {
  return oz * ML_PER_OZ;
}

/**
 * Convert milliliters to ounces
 */
export function mlToOz(ml: number): number {
  return ml / ML_PER_OZ;
}

/**
 * Convert volume to the target unit (internal storage is always oz)
 */
export function convertVolume(oz: number, targetUnit: VolumeUnit): number {
  return targetUnit === 'ml' ? ozToMl(oz) : oz;
}

/**
 * Convert from display unit back to oz (for storage)
 */
export function toOz(value: number, fromUnit: VolumeUnit): number {
  return fromUnit === 'ml' ? mlToOz(value) : value;
}

/**
 * Format volume with appropriate decimal places
 */
export function formatVolume(oz: number, unit: VolumeUnit, decimals: number = 2): string {
  const value = convertVolume(oz, unit);
  const formatted = unit === 'ml' 
    ? Math.round(value) // ml typically shown as whole numbers
    : value.toFixed(decimals);
  return `${formatted}${unit}`;
}

/**
 * Get unit label
 */
export function getUnitLabel(unit: VolumeUnit): string {
  return unit === 'ml' ? 'ml' : 'oz';
}

/**
 * Get appropriate decimal places for unit
 */
export function getDecimals(unit: VolumeUnit): number {
  return unit === 'ml' ? 0 : 2;
}
