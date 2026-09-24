import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import { toShortTHDate } from '../../../../utils'
import { getOwnershipsByAsset, resetSuccess } from '../../../../features/slices/asset-ownership/assetOwnershipSlice'
import Loading from '../../../../components/ui/Loading'

const OwnershipList = ({ assetId, isUpdated }) => {
    const dispatch = useDispatch<any>();
    const { ownerships, pager, isLoading: loading } = useSelector((state: any) => state.ownership);

    useEffect(() => {
        if (assetId) dispatch(getOwnershipsByAsset({ assetId }));
    }, [assetId, isUpdated]);

    useEffect(() => {
        if (isUpdated) dispatch(resetSuccess());
    }, [isUpdated]);

    return (
        <div>
            <table className="table table-bordered text-sm">
                <thead>
                    <tr>
                        <th className="w-[5%] text-center">#</th>
                        <th className="w-[20%] text-center">วันที่รับ</th>
                        <th>ผู้ดูแล</th>
                        <th className="w-[15%] text-center">สถานะ</th>
                        <th className="w-[10%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={5} className="text-center"><Loading /></td>
                        </tr>
                    )}
                    {!loading && ownerships && ownerships.map((owns, index) => (
                        <tr key={owns.id} className="font-thin">
                            <td className="text-center">{index + pager.from}</td>
                            <td className="text-center">{toShortTHDate(owns.owned_at)}</td>
                            <td>{owns.owner.firstname} {owns.owner.lastname}</td>
                            <td className="text-center">
                                {owns.status === 1 && <span className="badge rounded-pill text-bg-success">ครอบครองอยู่</span>}
                                {owns.status === 2 && <span className="badge rounded-pill text-bg-secondary">คืนความเป็นเจ้าของแล้ว</span>}
                                {owns.status === 3 && <span className="badge rounded-pill text-bg-warning">เสียหายระหว่างการดูแล</span>}
                                {owns.status === 4 && <span className="badge rounded-pill text-bg-danger">สูญหายระหว่างการดูแล</span>}
                            </td>
                            <td className="text-center p-1">
                                <Link to={`/asset//edit`} className="btn btn-sm btn-warning px-1 mr-1">
                                    <FaPencilAlt />
                                </Link>
                                <button className="btn btn-sm btn-danger px-1">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OwnershipList
