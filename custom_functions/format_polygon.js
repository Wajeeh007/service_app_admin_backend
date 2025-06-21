const errors = require('../errors/index.js')

function wktToCoordinates(poly) {
    if (!poly || poly.type !== 'Polygon' || !Array.isArray(poly.coordinates)) {
      return '';
    }
  
    const coords = poly.coordinates[0];
    
    if((coords[0][0] !== (coords[coords.length - 1])[0]) && coords[0][1] !== (coords[coords.length - 1])[1]) {
      return next(new errors.BadRequestError('Invalid polygon coordinates'))
    }

    return coords.map(([x, y]) => `${y} ${x}`).join(', ');
}

function coordinatesToWKT(wkt) {
  const coordString = wkt.match(/POLYGON\s*\(\((.+)\)\)/i)?.[1];
    if (!coordString) throw new Error('Invalid WKT polygon');

    const flippedCoords = coordString.trim().split(',').map(pair => {
        const [lat, lng] = pair.trim().split(/\s+/);
        return `${lng} ${lat}`; // flip to lng lat
    });

    // Ensure closed ring
    if (flippedCoords[0] !== flippedCoords[flippedCoords.length - 1]) {
        flippedCoords.push(flippedCoords[0]);
    }

    return `POLYGON((${flippedCoords.join(', ')}))`;
}


module.exports = {wktToCoordinates, coordinatesToWKT};