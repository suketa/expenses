import { useState, useContext } from 'react';
import { UserContext } from '../context'

const New = () => {
  const [ item, setItem ] = useState('');
  const [ cost, setCost ] = useState(0);

  const user = useContext(UserContext);
  console.log(user);
  const handleClick = (user) => {
    alert(user.signInUserSession.idToken.jwtToken);
    console.log(user)
  }

  return (
    <form>
      item:
      <input type="text" name="item" value={item} onChange={(e)=>setItem(e.target.value)}/>
      cost:
      <input type="number" name="cost" value={cost} onChange={(e)=>setCost(e.target.value)}/>
      <button onClick={()=> handleClick(user)}>
        save
      </button>
    </form>
  )
}

export default New;
