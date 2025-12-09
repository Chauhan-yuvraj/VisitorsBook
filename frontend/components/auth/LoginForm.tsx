import { View } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/auth.slice";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const dispatch = useAppDispatch();

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
    dispatch(login(data))
      .unwrap()
      .then(() => {
        router.replace("/(admin)/Dashboard");
      })
      .catch(() => {
        alert("Invalid email or password");
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
            />
            {errors.password && (
              <HelperText type="error">{errors.password.message}</HelperText>
            )}
          </>
        )}
      />

      <Button
        mode="contained"
        style={{ borderRadius: 8, backgroundColor: "#000" }}
        onPress={handleSubmit(onSubmit)}
      >
        Login
      </Button>
    </View>
  );
}
