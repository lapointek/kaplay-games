import { state } from "../state/globalStateManager.js";

export function makeCartridge(k, pos) {
    const cartridge = k.make([
        // spawn cartridge
        k.sprite("cartridge", { anim: "default" }),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
    ]);
    // collide with player
    cartridge.onCollide("player", (player) => {
        // play health sound when hit
        k.play("health", { volume: 0.5 });
        if (player.hp() < state.current().maxPlayerHp) {
            player.heal(1);
        }
        k.destroy(cartridge);
    });

    return cartridge;
}
