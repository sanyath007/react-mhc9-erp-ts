import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaxVoucherAttachment } from "../../../../../api/mockdata/voucherAttachment.api";
import { TaxVoucherAttachment } from "../../../../../components/VoucherAttachment/TaxVoucherAttachment";
import type { TaxVoucherAttachment as TaxVoucherAttachmentModel } from "../../../../../types";
import '../print.css'

export default function TaxVoucherAttachmentPrintPage() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<TaxVoucherAttachmentModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("ไม่พบรหัสเอกสาร");
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const result = await getTaxVoucherAttachment(id);
                setData(result);
            } catch {
                setError("ไม่สามารถโหลดแบบแนบฎีกาแสดงรายการเสียภาษีได้");
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                {error ?? "ไม่พบข้อมูล"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white print:min-h-0 print:h-auto">
            <style>{`
                @page {
                    size: A4 landscape;
                    margin: 10mm 15mm;
                }
            `}</style>
            <Toolbar
                id={data.id}
                onPrint={() =>
                    window.print()
                }
            />

            <main className="overflow-auto py-8 px-4 print:overflow-visible print:p-0 print:m-0">
                <TaxVoucherAttachment
                    data={data}
                />
            </main>
        </div>
    );
}

interface ToolbarProps {
    id: string;
    onPrint: () => void;
}

function Toolbar({ id, onPrint }: ToolbarProps) {
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