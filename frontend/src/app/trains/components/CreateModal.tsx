import { apiClient } from "@/lib";
import { Train } from "@/types";
import { Button, Modal, ModalProps, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";

const createTrain = async (newTrain: Train) => {
  const { data } = await apiClient.post<Train>("/api/trains", newTrain);
  return data;
};

export const CreateModal: FC<{} & Pick<ModalProps, "opened" | "onClose">> = ({
  ...props
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTrain,
    onSuccess: (newTrain) => {
      // Обновляем кэш списка поездов после успешного создания
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Ошибка при создании поезда:", error);
    },
  });

  const { register, formState, handleSubmit } = useForm<Train>();

  return (
    <Modal {...props} title="Create">
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await mutation.mutateAsync(data);
          } catch (err) {
            //
          }
        })}
      >
        <TextInput label="number" {...register("number")} />
        <TextInput label="route" {...register("route")} />
        <Button type="submit" loading={formState.isSubmitting}>
          create
        </Button>
      </form>
    </Modal>
  );
};
