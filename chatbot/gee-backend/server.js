const ee = require('@google/earthengine');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ─── GEE Initialization ──────────────────────────────────────────────────────

async function initializeGEE() {
  return new Promise((resolve, reject) => {
    try {
      const privateKey = require('./credentials/key.json');
      console.log('Authenticating with Google Earth Engine...');

      ee.data.authenticateViaPrivateKey(
        privateKey,
        () => {
          ee.data.setProject('alpha-earth-493408');

          ee.initialize(null, null, () => {
            console.log('✅ Earth Engine Initialized Successfully');
            resolve();
          }, (err) => {
            console.error('❌ Earth Engine initialization failed:', err);
            reject(err);
          }); 
        },
        (err) => {
          console.error('❌ Authentication failed:', err);
          reject(err);
        }
      );
    } catch (err) {
      console.error('❌ Error loading key.json. Ensure it is in gee-backend/credentials/key.json');
      reject(err);
    }
  });
}

// ─── Cache ───────────────────────────────────────────────────────────────────

const mapIdCache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// ─── Composite Builder ──────────────────────────────────────────────────────

/**
 * Simple, clean composite. No sharpening, no masks, no enhancement.
 * Just median + scale. Mimics what Google Earth shows for historical data.
 */
function getComposite(yearStr) {
  const year = parseInt(yearStr);
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  let collection;
  let attribution;
  let visParams;

  if (year < 2016) {
    // Landsat 8 TOA
    collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
      .filterDate(startDate, endDate);
    
    const composite = collection.median();
    const rgb = composite.select(['B4', 'B3', 'B2']);

    visParams = {
      bands: ['B4', 'B3', 'B2'],
      min: 0.02,
      max: 0.3,
      gamma: 1.4,
    };
    attribution = 'Google Earth Engine | Landsat 8 (30m)';

    return { composite: rgb, visParams, attribution };
  } else {
    // Sentinel-2 Harmonized
    collection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
      .filterDate(startDate, endDate);

    const composite = collection.median();
    
    // Smooth the 10m pixels for HD-like appearance at high zoom
    const rgb = composite.select(['B4', 'B3', 'B2']).divide(10000).resample('bicubic');

    // Subtle edge refinement (Sharpening)
    const kernel = ee.Kernel.fixed(3, 3, [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ]);
    const sharpened = rgb.convolve(kernel);

    visParams = {
      bands: ['B4', 'B3', 'B2'],
      min: 0.04,
      max: 0.32,
      gamma: 1.5,
    };
    attribution = 'Google Earth Engine | Sentinel-2 (10m)';

    return { composite: sharpened, visParams, attribution };
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/api/gee/tiles', async (req, res) => {
  const year = req.query.year || '2023';

  // Cache check
  const cached = mapIdCache.get(year);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`🚀 Cache hit for ${year}`);
    return res.json(cached.data);
  }

  console.log(`🔄 Generating tiles for ${year}...`);

  try {
    const { composite, visParams, attribution } = getComposite(year);

    composite.getMapId(visParams, (data, err) => {
      if (err) {
        console.error('GEE error:', err);
        return res.status(500).json({ error: 'Failed to generate tiles', details: String(err) });
      }

      const mapId = data.mapid || data.mapId;
      if (!mapId) {
        console.error('Empty MapID:', data);
        return res.status(500).json({ error: 'GEE returned empty Map ID' });
      }

      const urlFormat = `https://earthengine.googleapis.com/v1/${mapId}/tiles/{z}/{x}/{y}`;

      const responseData = {
        year,
        urlFormat,
        attribution,
      };

      mapIdCache.set(year, { timestamp: Date.now(), data: responseData });
      console.log(`✅ Tiles ready for ${year}`);
      res.json(responseData);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'running', service: 'GEE Tile Proxy' });
});

// ─── Startup ─────────────────────────────────────────────────────────────────

initializeGEE().then(() => {
  app.listen(port, () => {
    console.log(`🚀 GEE Backend listening at http://localhost:${port}`);
  });
}).catch(err => {
  console.log('Server failed to start due to GEE initialization error.');
});
