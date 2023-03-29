import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import NumberInput from '../component/NumberInput';
import {useState, useRef} from 'react';
import MoneyInput from '../component/MoneyInput';

export default function TestPage() {
    const [usd1, setUsd1] = useState(0);
    const [usd2, setUsd2] = useState(0);
    const [eur, setEur] = useState(0);

    const usdkrw = useRef();
    const usdkrw2 = useRef();
    const eurkrw = useRef();

    const handleUsd1 = () => {
        setUsd2(usd1 + 1);
        console.log(usdkrw2);
    }
    
    return (
        <Container
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
        >
            <div><MoneyInput id={usdkrw} label="usd buy"  passVal={setUsd1} customKeyUp={handleUsd1}/></div>
            <div><MoneyInput id={usdkrw2} label="usd sell" passVal={setUsd2} /></div>
            <div><MoneyInput id={eurkrw} label="eur" /></div>
            <div>usd1: {usd1}</div>
            <div>usd2: {usd2}</div>
            <div>eur: {eur}</div>
        </Container>
    );
}