import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

export const RegisterForm = () => {
  const router = useRouter();
  const { control, register, handleSubmit, formState } = useForm<{
    email: string;
    username: string;
    password: string;
  }>();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
              ...data,
            }
          );
          console.log(res.data);

          const result = await signIn("credentials", {
            ...data,
            redirect: false,
          });
          if (result?.ok) {
            router.push("/");
          }
          if (result?.error) {
            alert(result.error);
          }
        } catch (err) {
          console.log(err);
        }
      })}
    >
      <Stack>
        <TextInput label="Email" {...register("email", { required: true })} />
        <TextInput
          label="Ім'я користувача"
          {...register("username", { required: true })}
        />
        <PasswordInput label="Пароль" {...register("password")} />
        <Button type="submit" loading={formState.isSubmitting}>
          Зареєструватися
        </Button>
      </Stack>
    </form>
  );
};
