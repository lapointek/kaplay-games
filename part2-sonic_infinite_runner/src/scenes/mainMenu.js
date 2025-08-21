import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";

export default function mainMenu() {
    // if best-score doesnt exist than create best-score set to zero
    if (!k.getData("best-score")) k.setData("best-score", 0);
    k.onButtonPress("jump", () => k.go("game"));

    // background piece
    const bgPieceWidth = 1920;
    const bgPieces = [
        // add component to scene and determine position
        k.add([
            k.sprite("chemical-bg"),
            k.pos(0, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth * 2, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
    ];

    const platformWidth = 1280;
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([
            k.sprite("platforms"),
            k.pos(platformWidth * 4, 450),
            k.scale(4),
        ]),
    ];

    // add title
    k.add([
        k.text("SONIC RING RUN", { font: "mania", size: 96 }),
        k.pos(k.center().x, 200),
        k.anchor("center"),
    ]);
    // add subtitle
    k.add([
        k.text("Press Space/Click/Touch to Play", { font: "mania", size: 38 }),
        k.pos(k.center().x, k.center().y, -200),
        k.anchor("center"),
    ]);

    // add sonic sprite
    makeSonic(k.vec2(200, 745));

    // move bgPiece
    k.onUpdate(() => {
        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        // move game object chemical-bg to left
        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(
                platforms[1].pos.x + platforms[1].width * 4,
                450
            );
            platforms.push(platforms.shift());
        }

        platforms[0].move(-4000, 0);
        platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
    });
}
