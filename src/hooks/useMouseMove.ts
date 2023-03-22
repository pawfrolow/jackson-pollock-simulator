import { useCallback, useEffect, useRef, useState } from "react";
import * as utils from '../utils';

const useMouseMove = (throttle?: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handler = useCallback((e: MouseEvent) => {
        if(timeoutRef.current) return;

        timeoutRef.current = setTimeout(() => {
            setCoords({ x: e.offsetX, y: e.offsetY })
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }, throttle || 0)
    }, [throttle]);

    useEffect(() => {
        const canvas = utils.getCanvas();
        canvas?.addEventListener("mousemove", handler);
        return () => canvas?.addEventListener("mousemove", handler);
    }, []);

    return coords
};

export default useMouseMove;
