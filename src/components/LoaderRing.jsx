import '../styles/loaderRing.css'

const LoaderRing = ( { customClass }) => {
    return (
        <div className={`loading-ring ${customClass}`}>
            <div className="spinner"></div>
        </div>
    )
}

export default LoaderRing