import { useEffect } from 'react'
import '../styles/alerts.css'

import { alertStore } from '../utils/online/otherStores.jsx'


const Alerts = ({ alert, alertShow }) => {

    const {setShow, setAlert, timeout, updateTimeout } = alertStore((state) => ({
        setShow: state.setShow,
        setAlert: state.setAlert,
        timeout: state.timeout,
        updateTimeout: state.updateTimeout
    }))

    useEffect(() => {
        if(alertShow){
            setTimeout(() => {
                setShow(false)
                clearTimeout(updateTimeout)
            }, 1300);
        }
     }, [alertShow])
    return (
        <div className={`alerts ${ alertShow? 'show' : false }`} style={ { background: alert.color } }>
            <h5>{ alert.message }</h5>
        </div>
    )
}

export default Alerts