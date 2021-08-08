import { useState, useContext } from 'react';
import { UserContext } from '../context'
import { expenses_api } from '../const'
import axios from 'axios';

const New = () => {
  const [ item, setItem ] = useState('');
  const [ cost, setCost ] = useState(0);

  const user = useContext(UserContext);
  // console.log(user);

  const handleClick = (e, user) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: user.signInUserSession.idToken.jwtToken }
    };
    const url = expenses_api.post;
    const data = {
      cost: cost,
      key: item,
      income: false
    };
    axios.post(url, data, config)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error.message)
      });
    // alert(user.signInUserSession.idToken.jwtToken);
    // console.log(user)
  }

  return (
    <form>
      item:
      <input type="text" name="item" value={item} onChange={(e)=>setItem(e.target.value)}/>
      cost:
      <input type="number" name="cost" value={cost} onChange={(e)=>setCost(parseInt(e.target.value))}/>
      <button onClick={(e)=> handleClick(e, user)}>
        save
      </button>
    </form>
  )
}

export default New;
