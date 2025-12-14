import { state, statePropsEnum } from "../state/globalStateManager.js";
import { healthBar } from "../ui/healthBar.js";
import { makeBlink } from "./entitySharedLogic.js";

export function makePlayer(k) {
    // create gameobject player
    return k.make([
        k.pos(),
        k.sprite("player"),
        // hit box
        k.area({
            shape: new k.Rect(k.vec2(0, 18), 12, 12),
        }),
        // position
        k.anchor("center"),
        k.body({ mass: 100, jumpForce: 320 }),
        // allow player to jump twice
        k.doubleJump(state.current().isDoubleJumpUnlocked ? 2 : 1),
        k.opacity(),
        k.health(state.current().playerHp),
        // player tag
        "player",
        {
            speed: 150,
            isAttacking: false,
            setPosition(x, y) {
                this.pos.x = x;
                this.pos.y = y;
            },
            enablePassthrough() {
                this.onBeforePhysicsResolve((collision) => {
                    if (collision.target.is("passthrough") && this.isJumping()) {
                        collision.preventResolution();
                    }
                });
            },
            // player controls
            setControls() {
                this.controlHandlers = [];
                this.controlHandlers.push(
                    k.onKeyPress((key) => {
                        if (key === "x") {
                            // play jump animation when current animation is not jump
                            if (this.curAnim() !== "jump") this.play("jump");
                            this.doubleJump();
                        }
                        if (key === "z" && this.curAnim() !== "attack" && this.isGrounded()) {
                            this.isAttacking = true;
                            // hit box
                            this.add([
                                k.pos(this.flipX ? -25 : 0, 10),
                                k.area({
                                    shape: new k.Rect(k.vec2(0), 25, 10),
                                }),
                                "sword-hitbox",
                            ]);
                            this.play("attack");

                            // animation name
                            this.onAnimEnd((anim) => {
                                // if animation is attack
                                if (anim === "attack") {
                                    // get swordHitBox
                                    const swordHitBox = k.get("sword-hitbox", {
                                        recursive: true,
                                    })[0];
                                    // if swordHitBox exists then destroy the game object
                                    if (swordHitBox) k.destroy(swordHitBox);
                                    this.isAttacking = false;
                                    // play idle animation after attack is finished
                                    this.play("idle");
                                }
                            });
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyDown((key) => {
                        // if left key is pressed and is not attacking
                        if (key === "left" && !this.isAttacking) {
                            // if current animation is run and player is grounded
                            if (this.curAnim() !== "run" && this.isGrounded()) {
                                this.play("run");
                            }
                            // flip player when pressing left key
                            this.flipX = true;
                            this.move(-this.speed, 0);
                            return;
                        }

                        if (key === "right" && !this.isAttacking) {
                            // if current animation is run and player is grounded
                            if (this.curAnim() !== "run" && this.isGrounded()) {
                                this.play("run");
                            }
                            this.flipX = false;
                            this.move(this.speed, 0);
                            return;
                        }
                    })
                );

                this.controlHandlers.push(
                    k.onKeyRelease(() => {
                        // if none of these animations are not playing then play idle animation
                        if (
                            this.curAnim() !== "idle" &&
                            this.curAnim() !== "jump" &&
                            this.curAnim() !== "fall" &&
                            this.curAnim() !== "attack"
                        )
                            this.play("idle");
                    })
                );
            },
            disableControls() {
                for (const handler of this.controlHandlers) {
                    handler.cancel();
                }
            },

            // player fallen off map
            respawnIfOutOfBounds(
                boundValue,
                destinationName,
                previousSceneData = { exitName: null }
            ) {
                k.onUpdate(() => {
                    if (this.pos.y > boundValue) {
                        k.go(destinationName, previousSceneData);
                    }
                });
            },

            setEvents() {
                this.onFall(() => {
                    this.play("fall");
                });
                // falling off platform
                this.onFallOff(() => {
                    this.play("fall");
                });
                this.onGround(() => {
                    this.play("idle");
                });
                this.onHeadbutt(() => {
                    this.play("fall");
                });

                this.on("heal", () => {
                    state.set(statePropsEnum.playerHp, this.hp());
                    healthBar.trigger("update");
                });

                // make player blink when hurt
                this.on("hurt", () => {
                    makeBlink(k, this);
                    if (this.hp() > 0) {
                        state.set(statePropsEnum.playerHp, this.hp());
                        healthBar.trigger("update");
                        return;
                    }
                    k.play("boom");
                    this.play("explode");
                    state.set(statePropsEnum.playerHp, state.current().maxPlayerHp);
                });
                // goto room1 after all enemydrones are killed
                this.onAnimEnd((anim) => {
                    if (anim === "explode") {
                        k.go("room1");
                    }
                });
            },
            // enable double jump on player when you beat the enemy boss
            enableDoubleJump() {
                this.numJumps = 2;
            },
        },
    ]);
}
