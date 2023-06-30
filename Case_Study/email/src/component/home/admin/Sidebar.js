import { SETTING_TABS } from '../../../constants';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SideBar() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(() => {
        const selectedIndex = Object.keys(SETTING_TABS).find(index => window.location.href.includes(SETTING_TABS[index].urlPrefix));
        return selectedIndex ? selectedIndex : "0";
    });

    function handleSelectOption(index) {
        if (selectedOption !== index) {
            setSelectedOption(index);
            navigate(`/${SETTING_TABS[index].urlPrefix}`);
        }
    }

    return <>
        <div id="side-bar" className="block w-100">
            <div className="fw-light border-bottom text-center fw-bold py-3">Setting Options</div>
            <ul className="m-0 p-0 w-100">
                {Object.keys(SETTING_TABS).map(index =>
                    <li
                        key={SETTING_TABS[index].label}
                        className={`mail-folder nav-link fw-light hover-meow fs-4 p-3 ${index === selectedOption ? "mail-folder-selected" : ""}`}
                        onClick={() => handleSelectOption(index)}
                    >
                        <Link className="nav-link" to={`/`}>
                            <span>{SETTING_TABS[index].label}</span>
                        </Link>
                    </li>)}
            </ul>
        </div>
    </>
}
