import init, {Direction, World} from "snake";

init().then(wasm => {
    const CELL_SIZE = 10;
    const WORLD_WIDTH = 10;
    const snakeSpawnInd = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);

    const world = World.new(WORLD_WIDTH, snakeSpawnInd);
    const worldWidth = world.width();
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = worldWidth * CELL_SIZE;
    canvas.height = worldWidth * CELL_SIZE;

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
        for (let x = 0; x < worldWidth + 1; x++) {
            ctx.moveTo(CELL_SIZE * x, 0);
            ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
        }
        for(let y = 0; y < worldWidth + 1; y++) {
            ctx.moveTo(0, CELL_SIZE * y);
            ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
        }
        ctx.stroke();
    }

    function drawSnake() {
        const snakeCellPtr = world.snake_cells(); // points wasm memory address
        const snakeLen = world.snake_len();

        const snakeCells = new Uint32Array(
            wasm.memory.buffer,
            snakeCellPtr,
            snakeLen
        );

        snakeCells.forEach((snakeInd, ind) => {
            const col = snakeInd % worldWidth;
            const row = Math.floor(snakeInd / worldWidth);

            if(ind === 0) {
                ctx.fillStyle = "#7878db";
            } else {
                ctx.fillStyle = "#000";
            }

            ctx.beginPath();
            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        });

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
            world.step();
            paint();
            requestAnimationFrame(update);
        }, 1000 / fps);
    }

    update();

});
