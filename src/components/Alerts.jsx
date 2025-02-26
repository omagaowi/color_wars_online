import { useEffect } from 'react'
import '../styles/alerts.css'

import { alertStore } from '../utils/online/otherStores.jsx'


const getIcon = (type) => {
    console.log(type)
    if(type == 'error'){
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
        `
    }else if(type == 'warning'){
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>
        `

    }else if(type == 'success'){
      return  `   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
            </svg>
        `
    }else{
       return `   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
            </svg>
        `
    }
}


let newAlert

const Alerts = () => {

    const {setShow, alert, alertShow, setAlert, show,  timeout, updateTimeout } = alertStore((state) => ({
        setShow: state.setShow,
        alert: state.alert,
        alertShow: state.alertShow,
        show: state.show,
        setAlert: state.setAlert,
        timeout: state.timeout,
        updateTimeout: state.updateTimeout
    }))


    newAlert = (data) => {
        setAlert(data)
        setTimeout(() => {
            setShow(true)
        }, 200)
        setTimeout(() => {
            setShow(false)
        }, 1800)
    }
    

    useEffect(() => {
        if(alertShow){
            setTimeout(() => {
                setShow(false)
                clearTimeout(updateTimeout)
            }, 1300);
        }
     }, [alertShow])
    return (
        <div className={`alerts ${ show? 'show' : ''  } ${ alert.color }`}>
            <div dangerouslySetInnerHTML={{ __html: getIcon(alert.type) }}></div>
            <h5>{ alert.message }</h5>
        </div>
    )
}


export { newAlert }
export default Alerts