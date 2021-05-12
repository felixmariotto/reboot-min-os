# dungeon-game
dungeon game

#bodies tags   

###isDynamic: true
tells the engine that this body is a dynamic body

###mass: float
dynamic body power when interacting with another dynamic body

###weight: float
dynamic body sensitivity to gravity and forces

###constraint: { x, y, z }
axis on which the body is constrained to move

###empty: true
tells the physics engine not to resolve collision with this body.

###blocking: true
the body set colliding dynamic body velocity to 0. Used with empty bodies for blocking fences and such.

###dynamicOnly: true
only collisions with dynamic bodies will be checked on this body.