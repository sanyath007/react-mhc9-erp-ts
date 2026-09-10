import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react'
import { FaTimesCircle } from 'react-icons/fa'

interface AutocompleteItem {
    id: string | number;
    name: string;
    [key: string]: any;
}

interface AutocompleteProps {
    inputName?: string;
    items: AutocompleteItem[];
    onSelect: (item: AutocompleteItem | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ inputName, items, onSelect }) => {
    const [show, setShow] = useState(false);
    const [filtedItems, setFilteredItems] = useState<AutocompleteItem[]>([]);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        setFilteredItems(items)
    }, [items]);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const newItems = items.filter(item => item.name.search(target.value) !== -1);

        setFilteredItems(newItems);
    };

    const handleSelect = (item: AutocompleteItem) => {
        setShow(false);
        setSelected(item.name);

        onSelect(item);
    };

    const handleClear = () => {
        setSelected('');

        onSelect(null);
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center border rounded-md pr-2">
                <input
                    type="text"
                    value={selected}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelected(e.target.value)}
                    onClick={() => setShow(!show)}
                    className="form-control text-sm font-thin border-none outline-none"
                />
                {selected !== '' && <FaTimesCircle className="hover:cursor-pointer hover:text-red-500" onClick={handleClear} />}
            </div>
            <div className={`absolute w-full bg-white border rounded-md z-50 ${!show ? 'hidden' : 'block'}`}>
                <div className="m-2">
                    <input type="text" className="form-control" onKeyUp={handleKeyUp} />
                </div>
                <ul className="m-2">
                    {filtedItems && filtedItems.map((item, index) => (
                        <li className="text-sm font-thin p-1 hover:cursor-pointer hover:bg-gray-200" key={item.id} onClick={() => handleSelect(item)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Autocomplete
