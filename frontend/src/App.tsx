// import { useState } from "react";
// import backgroundImage from "./assets/forst.jpeg";
// import backgroundImage3 from "./assets/3.jpeg";
// import { Bar } from "react-chartjs-2";
// import { Chart, registerables } from "chart.js";

// Chart.register(...registerables);

// interface FormDataType {
//   electricityUsageKWh: string;
//   transportationUsageGallonsPerMonth: string;
//   wasteGenerationTons: string;
//   waterUsageCubicMeters: string;
//   processEmissionsTons: string;
// }

// function App() {
//   const [formData, setFormData] = useState<FormDataType>({
//     electricityUsageKWh: "",
//     transportationUsageGallonsPerMonth: "",
//     wasteGenerationTons: "",
//     waterUsageCubicMeters: "",
//     processEmissionsTons: ""
//   });

//   const [result, setResult] = useState<any>(null);
//   const [chartData, setChartData] = useState({
//     labels: ["Electricity", "Transportation", "Waste", "Water", "Process"],
//     datasets: [
//       {
//         label: "CO2 Emissions (kgCO2e/year)",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(153, 102, 255, 0.6)"
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)"
//         ],
//         borderWidth: 1
//       }
//     ]
//   });

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "kgCO2e/year"
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Emission Sources"
//         }
//       }
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3001/calculate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify({
//           electricityUsageKWh: parseFloat(formData.electricityUsageKWh) || 0,
//           transportationUsageGallonsPerMonth: parseFloat(formData.transportationUsageGallonsPerMonth) || 0,
//           wasteGenerationTons: parseFloat(formData.wasteGenerationTons) || 0,
//           waterUsageCubicMeters: parseFloat(formData.waterUsageCubicMeters) || 0,
//           processEmissionsTons: parseFloat(formData.processEmissionsTons) || 0
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResult(data);

//       setChartData({
//         labels: ["Electricity", "Transportation", "Waste", "Water", "Process"],
//         datasets: [
//           {
//             label: "CO2 Emissions (kgCO2e/year)",
//             data: [
//               data.yearlyElectricityEmissions?.value || 0,
//               data.yearlyTransportationEmissions?.value || 0,
//               data.yearlyWasteEmissions?.value || 0,
//               data.yearlyWaterEmissions?.value || 0,
//               data.processEmissions?.value || 0
//             ],
//             backgroundColor: [
//               "rgba(255, 99, 132, 0.6)",
//               "rgba(54, 162, 235, 0.6)",
//               "rgba(255, 206, 86, 0.6)",
//               "rgba(75, 192, 192, 0.6)",
//               "rgba(153, 102, 255, 0.6)"
//             ],
//             borderColor: [
//               "rgba(255, 99, 132, 1)",
//               "rgba(54, 162, 235, 1)",
//               "rgba(255, 206, 86, 1)",
//               "rgba(75, 192, 192, 1)",
//               "rgba(153, 102, 255, 1)"
//             ],
//             borderWidth: 1
//           }
//         ]
//       });
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-5 flex-col"
//       style={{ backgroundImage: `url(${backgroundImage3})`, backgroundSize: "cover" }}
//     >
//       <div className="bg-gray-200 p-10 w-full max-w-screen-lg" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}>
//         <h1 className="text-5xl font-bold mb-6 text-center text-white">Industry Carbon Emission Calculator</h1>
//       </div>
//       <div className="flex flex-col md:flex-row gap-8 bg-gray-200 p-10 w-full max-w-screen-lg">
//         <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
//           <h2 className="text-3xl font-bold mb-6 text-center">Input Data</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {Object.keys(formData).map((key) => (
//               <div key={key} className="flex flex-col">
//                 <label className="mb-2 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</label>
//                 <input
//                   type="number"
//                   name={key}
//                   value={formData[key as keyof FormDataType]}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-md p-2"
//                   step="any"
//                   min="0"
//                 />
//               </div>
//             ))}
//             <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300">
//               Calculate
//             </button>
//           </form>
//         </div>
//         <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
//           <h2 className="text-3xl font-bold mb-2 text-center">Yearly Emissions Statistics</h2>
//           {result && (
//             <>
//               <div className="mb-4">
//                 <p className="text-xl font-semibold">Total Yearly Emissions: {result.totalYearlyEmissions?.value.toFixed(2)} kgCO2e/year</p>
//               </div>
//               <div className="h-96">
//                 <Bar data={chartData} options={chartOptions} />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from 'react-router-dom'
import CalculatorForm from './components/CalculatorForm'
import AnalysisPage from './components/AnalysisPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorForm />} />
      <Route path="/analysis" element={<AnalysisPage />} />
    </Routes>
  )
}

export default App