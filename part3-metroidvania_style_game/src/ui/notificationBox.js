export function makeNotificationBox(k, content) {
    const container = k.make([
        // create notification
        k.rect(480, 100),
        k.color(k.Color.fromHex("#20214a")),
        k.fixed(),
        k.pos(k.center()),
        k.area(),
        k.anchor("center"),
        {
            close() {
                k.destroy(this);
            },
        },
    ]);
    // text component
    container.add([
        k.text(content, {
            font: "glyphmesss",
            size: 32,
        }),
        k.color(k.Color.fromHex("#eacfba")),
        k.area(),
        k.anchor("center"),
    ]);

    return container;
}
