import React from "react"

const PreviuosActTitle = () => {
    let title = localStorage.getItem('PreviousTitle')

    return (
        <div>
       {
           title ? (
            <p><b>Previous:</b> {title}</p>
           ) : (
           <p>First clicked act</p>
           )
       }
       </div>
    )
}

export default PreviuosActTitle