import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react'
import { Card, Title, RadioButton, useTheme } from 'react-native-paper';
import Swipeout from 'react-native-swipeout';

export default function TodoCard({ task, array, setArray }) {
    const [checked, setChecked] = useState(task.completed)
    const { colors } = useTheme()
    let swipeBtns = [{
        text: 'Delete',
        backgroundColor: '#c90000',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => handleDelete(task.id)
    }];
    const handleCheck = async (id) => {
        setChecked(!checked)
        console.log(checked, "this the value")
        console.log("array before=", array)
        array.forEach((elem) => {
            if (elem.id == id) {
                elem.completed = !checked
            }
        })
        console.log("array after=", array)
        let str = JSON.stringify(array)
        await AsyncStorage.setItem('tasks', str)
        setArray(array)
    }

    const handleDelete = async (id) => {
        let newArray = array.filter(item => item.id != id)
        setArray(newArray)
        let str = JSON.stringify(newArray)
        await AsyncStorage.setItem('tasks', str)
    }
    return (
        <Swipeout right={swipeBtns}
            autoClose={true}
            backgroundColor='transperent'
            style={{ marginTop: 10, borderRadius: 20 }}>
            <Card>
                <Card.Content style={{ display: "flex", flexDirection: "row", backgroundColor: colors.accent }}>
                    <RadioButton
                        uncheckedColor="red"
                        status={checked ? 'checked' : "unchecked"}
                        onPress={() => handleCheck(task.id)}
                    />
                    <Title style={{
                        marginLeft: 10,
                        fontFamily: "JosefinSans-Regular",
                        textDecorationLine: (checked) ? "line-through" : "none"
                    }}>{task.text}</Title>
                </Card.Content>
            </Card>
        </Swipeout>
    )
}
