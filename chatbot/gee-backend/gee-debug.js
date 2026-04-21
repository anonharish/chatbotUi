const ee = require('@google/earthengine');

async function debugGEE() {
  try {
    const privateKey = require('./credentials/key.json');
    ee.data.authenticateViaPrivateKey(
      privateKey,
      () => {
        ee.data.setProject('alpha-earth-493408');
        ee.initialize(null, null, () => {
          const year = 2021;
          const composite = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
            .filterDate(`${year}-01-01`, `${year}-12-31`)
            .median();

          composite.getMapId({ bands: ['B4', 'B3', 'B2'], min: 0, max: 0.4 }, (data, err) => {
            if (err) {
              console.log('❌ ERROR:', err);
            } else {
              console.log('✅ SUCCESS!');
              console.log('Map ID:', data.mapid || data.mapId);
              console.log('Token:', data.token);
            }
            process.exit(0);
          });
        }, (err) => {
          console.error('Init Error:', err);
          process.exit(1);
        });
      },
      (err) => {
        console.error('Auth Error:', err);
        process.exit(1);
      }
    );
  } catch (e) {
    console.error('File Error:', e);
    process.exit(1);
  }
}

debugGEE();
