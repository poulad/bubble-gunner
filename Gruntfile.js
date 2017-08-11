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
                    "docs/assets/scripts/bubble-gunner2.js",
                    "docs/assets/scripts/preload.js",
                    "docs/assets/scripts/menu.js",
                    "docs/assets/scripts/help.js",
                    "docs/assets/scripts/game.js",
                    "docs/assets/scripts/game-over.js",
                    "docs/assets/scripts/bubble-gunner.js",
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