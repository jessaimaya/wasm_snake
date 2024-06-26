import init, {Direction, World} from "snake";

init().then(_ => {
    const CELL_SIZE = 10;
    const world = World.new(CELL_SIZE);
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = CELL_SIZE * CELL_SIZE;
    canvas.height = CELL_SIZE * CELL_SIZE;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    document.addEventListener("keydown", function(evt) {
        switch (evt.code) {
            case "KeyA":
            case "ArrowLeft":
                world.change_direction(Direction.Left);
                break;
            case "KeyD":
            case "ArrowRight":
                world.change_direction(Direction.Right);
                break;
            case "KeyW":
            case "ArrowUp":
                world.change_direction(Direction.Up);
                break;
            case "KeyS":
            case "ArrowDown":
                world.change_direction(Direction.Down);
                break;
        }
    });

    function drawGrid() {
        ctx.beginPath();
        for (let x = 0; x < CELL_SIZE + 1; x++) {
            ctx.moveTo(CELL_SIZE * x, 0);
            ctx.lineTo(CELL_SIZE * x, WIDTH);
        }
        for(let y = 0; y < CELL_SIZE + 1; y++) {
            ctx.moveTo(0, CELL_SIZE * y);
            ctx.lineTo(HEIGHT, CELL_SIZE * y);
        }
        ctx.stroke();
    }

    function drawSnake() {
        const snakeInd = world.snake_head();
        const col = snakeInd % CELL_SIZE;
        const row = Math.floor(snakeInd / CELL_SIZE);

        ctx.beginPath();
        ctx.fillRect(
            col * CELL_SIZE,
            row * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
        ctx.stroke();
    }

    function paint() {
        drawGrid();
        drawSnake();
    }

    function update() {
        const fps = 3;
        setTimeout(()=> {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            world.udpate();
            paint();
            requestAnimationFrame(update);
        }, 1000 / fps);
    }

    update();

});
