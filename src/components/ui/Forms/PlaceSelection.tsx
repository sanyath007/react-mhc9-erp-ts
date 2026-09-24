import React from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

interface PlaceSelectionProps {
    place: any;
    error?: boolean;
    errorMessage?: string;
    onSearchClick: () => void;
    onAddClick: () => void;
}

const PlaceSelection: React.FC<PlaceSelectionProps> = ({ 
    place, 
    error, 
    errorMessage, 
    onSearchClick, 
    onAddClick 
}) => {
    return (
        <>
            <label htmlFor="">สถานที่จัด</label>
            <div className="input-group">
                <div className={`form-control text-sm h-[34px] bg-gray-100 flex items-center ${error ? 'border-red-500' : ''}`}>
                    {place?.name} {place?.changwat && <span className="ml-1">จ.{place.changwat.name}</span>}
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onSearchClick}>
                    <FaSearch />
                </button>
                <button type="button" className="btn btn-outline-success btn-sm px-2" onClick={onAddClick}>
                    <FaPlus />
                </button>
            </div>
            {error && errorMessage && (
                <span className="text-red-500 text-xs">{errorMessage}</span>
            )}
        </>
    );
};

export default PlaceSelection;
