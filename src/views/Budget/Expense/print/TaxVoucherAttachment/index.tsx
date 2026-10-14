import { useParams } from "react-router-dom";
import { useGetTaxVoucherAttachmentQuery } from "./api/taxVoucherAttachment.api";
import { mapTaxVoucherAttachmentDtoToViewModel } from "./mappers/taxVoucherAttachment.mapper";
import { TaxVoucherAttachment } from "../../../../../components/VoucherAttachment/TaxVoucherAttachment";
import '../print.css';

export default function TaxVoucherAttachmentPrintPage() {
    const { id, detailId } = useParams<{ id: string, detailId: string }>();
    const { data: dto, isLoading, isError, error } = useGetTaxVoucherAttachmentQuery({ id, detailId }, {
        skip: !id || !detailId,
    });

    if (!id) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                ไม่พบรหัสเอกสาร
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    if (isError || !dto) {
        const errorMessage = (error as any)?.data?.message ?? "ไม่สามารถโหลดแบบแนบฎีกาแสดงรายการเสียภาษีได้";
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                {errorMessage}
            </div>
        );
    }

    const viewModel = mapTaxVoucherAttachmentDtoToViewModel(dto);

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white print:min-h-0 print:h-auto">
            <style>{`
                @page {
                    size: A4 landscape;
                    margin: 10mm 15mm;
                }
            `}</style>
            <Toolbar
                id={viewModel.id}
                onPrint={() => window.print()}
            />

            <main className="overflow-auto py-8 px-4 print:overflow-visible print:p-0 print:m-0">
                <TaxVoucherAttachment data={viewModel} />
            </main>
        </div>
    );
}

interface ToolbarProps {
    id: string;
    onPrint: () => void;
}

function Toolbar({ onPrint }: ToolbarProps) {
    return (
        <header className="no-print sticky top-0 z-20 border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <div>
                    <h1 className="text-base font-semibold">
                        แบบแนบฎีกาแสดงรายการเสียภาษี
                    </h1>

                    <div className="text-sm text-slate-500">
                        แบบ 4117
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => window.close()}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        ปิด
                    </button>

                    <button
                        type="button"
                        onClick={onPrint}
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        พิมพ์เอกสาร
                    </button>
                </div>
            </div>
        </header>
    );
}