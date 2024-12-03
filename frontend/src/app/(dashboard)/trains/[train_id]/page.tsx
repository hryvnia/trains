"use client";

import { useForm } from "react-hook-form";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api, apiClient } from "@/lib";

import { Train } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { train_id } = useParams<{ train_id: string }>();

  const { data: trains, isFetching } = api.useGetTrainsQuery({});
  //   const train = trains?.find((t) => t.id === train_id);

  const [createTrain, createTrainRes] = api.useCreateTrainMutation();
  const [updateTrain, updateTrainRes] = api.useUpdateTrainMutation();

  const { register, formState, handleSubmit, reset } = useForm<Train>({});

  useEffect(() => {
    const train = trains?.find((t) => t.id === train_id);
    if (train) {
      reset(train);
    }
  }, [trains, reset]);

  return (
    <Modal opened onClose={() => {}}>
      test
    </Modal>
  );

  return (
    <div>
      <Container>
        {isFetching ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <form
            onSubmit={handleSubmit(async (data) => {
              try {
                await updateTrain(data);
              } catch (err) {}
            })}
          >
            <TextInput label="number" {...register("number")} />
            <TextInput label="route" {...register("route")} />
            <Button type="submit" loading={formState.isSubmitting}>
              save
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
}
