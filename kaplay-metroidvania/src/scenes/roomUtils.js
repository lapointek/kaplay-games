import { state, statePropsEnum } from "../state/globalStateManager.js";

export function setBackgroundColor(k, hexColorCode) {
    k.add([
        // create rectangle
        k.rect(k.width(), k.height()),
        k.color(k.Color.fromHex(hexColorCode)),
        // gameobject not affected by camera, remain in same position
        k.fixed(),
    ]);
}

export function setMapColliders(k, map, colliders) {
    for (const collider of colliders) {
        if (collider.polygon) {
            const coordinates = [];
            for (const point of collider.polygon) {
                coordinates.push(k.vec2(point.x, point.y));
            }

            map.add([
                k.pos(collider.x, collider.y),
                // hit box
                k.area({
                    // takes a vector2
                    shape: new k.Polygon(coordinates),
                    // tag to ignore collider when colliding with eachother
                    collisionIgnore: ["collider"],
                }),
                // tag name
                k.body({ isStatic: true }),
                "collider",
                collider.type,
            ]);
            continue;
        }
        if (collider.name === "boss-barrier") {
            const bossBarrier = map.add([
                k.rect(collider.width, collider.height),
                k.color(k.Color.fromHex("#eacfba")),
                k.pos(collider.x, collider.y),
                k.area({
                    collisionIgnore: ["collider"],
                }),
                k.opacity(0),
                "boss-barrier",
                {
                    // make boss barrier from invisible to visible
                    activate() {
                        k.tween(
                            this.opacity,
                            0.3,
                            1,
                            (val) => (this.opacity = val),
                            k.easings.linear
                        );
                        k.tween(
                            k.camPos().x,
                            collider.properties[0].value,
                            1,
                            (val) => k.camPos(val, k.camPos().y),
                            k.easings.linear
                        );
                    },
                    // deactivate barrier dissapear
                    async deactivate(playerPosX) {
                        k.tween(
                            this.opacity,
                            0,
                            1,
                            (val) => (this.opacity = val),
                            k.easings.linear
                        );
                        await k.tween(
                            k.camPos().x,
                            // move camera back to players position
                            playerPosX,
                            1,
                            (val) => k.camPos(val, k.camPos().y),
                            k.easings.linear
                        );
                        k.destroy(this);
                    },
                },
            ]);
            // collide with player
            bossBarrier.onCollide("player", async (player) => {
                const currentState = state.current();
                // if boss is defeated then deactivate boss barrier
                if (currentState.isBossDefeated) {
                    state.set(statePropsEnum.playerIsInBossFight, false);
                    bossBarrier.deactivate(player.pos.x);
                    return;
                }

                if (currentState.playerIsInBossFight) return;

                player.disableControls();
                player.play("idle");
                await k.tween(
                    player.pos.x,
                    player.pos.x + 25,
                    0.2,
                    (val) => (player.pos.x = val),
                    k.easings.linear
                );
                player.setControls();
            });

            bossBarrier.onCollideEnd("player", () => {
                const currentState = state.current();
                if (currentState.playerIsInBossFight || currentState.isBossDefeated) return;

                state.set(statePropsEnum.playerIsInBossFight, true);
                bossBarrier.activate();
                bossBarrier.use(k.body({ isStatic: true }));
            });
            continue;
        }
        map.add([
            k.pos(collider.x, collider.y),
            k.area({
                shape: new k.Rect(k.vec2(0), collider.width, collider.height),
                collisionIgnore: ["collider"],
            }),
            // body act as a wall
            k.body({ isStatic: true }),
            "collider",
            collider.type,
        ]);
    }
}

// Camera
export function setCameraControls(k, player, map, roomData) {
    k.onUpdate(() => {
        // if player is in boss fight return
        if (state.current().playerInBossFight) return;

        // if map position is greater than players position than clamp camera position to bounds of map
        if (map.pos.x + 160 > player.pos.x) {
            k.camPos(map.pos.x + 160, k.camPos().y);
            return;
        }

        if (player.pos.x > map.pos.x + roomData.width * roomData.tilewidth - 160) {
            // clamp camera to room
            k.camPos(map.pos.x + roomData.width * roomData.tilewidth - 160, k.camPos().y);
            return;
        }
        // camera follow player on x axis and not y axis
        k.camPos(player.pos.x, k.camPos().y);
    });
}

// Camera
export function setCameraZones(k, map, cameras) {
    for (const camera of cameras) {
        const cameraZone = map.add([
            k.area({
                shape: new k.Rect(k.vec2(0), camera.width, camera.height),
                collisionIgnore: ["collider"],
            }),
            k.pos(camera.x, camera.y),
        ]);
        // on collision of a game object. EventListener
        cameraZone.onCollide("player", () => {
            // get current camera position. if x position not equal to properties first element
            if (k.camPos().x !== camera.properties[0].value) {
                k.tween(
                    k.camPos().y,
                    // value in json
                    camera.properties[0].value,
                    // transition time
                    0.8,
                    // function to use new value
                    (val) => k.camPos(k.camPos().x, val),
                    k.easings.linear
                );
            }
        });
    }
}

export function setExitZones(k, map, exits, destinationName) {
    for (const exit of exits) {
        const exitZone = map.add([
            k.pos(exit.x, exit.y),
            k.area({
                shape: new k.Rect(k.vec2(0), exit.width, exit.height),
                collisionIgnore: ["collider"],
            }),
            k.body({ isStatic: true }),
            exit.name,
        ]);
        // set background transition
        exitZone.onCollide("player", async () => {
            const background = k.add([
                k.pos(-k.width(), 0),
                k.rect(k.width(), k.height()),
                k.color("#20214a"),
            ]);

            await k.tween(
                background.pos.x,
                0,
                0.3,
                (val) => (background.pos.x = val),
                k.easings.linear
            );
            // final exit scene
            if (exit.name === "final-exit") {
                k.go("final-exit");
                return;
            }
            k.go(destinationName, { exitName: exit.name });
        });
    }
}
