
const { randomPoint } = require('@turf/random');
const bbox = require('@turf/bbox').default;
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
const centerOfMass = require('@turf/center-of-mass').default;




function randomPointInPolygon(geometry, maxTries = 1000) {
  const polygonFeature = {
    type: 'Feature',
    geometry,
    properties: {}
  };

  const bounds = bbox(polygonFeature);

  for (let i = 0; i < maxTries; i++) {
    const pt = randomPoint(1, { bbox: bounds }).features[0];
    if (booleanPointInPolygon(pt, polygonFeature)) {
      return pt.geometry.coordinates;
    }
  }

  const fallback = centerOfMass(polygonFeature).geometry.coordinates;
  return fallback;
}

module.exports = randomPointInPolygon;
