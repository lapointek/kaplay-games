import k from "../kaplayCtx";

export function makeSonic(pos) {
    const sonic = k.add([
        k.sprite("sonic", { anim: "run" }),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.body({ jumpForce: 1700 }),
        {
            setControls() {
                // on button press sprite jump
                k.onButtonPress("jump", () => {
                    if (this.isGrounded()) {
                        // plays animation
                        this.play("jump");
                        this.jump();
                        // play a sound
                        k.play("jump", { volume: 0.2 });
                    }
                });
            },
            setEvents() {
                this.onGround(() => {
                    this.play("run");
                });
            },
        },
    ]);

    // display +1 on sonic sprite in yellow
    sonic.ringCollectUI = sonic.add([
        k.text("", { font: "mania", size: 24 }),
        k.color(255, 255, 0),
        k.anchor("center"),
        k.pos(30, -10),
    ]);

    return sonic;
}
