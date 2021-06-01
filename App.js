import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import Header from './components/header'
import { DefaultTheme, Provider, DarkTheme, TextInput, Button, FAB, Modal, Portal } from 'react-native-paper'
import Card from './components/card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getData, insertData } from './db/db';

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    setTasks(getData());
    return () => {
      setRefreshing(false)
    }
  }, [refreshing])

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
      text: "black",
      accent: "#f2f2f2"
    },
  };
  const darkTheme = {
    ...DarkTheme,
    roundness: 2,
    colors: {
      ...DarkTheme.colors,
      background: 'black',
      text: "#fff",
      accent: '#232323',
    },
  };

  const handleSubmit = async () => {
    if (text != '') {
      setTasks(insertData(text))
      setVisible(false)
      setText('')
    }
  }

  return (
    <Provider theme={(darkMode) ? darkTheme : theme}>
      <Header theme={darkMode} setTheme={setDarkMode} />
      <View style={{ flex: 1, backgroundColor: (darkMode) ? "black" : "#ffff", padding: 5, justifyContent: "center" }}>
        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{
            backgroundColor: (darkMode) ? "#232323" : "#f2f2f2",
            padding: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <MaterialIcons name="add-task" size={100} style={{ color: darkMode ? "#616161" : "#b7b7b7" }} />
            <View style={{
              width: "65%"
            }}>
              <TextInput
                label="Task..."
                value={text}
                mode="outlined"
                theme={{
                  colors: {
                    primary: "#616161",
                    accent: "#232323",
                  },
                }}
                onChangeText={text => setText(text)}
              />
              <Button mode="text"
                theme={{
                  colors: {
                    primary: "red",
                  },
                }}
                style={{ marginTop: 10 }}
                onPress={() => handleSubmit()}>
                Done
            </Button>
            </View>
          </Modal>
        </Portal>
        {(tasks.length != 0) ?
          <FlatList
            data={tasks}
            renderItem={({ item }) => {
              return <Card task={item} array={tasks} setArray={setTasks} />
            }}
            keyExtractor={(item) => item.timeStamp}
            onRefresh={() => setRefreshing(true)}
            refreshing={refreshing}
          />
          :
          <View>
            <Text style={{
              fontFamily: "JosefinSans-Regular",
              fontSize: 60,
              color: darkMode ? "#fff" : "#333",
              textAlign: "center",
            }}>
              Whoops !
             </Text>
            <Text style={{
              fontFamily: "JosefinSans-Regular",
              fontSize: 25,
              color: darkMode ? "#fff" : "#333",
              textAlign: "center",
            }}>
              Nothing to do.
        </Text>
          </View>
        }
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon="plus"
          onPress={() => setVisible(!visible)}
        />
      </View>
    </Provider >
  )
}
