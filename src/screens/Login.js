import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      Alert.alert("Login Successful", "Welcome back!");
      navigation.navigate("TaskManager");
      setUsername("");
      setPassword("");
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="auto" />
      <View>
        <View style={styles.header}>
          <Text style={styles.header}>Login</Text>
        </View>
        <TextInput
          style={styles.formInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
          <Text style={styles.buttonText}> Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#acb7ae",
  },
  header: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  formInput: {
    backgroundColor: "rgb(240, 240, 240)",
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
    height: 50,
    width: 300,
  },
  buttonWrapper: {
    backgroundColor: "#0039a6",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
