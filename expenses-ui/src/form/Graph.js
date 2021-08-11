import React, {useState, useEffect} from 'react';
import './Graph.css';
import { LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts'

const Graph = () => {
  [data, setData] = useState([])

  useEffect(() => {

  }, [])

  const data = [
    { month: "01", cost: 260195 },
    { month: "02", cost: 529689 },
    { month: "03", cost: 243304 },
    { month: "04", cost: 155510 },
    { month: "05", cost: 123450 },
    { month: "06", cost: 223460 },
    { month: "07", cost: 378100 },
    { month: "08", cost: 224930 },
    { month: "09", cost: 338430 },
    { month: "10", cost: 234320 },
    { month: "11", cost: 323310 },
    { month: "12", cost: 0 },
  ];
  return (
    <div className="chart">
      <ResponsiveContainer>
        <LineChart data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" padding={{left: 5}}/>
          <YAxis tickFormatter={(item) => {return item/1000}} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="cost" stroke="#00887A" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
