import {useState, useRef} from 'react';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoneyInput from '../component/MoneyInput';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function About() {
    const [items, setItems] = useState([]);
    const [usd, setUsd] = useState(0);
    const [eur, setEur] = useState(0);
    const inputFocus = useRef();
    const inputFocus2 = useRef();
    const handleInputUsd = (e) => {setUsd(e.target.value)}
    const handleInputEur = (e) => {setEur(e.target.value)}
    const handleKeyUp = (e) => {
        if(e.key === "Enter") {
            addItem();
            //document.getElementById("usd").focus();
            inputFocus.current.focus();
        }
    }
    const addItem = () => {
        let item = {usd: usd, eur: eur}
        item.rate = usd / eur;
        setItems([...items, item])
    }
    const formatMoney = (rate, fixed) => {
        if(!rate) return rate;
        return Number(rate).toFixed(fixed);
    }
    const reset = () => {
        setItems([]);
        setUsd('');
        setEur('');
        inputFocus.current.value = '';
        inputFocus2.current.value = '';
        inputFocus.current.focus();
    }

    return (
        <>
        <h1>About</h1>
        <div>
            usd: <MoneyInput id={inputFocus} passVal={setUsd} customKeyUp={handleKeyUp}/>
            eur: <MoneyInput id={inputFocus2} passVal={setEur} customKeyUp={handleKeyUp}/>
            <RefreshIcon onClick={reset}/>
        </div>
        <TableContainer>
            <Table sx={{maxWidth: 800}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>USD</TableCell>
                        <TableCell>EUR</TableCell>
                        <TableCell>rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {items.map(x=>x).sort((a,b) => a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0)
                    .map((item, i) => (
                    <TableRow key={i}>
                        <TableCell>{formatMoney(item.usd, 2)}</TableCell>
                        <TableCell>{formatMoney(item.eur, 2)}</TableCell>
                        <TableCell>{formatMoney(item.rate, 5)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            
        </TableContainer>
        </>
    )
}