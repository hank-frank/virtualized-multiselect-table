import React, { useState, useEffect } from 'react';
// import WindowedSelect from "react-windowed-select";
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';
import { DataGrid, Button, withTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const MyTable = (props) => {
    const [selected, setSelected] = useState([]);
    const [indexes, setIndexes] = useState([]);
    const [myTable, setMyTable] = useState([]);
    const [lastClicked, setLastClicked] = useState();
    const [list, setList] = useState([]);

    useEffect(() => {
        //create placeholder table data 
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
        if ( indexes.includes(row.index) ) {
            return {
                backgroundColor: "#2d87b3", 
                color: "white",
                borderRight: '1px solid black'
            } 
        } else if (row.index === -1) {
            return {
                backgroundColor: "#808080", 
                color: "white"
            }
        }
    };

    useEffect(() => {
        //this table generation is in this useEffect to trigger a re-render of it with the updated row styling to visually indicate selection, if not in a useEffect it will not re-render, the above function to apply the styles conditionally is not enough on it's own
        setMyTable(<Table 
            width={ 600 }
            height={ 500 }
            headerHeight={ 30 }
            rowHeight={ 25 }
            rowCount={ list.length }
            rowGetter={ ({index}) => list[index] }
            onRowClick={ rowClickEvent }
            rowStyle={ rowStyles }
            style={ {width: 'fit-content', border: "2px solid black"} }
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
        // This uses an object property to check for duplicates, if 'name' is not a unique object property a different unique object prop will need to be used
        //This filtering for unique is here to prevent duplicate additions to the arrays with multiple shift range selections in a row. 
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
        const alt = event.event.altKey;
        const ctrl = event.event.ctrlKey;
        //the arrays here need to be copied this way so that the depencendy array of the useEffect above recognizes them as a state change, otherwise the table will never re-render. 
        let tempIndexes = [...indexes];
        let tempSelected = [...selected];
        setLastClicked(indexClicked);

        if (shift) {
            //need to check if clicked and last clicked are both inside of a selected range and add to conditional for range deselsect
            if (tempIndexes.includes(indexClicked) && tempIndexes.includes(lastClicked) && indexClicked > lastClicked) {
                tempIndexes.splice(lastClicked, Math.abs(indexClicked - lastClicked) + 1);
                tempSelected.splice(lastClicked, Math.abs(indexClicked - lastClicked) + 1);
                //these filter for unique are not necessary for each and every one of these it was just easier to add it to all of them
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
            } else {
                tempIndexes.push(indexClicked);
                tempSelected.push(list[indexClicked]);
                setIndexes(filterIndexesForUnique(tempIndexes));                       
                setSelected(filterSelectedForUnique(tempSelected));
            }     
        } else if (cmnd || ctrl) {
            //This works on Mac, the ctrl registers as a right click and so the click event of the ctrl never registers in teh browser as the OS picks it up. 
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
            <Button onClick={ submitTable }  variant="contained" > Submit </Button>
        </>
    );
};

export default MyTable;
