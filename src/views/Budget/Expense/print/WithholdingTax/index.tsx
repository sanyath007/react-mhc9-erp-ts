import { useParams } from "react-router-dom";
import { useGetWithholdingTaxCertificateQuery } from "./api/withholdingTax.api";
import { mapWithholdingTaxDtoToViewModel } from "./mappers/withholdingTax.mapper";
import { WithholdingTaxCertificate } from "../../../../../components/WithholdingTex/WithholdingTaxCertificate";
import '../print.css';

export default function WithholdingTaxPrintPage() {
    const { id, detailId } = useParams<{ id: string, detailId: string }>();
    const { data: dto, isLoading, isError, error, refetch } = useGetWithholdingTaxCertificateQuery({ id, detailId }, {
        skip: !id || !detailId,
    });

    const handlePrint = () => {
        window.print();
    };

    if (!id) {
        return <ErrorState message="ไม่พบรหัสหนังสือรับรอง" onRetry={() => { }} />;
    }

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !dto) {
        const errorMessage = (error as any)?.data?.message ?? "ไม่สามารถโหลดข้อมูลหนังสือรับรองการหักภาษี ณ ที่จ่าย ได้";
        return (
            <ErrorState
                message={errorMessage}
                onRetry={refetch}
            />
        );
    }

    const viewModel = mapWithholdingTaxDtoToViewModel(dto);

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white print:min-h-0 print:h-auto">
            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 15mm 20mm;
                }
            `}</style>
            <PrintToolbar
                id={viewModel.id}
                certificateNo={viewModel.certificateNo}
                onPrint={handlePrint}
            />

            <main className="overflow-auto py-8 px-4 print:overflow-visible print:p-0 print:m-0">
                <WithholdingTaxCertificate data={viewModel} />
            </main>
        </div>
    );
}

interface PrintToolbarProps {
    id: string;
    certificateNo?: string;
    onPrint: () => void;
}

function PrintToolbar({
    id,
    certificateNo,
    onPrint,
}: PrintToolbarProps) {
    return (
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
                <div>
                    <h1 className="text-base font-semibold text-slate-900">
                        หนังสือรับรองการหักภาษี ณ ที่จ่าย
                    </h1>

                    <p className="mt-0.5 text-sm text-slate-500">
                        {certificateNo || `Document ID: ${id}`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
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
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        พิมพ์เอกสาร
                    </button>
                </div>
            </div>
        </header>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

                <p className="mt-3 text-sm text-slate-600">
                    กำลังโหลดข้อมูล...
                </p>
            </div>
        </div>
    );
}

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">ไม่สามารถแสดงเอกสารได้</h2>

                <p className="mt-2 text-sm text-slate-600">{message}</p>

                <button
                    type="button"
                    onClick={() => void onRetry()}
                    className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    ลองใหม่
                </button>
            </div>
        </div>
    );
}