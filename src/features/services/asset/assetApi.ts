import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const assetApi = createApi({
    reducerPath: 'assetApi',
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
        getInitialFormData: builder.query<any, void>({
            query: () => ({
                url: '/api/assets/init/form'
            }),
        }),
    }),
});

export const { useGetInitialFormDataQuery } = assetApi;
