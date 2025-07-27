import { Controller, useFormContext } from "react-hook-form";
import { View, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "../Input";
import { SignUpFormData } from "./signUpSchema";

export function AccountStep() {
  const { control } = useFormContext<SignUpFormData>();

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={55}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{  justifyContent: "center" }} className="gap-4  py-6">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
              placeholder="Seu melhor e-mail"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
            className='mb-5'
              label="Senha"
              placeholder="Digite sua senha (min. 8 caracteres)"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
