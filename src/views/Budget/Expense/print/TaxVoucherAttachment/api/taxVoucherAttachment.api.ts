import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TaxVoucherAttachmentResponseDto } from "../dto/taxVoucherAttachment.dto";

export const taxVoucherAttachmentApi = createApi({
    reducerPath: "taxVoucherAttachmentApi",
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
        getTaxVoucherAttachment: builder.query<TaxVoucherAttachmentResponseDto, { id: string; detailId: string }>({
            query: ({ id, detailId }) => `api/budget-expenses/${id}/details/${detailId}/voucher-attachment`,
        }),
    }),
});

export const { useGetTaxVoucherAttachmentQuery } = taxVoucherAttachmentApi;
