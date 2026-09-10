import React from 'react';

type ColorTheme = 'blue' | 'green' | 'amber' | 'purple' | 'pink';

interface StatCardProps {
    title: string;
    icon: React.ReactNode;
    target: number | string;
    received: number | string;
    colorTheme?: ColorTheme;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, target, received, colorTheme = 'blue' }) => {
    const themeClasses: Record<ColorTheme, string> = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-emerald-100 text-emerald-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
        pink: 'bg-pink-100 text-pink-600',
    };

    const iconClass = themeClasses[colorTheme] || themeClasses.blue;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${iconClass} text-xl`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xs font-medium mb-1">เป้าหมาย</span>
                    <span className="font-semibold text-sm text-gray-500">{target}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-xs font-medium mb-1">ได้รับ</span>
                    <span className="font-bold text-lg text-gray-800">{received}</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
