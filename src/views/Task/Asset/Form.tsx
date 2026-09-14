import React, { useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import ModalAssetList from '../../../components/Modals/AssetList'

const TaskAssetForm = ({ onAdd }: any) => {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAssetModal, setShowAssetModal] = useState(false);

    const handleAdd = () => {
        onAdd(selectedAsset);

        setSelectedAsset(null);
    };

    return (
        <div className="flex flex-row items-center gap-1 mb-1">
            <ModalAssetList
                isShow={showAssetModal}
                onHide={() => setShowAssetModal(false)}
                onSelect={(asset) => setSelectedAsset(asset)}
            />

            <div className="input-group w-4/12">
                <div className="form-control bg-gray-100 text-sm font-thin min-h-[34px]">
                    {selectedAsset?.asset_no}
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary text-sm"
                    onClick={() => setShowAssetModal(true)}
                >
                    <FaSearch />
                </button>
            </div>
            <div className="form-control min-h-[34px] bg-gray-100 text-sm font-thin">
                {selectedAsset?.name}
            </div>
            <button
                type="button"
                className="btn btn-outline-primary text-sm flex flex-row items-center"
                onClick={() => handleAdd()}
                disabled={!selectedAsset}
            >
                <FaPlus /> เพิ่ม
            </button>
        </div>
    )
}

export default TaskAssetForm
    