export default function SignupTitle( {title, onClose} ){
    
    return(
        <div className='flex just-btw align-center'>
            <h2>{title}</h2>
            <div className='close-btn pointer' onClick={onClose}>X</div>
        </div>
    )
}

