const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const N = 1 ;
const mode = "AI"

const cars = generateCars(N);

let bestRout = [];
let isRecording = false;

let bestCar = cars[0];
// bestCar.x = road.getLaneCenter(0);

if (localStorage.getItem('bestBrain')) {
    bestCar.brain = JSON.parse(
        localStorage.getItem('bestBrain')
    );
    for (let i = 1; i < cars.length; i++) {
        cars[i].brain = NeuralNetwork.newInstance(bestCar.brain, cars[i].brain);
        NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -200, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -350, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(2), -1400, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -1620, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -1620, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -1720, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(1), -1800, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(2), -1915, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(0), -2000, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(1), -2100, 30, 50, "DUMMY", 3),

    new Car(road.getLaneCenter(2), -2230, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(0), -2230, 30, 50, "DUMMY", 3),

];

animate();

function loadBest() {
    bestCar.brain = _bestModel;
}

function saveToClipboard() {
    navigator.clipboard.writeText(NeuralNetwork.getModelAsString(bestCar.brain));
}

function pasteFromClipboard() {
    navigator.clipboard.readText().then(
        str=>bestCar.brain = NeuralNetwork.getNetworkFromString(str)
    );
}

function trainBestRout() {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < bestRout.length; j++) {
            NeuralNetwork.backPropagation(
                bestCar.brain,
                bestRout[j].inputs, 
                bestRout[j].outputs, 
                lerp(0.2, 0.05, j/bestRout.length),
            );
        }

    }
    console.log(bestRout);
}

function save() {
    localStorage.setItem(
        "bestBrain", JSON.stringify(bestCar.brain)
    );
}

function discard() {
    localStorage.removeItem("bestBrain");
}
function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, mode)
        );
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        const obj = traffic[i];
        obj.update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    // car.update(road.borders, traffic);

    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );
    // bestCar = cars.filter(
    //     c => c.y <= Math.min(...cars.map(c => c.y)) + 20
    // ).find(
    //     (cc, i, obj) =>
    //         Math.abs(road.getLaneCenter(1) - cc.x) == Math.min(
    //             ...obj.map(
    //                 ccc => Math.abs(road.getLaneCenter(1) - ccc.x)
    //             )
    //         )
    // );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        const obj = traffic[i];
        obj.draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    // car.draw(carCtx, "blue");

    carCtx.restore();

    const offsets = bestCar.sensor.readings.map(s => s == null ? 0 : s.offset);
    let outputs = [];
    if (bestCar.train) {
        outputs = [
            bestCar.controls.forward?1:0,
            bestCar.controls.left?1:0,
            bestCar.controls.right?1:0,
            bestCar.controls.reverse?1:0,
        ]
    } else {
        outputs = NeuralNetwork.feedForward(offsets, bestCar.brain);
    }

    if (isRecording) {
        bestRout.push({
            inputs: offsets,
            outputs: activateOutputArray(outputs),
        })
    }

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

