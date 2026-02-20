// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// // // // // import axios from 'axios';

// // // // // const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

// // // // // const CircleChart = () => {
// // // // //   const [data, setData] = useState([]);

// // // // //   useEffect(() => {
// // // // //     axios.get('http://localhost:5000/api/stats/item-distribution')
// // // // //       .then(res => {
// // // // //         const formatted = Object.entries(res.data).map(([name, value]) => ({
// // // // //           name,
// // // // //           value: parseFloat(value)
// // // // //         }));
// // // // //         setData(formatted);
// // // // //       })
// // // // //       .catch(err => console.error(err));
// // // // //   }, []);

// // // // //   return (
// // // // //     <div style={{ width: '100%', height: 400 }}>
// // // // //       <h2 style={{ textAlign: 'center', color: '#10b981' }}>Item Distribution</h2>
// // // // //       <ResponsiveContainer>
// // // // //         <PieChart>
// // // // //           <Pie 
// // // // //             data={data} 
// // // // //             dataKey="value" 
// // // // //             nameKey="name" 
// // // // //             outerRadius={150} 
// // // // //             fill="#8884d8" 
// // // // //             label
// // // // //           >
// // // // //             {data.map((entry, index) => (
// // // // //               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // // // //             ))}
// // // // //           </Pie>
// // // // //           <Tooltip />
// // // // //         </PieChart>
// // // // //       </ResponsiveContainer>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CircleChart;



// // // import React, { useEffect, useState } from "react";
// // // import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
// // // import axios from "axios";

// // // const CirleChart = () => {
// // //   const [data, setData] = useState([]);

// // //   // 🎨 Attractive colors for slices
// // //   const COLORS = ["#4f46e5", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

// // //   useEffect(() => {
// // //     axios
// // //       .get("http://localhost:5000/api/stats/loan-by-item")
// // //       .then((res) => {
// // //         const formatted = Object.entries(res.data).map(([name, value]) => ({
// // //           name,
// // //           value,
// // //         }));
// // //         setData(formatted);
// // //       })
// // //       .catch((err) => console.error(err));
// // //   }, []);

// // //   return (
// // //     <div style={{ width: "100%", height: 400 }}>
// // //       <h2 style={{ textAlign: "center", color: "#4f46e5", marginBottom: "10px" }}>
// // //         Loan Amount by Item
// // //       </h2>
// // //       <ResponsiveContainer>
// // //         <PieChart>
// // //           <Pie
// // //             data={data}
// // //             dataKey="value"
// // //             nameKey="name"
// // //             cx="50%"
// // //             cy="50%"
// // //             outerRadius={130}
// // //             fill="#4f46e5"
// // //             label
// // //           >
// // //             {data.map((entry, index) => (
// // //               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //             ))}
// // //           </Pie>
// // //           <Tooltip />
// // //           <Legend verticalAlign="bottom" height={36} />
// // //         </PieChart>
// // //       </ResponsiveContainer>
// // //     </div>
// // //   );
// // // };

// // // export default CirleChart;

// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
//   YAxis,
//   Rectangle,
//   Text
// } from "recharts";
// import axios from "axios";

// // A vibrant and attractive color palette for each item
// const COLORS = [
//   "#4f46e5", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4",
//   "#f97316", "#14b8a6", "#3b82f6", "#f43f5e", "#8b5cf6", "#10b981"
// ];

// // Custom Tooltip to show both loan amount and gold weight
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length > 0) {
//     const loanAmountData = payload.find(item => item.dataKey === 'loanAmount');
//     const goldWeightData = payload.find(item => item.dataKey === 'goldWeight');

//     return (
//       <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
//         <p className="label" style={{ fontWeight: 'bold' }}>{`${label}`}</p>
//         {loanAmountData && (
//           <p className="loan-amount" style={{ color: loanAmountData.fill }}>
//             {`Total Loan Amount: ₹${loanAmountData.value}`}
//           </p>
//         )}
//         {goldWeightData && (
//           <p className="gold-weight" style={{ color: '#444' }}>
//             {`Total Gold Weight: ${goldWeightData.value} g`}
//           </p>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// // This custom component handles both regular bars and zero-value amounts
// const CustomBarShape = (props) => {
//   const { x, y, width, height, fill, payload } = props;

//   // Check if the loan amount is 0
//   if (payload.loanAmount === 0) {
//     // Render a large, colorful '0'
//     return (
//       <g transform={`translate(${x + width / 2},${y + height})`}>
//         <Text 
//           x={0} 
//           y={-15}
//           fill={fill}
//           fontSize={24}
//           textAnchor="middle" 
//           dominantBaseline="middle"
//           fontWeight="bold"
//         >
//           0
//         </Text>
//       </g>
//     );
//   }

//   // Otherwise, render a regular bar with rounded tops
//   return (
//     <Rectangle
//       x={x}
//       y={y}
//       width={width}
//       height={height}
//       fill={fill}
//       radius={[10, 10, 0, 0]}
//     />
//   );
// };
// const ItemBarChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/stats/loan-gold-by-item")
//       .then((res) => {
//         setData(res.data);
//       })
//       .catch((err) => console.error(err));
//   }, []);
  
//   return (
//     <div style={{ width: "100%", height: 400 , margin: "50px" }}>
//       <h2 style={{ textAlign: "center", color: '#4f46e5', marginBottom: "10px" }}>
//         Loan & Gold by Item
//       </h2>
      
//       {/* Custom Legend at the top */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
//         {data.map((entry, index) => (
//           <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
//             <span style={{ backgroundColor: COLORS[index % COLORS.length], width: '15px', height: '15px', borderRadius: '4px', marginRight: '5px' }}></span>
//             <span style={{ fontSize: '12px', color: '#555' }}>{entry.name}</span>
//           </div>
//         ))}
//       </div>

//       <ResponsiveContainer>
//         <BarChart
//           data={data}
//           barSize={60}
//           barCategoryGap="15%"
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <XAxis dataKey="name" hide />
//           <YAxis />
//           {/* Add cursor={false} to remove the hover shadow */}
//           <Tooltip content={<CustomTooltip />} cursor={false} />
          
//           <Bar dataKey="loanAmount" name="Loan Amount" shape={<CustomBarShape />}>
//             {/* We still need the cells to apply the colors */}
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Bar>
          
//           <Bar dataKey="goldWeight" name="Gold Weight" fill="transparent" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ItemBarChart;
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  YAxis,
  Rectangle,
  Text
} from "recharts";
import api from "../../utils/api";

// A vibrant and attractive color palette for each item
const COLORS = [
  "#4f46e5", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4",
  "#f97316", "#14b8a6", "#3b82f6", "#f43f5e", "#8b5cf6", "#10b981"
];

// Custom Tooltip to show both loan amount and gold weight
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const loanAmountData = payload.find(item => item.dataKey === 'loanAmount');
    const goldWeightData = payload.find(item => item.dataKey === 'goldWeight');

    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label" style={{ fontWeight: 'bold' }}>{`${label}`}</p>
        {loanAmountData && (
          <p className="loan-amount" style={{ color: loanAmountData.fill }}>
            {`Total Loan Amount: ₹${loanAmountData.value}`}
          </p>
        )}
        {goldWeightData && (
          <p className="gold-weight" style={{ color: '#444' }}>
            {`Total Gold Weight: ${goldWeightData.value} g`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// This custom component handles both regular bars and zero-value amounts
const CustomBarShape = (props) => {
  const { x, y, width, height, fill, payload } = props;

  if (payload.loanAmount === 0) {
    return (
      <g transform={`translate(${x + width / 2},${y + height})`}>
        <Text 
          x={0} 
          y={-15}
          fill={fill}
          fontSize={24}
          textAnchor="middle" 
          dominantBaseline="middle"
          fontWeight="bold"
        >
          0
        </Text>
      </g>
    );
  }

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={[10, 10, 0, 0]}
    />
  );
};

const ItemBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/stats/loan-gold-by-item")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div style={{ width: "100%", height: 400, margin: "50px" }}>
      <h2 style={{ textAlign: "center", color: '#4f46e5', marginBottom: "10px" }}>
        Loan & Gold by Item
      </h2>
      
      {/* Custom Legend at the top */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {data.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: COLORS[index % COLORS.length], width: '15px', height: '15px', borderRadius: '4px', marginRight: '5px' }}></span>
            <span style={{ fontSize: '12px', color: '#555' }}>{entry.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer>
        <BarChart
          data={data}
          barSize={60}
          barCategoryGap="15%"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ cursor: 'pointer' }} // Add this style to the BarChart
        >
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
          <Bar dataKey="loanAmount" name="Loan Amount" shape={<CustomBarShape />}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
          
          <Bar dataKey="goldWeight" name="Gold Weight" fill="transparent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ItemBarChart;