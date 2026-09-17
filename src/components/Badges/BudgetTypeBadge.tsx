import React from 'react'

const BudgetTypeBadge = ({ type }: any) => {
    return (
        <span className="ml-1 text-sm">
            {type.id === 1 && <span className="badge rounded-pill bg-secondary">{type?.name}</span>}
            {type.id === 2 && <span className="badge rounded-pill bg-danger">{type?.name}</span>}
            {type.id === 3 && <span className="badge rounded-pill bg-success">{type?.name}</span>}
            {type.id === 4 && <span className="badge rounded-pill bg-info">{type?.name}</span>}
            {type.id === 5 && <span className="badge rounded-pill bg-warning">{type?.name}</span>}
            {type.id === 6 && <span className="badge rounded-pill bg-dark">{type?.name}</span>}
        </span>
    );
};

export default BudgetTypeBadge;
