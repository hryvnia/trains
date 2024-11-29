import { Button, Stack, TextInput } from "@mantine/core";
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
            alert(result.error);
          }
        } catch (err) {
          alert("unknown error");
        }

        //
      })}
    >
      <Stack>
        <TextInput
          label="email or username"
          {...register("username")}
          autoComplete="email username"
        />
        <TextInput
          label="password"
          {...register("password")}
          autoComplete="password"
        />
        <Button type="submit" loading={formState.isSubmitting}>
          send
        </Button>
      </Stack>
    </form>
  );
};
