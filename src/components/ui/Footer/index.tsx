import React from 'react'

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 px-5 py-4">
            <div className="text-slate-300">
                <h3>
                    ©2020 ศูนย์สุขภาพจิตที่ 9 All Rights Reserved | โดย
                    <a href="https://www.query-studio.com" target="_blank" rel="noreferrer" className="ml-1">
                        นายสัญญา ธรรมวงษ์
                    </a>
                </h3>
            </div>
        </footer>
    )
}

export default Footer
