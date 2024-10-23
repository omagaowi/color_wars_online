import Header from '../../components/Header.jsx'
import '../../styles/optionStyles/options1.css'
import { useNavigate } from 'react-router-dom'
import { useMenuStore, useGridStore } from '../../utils/mainStore.js'
import { useEffect, useState } from 'react'
import boxesGrid from '../../utils/boxes.js'
import { alertStore } from '../../utils/online/otherStores.jsx'



const Options1 = () => {
    const navigate = useNavigate();

    const { mode, setMode } = useMenuStore((state) => ({ 
        mode: state.mode,
        setMode: state.setMode
    }))

    const { boxes, setBoxes } = useGridStore((state) => ({
        boxes: state.boxes,
        setBoxes: state.setBoxes
    }))

    const {setShow, setAlert, timeout, updateTimeout } = alertStore((state) => ({
        setShow: state.setShow,
        setAlert: state.setAlert,
        timeout: state.timeout,
        updateTimeout: state.updateTimeout
    }))

    const [nA, setNA] = useState(false)

    const version = 'v1'

    const fetchGrid = async () => {
        try {
            const response = await fetch('/boxes.json')
            const data = await response.json()
            return data
        } catch (error) {
            return error
        }
    }

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setBoxes([])
        setLoading(true)
        if(!localStorage.getItem('boxes')){
            fetchGrid().then(((data) => {
                setLoading(false)
                setBoxes(data.boxes)
                localStorage.setItem('boxes', JSON.stringify(data.boxes))
            })).catch((err) => {
                setLoading(false)
                console.log(err)
            })
        }else{
            setLoading(false)
        }
        // setBoxes(freshBoxesGrid)
    }, [])


    return (
        <div className="options-container options1">
            <Header />
            {
                nA? (
                    <div className="not-available">
                        	 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                            </svg>
                            <h2>Online Play Unavaible</h2>
                            <p>Online play unavailable in v-alspha</p>
                            <button>Cancel</button>
                    </div>
                ):(
                    <div className="options-pick">
                        {
                            loading? (
                                <>
                                    <h3 className='main-load'>Loading Core Game Data.....</h3>
                                </>
                            ):(
                                <>
                                    {
                                        error? (
                                            <h3 className='main-load'>Error Fetching Game Data!</h3>
                                        ):(
                                            <>
                                                  <div className="option online"  onClick={() => {
                                                        if(version == 'v1'){
                                                            setMode('online')
                                                            navigate('/joinroom')
                                                        }else{
                                                            updateTimeout(setTimeout(() => {
                                                                setAlert({
                                                                    type: 'error',
                                                                    users: [  ],
                                                                    message: `Online Play unavaible in ${version}!`,
                                                                    color: 'red'
                                                                })
                                                                setTimeout(() => {
                                                                    setShow(true)
                                                                }, 200)
                                                            }, 100))
                                                        }
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wifi" viewBox="0 0 16 16">
                                                        <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"/>
                                                        <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
                                                        </svg>
                                                        <h2>Online Play</h2>
                                                    </div>
                                                    <div className="option offline" onClick={() => {
                                                        setMode('offline')
                                                        navigate('/options/offline/4898')
                                                    }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wifi-off" viewBox="0 0 16 16">
                                                            <path d="M10.706 3.294A12.6 12.6 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4q.946 0 1.852.148zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.45 8.45 0 0 1 3.51-1.27zm2.596 1.404.785-.785q.947.362 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.5 8.5 0 0 0-1.98-.932zM8 10l.933-.933a6.5 6.5 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.53.53 0 0 1-.611.09A5.5 5.5 0 0 0 8 10m4.905-4.905.747-.747q.886.451 1.685 1.03a.485.485 0 0 1 .047.737.52.52 0 0 1-.668.05 11.5 11.5 0 0 0-1.811-1.07M9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A2 2 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75z"/>
                                                            </svg>
                                                            <h2>Offline Play</h2>
                                                        </div>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Options1