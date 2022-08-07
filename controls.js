class controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;


        switch (type) {
            case "AI":
                document.onkeydown = (ev) => {
                    if (ev.key == "x") {
                        isRecording = true;
                    }
                };
                document.onkeyup = (ev) => {
                    if (ev.key == "x") {
                        isRecording = false;
                    }
                };
                break;
            case "TRAIN":
                this.#addKeyboardListeners();
                break;
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }


    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "x":
                    isRecording = true;
                    break;
            }
            // console.table(this);
            // console.table(bestCar);
            // console.log(event.key);
        };
        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                case "x":
                    isRecording = false;
                    break;
            }
            // console.table(this);
        };
    }


}