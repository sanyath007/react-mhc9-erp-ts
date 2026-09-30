interface Props {
    signer?: {
        name?: string;
        position?: string;
    };
}

export function AttachmentSignature({ signer }: Props) {
    return (
        <section className="mt-[8mm] ml-auto w-[85mm] text-[12px]">
            <div className="flex items-end">
                <span>ลงชื่อ</span>
                <span className="mx-2 flex-1 border-b border-dotted border-black text-center">
                    {signer?.name || "\u00A0"}
                </span>

                <span>ผู้เบิก</span>
            </div>

            {signer?.position && (
                <div className="mt-2 text-center">
                    ตำแหน่ง {signer.position}
                </div>
            )}
        </section>
    );
}