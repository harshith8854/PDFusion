import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private usedColors: Set<string> = new Set();

  generateBrightColor(): string {
    let color: string;
    do {
      color = this.getRandomBrightColor();
    //   color = this.getRandomSimilarColor('#ff7ae2');
    } while (this.usedColors.has(color));
    
    this.usedColors.add(color);
    return color;
  }

  private getRandomBrightColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Ensure the color is bright
    if (r + g + b < 383) { // The sum of RGB values should be high for brightness
      return this.getRandomBrightColor(); // Recursion to find a bright color
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  private getRandomSimilarColor(baseColor: string): string {
    // Convert base color to RGB
    const baseRgb = this.hexToRgb(baseColor);
    
    // Randomly adjust the RGB values
    const r = this.clamp(baseRgb.r + this.getRandomOffset(), 0, 255);
    const g = this.clamp(baseRgb.g + this.getRandomOffset(), 0, 255);
    const b = this.clamp(baseRgb.b + this.getRandomOffset(), 0, 255);

    return `rgb(${r}, ${g}, ${b})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  private getRandomOffset(): number {
    // Generate a random offset between -50 and +50 for RGB values
    return Math.floor(Math.random() * 101) - 50;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
