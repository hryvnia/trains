import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const router = useRouter();
  const { control, register, handleSubmit, formState } = useForm<{
    username: string;
    password: string;
  }>();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          const result = await signIn("credentials", {
            ...data,
            redirect: false,
          });

          if (result?.ok) {
            router.push("/");
          }
          if (result?.error) {
            notifications.show({
              color: "red",
              title: "Помилка",
              message: result.error,
            });
          }
        } catch (err) {
          alert("unknown error");
        }

        //
      })}
    >
      <Stack>
        <TextInput
          label="Email або ім'я користувача"
          {...register("username")}
          autoComplete="email username"
        />
        <PasswordInput
          label="Пароль"
          {...register("password")}
          autoComplete="password"
        />
        <Button type="submit" loading={formState.isSubmitting}>
          Авторизуватись
        </Button>
      </Stack>
    </form>
  );
};
