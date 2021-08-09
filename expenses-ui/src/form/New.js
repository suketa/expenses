import { useState, useContext } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { UserContext } from '../context'
import { expenses_api } from '../const'

// TODO: move another file
const ExpensesButton = ({enabled, onClick, ...props}) => {
  return (
    <Button color="primary" variant="contained" onClick={onClick} disabled={!enabled}>
      {props.children}
    </Button>
  )
}

const New = () => {
  const [ item, setItem ] = useState('');
  const [ cost, setCost ] = useState(0);
  const [ income, setIncome ] = useState(false);
  const [ message, setMessage ] = useState('Expenses')
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
      <form>
        <FormGroup>
          <div>{message}</div>
          <FormControl margin="normal">
            <TextField 
              required 
              label="Item" 
              variant="outlined" 
              InputLabelProps={{
                shrink: true,
              }}
              disabled={income} 
              value={item} 
              onChange={onChangeItem}
            />
          </FormControl>
					<FormControl margin="normal">
						<TextField 
							required 
							label="Cost" 
							variant="outlined"
							type="number" 
							InputLabelProps={{
								shrink: true,
							}}
							name="cost"
							value={cost} 
							onChange={onChangeCost}
						/>
					</FormControl>
					<FormControl margin="normal">
						<FormControlLabel
							control={
								<Checkbox
									checked={income}
									onChange={onChangeIncome}
									name="income"
									color="primary"
								/>
							}
							label="income"
						/>
					</FormControl>
					<FormControl margin="normal">
						<ExpensesButton onClick={onClickSave} enabled={savingEnabled}>
							save
						</ExpensesButton>
					</FormControl>
				</FormGroup>
			</form>
		</>
	)
}

export default New;
