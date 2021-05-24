# three.js chain game

![chain game showcase](https://i.ibb.co/c3pM8BW/opti.gif)

#bodies tags   

###isDynamic: true
tells the engine that this body is a dynamic body

###mass: float
dynamic body power when interacting with another dynamic body

###weight: float
dynamic body sensitivity to gravity and forces

###constraint: [ x, y, z ]
axis on which the body is constrained to move

###range: [ float, float ]
array of two elements, containing the min and max bounds of a dynamic body in the direction of its constraint.

###empty: true
tells the physics engine not to resolve collision with this body.

###blocking: true
the body set colliding dynamic body velocity to 0. Used with empty bodies for blocking fences and such.

###dynamicOnly: true
only collisions with dynamic bodies will be checked on this body.

###isSwitch: true
indicate that the body is a switch. It must have range and force properties in order to work and emit events.

###switchState: true/false
initial state of the switch

###force: [ x, y, z ]
velocity towards which the body will always try to steer.

###airDrag: float
factor for the reduction of the body velocity at each physics update.
