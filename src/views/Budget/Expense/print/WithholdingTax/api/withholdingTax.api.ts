import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WithholdingTaxResponseDto } from "../dto/withholdingTax.dto";

export const withholdingTaxApi = createApi({
    reducerPath: "withholdingTaxApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL || "/api/v1",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("access_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getWithholdingTaxCertificate: builder.query<WithholdingTaxResponseDto, { id: string; detailId: string }>({
            query: ({ id, detailId }) => `api/budget-expenses/${id}/details/${detailId}/withholding-tax`,
        }),
    }),
});

export const { useGetWithholdingTaxCertificateQuery } = withholdingTaxApi;
