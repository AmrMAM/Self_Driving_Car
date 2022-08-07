class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(
                new Level(neuronCounts[i], neuronCounts[i + 1])
            );
        }
    }

    static getModelAsString(network) {
        return JSON.stringify(network);
    }

    static getNetworkFromString(str){
        return JSON.parse(str);
    }

    static backPropagation(network, givenInputs, desiredOutputs, learningRate = 0.1) {
        const predictedOutputs = NeuralNetwork.feedForward(
            givenInputs, network
        );

        let errors = [];
        let driv_errorOut = [];
        for (let i = 0; i < predictedOutputs.length; i++) {
            const e = 0.5 * (desiredOutputs[i] - predictedOutputs[i]) ^ 2;
            const errorOut = desiredOutputs[i] - predictedOutputs[i];
            errors.push(e);
            driv_errorOut.push(errorOut);
        }
        //   console.log(driv_errorOut);
        let driv_acc = driv_errorOut;
        for (let i = network.levels.length - 1; i >= 0; i--) {
            const level = network.levels[i];

            driv_acc = Level.feedBackword(level, driv_acc, learningRate);

        }

    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
        });
    }

    static newInstance(srcNetwork, targetNetwork) {
        targetNetwork = srcNetwork.constructor();
        targetNetwork.levels = [...srcNetwork.levels.map(
            level => ({
                inputs: [...level.inputs],
                outputs: [...level.outputs],
                weights: level.weights.map(ws => [...ws]),
                biases: [...level.biases]
            })
        )]
        return targetNetwork
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        };

        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.outputs.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let iout = 0; iout < level.outputs.length; iout++) {
            let sum = 0;
            for (let iin = 0; iin < level.inputs.length; iin++) {
                sum += level.weights[iin][iout] * level.inputs[iin];
            }

            // if (sum > level.biases[iout]) {
            //     level.outputs[iout] = 1;
            // } else {
            //     level.outputs[iout] = 0;
            // }
            level.outputs[iout] = sum + level.biases[iout];
        }
        return sigmoidArray(level.outputs);
    }

    static feedBackword(level, driv_acc, learningRate = 0.1) {
        let driv_accNew = [];
        for (let ii = 0; ii < level.inputs.length; ii++) {
            let driv_acc_inner = 0;
            for (let io = 0; io < level.outputs.length; io++) {
                const neuralInput = level.outputs[io];
                // const neuralOutput = sigmoid(level.outputs[io]);
                const driv_outIn = sigmoid(neuralInput) * (1 - sigmoid(neuralInput));
                const driv_inW = level.inputs[ii];

                // console.log(ii, "  ", io);
                level.weights[ii][io] = level.weights[ii][io] +
                    learningRate * driv_acc[io] * driv_outIn * driv_inW;

                driv_acc_inner += driv_acc[io] * driv_outIn * level.weights[ii][io];
            }
            driv_accNew.push(driv_acc_inner);
        }
        return driv_accNew;
    }
}