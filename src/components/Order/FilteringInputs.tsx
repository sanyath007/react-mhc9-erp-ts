import React, { useState } from 'react'
import { Col, FormGroup, Row } from 'react-bootstrap'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { useGetInitialFormDataQuery } from '../../features/services/order/orderApi'
import { generateQueryString } from '../../utils';
import { useStyles } from '../../hooks/useStyles'
import Loading from '../ui/Loading';

const initialFormData = {
    suppliers: []
};

const OrderFilteringInputs = ({ initialFilters, onFilter }: any) => {
    const classes = useStyles();
    const [filters, setFilters] = useState(initialFilters);
    const { data: formData = initialFormData, isLoading } = useGetInitialFormDataQuery();
    const [selectedYear, setSelectedYear] = useState(moment(`${filters.year}-01-01`));
    const [selectedPODate, setSelectedPODate] = useState(moment());

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFilters({ ...filters, [name]: value })
    };

    const handleFilter = () => {
        onFilter(generateQueryString(filters));
    };

    const handleClearInputs = () => {
        setFilters(initialFilters);

        onFilter(generateQueryString(initialFilters));
    };

    return (
        <div className="filtering-wrapper border rounded-md flex flex-row gap-2 p-2 mb-3">
            <Row>
                <Col className="pr-1">
                    <Row>
                        <Col md={3} className="mb-2">
                            <DatePicker
                                format="YYYY"
                                views={['year']}
                                value={selectedYear}
                                onChange={(date) => {
                                    setSelectedYear(date);
                                    setFilters(prev => ({ ...prev, ['year']: moment(date).year() }));
                                }}
                                className={classes.muiTextFieldInput}
                            />
                        </Col>
                        <Col md={5}>
                            <input
                                type="btn"
                                name="po_no"
                                value={filters.po_no}
                                onChange={handleInputChange}
                                placeholder="เลขที่ใบสั่งซื้อ/จ้าง"
                                className="form-control text-sm font-thin"
                            />
                        </Col>
                        <Col md={4}>
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={selectedPODate}
                                onChange={(date) => {
                                    setSelectedPODate(date);
                                    setFilters({ ...filters, ['po_date']: date.format('YYYY-MM-DD') });
                                }}
                                className={classes.muiTextFieldInput}
                            />
                        </Col>
                        <Col md={6}>
                            {isLoading && <div className="form-control text-sm text-center"><Loading /></div>}
                            {!isLoading && (
                                <select
                                    name="supplier"
                                    value={filters.supplier}
                                    onChange={handleInputChange}
                                    className="form-control text-sm font-thin"
                                >
                                    <option value="">-- ผู้จัดจำหน่าย --</option>
                                    {formData.suppliers && formData.suppliers.map(supplier => (
                                        <option value={supplier.id} key={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </Col>
                        <Col>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleInputChange}
                                className="form-control text-sm font-thin"
                            >
                                <option value="">-- สถานะ --</option>
                                <option value="1">รอดำเนินการ</option>
                                <option value="2">ตรวจรับแล้ว</option>
                                <option value="9">ยกเลิก</option>
                            </select>
                        </Col>
                    </Row>
                </Col>
                <Col md={2} lg={1} className="pl-1">
                    <div className="flex flex-col">
                        <button type="button" className="btn btn-outline-secondary text-sm px-1 mb-1" onClick={handleFilter}>
                            ตกลง
                        </button>
                        <button type="button" className="btn btn-outline-danger text-sm px-1" onClick={handleClearInputs}>
                            เคลียร์
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default OrderFilteringInputs
