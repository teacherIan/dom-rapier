import * as RAPIER from '@dimforge/rapier2d-compat';

async function run_simulation() {
  await RAPIER.init().then(() => {
    console.log('Initialized the WASM library.');
  });
  return RAPIER;
  // Run the simulation.
}

export async function create_world() {
  const RAPIER = await run_simulation();
  const gravity = new RAPIER.Vector2(0.0, 10);
  const world = new RAPIER.World(gravity);

  function step() {
    world.timestep = 0.1;
    world.step();
  }

  function createPhysicsCube(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2);
    const collider = world.createCollider(colliderDesc, rigidBody);
    collider.setRestitution(0.5);

    return { rigidBody, collider };
  }

  function createGround() {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      0,
      window.innerHeight + 50
    );
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(window.innerWidth * 2, 50);
    const collider = world.createCollider(colliderDesc, rigidBody);

    return { rigidBody, collider };
  }

  function createLeftWall() {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      0,
      window.innerHeight
    );
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0, window.innerHeight * 2);
    const collider = world.createCollider(colliderDesc, rigidBody);

    return { rigidBody, collider };
  }

  function createRightWall() {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      window.innerWidth + 100,
      window.innerHeight
    );
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      100,
      window.innerHeight * 2
    );
    const collider = world.createCollider(colliderDesc, rigidBody);

    return { rigidBody, collider };
  }

  function createStaticSquare(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const collider = world.createCollider(colliderDesc, rigidBody);

    return { rigidBody, collider };
  }

  return {
    world,
    step,
    createPhysicsCube,
    createGround,
    createRightWall,
    createLeftWall,
  };
}
