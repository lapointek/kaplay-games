import k from "../kaplayCtx";

export function makeMotobug(pos) {
    return k.add([
        // sprite of motobug
        k.sprite("motobug", { anim: "run" }),
        // hitbox shape
        k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        // check when enemy is offscreen
        k.offscreen(),
        // sprite tag
        "enemy",
    ]);
}
