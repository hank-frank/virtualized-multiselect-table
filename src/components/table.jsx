import React, { useState, useEffect } from 'react';
// import WindowedSelect from "react-windowed-select";
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';
import { DataGrid, Button, withTheme } from '@material-ui/core';

const MyTable = (props) => {
    const [selected, setSelected] = useState([]);
    const [indexes, setIndexes] = useState([]);
    const [myTable, setMyTable] = useState([]);
    const [lastClicked, setLastClicked] = useState(0);

    const [list, setList] = useState([]);

    //create placeholder table data 
    useEffect(() => {
        let tempList = list;
        for (let i = 0; i < 10000; i++) {
            tempList.push({
                name: i,
                description: i,
                something: i
            })    
        }
        setList(tempList);
    }, []);

    const rowStyles = (row) => {
        if ( indexes.includes(row.index) )
        return {
            backgroundColor: "#2d87b3", 
            color: "white"
        }
    };

    useEffect(() => {
        console.log('creating table');
        
        setMyTable(<Table 
            width={ 600 }
            height={ 500 }
            headerHeight={ 30 }
            rowHeight={ 25 }
            rowCount={ list.length }
            rowGetter={ ({index}) => list[index] }
            onRowClick={ rowClickEvent }
            rowStyle={ rowStyles }
        >
            <Column 
                label="Name"
                dataKey="name"
                width={200}
            />
            <Column 
                label="Description"
                dataKey="description"
                width={200}
            />
            <Column 
                label="Something"
                dataKey="something"
                width={200}
            />
        </Table>);
    }, [indexes]);

    const testButton = () => {
        console.log(`indexes: `, indexes);
        console.log(`selected: `, selected);
    };

    const rowClickEvent = (event) => {
        console.log(event);
        const indexClicked = event.index;
        const shift = event.event.shiftKey;
        const cmnd = event.event.metaKey;
        let tempIndexes = [...indexes];
        let tempSelected = [...selected];
        setLastClicked(indexClicked);

        if (shift) {
            if (tempIndexes.includes(indexClicked)) {
                console.log('SHIFT already included');
            } else {
                if (indexClicked > lastClicked) {
                    for (let i = lastClicked; i <= indexClicked; i ++) {
                        tempIndexes.push(i);
                        tempSelected.push(list[i]);
                    }
                    setIndexes(tempIndexes);
                    tempSelected = [...new Set(tempSelected)];                        
                    setSelected(tempSelected);
                } else if (indexClicked < lastClicked) {
                    for (let i = indexClicked; i <= lastClicked; i ++) {
                        tempIndexes.push(i);
                        tempSelected.push(list[i]);
                    }
                    setIndexes(tempIndexes);
                    tempSelected = [...new Set(tempSelected)];                        
                    setSelected(tempSelected);
                }
                
            }
        } else if (cmnd) {
            if (tempIndexes.includes(indexClicked)) {
                console.log('already included');
                for (let i = 0; i < tempIndexes.length; i++) {
                    if (tempIndexes[i] === indexClicked) {
                        tempIndexes.splice(i, 1);
                        tempSelected.splice(i, 1);
                    }
                }
                setIndexes(tempIndexes);                
                tempSelected = [...new Set(tempSelected)];                        
                setSelected(tempSelected);
            } else {
                tempIndexes.push(indexClicked);
                tempSelected.push(list[indexClicked]);
                setIndexes(tempIndexes);
                tempSelected = [...new Set(tempSelected)];                        
                setSelected(tempSelected);
            }
        } else { 
            if (tempIndexes.includes(indexClicked)) {
                console.log('already included');
                for (let i = 0; i < tempIndexes.length; i++) {
                    if (tempIndexes[i] === indexClicked) {
                        tempIndexes.splice(i, 1);
                        tempSelected.splice(i, 1);
                    }
                }
                setIndexes(tempIndexes);
                tempSelected = [...new Set(tempSelected)];                        
                setSelected(tempSelected);
            } else {
                tempIndexes.push(indexClicked);
                tempSelected.push(list[indexClicked]);
                setIndexes(tempIndexes);
                tempSelected = [...new Set(tempSelected)];                        
                setSelected(tempSelected);
            }
        }
    };

    const submitTable = () => {
        console.log(`to submit: `, selected);
    };

    return (
        <>
            <Button onClick={ testButton } variant="contained">TestButton</Button>
            { myTable }
            <Button onClick={ submitTable }  variant="contained"> Submit </Button>
        </>
    );
};

export default MyTable;
