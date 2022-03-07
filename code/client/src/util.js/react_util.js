import { useState, useEffect } from "react"

const useRefDimensions = (ref, defaultWidth, defaultHeight) => {
    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);

    const updateDim = () => {
        console.log("size changed");
        if(ref.current) {
            setWidth(ref.current.clientWidth);
            setHeight(ref.current.clientHeight);
        }
    }

    window.addEventListener("resize", updateDim)

    return [height, width];
}

export { useRefDimensions };