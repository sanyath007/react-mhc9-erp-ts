import type {
    Signer,
} from "../../types";

interface SignatureSectionProps {
    signer?: Signer;
}

export function SignatureSection({
    signer,
}: SignatureSectionProps) {
    return (
        <section className="mt-[10mm] print:mt-[6mm] ml-auto w-[55%] text-center text-[16pt]">
            <div>
                ลงชื่อ
                <span className="ml-2 inline-block w-[65mm] border-b border-dotted border-black">
                    &nbsp;
                </span>
            </div>

            <div className="pl-12">
                (
                <span className="inline-block min-w-[60mm]">
                    {signer?.name ?? ""}
                </span>
                )
            </div>

            <div>
                ตำแหน่ง
                <span className="ml-2 inline-block min-w-[52mm] border-b border-dotted border-black">
                    {signer?.position ?? ""}
                </span>
            </div>
        </section>
    );
}