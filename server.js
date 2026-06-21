
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator'); // Added missing import

const app = express();
const port = 3001;

// const cors = require('cors');

// For specific origin
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Or for multiple origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));

// Or for all origins (not recommended for production)
app.use(cors());
// // Enhanced CORS configuration
// const corsOptions = {
//   origin: 'http://localhost:5174', // Your frontend origin
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// };

// app.use(cors(corsOptions));

// Handle preflight requests
// app.options('*', cors(corsOptions));
app.use(express.json());

// Emission Factors
const EMISSION_FACTORS = {
  ELECTRICITY: 0.5,    // kgCO2e per kWh
  TRANSPORTATION: 10,  // kgCO2e per gallon
  WASTE: 500,          // kgCO2e per ton
  WATER: 0.8,          // kgCO2e per m³
  MONTHS_IN_YEAR: 12,
  KG_PER_TON: 1000
};

// Validation
const validateInput = [
  body('electricityUsageKWh').isFloat({ min: 0 }),
  body('transportationUsageGallonsPerMonth').isFloat({ min: 0 }),
  body('wasteGenerationTons').isFloat({ min: 0 }),
  body('waterUsageCubicMeters').isFloat({ min: 0 }),
  body('processEmissionsTons').isFloat({ min: 0 })
];

// Calculation Endpoint
app.post('/calculate', validateInput, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      electricityUsageKWh,
      transportationUsageGallonsPerMonth,
      wasteGenerationTons,
      waterUsageCubicMeters,
      processEmissionsTons
    } = req.body;

    // Calculations
    const yearlyElectricity = electricityUsageKWh * EMISSION_FACTORS.ELECTRICITY * EMISSION_FACTORS.MONTHS_IN_YEAR;
    const yearlyTransportation = transportationUsageGallonsPerMonth * EMISSION_FACTORS.TRANSPORTATION * EMISSION_FACTORS.MONTHS_IN_YEAR;
    const yearlyWaste = wasteGenerationTons * EMISSION_FACTORS.WASTE * EMISSION_FACTORS.MONTHS_IN_YEAR;
    const yearlyWater = waterUsageCubicMeters * EMISSION_FACTORS.WATER * EMISSION_FACTORS.MONTHS_IN_YEAR;
    const processEmissions = processEmissionsTons * EMISSION_FACTORS.KG_PER_TON;

    const total = yearlyElectricity + yearlyTransportation + yearlyWaste + yearlyWater + processEmissions;

    res.json({
      data: {
        yearlyElectricityEmissions: { value: yearlyElectricity, unit: 'kgCO2e/year' },
        yearlyTransportationEmissions: { value: yearlyTransportation, unit: 'kgCO2e/year' },
        yearlyWasteEmissions: { value: yearlyWaste, unit: 'kgCO2e/year' },
        yearlyWaterEmissions: { value: yearlyWater, unit: 'kgCO2e/year' },
        processEmissions: { value: processEmissions, unit: 'kgCO2e/year' },
        totalYearlyEmissions: { value: total, unit: 'kgCO2e/year' }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Industry Averages Endpoint
app.get('/industry-averages', (req, res) => {
  res.json({
    electricity: 30000,
    transportation: 120000,
    waste: 300000,
    water: 96000,
    process: 100000
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});