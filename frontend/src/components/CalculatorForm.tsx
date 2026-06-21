import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import backgroundImage from '../assets/forst.jpeg'
import backgroundImage3 from '../assets/3.jpeg'

Chart.register(...registerables)

interface FormDataType {
  electricityUsageKWh: string
  transportationUsageGallonsPerMonth: string
  wasteGenerationTons: string
  waterUsageCubicMeters: string
  processEmissionsTons: string
}

export default function CalculatorForm() {
  const [formData, setFormData] = useState<FormDataType>({
    electricityUsageKWh: '',
    transportationUsageGallonsPerMonth: '',
    wasteGenerationTons: '',
    waterUsageCubicMeters: '',
    processEmissionsTons: ''
  })

  const [result, setResult] = useState<any>(null)
  const [chartData, setChartData] = useState({
    labels: ['Electricity', 'Transportation', 'Waste', 'Water', 'Process'],
    datasets: [{
      label: 'CO2 Emissions (kgCO2e/year)',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderWidth: 1
    }]
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electricityUsageKWh: parseFloat(formData.electricityUsageKWh) || 0,
          transportationUsageGallonsPerMonth: parseFloat(formData.transportationUsageGallonsPerMonth) || 0,
          wasteGenerationTons: parseFloat(formData.wasteGenerationTons) || 0,
          waterUsageCubicMeters: parseFloat(formData.waterUsageCubicMeters) || 0,
          processEmissionsTons: parseFloat(formData.processEmissionsTons) || 0
        })
      })

      const data = await response.json()
      setResult(data.data)
      
      setChartData({
        labels: ['Electricity', 'Transportation', 'Waste', 'Water', 'Process'],
        datasets: [{
          ...chartData.datasets[0],
          data: [
            data.data.yearlyElectricityEmissions.value,
            data.data.yearlyTransportationEmissions.value,
            data.data.yearlyWasteEmissions.value,
            data.data.yearlyWaterEmissions.value,
            data.data.processEmissions.value
          ]
        }]
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAnalysis = () => {
    navigate('/analysis', { state: { result } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 flex-col" 
         style={{ backgroundImage: `url(${backgroundImage3})`, backgroundSize: 'cover' }}>
      <div className="bg-gray-200 p-10 w-full max-w-screen-lg" 
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        <h1 className="text-5xl font-bold mb-6 text-center text-white">Industry Carbon Emission Calculator</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 bg-gray-200 p-10 w-full max-w-screen-lg">
        <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center">Input Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </label>
                <input
                  type="number"
                  name={key}
                  value={formData[key as keyof FormDataType]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                  step="any"
                  min="0"
                />
              </div>
            ))}
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Calculate
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
          <h2 className="text-3xl font-bold mb-2 text-center">Yearly Emissions Statistics</h2>
          {result && (
            <>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  Total Emissions: {result.totalYearlyEmissions.value.toFixed(2)} kgCO2e/year
                </p>
                <button 
                  onClick={handleAnalysis}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Detailed Analysis
                </button>
              </div>
              <div className="h-96">
                <Bar data={chartData} options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } }
                }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}