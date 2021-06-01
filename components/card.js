import React, { useState } from 'react'
import { Card, Title, RadioButton, useTheme } from 'react-native-paper';
import Swipeout from 'react-native-swipeout';
import { deleteData, updateData } from '../db/db';

export default function TodoCard({ task, array, setArray }) {
    const [checked, setChecked] = useState(task.done)
    const { colors } = useTheme()
    let swipeBtns = [{
        text: 'Delete',
        backgroundColor: '#c90000',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => handleDelete(task.timeStamp)
    }];
    const handleCheck = async (timeStamp) => {
        checked ? setChecked(0) : setChecked(1);
        setArray(updateData(checked, timeStamp))
    }
    const handleDelete = async (timeStamp) => {
        setArray(deleteData(timeStamp))
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
                        onPress={() => handleCheck(task.timeStamp)}
                    />
                    <Title style={{
                        marginLeft: 10,
                        fontFamily: "JosefinSans-Regular",
                        textDecorationLine: (checked) ? "line-through" : "none"
                    }}>{task.todo}</Title>
                </Card.Content>
            </Card>
        </Swipeout>
    )
}
