import TextField from '@mui/material/TextField';
import {useState} from 'react';

export default function NumberInput({id, label}) {
    const [prev, setPrev] = useState(0);
    const handleInput = (e) => {
        let digit = 4;
        let decimal = 2;
        let regexInput = RegExp("(^[0-9]{0," + digit + "}$)|(^[0-9]{1," + digit + "}[.][0-9]{0," + decimal + "}$)");
        if (e.target.value === ".") {
            e.target.value = "0.";
        } else if (e.target.value && !regexInput.test(e.target.value)) {
            e.target.value = prev;
        }
    };
    const handleKeyDown = (e) => {
        setPrev(e.target.value);
    };
    const handleBlur = (e) => {
        let digit = 4;
        let regexChange = RegExp("^[0-9]{0," + digit + "}[.]$");
        if (e.target.value && regexChange.test(e.target.value)) {
            e.target.value = e.target.value + "0";
        }
        passVal(Number(e.target.value));
    }
    const handleChange = (e) => {
        passVal(Number(e.target.value));
    }
    const handleKeyUp = (e) => {
        //console.log(passVal)
        customKeyUp(e);
    }
    
    return (
        <>
            <TextField ref={id} label={label} 
                onInput={handleInput} onKeyDown={handleKeyDown} onBlur={handleBlur}
                onKeyUp={handleKeyUp}
                onChange={handleChange}
            variant="standard"/>
        </>
    );
}