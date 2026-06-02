import React from 'react'
const Contactus = () => {
    const Contacts = [{ name: "Prem", Number: 8328168976 }, { name: "Sohan", Number: 9030072216 }];
    return (
        <div>
            {Contacts.map((list, index) => {
                return (<div key={index}>
                    <h3>{list.name}</h3>
                    <p>{list.Number}</p>
                </div>)
            })}

        </div>
    )
}

export default Contactus