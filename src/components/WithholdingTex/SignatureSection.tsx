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
        <section
            className="
        mt-[14mm]
        ml-auto
        w-[55%]
        text-center
      "
        >
            <div>
                ลงชื่อ
                <span className="ml-2 inline-block w-[65mm] border-b border-dotted border-black">
                    &nbsp;
                </span>
            </div>

            <div className="mt-2">
                (
                <span className="inline-block min-w-[58mm]">
                    {signer?.name ?? ""}
                </span>
                )
            </div>

            <div className="mt-2">
                ตำแหน่ง
                <span className="ml-2 inline-block min-w-[52mm] border-b border-dotted border-black">
                    {signer?.position ?? ""}
                </span>
            </div>
        </section>
    );
}