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
import { apiClient } from "@/lib";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Train } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { fetchTrains } from "../page";

const updateTrain = async (train: Train) => {
  const { data } = await apiClient.patch<Train>(
    `/api/trains/${train.id}`,
    train
  );
  return data;
};

export default function Home() {
  const router = useRouter();

  const { train_id } = useParams<{ train_id: string }>();

  const queryClient = useQueryClient();
  const {
    data: trains,
    error,
    isLoading,
  } = useQuery<Train[], any>({
    queryKey: ["trains"],
    queryFn: fetchTrains,

    enabled: queryClient.getQueryData(["trains"]) === undefined,
    initialData: () => queryClient.getQueryData(["trains"]),
  });

  //   const train = trains?.find((t) => t.id === train_id);

  const mutation = useMutation({
    mutationFn: updateTrain,
    onSuccess: (newTrain) => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании поезда:", error);
    },
  });

  const { register, formState, handleSubmit, reset } = useForm<Train>({});

  useEffect(() => {
    const train = trains?.find((t) => t.id === train_id);
    if (train) {
      reset(train);
    }
  }, [trains, reset]);

  return (
    <div>
      <Container>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <form
            onSubmit={handleSubmit(async (data) => {
              try {
                await mutation.mutateAsync(data);
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
