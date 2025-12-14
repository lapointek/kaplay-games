export function makeDrone(k, initialPos) {
    return k.make([
        k.pos(initialPos),
        k.sprite("drone", { anim: "flying" }),
        // hit box
        k.area({ shape: new k.Rect(k.vec2(0), 12, 12) }),
        k.anchor("center"),
        k.body({ gravityScale: 0 }),
        // reposition drone if the player is 400 units away
        k.offscreen({ distance: 400 }),
        k.state("patrol-right", ["patrol-right", "patrol-left", "alert", "attack", "retreat"]),

        k.health(1),
        "drone",
        {
            speed: 100,
            pursuitSpeed: 150,
            range: 100,

            setBehavior() {
                const player = k.get("player", { recursive: true })[0];
                // run once (right)
                this.enterState("patrol-right", async () => {
                    // wait until continue running the if statement
                    await k.wait(3);
                    if (this.state === "patrol-right") this.enterState("patrol-left");
                });
                // while in patrol-right state run logic every frame.
                // drone is moving aslong as player is not within range.
                this.onStateUpdate("patrol-right", () => {
                    // if position of player is less than range of drone then enter alert state
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("alert");
                        return;
                    }
                    this.flipX = false;
                    this.move(this.speed, 0);
                });

                // run once (left)
                this.enterState("patrol-left", async () => {
                    // wait until continue running the if statement
                    await k.wait(3);
                    if (this.state === "patrol-left") this.enterState("patrol-right");
                });
                // while in patrol-right state run logic every frame.
                // drone is moving aslong as player is not within range.
                this.onStateUpdate("patrol-left", () => {
                    // if position of player is less than range of drone then enter alert state
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("alert");
                        return;
                    }
                    this.flipX = true;
                    this.move(-this.speed, 0);
                });

                this.onStateEnter("alert", async () => {
                    await k.wait(1);
                    if (this.pos.dist(player.pos) < this.range) {
                        this.enterState("attack");
                        return;
                    }
                    this.enterState("patrol-right");
                });

                this.onStateUpdate("attack", () => {
                    // if players position is greater than drones range. Then drone enters alert state
                    if (this.pos.dist(player.pos) > this.range) {
                        this.enterState("alert");
                        return;
                    }
                    this.flipX = player.pos.x <= this.pos.x;
                    // move to player
                    this.moveTo(k.vec2(player.pos.x, player.pos.y, +12), this.pursuitSpeed);
                });
            },

            setEvents() {
                const player = k.get("player", { recursive: true })[0];
                this.onCollide("player", () => {
                    // if player is attacking then return
                    if (player.isAttacking) return;
                    // hurt drone by 1
                    this.hurt(1);
                    // hurt player by 1
                    player.hurt(1);
                });

                this.onAnimEnd((anim) => {
                    // if animation is explode destroy the game object
                    if (anim === "explode") {
                        k.destroy(this);
                    }
                });

                // custom event listener for sound
                this.on("explode", () => {
                    k.play("boom", { volume: 0.2 });
                    this.collisionIgnore = ["player"];
                    this.unuse("body");
                    this.play("explode");
                });
                this.onCollide("sword-hitbox", () => {
                    this.hurt(1);
                });

                // trigger hurt event when the hurt function is called
                this.on("hurt", () => {
                    if (this.hp() === 0) {
                        this.trigger("explode");
                    }
                });

                this.onExitScreen(() => {
                    // if the drones distance is greater than 400
                    //  then the drones position equals initial position
                    this.pos = initialPos;
                });
            },
        },
    ]);
}
