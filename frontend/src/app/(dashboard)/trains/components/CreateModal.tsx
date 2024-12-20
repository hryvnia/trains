import { api, apiClient } from "@/lib";
import { Train } from "@/types";
import { Button, Modal, ModalProps, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const createTrain = async (newTrain: Train) => {
  const { data } = await apiClient.post<Train>("/api/trains", newTrain);
  return data;
};

export const CreateModal: FC<
  {
    train_id?: Train["id"];
  } & Pick<ModalProps, "opened" | "onClose">
> = ({ train_id, ...props }) => {
  const creating = train_id === "create";

  const { train } = api.useGetTrainsQuery(
    {},
    {
      selectFromResult: (res) => ({
        ...res,
        train: res.data?.find((t) => t.id === train_id),
      }),
    }
  );

  const [createTrain, createTrainRes] = api.useCreateTrainMutation();
  const [updateTrain, updateTrainRes] = api.useUpdateTrainMutation();

  const { register, formState, handleSubmit, reset } = useForm<Train>({});

  useEffect(() => {
    if (train) {
      reset(train);
    } else {
      reset({
        number: "",
        route: "",
      });
    }
  }, [train, reset]);

  return (
    <Modal title={creating ? "Створення" : "Редагування"} {...props}>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            const train = await (creating
              ? createTrain(data).unwrap()
              : updateTrain(data).unwrap());

            notifications.show({
              color: "green",
              title: `${creating ? "Створення" : "Редагування"} потяга ${
                train.number
              }`,
              message: `Дані збережено успішно`,
            });

            reset();
            props.onClose();
          } catch (err) {
            //
          }
        })}
      >
        <Stack>
          <TextInput
            label="Номер"
            {...register("number", { required: true })}
            placeholder="123"
          />
          <TextInput
            label="Сполучення"
            {...register("route", { required: true })}
            placeholder="Харків-Пас - Київ-Пас"
          />
          <Button type="submit" loading={formState.isSubmitting} fullWidth>
            {creating ? "Створити" : "Зберегти зміни"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
