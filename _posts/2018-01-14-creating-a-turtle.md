---
layout: post
title: "Creating a turtle"
date: 2018-01-14
categories: [rust, turtle]
comments: true
---

Let's have some fun and create the real turtle drawing using [Turtle](http://turtle.rs/).
Inspired by child's drawing of turtle we are going to draw and paint figures which consists of arcs and straight lines.

![Turtle]({{ site.url }}/assets/img/creating_a_turtle/turtle.PNG)

## Preparation

Creating a new project

```bash
cargo new --bin creating_a_turtle
```

Adding Turtle as a Dependency

```bash
[dependencies]
turtle = "^1.0.0-alpha.8"
```

Changing the `src/main.rs`

```rust
extern crate turtle;

use turtle::{Turtle, Color, color};

const SIZE: f64 = 1.0;
const SHELL_COLOR: Color = Color {red: 62.0, green: 114.0, blue: 29.0, alpha: 1.0};
const BODY_COLOR: Color = Color {red: 119.0, green: 178.0, blue: 85.0, alpha: 1.0};
const EYE_COLOR: Color = color::BLACK;

fn main() {
    let mut turtle = Turtle::new();
    turtle.set_speed(8);

    // ...
}
```

## Basic steps

Lets divide the turtle on the different parts and draw it separatly.
Our turtle consists of the next parts:

<div class="list-group">
  <a href="#shell" class="list-group-item list-group-item-action">Shell</a>
  <a href="#tail" class="list-group-item list-group-item-action">Tail</a>
  <a href="#legs" class="list-group-item list-group-item-action">Two legs</a>
  <a href="#neck" class="list-group-item list-group-item-action">Neck</a>
  <a href="#head" class="list-group-item list-group-item-action">Head</a>
  <a href="#eye" class="list-group-item list-group-item-action">Eye</a>
  <a href="#highlights" class="list-group-item list-group-item-action">Highlights on the shell</a>
</div>

To draw arcs we need to use the loops which are determine tilt angle and the length. The more sophisticated the figure is the more loops it requires to make.

### Shell

Adding code to the `main` function

```rust
turtle.pen_up();
turtle.set_x(-280.0);
turtle.set_y(-90.0);

draw_shell(&mut turtle);
```

Creating `draw_shell` function

```rust
fn draw_shell(turtle: &mut Turtle) {
    turtle.set_fill_color(SHELL_COLOR);
    turtle.begin_fill();

    for _ in 0..180 {
        turtle.forward(SIZE);
        turtle.right(1.0);
    }

    for _ in 0..90 {
        turtle.forward(SIZE / 3.0);
        turtle.right(1.0);
    }

    turtle.set_speed(5);
    let d = SIZE * 360.0 / std::f64::consts::PI;
    turtle.forward(d - d / 3.0);
    turtle.set_speed(10);

    for _ in 0..90 {
        turtle.forward(SIZE / 3.0);
        turtle.right(1.0);
    }

    turtle.end_fill();
}
```

![Shell]({{ site.url }}/assets/img/creating_a_turtle/shell.PNG)

### Tail

Adding code to the `main` function

```rust
draw_tail(&mut turtle);
```

Creating `draw_tail` function

```rust
fn draw_tail(turtle: &mut Turtle) {
    turtle.set_fill_color(BODY_COLOR);
    turtle.begin_fill();

    turtle.left(90.0);
    turtle.forward(SIZE);

    for _ in 0..45 {
        turtle.forward(SIZE / 3.0);
        turtle.left(1.0);
    }

    turtle.forward(SIZE * 3.0);

    for _ in 0..25 {
        turtle.forward(SIZE / 3.0);
        turtle.left(6.0);
    }

    turtle.forward(SIZE * 9.0);
    turtle.right(6.0);
    turtle.forward(SIZE * 8.0);

    turtle.end_fill();
}
```

![Tail]({{ site.url }}/assets/img/creating_a_turtle/tail.PNG)

### Legs

Adding code to the `main` function

```rust
turtle.pen_up();
turtle.right(55.0);
turtle.forward(SIZE * 10.0);
turtle.right(55.0);

// Back leg
draw_leg(&mut turtle);

turtle.right(86.5);
turtle.forward(SIZE * 55.0);
turtle.right(86.0);

// Front leg
draw_leg(&mut turtle);
```

Creating `draw_leg` function

```rust
fn draw_leg(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..15 {
        turtle.forward(SIZE);
        turtle.left(0.5);
    }

    for _ in 0..90 {
        turtle.forward(SIZE / 6.0);
        turtle.left(1.0);
    }

    turtle.forward(SIZE * 3.0);

    for _ in 0..90 {
        turtle.forward(SIZE / 6.0);
        turtle.left(1.0);
    }

    turtle.forward(SIZE * 14.5);

    turtle.end_fill();
}
```

![Legs]({{ site.url }}/assets/img/creating_a_turtle/legs.PNG)

### Neck

Adding code to the `main` function

```rust
turtle.right(54.5);
turtle.forward(SIZE * 8.0);

draw_neck(&mut turtle);
```

Creating `draw_neck` function

```rust
fn draw_neck(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..15 {
        turtle.forward(SIZE * 3.0);
        turtle.left(1.5);
    }

    turtle.end_fill();
    turtle.begin_fill();

    turtle.left(100.0);
    turtle.forward(SIZE * 20.0);
    turtle.left(80.0);

    for _ in 0..4 {
        turtle.forward(SIZE * 3.7);
        turtle.left(1.5);
    }

    turtle.left(30.0);

    for _ in 0..27 {
        turtle.forward(SIZE);
        turtle.right(1.0);
    }

    turtle.end_fill();
}
```

![Neck]({{ site.url }}/assets/img/creating_a_turtle/neck.PNG)

### Head

In our case the most difficult part of the turtle is head. It requires six loops to draw. There was a way to draw it as one circle but I've decided to make it look a like a real turtle's head.

Adding code to the `main` function

```rust
turtle.right(172.6);
turtle.forward(SIZE * 40.0);
turtle.right(110.0);

draw_head(&mut turtle);
```

Creating `draw_head` function

```rust
fn draw_head(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..20 {
        turtle.forward(SIZE * 1.2);
        turtle.left(1.0);
    }

    for _ in 0..10 {
        turtle.forward(SIZE * 1.2);
        turtle.left(4.0);
    }

    for _ in 0..10 {
        turtle.forward(SIZE / 1.5);
        turtle.left(7.0);
    }

    for _ in 0..10 {
        turtle.forward(SIZE);
        turtle.left(2.0);
    }

    for _ in 0..50 {
        turtle.forward(SIZE / 2.5);
        turtle.left(1.0);
    }

    for _ in 0..30 {
        turtle.forward(SIZE / 3.0);
        turtle.left(1.8);
    }

    for _ in 0..10 {
        turtle.forward(SIZE / 1.5);
        turtle.left(1.8);
    }

    turtle.end_fill();
}
```

![Head]({{ site.url }}/assets/img/creating_a_turtle/head.PNG)

### Eye

Adding code to the `main` function

```rust
turtle.left(128.0);
turtle.forward(SIZE * 15.0);

draw_eye(&mut turtle);
```

Creating `draw_eye` function

```rust
fn draw_eye(turtle: &mut Turtle) {
    turtle.set_fill_color(EYE_COLOR);
    turtle.begin_fill();
    for _ in 0..90 {
        turtle.forward(SIZE / 3.0);
        turtle.right(4.0);
    }
    turtle.end_fill();
}
```

![Eye]({{ site.url }}/assets/img/creating_a_turtle/eye.PNG)

### Highlights

Adding code to the `main` function

```rust
turtle.set_fill_color(BODY_COLOR);

turtle.left(175.0);
turtle.forward(SIZE * 43.0);

draw_right_highlight(&mut turtle);

turtle.right(18.0);
turtle.forward(SIZE * 37.0);
turtle.set_heading(180.0);

draw_middle_highlight(&mut turtle);

turtle.left(24.0);
turtle.forward(SIZE * 36.0);
turtle.set_heading(180.0);

draw_left_highlight(&mut turtle);
```

Creating highlight functions

```rust
fn draw_right_highlight(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..39 {
        turtle.forward(SIZE / 5.0);
        turtle.left(2.0);
    }

    turtle.forward(SIZE * 36.0);

    for _ in 0..90 {
        turtle.forward(SIZE / 2.5);
        turtle.left(2.0);
    }

    for _ in 0..42 {
        turtle.forward(SIZE);
        turtle.left(0.9);
    }

    for _ in 0..26 {
        turtle.forward(SIZE / 5.0);
        turtle.left(2.0);
    }

    turtle.end_fill();
}

fn draw_middle_highlight(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..40 {
        turtle.forward(SIZE / 4.0);
        turtle.left(2.0);
    }

    turtle.forward(SIZE * 47.0);
    turtle.left(8.5);

    for _ in 0..90 {
        turtle.forward(SIZE / 2.0);
        turtle.left(2.0);
    }
    turtle.forward(SIZE / 2.0);

    turtle.left(8.5);
    turtle.forward(SIZE * 47.0);

    for _ in 0..40 {
        turtle.left(2.0);
        turtle.forward(SIZE / 4.0);
    }

    turtle.end_fill();
}

fn draw_left_highlight(turtle: &mut Turtle) {
    turtle.begin_fill();

    for _ in 0..26 {
        turtle.forward(SIZE / 5.0);
        turtle.left(2.0);
    }

    for _ in 0..42 {
        turtle.forward(SIZE);
        turtle.left(0.9);
    }

    for _ in 0..90 {
        turtle.forward(SIZE / 2.5);
        turtle.left(2.0);
    }

    turtle.forward(SIZE * 36.0);

    for _ in 0..39 {
        turtle.forward(SIZE / 5.0);
        turtle.left(2.0);
    }

    turtle.end_fill();
}
```

![Turtle]({{ site.url }}/assets/img/creating_a_turtle/turtle.PNG)

### Main function

```rust
fn main() {
    let mut turtle = Turtle::new();
    turtle.set_speed(8);

    turtle.pen_up();
    turtle.set_x(-280.0);
    turtle.set_y(-90.0);

    draw_shell(&mut turtle);

    draw_tail(&mut turtle);

    turtle.pen_up();
    turtle.right(55.0);
    turtle.forward(SIZE * 10.0);
    turtle.right(55.0);

    // Back leg
    draw_leg(&mut turtle);

    turtle.right(86.5);
    turtle.forward(SIZE * 55.0);
    turtle.right(86.0);

    // Front leg
    draw_leg(&mut turtle);

    turtle.right(54.5);
    turtle.forward(SIZE * 8.0);

    draw_neck(&mut turtle);

    turtle.right(172.6);
    turtle.forward(SIZE * 40.0);
    turtle.right(110.0);

    draw_head(&mut turtle);

    turtle.left(128.0);
    turtle.forward(SIZE * 15.0);

    draw_eye(&mut turtle);

    turtle.set_fill_color(BODY_COLOR);

    turtle.left(175.0);
    turtle.forward(SIZE * 43.0);

    draw_right_highlight(&mut turtle);

    turtle.right(18.0);
    turtle.forward(SIZE * 37.0);
    turtle.set_heading(180.0);

    draw_middle_highlight(&mut turtle);

    turtle.left(24.0);
    turtle.forward(SIZE * 36.0);
    turtle.set_heading(180.0);

    draw_left_highlight(&mut turtle);
}
```

## Result

![Example]({{ site.url }}/assets/img/creating_a_turtle/turtle.gif)
