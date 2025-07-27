import { View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { colors } from "../../styles/colors";
import { AuthLayout } from "../../components/AuthLayout";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuth } from '../../hooks/useAuth';
import { isAxiosError } from 'axios';

const schema = z.object({
  email: z.email("Informe um e-email válido"),
  password: z.string().min(8, "Deve conter pelo menos 8 caracteres"),
});

export default function SignIn() {
  const form = useForm({
    // resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    const {signIn} = useAuth()
  

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await signIn(formData);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      if (isAxiosError(error)) {
        console.log("🚀 ~ handleSubmit ~ error:", error.response?.data);
      }
      
    }
   
  });
  return (
    <AuthLayout
      icon="👤"
      title="Entre em sua conta"
      subtitle="Acesse sua conta para continuar"
    >
      <View className="justify-between flex-1">
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ justifyContent: "center" }}
        >
          <View className="gap-6 mt-10">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  placeholder="Digite sua senha"
                  label="Senha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </View>
        </KeyboardAwareScrollView>

        <View className="flex-row gap-6">
          <Button onPress={router.back} size="icon" color="gray">
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>

          <Button
            className="flex-1"
            onPress={handleSubmit}
            loading={form.formState.isSubmitting}
          >
            Entrar
          </Button>
        </View>
      </View>
    </AuthLayout>
  );
}
