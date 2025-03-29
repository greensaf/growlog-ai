export const parseGrowerLogFunction = {
  name: 'parseGrowerLogEntry',
  description: 'Extract parameters from a grower report into structured format',
  parameters: {
    type: 'object',
    properties: {
      date: { type: 'string', description: 'Date (format YYYY-MM-DD)' },
      time: { type: 'string', description: 'Time (HH:MM)' },
      location: { type: 'string', description: 'Location' },
      regime: {
        type: 'string',
        description: 'Lighting or environmental regime',
      },
      plantId: { type: 'string', description: 'Plant ID' },
      strain: { type: 'string', description: 'Strain name' },
      start: {
        type: 'string',
        description: 'Start date of plant (if mentioned)',
      },
      startForm: {
        type: 'string',
        enum: ['clone', 'seed', 'other'],
        description: 'Start form: clone, seed, or other',
      },
      sourceId: { type: 'string', description: 'Source or origin identifier' },
      tOutside: { type: 'number', description: 'Outdoor temperature (°C)' },
      tAir: {
        type: 'number',
        description: 'Indoor air temperature (°C)',
      },
      tSolution: { type: 'number', description: 'Solution temperature (°C)' },
      tSubstrate: { type: 'number', description: 'Substrate temperature (°C)' },
      hInside: { type: 'number', description: 'Indoor humidity (%)' },
      hOutside: { type: 'number', description: 'Outdoor humidity (%)' },
      CO2: { type: 'number', description: 'CO₂ level (ppm)' },
      VPD: { type: 'number', description: 'Vapor pressure deficit' },
      PPFD: { type: 'number', description: 'PPFD – light photon density' },
      EC: {
        type: 'number',
        description: 'Electrical conductivity of solution',
      },
      PH: { type: 'number', description: 'pH of solution' },
      Irrigation: { type: 'number', description: 'Irrigation volume (ml)' },
      Event: {
        type: 'string',
        description: 'Event that occurred on this day',
      },
      Comment: { type: 'string', description: 'Grower comment' },
    },
    required: ['plantId', 'date', 'time'],
  },
};
