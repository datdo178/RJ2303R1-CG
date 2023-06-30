import { SETTING_TABS } from '../../../constants';

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SideBar() {
    const [selectedOption, setSelectedOption] = useState(SETTING_TABS[0]);

    return <>
        <div id="side-bar" className="block w-100">
            <div className="fw-light border-bottom text-center fw-bold py-3">Setting Options</div>
            <ul className="m-0 p-0 w-100">
                {SETTING_TABS.map(item =>
                    <li
                        key={item}
                        className={`mail-folder nav-link fw-light hover-meow fs-4 p-3 ${item === selectedOption ? "mail-folder-selected" : ""}`}
                        onClick={() => setSelectedOption(item)}
                    >
                        <Link className="nav-link" to={`/`}>
                            <span>{item}</span>
                        </Link>
                    </li>)}
            </ul>
        </div>
    </>
}
