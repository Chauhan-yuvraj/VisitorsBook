import { View } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/auth.slice";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const dispatch = useAppDispatch();
  // 1. Add local state to control the button spinner
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "yuvraj.chauhan@abhyuday.in",
      password: "abhyuday@123",
    },
  });

  const onSubmit = (data: FormValues) => {
    // 2. Start loading
    setIsLoggingIn(true);

    dispatch(login(data))
      .unwrap() // Wait for the promise to resolve or reject
      .then(() => {
        router.replace("/(admin)/Dashboard");
      })
      .catch((error) => {
        // 3. Error: Stop loading so user can try again
        setIsLoggingIn(false);
        alert(error || "Invalid email or password");
      });
  };

  return (
    <View className="gap-4 border p-6 rounded-lg bg-white/90 shadow-md">
      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Email"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ minWidth: 300, backgroundColor: "white" }}
              error={!!errors.email}
              disabled={isLoggingIn} // Disable input while loading
            />
            {errors.email && (
              <HelperText type="error">{errors.email.message}</HelperText>
            )}
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Password"
              mode="outlined"
              value={value}
              secureTextEntry
              onChangeText={onChange}
              style={{ minWidth: 300, backgroundColor: "white" }}
              error={!!errors.password}
              disabled={isLoggingIn} // Disable input while loading
            />
            {errors.password && (
              <HelperText type="error">{errors.password.message}</HelperText>
            )}
          </>
        )}
      />

      {/* 4. Button with Loading Prop */}
      <Button
        mode="contained"
        loading={isLoggingIn} // Shows the spinner
        disabled={isLoggingIn} // Prevents clicking twice
        style={{ borderRadius: 8, backgroundColor: "#000" }}
        onPress={handleSubmit(onSubmit)}
      >
        Login
      </Button>
    </View>
  );
}
