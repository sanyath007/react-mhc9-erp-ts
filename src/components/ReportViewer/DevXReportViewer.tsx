import React, { useEffect, useRef } from 'react'
import { DxReportViewer } from 'devexpress-reporting/dx-webdocumentviewer'
import * as ko from 'knockout'

const DevXReportViewer: React.FC = () => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const reportUrl = ko.observable("TestReport");
    const requestOptions = {
        host: 'http://localhost:5001/',
        invokeAction: 'DXXRDV'
    };

    useEffect(() => {
        if (viewerRef.current) {
            const viewer = new DxReportViewer(viewerRef.current, { 
                reportUrl, 
                requestOptions,
            });

            viewer.render(); 

            return () => viewer.dispose();
        }
    }, [reportUrl, requestOptions]);

    return (
        <div style={{ width: "100%", height: "1000px" }}>
            <div ref={viewerRef}></div>
        </div>
    )
}

export default DevXReportViewer