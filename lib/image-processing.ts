/**
 * Image processing utilities for post-processing
 */

/**
 * Remove background from image (make white/light areas transparent or white)
 */
export async function removeBackground(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageBlob);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove near-white backgrounds
      const threshold = 240; // Adjust this to control sensitivity
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If pixel is close to white, make it pure white
        if (r > threshold && g > threshold && b > threshold) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob || imageBlob);
      }, 'image/jpeg', 0.95);
    };
    
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Increase image contrast
 */
export async function increaseContrast(imageBlob: Blob, amount: number = 1.5): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageBlob);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const factor = (259 * (amount * 100 + 255)) / (255 * (259 - amount * 100));

      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
      }

      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob || imageBlob);
      }, 'image/jpeg', 0.95);
    };
    
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Sharpen image
 */
export async function sharpenImage(imageBlob: Blob, amount: number = 1): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageBlob);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      // Sharpening kernel
      const kernel = [
        0, -amount, 0,
        -amount, 1 + 4 * amount, -amount,
        0, -amount, 0
      ];

      const output = new Uint8ClampedArray(data.length);

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
                const kernelIdx = (ky + 1) * 3 + (kx + 1);
                sum += data[pixelIdx] * kernel[kernelIdx];
              }
            }
            output[idx + c] = Math.max(0, Math.min(255, sum));
          }
          output[idx + 3] = data[idx + 3]; // Alpha channel
        }
      }

      // Copy edges
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          output[i] = data[i];
          output[i + 1] = data[i + 1];
          output[i + 2] = data[i + 2];
          output[i + 3] = data[i + 3];
        }
      }

      const newImageData = new ImageData(output, width, height);
      ctx.putImageData(newImageData, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob || imageBlob);
      }, 'image/jpeg', 0.95);
    };
    
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Auto-adjust brightness and contrast
 */
export async function autoAdjust(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageBlob);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate histogram
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        min = Math.min(min, gray);
        max = Math.max(max, gray);
      }

      // Normalize
      const range = max - min;
      if (range > 0) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = ((data[i] - min) / range) * 255;
          data[i + 1] = ((data[i + 1] - min) / range) * 255;
          data[i + 2] = ((data[i + 2] - min) / range) * 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob || imageBlob);
      }, 'image/jpeg', 0.95);
    };
    
    reader.readAsDataURL(imageBlob);
  });
}

