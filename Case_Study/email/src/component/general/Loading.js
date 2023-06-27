import spinner from '../../assets/images/cat-spinner.gif';

function Loading() {
    return <div className="spinner">
        <img src={spinner} alt="spinner"/>
    </div>
}

export default Loading
