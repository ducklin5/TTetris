import { useState, useEffect } from "react"

const useRefDimensions = (ref) => {
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);

    const updateDim = () => {
        console.log("size changed");
        if(ref.current) {
            setWidth(ref.current.clientWidth);
            setHeight(ref.current.clientHeight);
        }
    }

    useEffect(updateDim, [ref])
    window.addEventListener("resize", updateDim)
    
    return [height, width];
}

export { useRefDimensions };