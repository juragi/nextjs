import {useState, useRef} from 'react';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoneyInput from '../component/MoneyInput';
import RefreshIcon from '@mui/icons-material/Refresh';
import Container from '@mui/material/Container'


export default function Calc2() {
    const [usdkrw, setUsdkrw] = useState(0);
    const [eurkrw, setEurkrw] = useState(0);
    const [buyItems, setBuyItems] = useState([]);
    const [sellItems, setSellItems] = useState([]);
    const [indexRate, setIndexRate] = useState(1);
    const [msg, setMsg] = useState("");
    const inputUsd = useRef();
    const inputEur = useRef();
    const handleKeyUp = () => {
        if(usdkrw > 0 && eurkrw > 0) {
            //
            //setItems(sellEur(usdkrw, eurkrw));
        } else {
            //setItems([]);
        }
    }

    const getOffsetUsd = (usdkrw) => {
        let offsetUsd = 0;
        if(usdkrw > 1285) offsetUsd = 2.52;
        else if(usdkrw > 1275) offsetUsd = 2.5;
        else if(usdkrw > 1255) offsetUsd = 2.48;
        else offsetUsd = 2.4;
        return offsetUsd;
    }
    
    const handleClick = () => {
        let offsetUsd = getOffsetUsd(usdkrw) / 2;
        let usdkrwBuy = usdkrw - offsetUsd;
        let usdkrwSell = usdkrw + offsetUsd;
        //console.log(usdkrwBuy, usdkrwSell)
        setBuyItems(buyEur(usdkrwBuy, eurkrw));
        setSellItems(sellEur(usdkrwSell, eurkrw));
        setIndexRate(eurkrw / usdkrw);
        setMsg(`USD: ${usdkrwBuy} ~ ${usdkrwSell}   EUR: ${eurkrw}`);
    }
    
    const formatMoney = (rate, fixed) => {
        if(!rate) return rate;
        return Number(rate).toFixed(fixed);
    }
    return (
        <Container>
            <MoneyInput id={inputUsd} passVal={setUsdkrw} customKeyUp={handleKeyUp} placeholder={"usdkrw"}/>
            <MoneyInput id={inputEur} passVal={setEurkrw} customKeyUp={handleKeyUp} placeholder={"eurkrw"}/>
            <button onClick={handleClick}>Calc</button>
            <span>rate: {formatMoney(indexRate, 6)}</span>
            <div>{msg}</div>
            <hr />
            <div>Buy</div>
            <TableContainer>
                <Table sx={{maxWidth: 800}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>USD</TableCell>
                            <TableCell>EUR</TableCell>
                            <TableCell>rate</TableCell>
                            <TableCell>tmp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {buyItems //.map(x=>x).sort((a,b) => a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0)
                        .map((item, i) => (
                        <TableRow key={i}>
                            <TableCell>{formatMoney(item.usd, 2)}</TableCell>
                            <TableCell>{formatMoney(item.eur, 2)}</TableCell>
                            <TableCell>{formatMoney(item.rate, 5)}</TableCell>
                            <TableCell>{formatMoney(item.tmp, 6)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                
            </TableContainer>
            <hr />
            <div>Sell</div>
            <TableContainer>
                <Table sx={{maxWidth: 800}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>EUR</TableCell>
                            <TableCell>USD</TableCell>
                            <TableCell>rate</TableCell>
                            <TableCell>tmp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sellItems //.map(x=>x).sort((a,b) => a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0)
                        .map((item, i) => (
                        <TableRow key={i}>
                            <TableCell>{formatMoney(item.eur, 2)}</TableCell>
                            <TableCell>{formatMoney(item.usd, 2)}</TableCell>
                            <TableCell>{formatMoney(item.rate, 5)}</TableCell>
                            <TableCell>{formatMoney(item.tmp, 6)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                
            </TableContainer>
        </Container>
        
    )
}








function sellEur(usdkrw, eurkrw) {
    let rate = eurkrw / usdkrw;
    let eur = getPrice(9.9 / rate);
    let items = [];
    let offset = 0.00025;
    for(let i = 0; i < 1000; i++) {
        let usd = eur * rate;
        let tmp  = usd;
        //usd = Math.ceil(usd * 100) / 100;
        //usd = Math.ceil(Math.round(Math.round(usd * 10000) / 10) / 10)/100
        let usdFloor = Math.floor(usd * 100) / 100;
        let mod = usd - usdFloor;
        if(mod > (eur < 12 ? 0.00025 : offset)) usd = usdFloor + 0.01;
        
        let krw = Math.floor(eur * eurkrw);
        usd = krw / usdkrw;
        usdFloor = Math.floor(usd * 100) / 100;
        if(mod > offset) usd = Number(Number(usdFloor + 0.01).toFixed(2));
        else usd = Number(Number(usd).toFixed(2));

        let r = usd / eur;
        items.push({
            eur: getPrice(eur), 
            usd: getPrice(usd), 
            rate: r,
            tmp: tmp,
            mod: mod,
            usdFloor:usdFloor,
            krw:eur * eurkrw
        });
        eur += 0.01;
        eur = Number(Number(eur).toFixed(2));
    }
    
    let filteredItems = items.filter(x=>x.usd >= 10).sort((a,b) => {
        return a.rate > b.rate ? -1 : a.rate < b.rate ? 1 : 0;
    });
    //console.log(items);
    let iii = items.map(x=>x);
    iii.sort((a,b) => {
        return a.mod > b.mod ? 1 : a.mod < b.mod ? -1 : 0
    });
    //console.log(iii);

    let newItems = [];
    
    for(let i = 0; i < 3; i++) {
        newItems.push(filteredItems[i]);
    }
    
    return newItems;
}

function buyEur(usdkrw, eurkrw) {
    let usd = 10;
    let items = [];
    for(let i = 0; i < 1000; i++) {
        let item = getBuyEurItem(usdkrw, eurkrw, usd);
        items.push(item)
        usd += 0.01;
    }
    //console.log(items);
    let items3 = items.map(x=>x);
    items3.sort((a,b) => {
        return a.mod > b.mod ? 1 : a.mod < b.mod ? -1 : 0;
    });
    //console.log(items3);
    let items2 = items.map(x=>x);//.filter(x=>x.eur2 !== x.eur);
    items2.sort((a,b) => {
        return a.rate > b.rate ? 1 : a.rate < b.rate ? -1 : 0;
    });
    let newItems = [];
    for(let i = 0; i < Math.min(3, items2.length); i++) {
        newItems.push(items2[i]);
    }
    return newItems;
}

function getBuyEurItem(usdkrw, eurkrw, usd, offset) {
    if (!offset) offset = 0.0007; // 1338.69, 1389.18 환율일 때 0.0007이 정확
    let krw = Math.ceil(usd * usdkrw);
    let eur = krw / eurkrw;
    let tmp = eur;
    let eurFloor = Math.floor(eur * 100) / 100;
    let mod = eur - eurFloor;
    if(mod > offset) eur = Number(Number(eurFloor + 0.01).toFixed(2));
    else eur = eurFloor;
    return {usd: usd, eur: eur, rate: usd/eur, tmp: tmp, mod: mod};
}

function getPrice(price) {
    return Number(price.toFixed(2));
}
