import { useDispatch, useSelector } from 'react-redux';
import { searchSelector } from '../../redux/selectors';
import generalSlice from '../../redux/generalSlice';
import { MAX_SEARCH_RESULT_QUANTITY } from '../../constants';

export function Search() {
    const dispatch = useDispatch();
    const search = useSelector(searchSelector);

    function handleSearchKeywordChange(e) {
        dispatch(generalSlice.actions.changeSearchKeyword(e.target.value));
    }

    return <div className="position-relative" style={{ width: "450px" }}>
        <input
            className={`form-control ${search.keyword ? "searching-state-input" : "rounded-pill"}`}
            onChange={e => handleSearchKeywordChange(e)}
        />

            {search.keyword ?
                <div id="search-result" className="bg-white text-dark hover-meow w-100 position-absolute">
                    <ul className="list-group">
                        <li key="count" className="list-group-item">
                            <b className="m-0 p-0">{`Found ${search.results.length} mail(s)`}</b>
                            <br/>
                            <span className="m-0 p-0 fw-lighter fs-5px">
                                {`Only search ${MAX_SEARCH_RESULT_QUANTITY} first matching results`}
                            </span>
                        </li>
                    </ul>
                    <ul className="list-group">
                        {search.results.map(item =>
                            <li
                                key={item.id}
                                className="list-group-item hover-meow"
                            >
                                <b>Title: </b>{item.title.slice(0, 30)}...
                                <br/>
                                <span className="fw-lighter">{item.content.slice(0, 45)}...</span>
                            </li>
                        )}
                    </ul>
                </div> : ""
            }
    </div>

}
