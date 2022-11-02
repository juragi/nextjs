import {useState} from 'react';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function About() {
    const [items, setItems] = useState([]);
    const [usd, setUsd] = useState(0);
    const [eur, setEur] = useState(0);
    const handleInputUsd = (e) => {setUsd(e.target.value)}
    const handleInputEur = (e) => {setEur(e.target.value)}
    const handleKeyUp = (e) => {
        if(e.key === "Enter") {
            addItem();
            document.getElementById("inputUsd").focus();
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
    return (
        <>
        <h1>About</h1>
        <div>
            usd: <input id="inputUsd" onInput={handleInputUsd}/>
            eur: <input id="inputEur" onInput={handleInputEur} onKeyUp={handleKeyUp}/>
        </div>
        <TableContainer>
            <Table sx={{minWidth: 650}} aria-label="simple table">
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