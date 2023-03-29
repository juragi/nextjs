import {useState} from 'react';
import TextField from '@mui/material/TextField';

export default function MoneyInput({passVal, customKeyUp, id, placeholder, label}) {
    const [val, setVal] = useState('')
    const [prev, setPrev] = useState(0);
    const handleInput = (e) => {
        let digit = 4;
        let decimal = 2;
        let regexInput = RegExp("(^[0-9]{0," + digit + "}$)|(^[0-9]{1," + digit + "}[.][0-9]{0," + decimal + "}$)");
        if (e.target.value === ".") {
            setVal("0.");
            //e.target.value = "0.";
        } else if (e.target.value && !regexInput.test(e.target.value)) {
            //e.target.value = prev;
            setVal(prev);
        }
    };
    const handleKeyDown = (e) => {
        setPrev(e.target.value);
    };
    const handleBlur = (e) => {
        let digit = 4;
        let regexChange = RegExp("^[0-9]{0," + digit + "}[.]$");
        let v = e.target.value;
        if (v && regexChange.test(v)) {
            //e.target.value = v + "0";
            setVal(v + "0")
        }
        if(typeof passVal === "function")passVal(Number(e.target.value));
    }
    const handleChange = (e) => {
        setVal(e.target.value);
        if(typeof passVal === "function")passVal(Number(e.target.value));
    }
    const handleKeyUp = (e) => {
        //console.log(passVal)
        if(typeof customKeyUp === "function")customKeyUp(e);
    }

    return (
        <>
        <TextField ref={id} onInput={handleInput} onKeyDown={handleKeyDown} onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            onChange={handleChange}
            value={val}
            label={placeholder || label} variant="standard"
            />
        </>
    )
}