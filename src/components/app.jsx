import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Button } from '@material-ui/core';
import MyTable from './table.jsx';


function App () {
    return (
        <>
            <h1>Headline</h1>
            <MyTable />
        </>
    )
};

export default App;
