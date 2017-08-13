module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            bubbleGunner: {
                src: [
                    "**/*.ts",
                    "!node_modules/**"
                ]
            }
        },
        concat: {
            bubbleGunner: {
                src: [
                    // Common
                    "docs/assets/scripts/globals.js",
                    "docs/assets/scripts/scene-type.js",
                    "docs/assets/scripts/scene-event.js",
                    "docs/assets/scripts/scene-base.js",
                    "docs/assets/scripts/asset-manager.js",

                    // Preload scene
                    "docs/assets/scripts/preload/preload.js",

                    // Menu scene
                    "docs/assets/scripts/menu/menu-scene.js",

                    // Help scene
                    "docs/assets/scripts/help/help-scene.js",

                    // Game scene
                    "docs/assets/scripts/game/helpers.js",
                    "docs/assets/scripts/game/level-manager.js",
                    "docs/assets/scripts/game/scores-bar.js",
                    "docs/assets/scripts/game/dragon.js",
                    "docs/assets/scripts/game/lava-piece.js",
                    "docs/assets/scripts/game/animal.js",
                    "docs/assets/scripts/game/bubble.js",
                    "docs/assets/scripts/game/game-scene.js",

                    // Game Over scene
                    "docs/assets/scripts/game-over/game-over-scene.js",

                    "docs/assets/scripts/game-manager.js",
                    "docs/assets/scripts/script.js"
                ],
                dest: "docs/assets/scripts/bubble-gunner.concat.js"
            }
        },
        uglify: {
            bubbleGunner: {
                src: ["docs/assets/scripts/bubble-gunner.concat.js"],
                dest: "docs/assets/scripts/bubble-gunner.min.js"
            }
        },
        clean: {
            bubbleGunner: {
                src: ["docs/assets/scripts/bubble-gunner.concat.js"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask("default", [
        // "ts:bubbleGunner",
        "concat:bubbleGunner",
        "uglify:bubbleGunner",
        "clean:bubbleGunner"
    ]);
};