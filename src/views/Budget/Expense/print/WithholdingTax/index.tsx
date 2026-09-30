import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWithholdingTaxCertificate } from "../../../../../api/mockdata/withholdingTax.api";
import { WithholdingTaxCertificate } from "../../../../../components/WithholdingTex/WithholdingTaxCertificate";
import type { WithholdingTaxCertificate as WithholdingTaxCertificateModel } from "../../../../../types";
import '../print.css'

export default function WithholdingTaxPrintPage() {
    const { id } = useParams<{ id: string; }>();
    const [data, setData] = useState<WithholdingTaxCertificateModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!id) {
            setError("ไม่พบรหัสหนังสือรับรอง");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await getWithholdingTaxCertificate(id);
            setData(result);
        } catch (err) {
            if (err) {
                if (err.status === 404) {
                    setError("ไม่พบข้อมูลหนังสือรับรองการหักภาษี ณ ที่จ่าย");
                } else if (err.status === 401 || err.status === 403) {
                    setError("คุณไม่มีสิทธิ์เข้าถึงเอกสารนี้");
                } else {
                    setError(err.message);
                }
            } else {
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error || !data) {
        return (
            <ErrorState
                message={error ?? "ไม่พบข้อมูล"}
                onRetry={loadData}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white print:min-h-0 print:h-auto">
            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 15mm 20mm;
                }
            `}</style>
            <PrintToolbar
                id={data.id}
                certificateNo={data.certificateNo}
                onPrint={handlePrint}
            />

            <main className="overflow-auto py-8 px-4 print:overflow-visible print:p-0 print:m-0">
                <WithholdingTaxCertificate data={data} />
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