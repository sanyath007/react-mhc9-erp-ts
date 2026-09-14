import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import ErrorMessage from './ErrorMessage';

const YearPicker = ({
    value,
    onChange,
    placeholder = 'เลือกปี',
    label,
    error,
    icon,
    disabled = false,
    minYear,
    maxYear,
    className = '',
    inputCss = ''
}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, direction: 'bottom' });
    const [mounted, setMounted] = useState(false);

    // Parse current year safely
    const currentSelectedYear = value ? parseInt(value, 10) : moment().year();
    
    // View state for pagination (12 years per page)
    const [viewStartYear, setViewStartYear] = useState(() => {
        return Math.floor(currentSelectedYear / 12) * 12;
    });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mount check for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync view with value when opened
    useEffect(() => {
        if (isOpen && value) {
            const y = parseInt(value, 10);
            if (!isNaN(y)) {
                setViewStartYear(Math.floor(y / 12) * 12);
            }
        }
    }, [isOpen, value]);

    // Calculate position
    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = 300;
        const dropdownWidth = 300;
        const gap = 4;
        const edgePadding = 8;

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top;
        let direction;

        if (spaceBelow >= dropdownHeight + gap || spaceBelow >= spaceAbove) {
            top = rect.bottom + gap;
            direction = 'bottom';
        } else {
            top = rect.top - dropdownHeight - gap;
            direction = 'top';
        }

        let left = rect.left;
        if (left + dropdownWidth > window.innerWidth - edgePadding) {
            left = window.innerWidth - dropdownWidth - edgePadding;
        }
        if (left < edgePadding) {
            left = edgePadding;
        }

        setPosition({ top, left, direction });
    }, []);

    // Update position on open and scroll/resize
    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        const handleUpdate = () => updatePosition();
        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [isOpen, updatePosition]);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: any) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e: any) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleYearSelect = (year: number) => {
        onChange(year.toString());
        setIsOpen(false);
    };

    const navigatePage = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setViewStartYear(prev => prev - 12);
        } else {
            setViewStartYear(prev => prev + 12);
        }
    };

    // Generate years for current view (3x4 grid)
    const years = Array.from({ length: 12 }, (_, i) => viewStartYear + i);

    const dropdownContent = (
        <div
            ref={dropdownRef}
            className="fixed z-[9999] w-72 rounded-lg overflow-hidden border border-border shadow-2xl bg-white animate-in fade-in-0 zoom-in-95 duration-150"
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <button
                    type="button"
                    onClick={() => navigatePage('prev')}
                    className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                    <ChevronLeft size={18} className="text-muted-foreground" />
                </button>

                <div className="text-center font-bold text-foreground">
                    {viewStartYear + 543} - {viewStartYear + 11 + 543}
                </div>

                <button
                    type="button"
                    onClick={() => navigatePage('next')}
                    className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                    <ChevronRight size={18} className="text-muted-foreground" />
                </button>
            </div>

            {/* Year Grid */}
            <div className="grid grid-cols-3 gap-2 p-4">
                {years.map((year) => {
                    const isSelected = value && parseInt(value, 10) === year;
                    const isCurrentYear = moment().year() === year;
                    
                    let isDisabled = false;
                    if (minYear && year < minYear) isDisabled = true;
                    if (maxYear && year > maxYear) isDisabled = true;

                    return (
                        <button
                            key={year}
                            type="button"
                            onClick={() => !isDisabled && handleYearSelect(year)}
                            disabled={isDisabled}
                            className={`py-3 text-sm rounded-xl transition-all duration-200 font-bold relative flex items-center justify-center
                                ${isDisabled && 'text-muted-foreground/20 cursor-not-allowed'}
                                ${!isDisabled && isSelected && 'bg-primary text-white shadow-lg shadow-primary/30 scale-105 z-10'}
                                ${!isDisabled && !isSelected && isCurrentYear && 'bg-primary/10 text-primary ring-1 ring-primary/30'}
                                ${!isDisabled && !isSelected && !isCurrentYear && 'text-foreground hover:bg-muted'}
                            `}
                        >
                            {year + 543}
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border">
                <button
                    type="button"
                    onClick={() => {
                        const currentYear = moment().year();
                        if ((!minYear || currentYear >= minYear) && (!maxYear || currentYear <= maxYear)) {
                            handleYearSelect(currentYear);
                        }
                    }}
                    className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-wider transition-colors"
                >
                    ปีปัจจุบัน
                </button>

                <div className="flex gap-2">
                    {value && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
                        >
                            ล้าง
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-1.5 text-xs font-bold bg-white text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted uppercase tracking-wider transition-all shadow-sm"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider pl-1 flex items-center gap-2">
                    {icon && <span>{icon}</span>}
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex items-center justify-between gap-2 text-left transition-all w-full bg-muted/30 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${inputCss}
                    ${isOpen ? 'ring-2 ring-primary/20 border-primary shadow-lg' : ''}
                    ${error ? 'border-rose-300 bg-rose-50/30' : ''}
                    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                `}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Calendar size={18} className={`shrink-0 ${value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`truncate ${value ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                        {value ? (parseInt(value, 10) + 543) : placeholder}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <ChevronRight size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90 text-primary' : ''}`} />
                </div>
            </button>

            {error && <ErrorMessage message={error} className='mt-1.5 px-1' />}

            {/* Portal Dropdown */}
            {mounted && isOpen && createPortal(dropdownContent, document.body)}
        </div>
    );
};

export default YearPicker;
