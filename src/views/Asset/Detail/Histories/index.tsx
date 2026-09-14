import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toShortTHDate } from '../../../../utils'
import { getRepairationsByAsset } from '../../../../features/slices/repairation/repairationSlice'
import Loading from '../../../../components/ui/Loading'

const AssetHistories = ({ asset }) => {
    const dispatch = useDispatch<any>();
    const { repairations, pager, isLoading } = useSelector((state: any) => state.repairation);

    useEffect(() => {
        if (asset) dispatch(getRepairationsByAsset(asset.id));
    }, [dispatch, asset]);

    return (
        <div>
            <table className="table table-bordered text-sm">
                <thead>
                    <tr>
                        <th className="text-center w-[5%]">#</th>
                        <th className="text-center w-[15%]">วันที่ซ่อม</th>
                        <th>รายละเอียดการซ่อม</th>
                        <th className="text-center w-[15%]">ค่าใช้จ่าย</th>
                        <th className="text-center w-[15%]">ผู้ดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td className="text-center" colSpan={5}><Loading /></td>
                        </tr>
                    )}

                    {!isLoading && repairations && repairations.map((repairation, index) => (
                        <tr className="font-thin" key={repairation.id}>
                            <td className="text-center">{pager && pager.from + index}</td>
                            <td className="text-center">
                                <p className="text-sm">{toShortTHDate(repairation.request_date)}</p>
                                <p className="text-sm font-thin"><b className="mr-1">เวลา</b>{repairation.request_time}</p>
                            </td>
                            <td>{repairation.description}</td>
                            <td className="text-center">{repairation.total_cost}</td>
                            <td className="text-center">
                                {`${repairation.staff?.prefix?.name}${repairation.staff?.firstname} ${repairation.staff?.lastname}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default AssetHistories