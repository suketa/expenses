import { useState, useContext } from 'react';
import { UserContext } from '../context'
import { expenses_api } from '../const'
import axios from 'axios';

const New = () => {
  const [ item, setItem ] = useState('');
  const [ cost, setCost ] = useState(0);
  const [ income, setIncome ] = useState(false);
  const [ message, setMessage ] = useState('')

  const user = useContext(UserContext);

  const handleClick = (e, user) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: user.signInUserSession.idToken.jwtToken }
    };
    const url = expenses_api.post;
    const data = {
      cost: cost,
      key: item,
      income: income
    };
    axios.post(url, data, config)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        setMessage(error)
      });
  }

  return (
    <>
      <p>{message}</p>
      <form>
        item:
        <input type="text" name="item" value={item} onChange={(e)=>setItem(e.target.value)}/>
        cost:
        <input type="number" name="cost" value={cost} onChange={(e)=>setCost(parseInt(e.target.value))}/>
        income:
        <input type="checkbox" name="income" value={income} onChange={()=>setIncome(!income)}/>
        <button onClick={(e)=> handleClick(e, user)}>
          save
        </button>
      </form>
    </>
  )
}

export default New;
