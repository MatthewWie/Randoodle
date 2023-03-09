document.addEventListener("DOMContentLoaded", () => {
    const colors = {
        black: "#000000",
        gray: "#505050",
        red: "#ef130b",
        orange: "#ff7100",
        yellow: "#ffe400",
        green: "#00cc00",
        blue: "#00b2ff",
        purple: "#a300ba",
        pink: "#df69a7",
        brown: "#a0522d",
        white: "#ffffff",

        rainbow: "rainbow"
    };

    class DrawingApp {
        constructor(canvas, colorButtons) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.isDrawing = false;
            this.colorButtons = colorButtons;
            this.lastX = 0;
            this.lastY = 0;
            this.hue = 0;
            this.brushSize = 10;
            this.direction = true;
            this.color = colors.black;

            this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
            this.canvas.addEventListener("mousemove", this.draw.bind(this));
            this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
            this.canvas.addEventListener("mouseout", this.stopDrawing.bind(this));
            this.canvas.addEventListener("mousedown", this.draw.bind(this));

            this.canvas.addEventListener("wheel", this.handleScroll.bind(this));
            document.addEventListener("keydown", this.handleKeyDown.bind(this));

            for (const [color, button] of Object.entries(this.colorButtons)) {
                button.addEventListener("click", () => {
                    this.setColor(color);
                    this.color = colors[color];
                });
            }

            this.update();
        }

        // ##############################
        //           HANDLING
        // ##############################

        handleScroll(e) {
            // Increase or decrease the size value based on the direction of the mouse scroll
            this.brushSize = parseInt(this.brushSize) + ((e.deltaY > 0 ? -1 : 1) * 10);
            if (this.brushSize < 5) {
                this.brushSize = 5;
            } else if (this.brushSize > 75) {
                this.brushSize = 75;
            }
        }

        handleKeyDown(e) {
            switch (e.key) {
                case "1":
                    this.setColor("black");
                    break;
                case "2":
                    this.setColor("gray");
                    break;
                case "3":
                    this.setColor("red");
                    break;
                case "4":
                    this.setColor("orange");
                    break;
                case "5":
                    this.setColor("yellow");
                    break;
                case "6":
                    this.setColor("green");
                    break;
                case "7":
                    this.setColor("blue");
                    break;
                case "8":
                    this.setColor("purple");
                    break;
                case "9":
                    this.setColor("pink");
                    break;
                case "0":
                    this.setColor("brown");
                    break;
                case "-":
                    this.setColor("white");
                    break;
                case "r":
                    this.setColor("rainbow");
                case " ":
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    break;
                default:
                    break;
            }
        }

        // ##############################
        //            DRAWING
        // ##############################

        setColor(color) {
            this.color = colors[color];
            if (this.color === colors.rainbow) {
                this.hue = 0;
            }
        }

        startDrawing(e) {
            const canvasRect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            this.isDrawing = true;
            [this.lastX, this.lastY] = [mouseX, mouseY];
        }

        draw(e) {
            if (!this.isDrawing) {
                return;
            }

            this.ctx.lineWidth = this.brushSize;

            if (this.color === colors.rainbow) {
                this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
                this.hue++;
                if (this.hue >= 360) {
                    this.hue = 0;
                }
            } else {
                this.ctx.strokeStyle = this.color;
            }

            this.ctx.lineCap = "round";

            const rect = this.canvas.getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (mouseX === this.lastX && mouseY === this.lastY) {
                // Mouse is not moving
                this.isMoving = false;
                drawDot();
            } else {
                // Mouse is moving
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(mouseX, mouseY);
                this.ctx.stroke();
            }
            [this.lastX, this.lastY] = [mouseX, mouseY];
        }

        stopDrawing() {
            this.isDrawing = false;
        }

        // ##############################
        //       LOOPING FUNCTIONS
        // ##############################

        update() {

            // Copy the current canvas to a temporary canvas
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(this.canvas, 0, 0);

            // Save the current canvas state
            const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Clear the entire canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Restore the saved canvas state, but slightly displaced
            this.ctx.putImageData(imgData, 1, 0);

            // Call the update method again after a short delay
            window.requestAnimationFrame(this.update.bind(this));
        }
    }

    const canvas = document.getElementById("canvas");
    const colorButton = {
        black: document.getElementById("black"),
        gray: document.getElementById("gray"),
        red: document.getElementById("red"),
        orange: document.getElementById("orange"),
        yellow: document.getElementById("yellow"),
        green: document.getElementById("green"),
        blue: document.getElementById("blue"),
        purple: document.getElementById("purple"),
        pink: document.getElementById("pink"),
        brown: document.getElementById("brown"),
        white: document.getElementById("white")
    };

    new DrawingApp(canvas, colorButton);

    function getRandomTime() {
        return Math.floor(Math.random() * 3000) + 1000; // returns a random time between 1 and 4 seconds (in milliseconds)
    }

    var limit = 99;

    setTimeout(function () {
        var text = document.getElementById("text");
        var swap = document.getElementById("swap");
        if (limit >= 3) {
            swap.style.visibility = "visible";
        } else {
            text.style.visibility = "visible";
            limit = limit + 1;
        }
        setTimeout(function () {
            text.style.visibility = "hidden";
            swap.style.visibility = "hidden";
        }, 1000); // hides after 1 second
    }, 5000); // waits for 5 seconds at the very least

    setInterval(function () {
        var text = document.getElementById("text");
        text.style.visibility = "hidden";
        setTimeout(function () {
        }, 1000); // disables the transition after 1 second
        setTimeout(function () {
            text.style.visibility = "visible";
            setTimeout(function () {
                text.style.visibility = "hidden";
            }, 1000); // hides after 1 second
        }, getRandomTime()); // waits for a random time before turning the square white
    }, 5000 + getRandomTime()); // repeats the process every 5 seconds plus a random time
});
