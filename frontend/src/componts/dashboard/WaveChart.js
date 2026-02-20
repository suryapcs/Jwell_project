
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  CartesianGrid
} from 'recharts';
import api from '../../utils/api';

// Function to generate the last 12 months data structure
const get12Months = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    // Use the same locale here for consistency
    const name = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    months.push({ name, value: 0 });
  }
  return months.reverse();
};

// Custom component to render the data label with a circle
const CustomBarLabel = ({ x, y, width, value, fill }) => {
//   if (value === 0) return null;

  const circleY = y - 10;
  const circleX = x + width / 2;

  return (
    <g>
      <circle cx={circleX} cy={circleY} r={12} fill="#fff" stroke={fill} strokeWidth={1.5} />
      <text
        x={circleX}
        y={circleY + 4}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize={12}
      >
        {value}
      </text>
    </g>
  );
};

// Custom component to render the X-Axis ticks with smaller font size
const CustomizedAxisTick = ({ x, y, payload, index, colors }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="middle" 
        fill={colors[index]} 
        // Decreased font size for the month names
        fontSize={14} 
      >
        {payload.value.substring(0, 3)}
      </text>
    </g>
  );
};

const MonthlyCustomerChart = () => {
  const [data, setData] = useState(get12Months());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await api.get('/api/customer/monthly-customer-count');
        const apiData = response.data;  // Axios puts data here
        const mergedData = get12Months().map((defaultMonth) => {
          const apiMonth = apiData.find((d) => d.name === defaultMonth.name);
          return apiMonth || defaultMonth;
        });

        setData(mergedData);
      } catch (err) {
           setError(err.response?.data?.message || err.message || 'Failed to fetch data');

      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const colors = [
    '#82ca9d', '#82ca9d', '#82ca9d', '#8884d8', '#8884d8', '#8884d8',
    '#8884d8', '#00c497', '#00c497', '#00c497', '#00c497', '#8884d8',
  ];

  return (
    <div style={{ width: '100%', height: 400,  padding: '20px', borderRadius: '10px' }}>
      <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Customers</h3>
      <p style={{ textAlign: 'center', fontSize: '14px', marginTop:"0px" }}>Monthly Customers Chart</p>
      <ResponsiveContainer>
        <BarChart
          data={data}
          barSize={60}
          margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#ddd" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={<CustomizedAxisTick colors={colors} />}
          />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
            <LabelList dataKey="value" content={<CustomBarLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyCustomerChart;