import k from "./kaplayCtx";
import game from "./scenes/game";
import gameOver from "./scenes/gameOver";
import mainMenu from "./scenes/mainMenu";

// import asset
k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("sonic", "graphics/sonic.png", {
    // how many frames per row
    sliceX: 8,
    // how many frames per column
    sliceY: 2,
    // config animations starting at zero
    anims: {
        // first row
        run: { from: 0, to: 7, loop: true, speed: 30 },
        jump: { from: 8, to: 15, loop: true, speed: 100 },
    },
});
k.loadSprite("ring", "graphics/ring.png", {
    // how many frames per row
    sliceX: 16,
    // how many frames per column
    sliceY: 1,
    // config animations starting at zero
    anims: {
        // first row
        spin: { from: 0, to: 15, loop: true, speed: 30 },
    },
});
k.loadSprite("motobug", "graphics/motobug.png", {
    // how many frames per row
    sliceX: 5,
    // how many frames per column
    sliceY: 1,
    // config animations starting at zero
    anims: {
        // first row
        run: { from: 0, to: 4, loop: true, speed: 8 },
    },
});
k.loadFont("mania", "fonts/mania.ttf");

k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("city", "sounds/city.mp3");

k.scene("main-menu", mainMenu);

k.scene("game", game);
k.scene("gameover", gameOver);

// default scene
k.go("main-menu");
