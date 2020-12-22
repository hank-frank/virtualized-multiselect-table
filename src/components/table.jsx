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

    const filterIndexesForUnique = (array) => {
        return [...new Set(array)];
    }

    const filterSelectedForUnique = (array) => {
        let flags = {};
        let final = array.filter((each) => {
            if (flags[each.name]) {
                return false;
            }
            flags[each.name] = true;
            return true;
        })
        return final;
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
            //need to check if clicked and last clicked are both inside of a selected range and add ot conditional for range deselsect
            if (tempIndexes.includes(indexClicked) && tempIndexes.includes(lastClicked) && indexClicked > lastClicked) {
                tempIndexes.splice(lastClicked, Math.abs(indexClicked - lastClicked) + 1);
                tempSelected.splice(lastClicked, Math.abs(indexClicked - lastClicked) + 1);
                setIndexes(filterIndexesForUnique(tempIndexes));
                setSelected(filterSelectedForUnique(tempSelected));
            } else if (indexClicked > lastClicked) {
                for (let i = lastClicked; i <= indexClicked; i ++) {
                    tempIndexes.push(i);
                    tempSelected.push(list[i]);
                }
                setIndexes(filterIndexesForUnique(tempIndexes));
                setSelected(filterSelectedForUnique(tempSelected));
            } else if (indexClicked < lastClicked) {
                for (let i = indexClicked; i <= lastClicked; i ++) {
                    tempIndexes.push(i);
                    tempSelected.push(list[i]);
                }
                setIndexes(filterIndexesForUnique(tempIndexes));
                setSelected(filterSelectedForUnique(tempSelected));
            }        
        } else if (cmnd) {
            if (tempIndexes.includes(indexClicked)) {
                for (let i = 0; i < tempIndexes.length; i ++) {
                    if (indexClicked === tempIndexes[i]) {
                        tempIndexes.splice(i, 1);
                        tempSelected.splice(i, 1);
                    }
                }   
                setIndexes(filterIndexesForUnique(tempIndexes));                        
                setSelected(filterSelectedForUnique(tempSelected));
            } else {
                tempIndexes.push(indexClicked);
                tempSelected.push(list[indexClicked]);
                setIndexes(filterIndexesForUnique(tempIndexes));                       
                setSelected(filterSelectedForUnique(tempSelected));
            }
        } else { 
            if (tempIndexes.includes(indexClicked)) {
                if (tempIndexes.length > 1) {
                    tempIndexes = [];
                    tempSelected = [];
                    tempIndexes.push(indexClicked);
                    tempSelected.push(list[indexClicked]);
                    setIndexes(filterIndexesForUnique(tempIndexes));                       
                    setSelected(filterSelectedForUnique(tempSelected));
                } else {
                    setIndexes([]);                       
                    setSelected([]);
                }
            } else {
                tempIndexes = [];
                tempSelected = [];
                tempIndexes.push(indexClicked);
                tempSelected.push(list[indexClicked]);
                setIndexes(filterIndexesForUnique(tempIndexes));                       
                setSelected(filterSelectedForUnique(tempSelected));
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
