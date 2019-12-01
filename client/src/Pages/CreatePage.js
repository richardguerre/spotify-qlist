import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'react-hookstore';

export default function CreatePage() {
    const [ appStore, setStore ] = useStore('appStore');

    let partyName = ''
    const handleChange = (e) => {
        partyName = e.target.value
    }

    const handleSubmit = (e) => {
        setStore({...appStore, partyName : partyName})
    }

    return (
        <div>
            <label>
                Party Name:{" "}
                <input type="text" name="name" onChange={handleChange} placeholder="I got friends"/>
            </label>
            <Link to={`/queue/${appStore.partyName}`}><input type="submit" value="Submit" onClick={handleSubmit}/></Link>
        </div>
    )
}
