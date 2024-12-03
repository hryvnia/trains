import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib";
import { Report, Schedule, ScheduleFull, Station, Train } from "@/types";
import dayjs from "dayjs";

export const api = createApi({
  reducerPath: "generalApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Train", "Station", "Schedule", "Report"],

  endpoints: (builder) => ({
    getTrains: builder.query<Train[], {}>({
      query: () => ({
        url: `/trains`,
        method: "get",
      }),
      providesTags: ["Train"],
    }),
    createTrain: builder.mutation<Train, Omit<Train, "id">>({
      query: (data) => ({
        url: `/trains`,
        method: "post",
        data,
      }),
      invalidatesTags: ["Train"],
    }),
    updateTrain: builder.mutation<Train, Train>({
      query: ({ id, ...data }) => ({
        url: `/trains/${id}`,
        method: "patch",
        data,
      }),
      invalidatesTags: ["Train"],
    }),
    deleteTrain: builder.mutation<{}, Train["id"]>({
      query: (id) => ({
        url: `/trains/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Train"],
    }),
    //
    getStations: builder.query<Station[], {}>({
      query: () => ({
        url: `/stations`,
        method: "get",
      }),
      providesTags: ["Station"],
    }),
    //

    getSchedules: builder.query<ScheduleFull[], {}>({
      query: () => ({
        url: `/schedules`,
        method: "get",
      }),
      providesTags: ["Schedule"],
    }),

    createSchedule: builder.mutation<Schedule, Schedule>({
      query: (data) => ({
        url: `/schedules`,
        method: "post",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    updateSchedule: builder.mutation<Schedule, Schedule>({
      query: ({ id, ...data }) => ({
        url: `/schedules/${id}`,
        method: "patch",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    deleteSchedule: builder.mutation<Schedule, Schedule["id"]>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Schedule"],
    }),

    getSchedulesStats: builder.query<
      { hour: number; arrivals: Schedule[]; departures: Schedule[] }[],
      { date: string }
    >({
      query: ({ date }) => ({
        url: `/schedules/stats/${dayjs(date).format("YYYY-MM-DD")}`,
        method: "get",
      }),
      providesTags: ["Schedule"],
    }),

    //
    getReports: builder.query<
      Report[],
      {
        all?: boolean;
      }
    >({
      query: ({ ...params }) => ({
        url: `/reports`,
        method: "get",
        params,
      }),
      providesTags: ["Report"],
      keepUnusedDataFor: 0,
    }),
    generateReport: builder.mutation<Report, Omit<Report, "id">>({
      query: (data) => ({
        url: `/reports`,
        method: "post",
        data,
      }),
      invalidatesTags: ["Report"],
    }),
    deleteReport: builder.mutation<Report, Report["id"]>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});
