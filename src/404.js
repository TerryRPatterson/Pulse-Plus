import React from "react";

let page404 = ({location}) => {
    return <h1>Page {location["pathname"]} not found.</h1>;
};

export default page404;
