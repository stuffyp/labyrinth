import React, {useState} from "react";
import { get, post } from "../../utilities";
import "./APITester.css";

const APITester = (props) => {

    const [endpoint, setEndpoint] = useState("");
    const [value, setValue] = useState("");
    const [responseText, setResponse] = useState("");

    const handleValueChange = (event) => {
        setValue(event.target.value);
    }

    const handleEndpointChange = (event) => {
        setEndpoint(event.target.value);
    }

    const handleClick = () => {
        console.log("/api/"+endpoint);
        const body = value ? JSON.parse(value) : {};
        post("/api/"+endpoint, body).then((response)=>{
            console.log(JSON.stringify(response));
            setResponse(JSON.stringify(response));
        });
    }

  return (
    <div className="api-tester-container">
        <p>API TESTER (DEBUGGING PURPOSES):</p>
        <div className="u-flex">
    <span>Body: </span>
    <input 
        type="text" 
        placeholder="" 
        value={value}
        onChange={handleValueChange}
    />
    <span>Endpoint: </span>
    <input 
        type="text" 
        placeholder="" 
        value={endpoint}
        onChange={handleEndpointChange}
    />
    <button onClick={handleClick}>Send Request</button>
    </div>
    <p>Response:</p>
    <p>{responseText}</p>
    </div>
    
  )
}

export default APITester;