import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const systemApi = createApi({
    reducerPath: 'systemApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("access_token");

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);

                return headers;
            }
        },
    }),
    endpoints: (builder) => ({
        getSystemInfo: builder.query<any, void>({
            query: () => ({
                url: '/api/system',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetSystemInfoQuery } = systemApi;
