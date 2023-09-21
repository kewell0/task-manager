import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const TaskManager = ({ navigation }) => {
  const intialState = {
    id: 0,
    title: "",
    description: "",
    completed: false,
  };

  const [todo, setTodo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState(intialState);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem("todo");
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (title, value) =>
    setNewTodo({ ...newTodo, [title]: value });

  const clear = () => setNewTodo(intialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Please enter all the values.");
      return;
    }

    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
    clear();
    setShowModal(false);
  };

  const updateTodo = (item) => {
    const itemToBeUpdated = todo.filter((todoItem) => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingTodos = todo.filter((todoItem) => todoItem.id != item.id);
    const updatedTodo = [...itemToBeUpdated, ...remainingTodos];

    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
  };

  const handleDelete = async (id) => {
    try {
      await AsyncStorage.removeItem("todo");
      return true;
    } catch (exception) {
      return false;
    }
  };

  const displayTodo = (item) => (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 0.6,
      }}
    >
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",

          paddingVertical: 16,
        }}
        onPress={() =>
          Alert.alert(`${item.title}`, `${item.description}`, [
            {
              text: item.completed ? "Mark InProgress" : "completed",
              onPress: () => updateTodo(item),
            },
            {
              text: "Ok",
              style: "cancel",
            },
          ])
        }
      >
        <BouncyCheckbox
          isChecked={item.completed ? true : false}
          fillColor="blue"
          onPress={() => updateTodo(item)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Text
            style={{
              color: "#000",
              width: "90%",
              fontSize: 16,
              textDecorationLine: item.completed ? "line-through" : "none",
            }}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>

      {/* delete button */}
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Text style={{ fontWeight: "900", color: "red" }}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingVertical: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 28 }}>
            Welcome 👋
          </Text>
          <Text style={{ fontSize: 16 }}>
            You have
            <Text style={{ fontWeight: "900" }}>
              {todo.length} {todo.length == 1 ? "task" : "tasks"}
            </Text>
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>
      {/* Todo Items */}
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
        Todos📄
      </Text>

      <FlatList
        data={todo}
        renderItem={({ item }) => (!item.completed ? displayTodo(item) : null)}
        keyExtractor={todo.id}
      />

      {/* Completed Tasks */}
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
        Completed Tasks✅
      </Text>

      <FlatList
        data={todo}
        renderItem={({ item }) => (item.completed ? displayTodo(item) : null)}
      />

      <View style={styles.addTaskBtn}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: "lightblue",
            borderRadius: 100,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 60,
          }}
        >
          <Text style={{ fontSize: 46 }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              paddingVertical: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          ></View>

          <Text
            style={{
              color: "#000",
              fontSize: 28,
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            Add a Task
          </Text>
          <TextInput
            placeholder="Title"
            value={newTodo.title}
            onChangeText={(title) => handleChange("title", title)}
            style={{
              backgroundColor: "rgb(240, 240, 240)",
              paddingHorizontal: 15,
              borderRadius: 10,
              marginVertical: 10,
              height: 50,
            }}
          />
          <TextInput
            placeholder="Description"
            value={newTodo.description}
            onChangeText={(desc) => handleChange("description", desc)}
            style={{
              backgroundColor: "rgb(240, 240, 240)",
              paddingHorizontal: 15,
              borderRadius: 10,
              marginVertical: 10,
              height: 120,
            }}
            multiline={true}
            numberOfLines={6}
          />

          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: "blue",
                width: 100,
                borderRadius: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 22, color: "#fff", fontWeight: "800" }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addTaskBtn: {
    width: "100%",
    alignItems: "flex-end",
  },
});
