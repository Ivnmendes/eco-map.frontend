import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataContext } from '../context/DataContext';
import DropDownPicker from 'react-native-dropdown-picker';

export default function MultiSelectDropdown({ value, setValue, open, setOpen }) { 
    const { collectionTypes } = useContext(DataContext);
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (collectionTypes && collectionTypes.results) {
            setItems(collectionTypes.results.map(type => ({
                label: type.name,
                value: type.id
            })));
        }
    }, [collectionTypes]);
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Selecione o tipo de coleta:</Text>
            <DropDownPicker
                listMode="FLATLIST"
                open={open}
                value={value || []}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                multiple={true}
                min={0}
                placeholder={"Selecione as categorias:"}
                mode="BADGE"
                badgeDotColors={["#256D5B"]}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                listItemLabelStyle={styles.listItemLabel}
                selectedItemLabelStyle={styles.selectedItemLabel}
                dropDownContainerStyle={styles.customDropDownContainer}
                listItemContainerStyle={styles.customListItemContainer}
                selectedItemContainerStyle={styles.customSelectedItemContainer}
                tickIconStyle={styles.customDropDownContainerTick}
                badgeTextStyle={styles.badgeText}
                badgeColors={["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
                zIndex={5000}       
                zIndexInverse={1000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        width: '100%',
        marginBottom: 12,
        zIndex: 5000
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
    dropdown: {
        backgroundColor: '#f8f4f4',
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownText: {
        fontSize: 16,
    },
    customDropDownContainer: {
        backgroundColor: '#f7f5f5', 
        borderColor: '#888',    
        borderWidth: 1,
        borderRadius: 8,          
        maxHeight: 250,           
    },
    customListItemContainer: {
        paddingHorizontal: 12,    
        paddingVertical: 10,      
        borderBottomColor: '#eeeeee', 
        borderBottomWidth: 0.5, 
    },
    customSelectedItemContainer: {
        backgroundColor: '#caedc2',
    },
    customDropDownContainerTick: {
        color: "#fff"
    },
    listItemLabel: {
       fontSize: 16,
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#000',
    },
    badgeText: {
        fontSize: 14,
    },
    selectedValue: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
});