import { useState, useContext } from 'react';
import { UserContext } from '../context'
import { expenses_api } from '../const'
import axios from 'axios';

// TODO: move another file
const Button = ({enabled, onClick, ...props}) => {
  return (
    <button className="text-white bg-blue-500 hover:bg-blue-600 w-40 px-5" onClick={onClick} disabled={!enabled}>
      {props.children}
    </button>
  )
}

const New = () => {
  const [ item, setItem ] = useState('');
  const [ cost, setCost ] = useState(0);
  const [ income, setIncome ] = useState(false);
  const [ message, setMessage ] = useState('')
  const [ savingEnabled, setSavingEnabled ] = useState(false);

  const user = useContext(UserContext);

  const setSaveButtonEnabled = (item, cost, income) => {
    const enabled = (item.length > 0 || income) && (cost !== 0 && cost !== '')
    setSavingEnabled(enabled)
  }

  const onChangeItem = (event) => {
    const value = event.target.value;
    setItem(value);
    setSaveButtonEnabled(value, cost, income);
  }

  const onChangeCost = (event) => {
    const v = event.target.value;
    const value = (isNaN(v) || !v) ? '' : parseInt(v, 10);
    setCost(value)
    setSaveButtonEnabled(item, value, income);
  }

  const onChangeIncome = () => {
    const value = !income;
    if (value) {
      setItem('')
    }
    setIncome(value);
    setSaveButtonEnabled(item, cost, value);
  }

  const onClickSave = (event) => {
    setSavingEnabled(false)
    setMessage('Saving...')
    event.preventDefault();

    const config = {
      headers: { Authorization: user.signInUserSession.idToken.jwtToken }
    };
    const url = expenses_api.post;
    const data = {
      cost: cost,
      key: item,
      income: income
    };

    // TODO: refactoring, move to another common file
    axios.post(url, data, config)
      .then(response => {
        setMessage(response.data.message);
        setSavingEnabled(true);
      })
      .catch(error => {
        setMessage(error)
        setSavingEnabled(true);
      });
  }

  return (
    <>
      <p>{message}</p>
      <form className="grid">
        <label className="text-left" for="item">Item *</label>
        <input type="text" name="item" disabled={income} value={item} onChange={onChangeItem}/>
        <label className="text-left" for="cost">Cost *</label>
        <input type="number" name="cost" value={cost} onChange={onChangeCost}/>
        <label className="text-left" for="income">
          <input type="checkbox" id="income" value={income} onChange={onChangeIncome}/>income
        </label>
      </form>
      <Button onClick={onClickSave} enabled={savingEnabled}>
        save
      </Button>
    </>
  )
}

export default New;
