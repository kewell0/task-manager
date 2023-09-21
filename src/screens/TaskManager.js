import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
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

  const handleDelete = async (item) => {
    const response = await AsyncStorage.getItem("todo");
    let todos = [];
    if (response !== null) todos = JSON.parse(response);

    const newTodoList = todo.filter((Item) => Item.id !== item.id);
    setTodo(newTodoList);

    await AsyncStorage.setItem("todo", JSON.stringify(newTodoList));
  };

  const displayTodo = (item) => (
    <View style={styles.todos}>
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
          width: "60%",
        }}
        onPress={() =>
          Alert.alert(`${item.title}`, `${item.description}`, [
            {
              text: item.completed ? "Redo Task" : "completed",
              onPress: () => updateTodo(item),
            },
            {
              text: "cancel",
              style: "cancel",
            },
            {
              text: "delete",
              onPress: () => handleDelete(item),
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
              fontSize: 15,
              fontWeight: 700,
              textDecorationLine: item.completed ? "line-through" : "none",
            }}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>

      {/* delete button */}
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={styles.deleteBtnWrapper}
      >
        <Text style={styles.deleteIcon}>X</Text>
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
          <View style={styles.taskCounter}>
            <Text style={{ marginRight: 8 }}> You have</Text>
            <Text style={{ fontWeight: "900" }}>
              {todo.length} {todo.length == 1 ? "task" : "tasks"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.logoutBtn}
        >
          <Text style={{ fontWeight: "800" }}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* Todo Items */}
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
        Todos📄
      </Text>

      <FlatList
        data={todo}
        renderItem={({ item }) => (!item.completed ? displayTodo(item) : null)}
        keyExtractor={(item) => item.id}
      />

      {/* Completed Tasks */}
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
        Completed Tasks✅
      </Text>

      <FlatList
        data={todo}
        renderItem={({ item }) => (item.completed ? displayTodo(item) : null)}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.addTaskBtn}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.modalToggle}
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
                backgroundColor: "#0039a6",
                width: "100%",
                borderRadius: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: "800",
                }}
              >
                Submit
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
  taskCounter: {
    flexDirection: "row",
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#0039a6",
    borderRadius: 8,
    padding: 8,
  },
  todos: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "grey",
    borderBottomWidth: 0.6,
  },
  addTaskBtn: {
    width: "100%",
    alignItems: "flex-end",
  },
  modalToggle: {
    backgroundColor: "lightblue",
    borderRadius: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    marginBottom: 15,
  },
  deleteBtnWrapper: {
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deleteIcon: {
    fontWeight: "900",
    color: "red",
    fontSize: 24,
  },
});
