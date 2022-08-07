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

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function sigmoid(num) {
    return (1/(1+Math.exp(-num)));
}

function sigmoidArray(arrayNum) {
    return arrayNum.map(num=>sigmoid(num));
}

function activateOutput(val) {
    if (val>=0.5) {
        return 1;
    }else{
        return 0;
    }
}

function activateOutputArray(outputs) {
    return outputs.map((t)=>t>=0.5?1:0);
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
