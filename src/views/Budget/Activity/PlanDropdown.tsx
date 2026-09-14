import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const PlanDropdown = () => {
    const [show, setShow] = useState(false);

    return (
        <div className="dropdown">
            <button type="button" className="btn btn-outline-secondary dropdown-toggle flex flex-row items-center" onClick={() => setShow(!show)}>
                <FaSearch className="mr-1" /> รายการแผนงาน
            </button>
            <ul className={`dropdown-menu ${show ? 'show' : ''}`}>
                <li><Link to="/budget-plan" className="dropdown-item">แผนงาน</Link></li>
                <li><Link to="/budget-project" className="dropdown-item">โครงการ/ผลผลิต</Link></li>
            </ul>
        </div>
    )
}

export default PlanDropdown