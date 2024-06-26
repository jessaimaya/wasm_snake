use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(PartialEq)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

struct Cell(usize);

struct Snake {
    body: Vec<Cell>,
    direction: Direction,
}

impl Snake {
    fn new(index: usize) -> Self {
        wasm_log::init(wasm_log::Config::default());
        Snake {
            body: vec![Cell(index)],
            direction: Direction::Up,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    pub width: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize) -> Self {
        World {
            width,
            snake: Snake::new(100),
        }
    }

    pub fn snake_head(&self) -> usize {
        // self.snake.body.last().expect("fail to get snake head.").0
        self.snake.body[0].0
    }

    pub fn udpate(&mut self) {
        let current_ind = self.snake_head();
        let row = current_ind / self.width;
        let col = current_ind % self.width;

        self.snake.body[0].0 = match self.snake.direction {
            Direction::Right => {
                let next_col = (col + 1) % self.width;
                (row * self.width) + next_col
            }
            Direction::Left => {
                let next_col = if col == 0 { self.width - 1 } else { col - 1 };
                (row * self.width) + next_col
            }
            Direction::Up => {
                let next_row = if row == 0 { self.width - 1 } else { row - 1 };
                let res = (next_row * self.width) + col;
                res
            }
            Direction::Down => {
                let next_row = (col + 1) % self.width;
                (row * self.width) + next_row
            }
        }
    }
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hi {}!", name));
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}
