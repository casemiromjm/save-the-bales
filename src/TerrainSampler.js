export class TerrainSampler {
  constructor(terrainSize, heightFactor, noiseOffsetX, noiseOffsetY) {
    this.terrainSize = terrainSize;
    this.terrainHalfSize = terrainSize / 2;
    this.heightFactor = heightFactor;
    this.noiseOffsetX = noiseOffsetX;
    this.noiseOffsetY = noiseOffsetY;
    
    // Load road mask for accurate CPU height sampling: this solution is AI based
    this.roadMaskData = null;
    let img = new Image();
    img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        this.roadMaskData = ctx.getImageData(0, 0, img.width, img.height);
    };
    img.src = "src/textures/terrain/roadMask6.png";
  }

  fract(x) {
    return x - Math.floor(x);
  }

  mix(a, b, t) {
    return a * (1 - t) + b * t;
  }
  
  terrainRandom(ix, iy) {
    return this.fract( Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453123);
  }

  terrainNoise(x, y) {
    let ix = Math.floor(x);
    let iy = Math.floor(y);

    let fx = x - ix;
    let fy = y - iy;

    let a = this.terrainRandom(ix, iy);
    let b = this.terrainRandom(ix + 1, iy);
    let c = this.terrainRandom(ix, iy + 1);
    let d = this.terrainRandom(ix + 1, iy + 1);

    let ux = fx * fx * (3.0 - 2.0 * fx);
    let uy = fy * fy * (3.0 - 2.0 * fy);

    return this.mix(a, b, ux) +
      (c - a) * uy * (1.0 - ux) +
      (d - b) * ux * uy;
  }

  worldToUV(x, z) {
    return { u: (x + this.terrainHalfSize) / this.terrainSize, v: (z + this.terrainHalfSize) / this.terrainSize };
  }
  isOutsideTerrain(x, z) {
    let uv = this.worldToUV(x, z);
    return uv.u < 0 || uv.u > 1 || uv.v < 0 || uv.v > 1;
  }

  isRoadAt(x, z) {
    if (this.isOutsideTerrain(x, z) || !this.roadMaskData) {
      return false;
    }

    let uv = this.worldToUV(x, z);
    let px = Math.floor(uv.u * (this.roadMaskData.width - 1));
    let py = Math.floor(uv.v * (this.roadMaskData.height - 1));
    
    px = Math.max(0, Math.min(px, this.roadMaskData.width - 1));
    py = Math.max(0, Math.min(py, this.roadMaskData.height - 1));
    
    let index = (py * this.roadMaskData.width + px) * 4;
    let maskValue = this.roadMaskData.data[index] / 255.0; // Red channel
    
    // threshold, if mask is greater than 0.2 it is safe enough to be considered a path
    return maskValue > 0.2; 
  }

  getHeightAt(x, z) {
    if (this.isOutsideTerrain(x, z)) {
      return 0;
    }

    let uv = this.worldToUV(x, z);

    let hillFrequency = 8.0;

    let shiftedU = uv.u + this.noiseOffsetX;
    let shiftedV = uv.v + this.noiseOffsetY;
    let generatedNoise = this.terrainNoise( shiftedU * hillFrequency, shiftedV * hillFrequency);
    
    let baseHeight = generatedNoise * this.heightFactor;
    
    // Apply road mask flattening to match the vertex shader
    let maskValue = 0.0;
    if (this.roadMaskData) {
        let px = Math.floor(uv.u * (this.roadMaskData.width - 1));
        let py = Math.floor(uv.v * (this.roadMaskData.height - 1));
        
        // Ensure within bounds
        px = Math.max(0, Math.min(px, this.roadMaskData.width - 1));
        py = Math.max(0, Math.min(py, this.roadMaskData.height - 1));
        
        let index = (py * this.roadMaskData.width + px) * 4;
        maskValue = this.roadMaskData.data[index] / 255.0; // Red channel
    }

    return this.mix(baseHeight, 0.0, maskValue);
  }
}