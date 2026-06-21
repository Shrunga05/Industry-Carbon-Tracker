import { useLocation, useNavigate } from 'react-router-dom'

interface EmissionData {
  parameter: string
  yourValue: number
  industryAverage: number
  recommendations: string[]
}

const INDUSTRY_AVERAGES = {
  electricity: 30000, // kgCO2e/year
  transportation: 120000, // kgCO2e/year
  waste: 300000, // kgCO2e/year
  water: 96000, // kgCO2e/year
  process: 100000 // kgCO2e/year
}

export default function AnalysisPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Calculator
          </button>
        </div>
      </div>
    )
  }

  const emissionData: EmissionData[] = [
    {
      parameter: 'Electricity',
      yourValue: result.yearlyElectricityEmissions.value,
      industryAverage: INDUSTRY_AVERAGES.electricity,
      recommendations: [
        'Switch to renewable energy sources (solar, wind)',
        'Implement energy-efficient lighting (LEDs)',
        'Upgrade to energy-efficient machinery',
        'Install smart meters to monitor usage'
      ]
    },
    {
      parameter: 'Transportation',
      yourValue: result.yearlyTransportationEmissions.value,
      industryAverage: INDUSTRY_AVERAGES.transportation,
      recommendations: [
        'Switch to electric or hybrid vehicles',
        'Optimize delivery routes',
        'Implement fleet management software',
        'Use alternative fuels (biodiesel, CNG)'
      ]
    },
    {
      parameter: 'Waste',
      yourValue: result.yearlyWasteEmissions.value,
      industryAverage: INDUSTRY_AVERAGES.waste,
      recommendations: [
        'Implement recycling programs',
        'Reduce packaging materials',
        'Compost organic waste',
        'Donate usable materials'
      ]
    },
    {
      parameter: 'Water',
      yourValue: result.yearlyWaterEmissions.value,
      industryAverage: INDUSTRY_AVERAGES.water,
      recommendations: [
        'Install water-efficient fixtures',
        'Implement water recycling systems',
        'Fix leaks promptly',
        'Use rainwater harvesting'
      ]
    },
    {
      parameter: 'Process',
      yourValue: result.processEmissions.value,
      industryAverage: INDUSTRY_AVERAGES.process,
      recommendations: [
        'Optimize production processes',
        'Use cleaner production technologies',
        'Capture and utilize waste gases',
        'Switch to low-carbon raw materials'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Detailed Carbon Footprint Analysis</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Total Emissions: {result.totalYearlyEmissions.value.toFixed(2)} kgCO2e/year</h2>
        </div>

        <div className="space-y-8">
          {emissionData.map((data) => {
            const isHigh = data.yourValue > data.industryAverage
            return (
              <div 
                key={data.parameter} 
                className={`p-6 rounded-lg border ${isHigh ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{data.parameter}</h3>
                  <span className={`px-4 py-2 rounded-full font-semibold ${isHigh ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {isHigh ? 'Above Average' : 'Within Limits'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-2">Your Emissions vs Industry Average</h4>
                    <div className="space-y-2">
                      <p>Your Value: {data.yourValue.toFixed(2)} kgCO2e/year</p>
                      <p>Industry Average: {data.industryAverage.toFixed(2)} kgCO2e/year</p>
                      <p className="font-semibold">
                        Difference: {((data.yourValue - data.industryAverage) / data.industryAverage * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {isHigh && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations to Reduce Emissions</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {data.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg"
          >
            Back to Calculator
          </button>
        </div>
      </div>
    </div>
  )
}