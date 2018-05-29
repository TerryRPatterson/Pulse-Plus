import React from "react";

let gitFeed = ({type, children}) => {
    return (<div className={type}>
        <ul className={`list ${type}List`}>
            {children}
        </ul>
    </div>);
};

export default gitFeed;
