import React, { useEffect, useRef, useState } from 'react'
import WebViewer from '@pdftron/webviewer';

const WordViewer: React.FC = () => {
    // const viewer = useRef<any>(null);
    // const [instance, setInstance] = useState();

    // useEffect(() => {
    //     if (!instance) {
    //         WebViewer({
    //             path: '/',
    //             initialDoc: '/reports/example.pdf'
    //         }, viewer.current)
    //         .then(ins => {
    //             const { documentViewer } = ins.Core;
    //             setInstance(ins);
    //         })
    //     }
    // }, []);

    return (
        <div style={{ width: '100%', height: '800px' }}>
            {/* <WebViewer
                enableOfficeEditing={true}
                initialDoc="/reports/example.pdf"
            /> */}
        </div>  
    )
}

export default WordViewer