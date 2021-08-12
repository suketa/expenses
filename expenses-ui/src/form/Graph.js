import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts'
import './Graph.css';
import { expenses_api } from '../const'
import { UserContext } from '../context'

const Graph = () => {
  const [data, setData] = useState([])
  const user = useContext(UserContext);

  const config = {
    headers: { Authorization: user.signInUserSession.idToken.jwtToken }
  };
  const year = (new Date()).getFullYear();
  const url = `${expenses_api.graph_data}${year}`

  useEffect(() => {
    let isMounted = true;
    axios.get(url, config)
      .then(response => {
        if (isMounted) {
          setData(response.data.data);
        }
      });
    return () => {isMounted = false}
  });

  return (
    <div className="chart">
      <ResponsiveContainer>
        <LineChart data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" padding={{left: 5}}/>
          <YAxis tickFormatter={(item) => {return item/1000}} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="line" dataKey="cost" stroke="#1e90ff" />
          <Line type="line" dataKey="lcost" stroke="#3cb371" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
