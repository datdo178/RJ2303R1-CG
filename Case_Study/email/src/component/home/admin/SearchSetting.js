import { useDispatch, useSelector } from 'react-redux';
import { configSelector } from '../../../redux/selectors';
import { useState } from 'react';
import { updateConfigApi } from '../../../redux/generalSlice';

export function SearchSetting() {
    const dispatch = useDispatch();
    const config = useSelector(configSelector);
    const [maxSearchQuantity, setMaxSearchQuantity] = useState(config.maxSearchResult);

    function isInvalidValue() {
        return parseInt(maxSearchQuantity) === parseInt(config.maxSearchResult)
        || !maxSearchQuantity
        || parseInt(maxSearchQuantity) < 10
        || 100 < parseInt(maxSearchQuantity)
    }

    function save() {
        if (!isInvalidValue()) {
            dispatch(updateConfigApi({ maxSearchResult: maxSearchQuantity }));
        }
    }

    return <div id="search-setting" className="block">
        <div className="p-3">
            <div className="fs-1 fw-light border-bottom text-center fw-bold py-3 mb-3">Search Setting</div>
            <label htmlFor="max-search-result">Max Result Quantity:</label>
            <input
                type="number"
                max="100"
                min="10"
                className="search-input"
                value={maxSearchQuantity}
                onChange={e => setMaxSearchQuantity(e.target.value)}/>
        </div>
        <button
            className="btn btn-success ms-3"
            onClick={() => save()}
            disabled={isInvalidValue()}
        >Save</button>
    </div>
}
