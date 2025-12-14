import k from "../kaplayCtx";

export function makeRing(pos) {
    return k.add([
        // sprite of motobug
        k.sprite("ring", { anim: "spin" }),
        // hitbox shape
        k.area(),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        // check when enemy is offscreen
        k.offscreen(),
        // sprite tag
        "ring",
    ]);
}
