document.addEventListener("DOMContentLoaded", () => {
    const colors = {
        black: "#000000",
        gray: "#808080",
        red: "#ff0000",
        orange: "#ffa500",
        yellow: "#ffff00",
        green: "#008000",
        blue: "#0000ff",
        purple: "#800080",
        pink: "#ffc0cb",
        brown: "#a52a2a",
        rainbow: "rainbow"
    };

    class DrawingApp {
        constructor(canvas, brushSizeSlider, colorButtons) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.brushSizeSlider = brushSizeSlider;
            this.colorButtons = colorButtons;
            this.isDrawing = false;
            this.lastX = 0;
            this.lastY = 0;
            this.hue = 0;
            this.direction = true;
            this.color = colors.black;

            this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
            this.canvas.addEventListener("mousemove", this.draw.bind(this));
            this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
            this.canvas.addEventListener("mouseout", this.stopDrawing.bind(this));

            this.canvas.addEventListener("wheel", this.handleScroll.bind(this));
            document.addEventListener("keydown", this.handleKeyDown.bind(this));

            this.createSlider();

            for (const [color, button] of Object.entries(this.colorButtons)) {
                button.addEventListener("click", () => {
                    this.setColor(color);
                    this.color = colors[color];
                });
            }
            this.updateDisplaceBrush = 0;
            this.update();
            this.dashes();
        }

        createSlider() {
            const slider = document.getElementById("brushSize");
            slider.oninput = () => {
                this.brushSize = slider.value;
            };

            slider.addEventListener("wheel", (e) => {
                e.preventDefault();
                const delta = Math.sign(e.deltaY);
                const increment = delta * (e.shiftKey ? 10 : 1);
                slider.value = parseInt(slider.value) + increment;
                this.brushSize = slider.value;
            });
        }

        handleScroll(e) {
            // Increase or decrease the slider value based on the direction of the scroll
            this.brushSizeSlider.value = parseInt(this.brushSizeSlider.value) + (e.deltaY > 0 ? -1 : 1);
            // Set the brush size based on the new slider value
            this.brushSize = this.brushSizeSlider.value;
        }

        setColor(color) {
            this.color = colors[color];
            if (this.color === colors.rainbow) {
                this.hue = 0;
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
                case "r":
                    this.setColor("rainbow");
                case " ":
                    this.clearCanvas();
                    break;
                default:
                    break;
            }
        }

        startDrawing(e) {
            const canvasRect = this.canvas.getBoundingClientRect();

            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            this.isDrawing = true;
            [this.lastX, this.lastY] = [mouseX, mouseY];

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(mouseX, mouseY);
            this.ctx.stroke();
        }

        draw(e) {
            if (!this.isDrawing) {
                return;
            }

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

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(mouseX, mouseY);
            this.ctx.stroke();

            [this.lastX, this.lastY] = [mouseX, mouseY];

            if (this.ctx.lineWidth >= 50 || this.ctx.lineWidth <= 1) {
                this.direction = !this.direction;
            }

            if (this.direction) {
                this.ctx.lineWidth++;
            } else {
                this.ctx.lineWidth--;
            }
        }


        update() {
            // Update the brushstroke size
            this.ctx.lineWidth = this.brushSizeSlider.value / 2;

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
            this.ctx.putImageData(imgData, 0, -1);

            // Call the update method again after a short delay
            window.requestAnimationFrame(this.update.bind(this));
        }

        dashes() {
            // Set the line style for the vertical dotted lines
            this.ctx.setLineDash([2, 2]);
            this.ctx.strokeStyle = colors.gray;

            // Draw the left vertical line
            this.ctx.beginPath();
            this.ctx.moveTo(5, (this.canvas.height - 5));
            this.ctx.lineTo(5, this.canvas.height);
            this.ctx.stroke();

            // Draw the right vertical line
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width - 5, (this.canvas.height - 5));
            this.ctx.lineTo(this.canvas.width - 5, this.canvas.height);
            this.ctx.stroke();

            // Call the dashes method again after a short delay
            setTimeout(dashes, 1000)
        }

        stopDrawing() {
            this.isDrawing = false;
        }

        clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    const canvas = document.getElementById("canvas");
    const brushSizeSlider = document.getElementById("brushSize");
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
        rainbow: document.getElementById("rainbow")
    };

    new DrawingApp(canvas, brushSizeSlider, colorButton);
});