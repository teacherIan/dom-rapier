import './style.css';

const appContainer = document.getElementById('app');
import * as PIXI from 'pixi.js';
import { create_world } from './physics';
import * as RAPIER from '@dimforge/rapier2d-compat';

let Iinterface: {
  element: HTMLElement;

  physics: {
    rigidBody: RAPIER.RigidBody;
    collider: RAPIER.Collider;
  };
};

let arr: Array<typeof Iinterface> = [];

async function start() {
  const {
    world,
    step,
    createPhysicsCube,
    createGround,
    createRightWall,
    createLeftWall,
  } = await create_world();

  createGround();
  createRightWall();
  createLeftWall();

  function createSquare(x: number, y: number, width: number, height: number) {
    //physics

    const square = document.createElement('div');
    square.classList.add('square');
    square.style.position = 'absolute';
    square.style.backgroundColor = 'red';

    square.innerHTML = 'Dom';
    square.style.left = x + 'px';
    square.style.top = y + 'px';
    square.style.width = width + 'px';
    square.style.height = height + 'px';

    const range = document.createElement('input');
    range.type = 'range';
    range.min = '-3';
    range.max = '5';
    range.value = '0';
    range.style.width = '100%';
    square.appendChild(range);

    range.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      let newValue = Number(value) * 100;
      world.gravity = new RAPIER.Vector2(0, Number(newValue / 100));
      world.bodies.forEach((body) => {
        body.addForce(new RAPIER.Vector2(0, Number(newValue)), true);
      });
    });

    appContainer?.appendChild(square);

    let squareJson = square.getBoundingClientRect();

    const { rigidBody, collider } = createPhysicsCube(
      squareJson.x,
      squareJson.y,
      squareJson.width,
      squareJson.height
    );

    arr.push({
      element: square,

      physics: {
        rigidBody,
        collider,
      },
    });
  }

  for (let i = 0; i < 100; i++) {
    const widthHeight = Math.random() * 50 + 100;
    createSquare(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
      widthHeight,
      widthHeight
    );
  }

  function gameLoop() {
    arr.forEach((item) => {
      const { x, y } = item.physics.rigidBody.translation();

      const dom = item.element.getBoundingClientRect();

      item.element.style.left = x - dom.width / 2 + 'px';
      item.element.style.top = y - dom.height / 2 + 'px';
      item.element.style.transform = `rotate(${item.physics.collider.rotation()}rad)`;
    });

    step();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

start();
