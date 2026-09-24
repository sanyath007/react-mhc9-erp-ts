import React, { useEffect } from 'react'
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.viewer'
import 'stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css'

const StiReportViewer: React.FC = () => {
    useEffect(() => {
        const viewer = new Stimulsoft.Viewer.StiViewer(undefined, 'StiViewer', false)
        const report = new Stimulsoft.Report.StiReport()

        const getReport = async () => {
            const res = await fetch('./reports/SimpleList.mrt');
            const data = await res.json();

            report.loadDocument(data);
            viewer.report = report;

            viewer.renderHtml('viewer');
        };

        getReport();
    }, []);

    return (
        <div id="viewer"></div>
    )
}

export default StiReportViewer