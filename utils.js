function lerp(A, B, t) {
    return A + (B - A) * t;
}


function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i1 = 0; i1 < poly1.length; i1++) {
        const point1 = poly1[i1];
        for (let i2 = 0; i2 < poly2.length; i2++) {
            const point2 = poly2[i2];
            const touch = getIntersection(
                point1,
                poly1[(i1 + 1) % poly1.length],
                point2,
                poly2[(i2 + 1) % poly2.length],
            );
            if (touch) {
                return true;
            }

        }

    }

    return false;
}