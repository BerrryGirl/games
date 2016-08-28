FishSpikes = {};
FishSpikes.Boot = function(game) {};
FishSpikes.Boot.prototype = {
    preload: function() {
        this.game.load.image("preloadSprite", "assets/preloadBar.png");
        this.game.load.image("bg", "assets/bg.png");
        this.game.load.bitmapFont("fontb", "assets/fonts/fontb.png", "assets/fonts/fontb.xml")
    },
    create: function() {
        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.refresh()
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(false, true);
            this.scale.enterPortrait.add(this.rescale, this);
            this.scale.enterLandscape.add(this.rescale, this)
        }
        this.scale.setScreenSize(true);
        this.scale.refresh();
        this.game.state.start("preload")
    },
    rescale: function() {
        setTimeout(function() {
            game.scale.refresh();
            setTimeout(function() {
                game.scale.refresh()
            }, 400)
        }, 400)
    }
};
FishSpikes.globale = {
    save: null,
    isLocalStorage: true,
    music: null,
    resolution: 2
};
resolution = 2;
gamePaused = false;
configGame = {
    prixFishs: [100, 200, 300, 400, 1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 12, 21, 32, 54, 89, 36, 60, 55],
    effectsFish: [2, 7, 5, 8, 1, 6, 1, 7, 8, 3, 6, 0],
    posYeux: [{
        x: 51,
        y: 22
    }, {
        x: 41,
        y: 15
    }, {
        x: 23,
        y: 21
    }, {
        x: 43,
        y: 16
    }, {
        x: 61,
        y: 26
    }, {
        x: 22,
        y: 14
    }, {
        x: 40,
        y: 20
    }, {
        x: 48,
        y: 16
    }, {
        x: 69,
        y: 18
    }, {
        x: 52,
        y: 18
    }, {
        x: 29,
        y: 26
    }, {
        x: 70,
        y: 17
    }],
    objSeg: [{
        x: 33,
        y: 6,
        z: 45,
        t: 56
    }, {
        x: 25,
        y: 1,
        z: 33,
        t: 44
    }, {
        x: 12,
        y: 6,
        z: 0,
        t: 41
    }, {
        x: 30,
        y: 2,
        z: 15,
        t: 50
    }, {
        x: 51,
        y: 12,
        z: 41,
        t: 52
    }, {
        x: 3,
        y: 2,
        z: 8,
        t: 38
    }, {
        x: 57,
        y: 6,
        z: 45,
        t: 56
    }, {
        x: 66,
        y: 3,
        z: 57,
        t: 44
    }, {
        x: 78,
        y: 6,
        z: 87,
        t: 40
    }, {
        x: 59,
        y: 2,
        z: 75,
        t: 50
    }, {
        x: 38,
        y: 12,
        z: 49,
        t: 54
    }, {
        x: 86,
        y: 0,
        z: 80,
        t: 39
    }],
    objSegHard: [
        [{
            x: 0,
            y: 46
        }, {
            x: 47,
            y: 0
        }, {
            x: 67,
            y: 46
        }, {
            x: 132,
            y: 46
        }, {
            x: 165,
            y: 11
        }, {
            x: 177,
            y: 46
        }, {
            x: 224,
            y: 46
        }, {
            x: 271,
            y: 8
        }, {
            x: 293,
            y: 46
        }, {
            x: 293,
            y: 46
        }, {
            x: 331,
            y: 46
        }, {
            x: 356,
            y: 8
        }, {
            x: 391,
            y: 23
        }, {
            x: 394,
            y: 46
        }, {
            x: 472,
            y: 46
        }, {
            x: 510,
            y: 0
        }, {
            x: 537,
            y: 46
        }, {
            x: 640,
            y: 38
        }, {
            x: 624,
            y: 73
        }, {
            x: 595,
            y: 73
        }, {
            x: 579,
            y: 116
        }, {
            x: 530,
            y: 76
        }, {
            x: 451,
            y: 74
        }, {
            x: 420,
            y: 116
        }, {
            x: 388,
            y: 76
        }, {
            x: 333,
            y: 76
        }, {
            x: 307,
            y: 116
        }, {
            x: 274,
            y: 74
        }, {
            x: 230,
            y: 74
        }, {
            x: 209,
            y: 111
        }, {
            x: 165,
            y: 79
        }, {
            x: 118,
            y: 77
        }, {
            x: 106,
            y: 116
        }, {
            x: 55,
            y: 73
        }, {
            x: 0,
            y: 76
        }],
        [{
            x: 13,
            y: 54
        }, {
            x: 44,
            y: 51
        }, {
            x: 63,
            y: 5
        }, {
            x: 109,
            y: 48
        }, {
            x: 189,
            y: 48
        }, {
            x: 219,
            y: 5
        }, {
            x: 253,
            y: 49
        }, {
            x: 307,
            y: 48
        }, {
            x: 332,
            y: 0
        }, {
            x: 369,
            y: 50
        }, {
            x: 413,
            y: 49
        }, {
            x: 431,
            y: 9
        }, {
            x: 475,
            y: 48
        }, {
            x: 525,
            y: 50
        }, {
            x: 533,
            y: 3
        }, {
            x: 583,
            y: 49
        }, {
            x: 640,
            y: 50
        }, {
            x: 635,
            y: 82
        }, {
            x: 595,
            y: 124
        }, {
            x: 569,
            y: 81
        }, {
            x: 511,
            y: 80
        }, {
            x: 478,
            y: 116
        }, {
            x: 464,
            y: 81
        }, {
            x: 415,
            y: 80
        }, {
            x: 369,
            y: 124
        }, {
            x: 344,
            y: 78
        }, {
            x: 315,
            y: 82
        }, {
            x: 283,
            y: 117
        }, {
            x: 252,
            y: 103
        }, {
            x: 265,
            y: 80
        }, {
            x: 172,
            y: 81
        }, {
            x: 130,
            y: 124
        }, {
            x: 105,
            y: 80
        }, {
            x: 0,
            y: 88
        }, {
            x: 13,
            y: 54
        }]
    ],
    birds: [
        [
            [{
                x: 38,
                y: 24
            }, {
                x: 56,
                y: 10
            }, {
                x: 87,
                y: 12
            }, {
                x: 98,
                y: 20
            }, {
                x: 126,
                y: 25
            }, {
                x: 116,
                y: 39
            }, {
                x: 97,
                y: 42
            }, {
                x: 95,
                y: 60
            }, {
                x: 75,
                y: 70
            }, {
                x: 40,
                y: 73
            }, {
                x: 30,
                y: 68
            }, {
                x: 38,
                y: 24
            }],
            [{
                x: 104,
                y: 24
            }, {
                x: 85,
                y: 9
            }, {
                x: 55,
                y: 11
            }, {
                x: 44,
                y: 19
            }, {
                x: 15,
                y: 24
            }, {
                x: 25,
                y: 38
            }, {
                x: 45,
                y: 42
            }, {
                x: 46,
                y: 59
            }, {
                x: 66,
                y: 69
            }, {
                x: 102,
                y: 72
            }, {
                x: 111,
                y: 67
            }, {
                x: 104,
                y: 24
            }]
        ],
        [
            [{
                x: 47,
                y: 3
            }, {
                x: 120,
                y: 3
            }, {
                x: 122,
                y: 27
            }, {
                x: 90,
                y: 27
            }, {
                x: 90,
                y: 77
            }, {
                x: 21,
                y: 78
            }, {
                x: 47,
                y: 3
            }],
            [{
                x: 89,
                y: 4
            }, {
                x: 16,
                y: 4
            }, {
                x: 14,
                y: 27
            }, {
                x: 47,
                y: 27
            }, {
                x: 47,
                y: 77
            }, {
                x: 116,
                y: 78
            }, {
                x: 89,
                y: 4
            }]
        ],
        [
            [{
                x: 58,
                y: 19
            }, {
                x: 100,
                y: 9
            }, {
                x: 102,
                y: 17
            }, {
                x: 128,
                y: 31
            }, {
                x: 99,
                y: 44
            }, {
                x: 101,
                y: 72
            }, {
                x: 24,
                y: 74
            }, {
                x: 9,
                y: 60
            }, {
                x: 58,
                y: 19
            }],
            [{
                x: 78,
                y: 19
            }, {
                x: 36,
                y: 8
            }, {
                x: 34,
                y: 16
            }, {
                x: 8,
                y: 30
            }, {
                x: 37,
                y: 44
            }, {
                x: 36,
                y: 72
            }, {
                x: 112,
                y: 73
            }, {
                x: 128,
                y: 59
            }, {
                x: 78,
                y: 19
            }]
        ],
        [
            [{
                x: 30,
                y: 13
            }, {
                x: 107,
                y: 14
            }, {
                x: 125,
                y: 27
            }, {
                x: 129,
                y: 42
            }, {
                x: 93,
                y: 45
            }, {
                x: 89,
                y: 66
            }, {
                x: 22,
                y: 71
            }, {
                x: 11,
                y: 59
            }, {
                x: 30,
                y: 13
            }],
            [{
                x: 106,
                y: 13
            }, {
                x: 29,
                y: 14
            }, {
                x: 11,
                y: 27
            }, {
                x: 7,
                y: 41
            }, {
                x: 43,
                y: 45
            }, {
                x: 47,
                y: 66
            }, {
                x: 114,
                y: 70
            }, {
                x: 125,
                y: 59
            }, {
                x: 106,
                y: 13
            }]
        ],
        [
            [{
                x: 43,
                y: 4
            }, {
                x: 101,
                y: 5
            }, {
                x: 102,
                y: 14
            }, {
                x: 123,
                y: 24
            }, {
                x: 102,
                y: 30
            }, {
                x: 87,
                y: 59
            }, {
                x: 61,
                y: 75
            }, {
                x: 29,
                y: 77
            }, {
                x: 20,
                y: 15
            }, {
                x: 43,
                y: 4
            }],
            [{
                x: 93,
                y: 5
            }, {
                x: 36,
                y: 6
            }, {
                x: 35,
                y: 14
            }, {
                x: 13,
                y: 24
            }, {
                x: 35,
                y: 31
            }, {
                x: 49,
                y: 59
            }, {
                x: 76,
                y: 75
            }, {
                x: 107,
                y: 77
            }, {
                x: 116,
                y: 16
            }, {
                x: 93,
                y: 5
            }]
        ],
        [
            [{
                x: 63,
                y: 31
            }, {
                x: 79,
                y: 12
            }, {
                x: 98,
                y: 12
            }, {
                x: 122,
                y: 32
            }, {
                x: 111,
                y: 44
            }, {
                x: 100,
                y: 60
            }, {
                x: 81,
                y: 69
            }, {
                x: 36,
                y: 68
            }, {
                x: 19,
                y: 54
            }, {
                x: 10,
                y: 31
            }, {
                x: 63,
                y: 31
            }],
            [{
                x: 74,
                y: 31
            }, {
                x: 57,
                y: 12
            }, {
                x: 38,
                y: 13
            }, {
                x: 14,
                y: 32
            }, {
                x: 26,
                y: 45
            }, {
                x: 36,
                y: 60
            }, {
                x: 55,
                y: 69
            }, {
                x: 101,
                y: 68
            }, {
                x: 117,
                y: 54
            }, {
                x: 126,
                y: 31
            }, {
                x: 74,
                y: 31
            }]
        ],
        [
            [{
                x: 61,
                y: 10
            }, {
                x: 104,
                y: 9
            }, {
                x: 125,
                y: 20
            }, {
                x: 132,
                y: 35
            }, {
                x: 116,
                y: 38
            }, {
                x: 84,
                y: 67
            }, {
                x: 59,
                y: 66
            }, {
                x: 8,
                y: 46
            }, {
                x: 61,
                y: 10
            }],
            [{
                x: 76,
                y: 9
            }, {
                x: 33,
                y: 9
            }, {
                x: 12,
                y: 19
            }, {
                x: 5,
                y: 34
            }, {
                x: 21,
                y: 38
            }, {
                x: 53,
                y: 66
            }, {
                x: 78,
                y: 65
            }, {
                x: 129,
                y: 45
            }, {
                x: 76,
                y: 9
            }]
        ],
        [
            [{
                x: 21,
                y: 18
            }, {
                x: 99,
                y: 4
            }, {
                x: 100,
                y: 15
            }, {
                x: 114,
                y: 17
            }, {
                x: 124,
                y: 28
            }, {
                x: 100,
                y: 38
            }, {
                x: 99,
                y: 70
            }, {
                x: 39,
                y: 71
            }, {
                x: 32,
                y: 78
            }, {
                x: 21,
                y: 18
            }],
            [{
                x: 36,
                y: 4
            }, {
                x: 34,
                y: 15
            }, {
                x: 20,
                y: 17
            }, {
                x: 11,
                y: 28
            }, {
                x: 34,
                y: 38
            }, {
                x: 36,
                y: 70
            }, {
                x: 96,
                y: 71
            }, {
                x: 103,
                y: 78
            }, {
                x: 114,
                y: 18
            }, {
                x: 36,
                y: 4
            }]
        ],
        [
            [{
                x: 46,
                y: 23
            }, {
                x: 74,
                y: 9
            }, {
                x: 99,
                y: 16
            }, {
                x: 111,
                y: 37
            }, {
                x: 111,
                y: 67
            }, {
                x: 37,
                y: 68
            }, {
                x: 25,
                y: 60
            }, {
                x: 25,
                y: 60
            }, {
                x: 46,
                y: 23
            }],
            [{
                x: 62,
                y: 9
            }, {
                x: 37,
                y: 16
            }, {
                x: 25,
                y: 37
            }, {
                x: 25,
                y: 67
            }, {
                x: 98,
                y: 68
            }, {
                x: 111,
                y: 60
            }, {
                x: 90,
                y: 23
            }, {
                x: 62,
                y: 9
            }]
        ],
        [
            [{
                x: 54,
                y: 20
            }, {
                x: 55,
                y: 10
            }, {
                x: 127,
                y: 45
            }, {
                x: 109,
                y: 45
            }, {
                x: 81,
                y: 66
            }, {
                x: 54,
                y: 66
            }, {
                x: 11,
                y: 21
            }, {
                x: 54,
                y: 20
            }],
            [{
                x: 82,
                y: 21
            }, {
                x: 81,
                y: 10
            }, {
                x: 9,
                y: 46
            }, {
                x: 27,
                y: 46
            }, {
                x: 55,
                y: 66
            }, {
                x: 82,
                y: 66
            }, {
                x: 125,
                y: 21
            }, {
                x: 82,
                y: 21
            }]
        ],
        [
            [{
                x: 25,
                y: 16
            }, {
                x: 104,
                y: 17
            }, {
                x: 124,
                y: 29
            }, {
                x: 132,
                y: 36
            }, {
                x: 118,
                y: 46
            }, {
                x: 104,
                y: 65
            }, {
                x: 31,
                y: 66
            }, {
                x: 5,
                y: 46
            }, {
                x: 25,
                y: 46
            }, {
                x: 25,
                y: 16
            }],
            [{
                x: 111,
                y: 16
            }, {
                x: 32,
                y: 16
            }, {
                x: 12,
                y: 29
            }, {
                x: 4,
                y: 46
            }, {
                x: 18,
                y: 46
            }, {
                x: 18,
                y: 46
            }, {
                x: 32,
                y: 65
            }, {
                x: 106,
                y: 65
            }, {
                x: 132,
                y: 46
            }, {
                x: 111,
                y: 46
            }, {
                x: 111,
                y: 16
            }]
        ],
        [
            [{
                x: 31,
                y: 3
            }, {
                x: 85,
                y: 3
            }, {
                x: 101,
                y: 12
            }, {
                x: 110,
                y: 31
            }, {
                x: 96,
                y: 33
            }, {
                x: 83,
                y: 55
            }, {
                x: 85,
                y: 65
            }, {
                x: 47,
                y: 65
            }, {
                x: 35,
                y: 76
            }, {
                x: 31,
                y: 3
            }],
            [{
                x: 51,
                y: 4
            }, {
                x: 34,
                y: 12
            }, {
                x: 26,
                y: 32
            }, {
                x: 40,
                y: 33
            }, {
                x: 54,
                y: 56
            }, {
                x: 51,
                y: 65
            }, {
                x: 90,
                y: 65
            }, {
                x: 102,
                y: 76
            }, {
                x: 105,
                y: 3
            }, {
                x: 51,
                y: 4
            }]
        ]
    ]
};
text = {
    play: "play",
    hard: "hard\nmode",
    gamesPlayed: "games played",
    floor: "floor",
    floorReach: "floor reached",
    hightScore: "hight score",
    selectShop: "tap to select a bird to play",
    pause: "pause",
    resume: "resume",
    menu: "menu",
    gameOver: "Game Over",
    saveMe: "save me for",
    txtTuto1: "Tap to fly and\n\nkeep the bird save from\n\nabstacls",
    loading: "Loading ...",
    nameGame: "Best Bird Climb"
};
var Music = {
    enableMisic: true,
    musicBg: null,
    sounds: null
};
FishSpikes.Save = function() {
    this.dataGame = null;
    this.isLocalStorage = this.isStorageGame();
    if (!this.isLocalStorage) {
        this.dataGame = this.getIniDataGame()
    } else {
        var str = this.getStringDataFromStorage();
        if (str == null || str == "null") this.dataGame = this.getIniDataGame();
        else this.dataGame = this.getDataFromString(str)
    }
};
FishSpikes.Save.prototype = {
    getIniDataGame: function() {
        var dataGame = {
            candy: 200,
            diam: 0,
            fishShop: [],
            charPlay: 0,
            lastFloor: 0,
            maxFloor: 0,
            nbrPlayGame: 0
        };
        for (var i = 0; i < configGame.prixFishs.length; i++) {
            dataGame.fishShop.push(false)
        }
        dataGame.fishShop[0] = true;
        return dataGame
    },
    saveData: function() {
        if (this.isLocalStorage) {
            var strToSave = this.dataGame.candy + ";";
            strToSave += this.dataGame.diam + ";";
            strToSave += this.dataGame.charPlay + ";";
            strToSave += this.dataGame.lastFloor + ";";
            strToSave += this.dataGame.maxFloor + ";";
            strToSave += this.dataGame.nbrPlayGame + ";";
            for (var i = 0; i < this.dataGame.fishShop.length; i++) {
                strToSave += this.dataGame.fishShop[i];
                if (i != this.dataGame.fishShop.length - 1) strToSave += ","
            }
            localStorage.setItem("saveBestBirdClimbe", strToSave)
        } else {
            console.log("private navigation")
        }
    },
    getDataFromString: function(str) {
        var elemetsSave = str.split(";");
        var dataGame = {
            candy: +elemetsSave[0],
            diam: +elemetsSave[1],
            fishShop: [],
            charPlay: +elemetsSave[2],
            lastFloor: +elemetsSave[3],
            maxFloor: +elemetsSave[4],
            nbrPlayGame: +elemetsSave[5]
        };
        var fishs = elemetsSave[6].split(",");
        for (var i = 0; i < fishs.length; i++) {
            if (fishs[i] === "true") dataGame.fishShop.push(true);
            else dataGame.fishShop.push(false)
        }
        debSave = dataGame;
        return dataGame
    },
    getStringDataFromStorage: function() {
        return localStorage.getItem("saveBestBirdClimbe")
    },
    isStorageGame: function() {
        var isStorageGame = true;
        if (!game.device.localStorage) {
            isStorageGame = false;
            return isStorageGame
        }
        var testKey = "qeTest",
            storage = window.sessionStorage;
        try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey)
        } catch (error) {
            if (error.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) isStorageGame = false
        }
        return isStorageGame
    }
};
FishSpikes.Preload = function(game) {};
FishSpikes.Preload.prototype = {
    preload: function() {
        this.game.add.image(0, 0, "bg");
        var pr = this.game.add.sprite(140, 560, "preloadSprite");
        pr.alpha = .4;
        progressBar = this.game.add.sprite(140, 560, "preloadSprite");
        this.game.load.setPreloadSprite(progressBar);
        var txtLoad = this.game.add.bitmapText(0, 700, "fontb", text.loading, 40);
        txtLoad.x = (this.game.width - txtLoad.textWidth) / 2;
        txtLoad = this.game.add.bitmapText(0, 300, "fontb", text.nameGame, 65);
        txtLoad.x = (this.game.width - txtLoad.textWidth) / 2;
        this.game.load.image("rotate", "assets/rotate.png");
        this.game.load.image("diam", "assets/diam.png");
        this.game.load.image("imgTimer", "assets/buttons/imgTimer.png");
        this.game.load.image("e", "assets/e.png");
        this.game.load.image("lazer", "assets/lazer.png");
        this.game.load.spritesheet("effet", "assets/effet.png", 30, 30);
        this.game.load.spritesheet("exit", "assets/buttons/exit.png", 60, 60);
        this.game.load.bitmapFont("fontw", "assets/fonts/fontw.png", "assets/fonts/fontw.xml");
        this.game.load.spritesheet("bntBig", "assets/buttons/bntBig.png", 153, 153);
        this.game.load.spritesheet("bntPlay", "assets/buttons/bntPlay.png", 162, 164);
        this.game.load.spritesheet("bntCredits", "assets/buttons/bntCredits.png", 91, 92);
        this.game.load.spritesheet("bntshop", "assets/buttons/bntshop.png", 91, 92);
        this.game.load.spritesheet("bntMini", "assets/buttons/bntMini.png", 91, 92);
        this.game.load.spritesheet("sprSound", "assets/buttons/sprSound.png", 51, 51);
        this.game.load.spritesheet("back", "assets/buttons/back.png", 91, 92);
        this.game.load.spritesheet("bntBy", "assets/buttons/bntBy.png", 200, 88);
        this.game.load.spritesheet("bntSelect", "assets/buttons/bntSelect.png", 200, 94);
        this.game.load.spritesheet("fish", "assets/fish.png", 137, 83);
        this.game.load.spritesheet("bntPause", "assets/buttons/bntPause.png", 29, 41);
        this.game.load.spritesheet("bntPause", "assets/buttons/bntPause.png", 29, 41);
        this.game.load.spritesheet("bntResume", "assets/buttons/bntResume.png", 369, 108);
        this.game.load.spritesheet("bntReplay", "assets/buttons/bntReplay.png", 516, 108);
        this.game.load.spritesheet("pipes", "assets/pipes.png", 90, 64);
        this.game.load.audio("effects", ["assets/music/effects.ogg", "assets/music/effects.mp3"]);
        this.game.load.audio("musicbg", ["assets/music/music.ogg", "assets/music/music.mp3"]);
        this.ready = false
    },
    create: function() {
        if (!this.game.device.desktop) game.scale.forceOrientation(false, true, "rotate")
    },
    update: function() {
        if (game.cache.isSoundDecoded("musicbg") && game.cache.isSoundDecoded("effects") && this.ready == false) {
            this.ready = true;
            FishSpikes.globale.save = new FishSpikes.Save;
            Music.musicBg = this.game.add.audio("musicbg");
            Music.sounds = this.game.add.audio("effects");
            Music.sounds.addMarker("click", 0, 1.4628571428571429);
            Music.sounds.addMarker("diam", 3, .809795918367347);
            Music.sounds.addMarker("jump", 5, .914285714285715);
            Music.sounds.addMarker("die", 7, .644240362811791);
            Music.sounds.addMarker("levelUp", 9, 2.37501133786848);
            game.onPause.add(function() {
                gamePaused = true;
                Music.musicBg.pause()
            }, this);
            game.onResume.add(function() {
                gamePaused = false;
                if (Music.enableMisic && !play.isGamePaused) {
                    Music.musicBg.resume()
                }
            }, this);
            Music.musicBg.onStop.add(function() {
                if (gamePaused) return;
                if (Music.enableMisic) {
                    Music.musicBg.play()
                }
            }, this);
            this.game.state.start("menu")
        }
    }
};
FishSpikes.Menu = function(game) {
    this.menuHome = null;
    this.menuShop = null;
    this.menuPause = null;
    this.menuGameOver = null;
    this.menucredits = null;
    this.menuPause = null;
    this.groupGamePlay = null;
    this.groupTuto = null;
    this.groupTxtLevels = null;
    this.groupEffet = null;
    this.bg = null;
    this.switchHomeTr = null;
    this.switchcreditsTr = null;
    this.switchShopTr = null;
    this.switchPauseTr = null;
    this.switchGameOverTr = null;
    this.dest = null;
    this.div = null;
    this.player = null;
    this.crono = null;
    this.diam = null;
    this.txtDiam = null;
    this.isGamePaused = null;
    this.isStartGame = null;
    this.bgTimer = null;
    this.txtTimer = null;
    this.timer = null;
    this.timerGameOver = null;
    this.bntPause = null;
    this.groupObj = null;
    this.DebuSwap = null;
    this.mouve = null;
    this.fish;
    this.pipes1 = null;
    this.pipes2 = null;
    this.euys = null;
    this.longPipes = 14;
    this.groupEffet;
    this.effetIndex;
    this.changeGroup = 0;
    this.scor = 0;
    this.countLevel = 0;
    this.stopX;
    this.stopY;
    this.hole;
    this.caseSup = 5;
    this.t = 0;
    this.explo = 0;
    this.vitesse = 80;
    this.g = 9.8;
    this.a = 1.0472;
    this.Xp;
    this.Yp;
    this.deraction = 1;
    this.saveY;
    this.saveIndexTableaux = 0;
    this.txt_scor = null
};
FishSpikes.Menu.prototype = {
    create: function() {
        if (Music.enableMisic) Music.musicBg.play();
        this.lastTxtDiamWidth = -1;
        this.isGamePaused = false;
        this.isStartGame = false;
        this.dest = this.world.height;
        this.div = 20;
        game.stage.backgroundColor = "#FFFFFF";
        this.menuHome = this.add.group();
        this.menucredits = this.add.group();
        this.menuShop = this.add.group();
        this.menuHome.isHome = true;
        this.showMenuHome();
        this.diam = this.add.sprite(570, 20, "diam");
        this.diam.inputEnabled = true;
        this.txtDiam = this.add.bitmapText(0, 25, "fontb", FishSpikes.globale.save.dataGame.diam + "", 40);
        this.txtDiam.x = this.diam.x - this.txtDiam.textWidth;
        this.txtDiam.align = "center"
    },
    startGameOver: function() {
        console.log("game over");
        this.switchGameOverTr = true;
        this.isGamePaused = true;
        this.bntPause.animStart = false;
        this.showMenuGameOver()
    },
    updateTxtDiam: function() {
        this.lastTxtDiamWidth = this.txtDiam.textWidth;
        this.txtDiam.text = FishSpikes.globale.save.dataGame.diam + ""
    },
    gameOverToHome: function() {
        if (this.menuGameOver) this.menuGameOver.getAt(0).visible = false;
        this.timerGameOver = null;
        this.isGamePaused = false;
        this.isStartGame = false;
        this.switchGameOverTr = false;
        console.log("go to home");
        this.initPosHome();
        this.showMenuHome();
        this.menuHome.y = 0;
        this.killGamePlay()
    },
    updateAnimMenu: function(groupMenu, animStart) {
        if (groupMenu) {
            if (animStart) {
                groupMenu.forEach(this.animShow, this)
            } else {
                groupMenu.forEach(this.animHide, this)
            }
        }
    },
    updateAnimObject: function(obj) {
        if (obj && obj.exists) {
            if (obj.animStart) {
                this.animShow(obj)
            } else {
                this.animHide(obj)
            }
        }
    },
    setPosAnimation: function(obj, s, h, isAnimeUpDown) {
        obj.posShow = s;
        obj.posHide = h;
        obj.isAnimeUpDown = isAnimeUpDown
    },
    animShow: function(obj) {
        if (obj.posShow == null) return;
        if (obj.timer) {
            obj.timer -= this.game.time.elapsed;
            if (obj.timer <= 0) obj.timer = null;
            return
        }
        if (obj.isAnimeUpDown) {
            obj.y += (obj.posShow - obj.y) / (this.div * .5)
        } else {
            obj.x += (obj.posShow - obj.x) / (this.div * .5)
        }
    },
    animHide: function(obj) {
        if (!obj || obj.posHide == null) return;
        if (Math.abs(obj.posHide - obj.y) <= 80) {
            if (obj.parent.name === "group") {
                console.log("destroy group ");
                if (obj.parent.isHome) this.fish = null;
                obj.parent.removeAll(true, true)
            } else {
                console.log("destroy obj ");
                obj.exists = false
            }
            return
        }
        if (obj.timer) {
            obj.timer -= this.game.time.elapsed;
            if (obj.timer <= 0) obj.timer = null;
            return
        }
        if (obj.isAnimeUpDown) {
            obj.y += (obj.posHide - obj.y) / (this.div * 2)
        } else {
            obj.x += (obj.posHide - obj.x) / (this.div * 2)
        }
    },
    showMenuHomeCr: function() {
        if (Music.enableMisic) Music.sounds.play("click");
        if (!this.switchcreditsTr) return;
        this.showMenuHome()
    },
    showMenuHomeSh: function() {
        if (!this.switchShopTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        this.showMenuHome()
    },
    showMenuHome: function() {
        if (this.switchShopTr) {
            console.log("menu shop exist already");
            console.log("this.menucredits.length: " + this.menuShop.length);
            var time1 = 5 * 50;
            var i = 0;
            var decTimer = false;
            while (i < this.menuShop.length) {
                if (this.menuShop.getAt(i).key === "bntBy") {
                    this.menuShop.getAt(i).timer = time1;
                    this.menuShop.getAt(i).txtPrix.timer = time1;
                    this.menuShop.getAt(i).diam.timer = time1;
                    if (decTimer) time1 -= 50;
                    decTimer = !decTimer
                } else if (this.menuShop.getAt(i).key === "bntSelect") {
                    this.menuShop.getAt(i).timer = time1;
                    this.menuShop.getAt(i).bird.timer = time1;
                    if (decTimer) time1 -= 50;
                    decTimer = !decTimer
                }
                i++
            }
        }
        this.switchHomeTr = true;
        this.switchcreditsTr = false;
        this.switchShopTr = false;
        if (this.menuHome.length > 0) {
            console.log("menu home exist already");
            console.log("this.menuHome.length: " + this.menuHome.length);
            var indexChar = FishSpikes.globale.save.dataGame.charPlay;
            var nbrCharLine = 12;
            this.fish.frame = indexChar + 24;
            this.fish.animations.add("animG", [indexChar + nbrCharLine * 2, indexChar + nbrCharLine * 3, indexChar + nbrCharLine * 2], 5);
            this.fish.animations.add("animD", [indexChar, indexChar + nbrCharLine, indexChar], 5);
            return
        }
        var bntPlay = new Phaser.Button(this.game, this.world.centerX, 556 - this.dest, "bntPlay", this.play, this, 1, 0, 1, 0);
        bntPlay.anchor.setTo(.5, .5);
        this.setPosAnimation(bntPlay, 556, 556 - this.dest, true);
        this.menuHome.add(bntPlay);
        var txtplay = new Phaser.BitmapText(this.game, this.world.centerX, 570 - this.dest, "fontw", text.play, 40);
        txtplay.x -= txtplay.textWidth / 2;
        this.setPosAnimation(txtplay, 570, 570 - this.dest, true);
        txtplay.align = "center";
        this.menuHome.add(txtplay);
        var bntCredits = new Phaser.Button(this.game, 120 - this.dest, 820, "bntCredits", this.showMenuCredits, this, 1, 0, 1, 0);
        bntCredits.anchor.setTo(.5, .5);
        this.setPosAnimation(bntCredits, 120, 120 - this.dest, false);
        this.menuHome.add(bntCredits);
        var bntShop = new Phaser.Button(this.game, this.world.centerX, 820 + this.dest, "bntshop", this.showMenuShop, this, 1, 0, 1, 0);
        bntShop.anchor.setTo(.5, .5);
        this.setPosAnimation(bntShop, 820, 820 + this.dest, true);
        this.menuHome.add(bntShop);
        var bntSound;
        bntSound = new Phaser.Button(this.game, 510 + this.dest, 820, "sprSound", this.soundbnt, bntSound);
        bntSound.addToMenu = true;
        bntSound.context = this;
        bntSound.anchor.setTo(.5, .5);
        bntSound.frame = Music.enableMisic ? 0 : 1;
        this.setPosAnimation(bntSound, 510, 510 + this.dest, false);
        var contSound = new Phaser.Button(this.game, 510 + this.dest, 820, "bntMini", this.soundbnt, bntSound, 1, 0, 1, 0);
        contSound.addToMenu = true;
        bntSound.context = this;
        contSound.anchor.setTo(.5, .5);
        this.setPosAnimation(contSound, 510, 510 + this.dest, false);
        this.menuHome.add(contSound);
        this.menuHome.add(bntSound);
        var txtfloor = new Phaser.BitmapText(this.game, 320, 120 - this.dest, "fontb", text.floorReach + ": " + FishSpikes.globale.save.dataGame.lastFloor, 35);
        txtfloor.x -= txtfloor.textWidth / 2;
        this.setPosAnimation(txtfloor, 120, 120 - this.dest, true);
        txtfloor.align = "center";
        this.menuHome.add(txtfloor);
        var txtgamesPlayed = new Phaser.BitmapText(this.game, 320, 180 - this.dest, "fontb", text.gamesPlayed + ": " + FishSpikes.globale.save.dataGame.nbrPlayGame, 35);
        txtgamesPlayed.x -= txtgamesPlayed.textWidth / 2;
        this.setPosAnimation(txtgamesPlayed, 180, 180 - this.dest, true);
        txtgamesPlayed.align = "center";
        this.menuHome.add(txtgamesPlayed);
        var txthightScore = new Phaser.BitmapText(this.game, 320, 240 - this.dest, "fontb", text.hightScore + ": " + FishSpikes.globale.save.dataGame.maxFloor, 35);
        txthightScore.x -= txthightScore.textWidth / 2;
        this.setPosAnimation(txthightScore, 240, 240 - this.dest, true);
        txthightScore.align = "center";
        this.menuHome.add(txthightScore);
        var txtTitle = new Phaser.BitmapText(this.game, 320, 340 - this.dest, "fontb", text.nameGame, 45);
        txtTitle.x -= txtTitle.textWidth / 2;
        this.setPosAnimation(txtTitle, 340, 340 - this.dest, true);
        txtTitle.align = "center";
        this.menuHome.add(txtTitle);
        this.fish = game.add.sprite(this.world.centerX, 400 - this.dest, "fish");
        this.setPosAnimation(this.fish, 400, 400 - this.dest, true);
        var indexChar = FishSpikes.globale.save.dataGame.charPlay;
        var nbrCharLine = 12;
        this.fish.frame = indexChar + nbrCharLine * 2;
        this.fish.animations.add("animG", [indexChar + nbrCharLine * 2, indexChar + nbrCharLine * 3, indexChar + nbrCharLine * 2], 5, false);
        this.fish.animations.add("animD", [indexChar, indexChar + nbrCharLine, indexChar], 5, false);
        this.menuHome.add(this.fish)
    },
    initPosHome: function() {
        console.log("add fish to home");
        this.menuHome.add(this.fish);
        this.fish.x = 380;
        for (var i = this.menuHome.length - 1; i >= 0; i--) {
            if (this.menuHome.getAt(i).isAnimeUpDown) {
                this.menuHome.getAt(i).y = this.menuHome.getAt(i).posHide
            } else {
                this.menuHome.getAt(i).x = this.menuHome.getAt(i).posHide
            }
        }
    },
    soundbnt: function() {
        if (this.context.isStartGame && this.addToMenu) return;
        Music.enableMisic = !Music.enableMisic;
        this.frame = Music.enableMisic ? 0 : 1;
        if (Music.enableMisic) {
            Music.musicBg.resume();
            Music.sounds.play("click")
        } else Music.musicBg.pause()
    },
    showMenuCredits: function() {
        if (this.isStartGame || !this.switchHomeTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        this.switchHomeTr = false;
        this.switchcreditsTr = true;
        if (this.menucredits.length > 0) {
            console.log("menu credits exist already");
            console.log("this.menucredits.length: " + this.menucredits.length);
            return
        }
        var txt = new Phaser.BitmapText(this.game, 311, 150 - this.dest, "fontb", "Developed by:\n\nElite Coder", 50);
        txt.x -= txt.textWidth / 2;
        this.setPosAnimation(txt, 150, 150 - this.dest, true);
        txt.align = "center";
        this.menucredits.add(txt);
        var txtdev = new Phaser.BitmapText(this.game, 80 - this.dest, 400, "fontb", "Programed by:\n\nwww.berrry.xyz", 35);
        this.setPosAnimation(txtdev, 80, 80 - this.dest, false);
        txtdev.align = "center";
        this.menucredits.add(txtdev);
        var txtMusic = new Phaser.BitmapText(this.game, 150 + this.dest, 650, "fontb", "Music by: \n\nElite Coder", 35);
        this.setPosAnimation(txtMusic, 150, 150 + this.dest, false);
        txtMusic.align = "center";
        this.menucredits.add(txtMusic);
        var back = new Phaser.Button(this.game, 120, 840 + this.dest, "back", this.showMenuHomeCr, this, 1, 0, 1, 0);
        back.anchor.setTo(.5, .5);
        this.setPosAnimation(back, 840, 840 + this.dest, true);
        this.menucredits.add(back)
    },
    showMenuShop: function() {
        if (this.isStartGame || !this.switchHomeTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        this.switchHomeTr = false;
        this.switchShopTr = true;
        if (this.menuShop.length > 0) {
            console.log("menu shop exist already");
            console.log("this.menucredits.length: " + this.menuShop.length);
            var time1 = 5 * 50;
            var i = 0;
            var decTimer = false;
            while (i < this.menuShop.length) {
                this.menuShop.getAt(i).timer = time1;
                this.menuShop.getAt(i + 1).timer = time1;
                if (this.menuShop.getAt(i).key === "bntBy") {
                    this.menuShop.getAt(i + 2).timer = time1;
                    i += 3
                } else {
                    i += 2
                }
                if (decTimer) time1 -= 50;
                decTimer = !decTimer
            }
            return
        }
        var txtshop = new Phaser.BitmapText(this.game, 113, 100 - this.dest, "fontb", text.selectShop, 26);
        this.setPosAnimation(txtshop, 100, 100 - this.dest, true);
        txtshop.align = "center";
        this.menuShop.add(txtshop);
        var nbrAllButtons = 12;
        var nbrButtonShow = 6;
        var widthContainer = 200 + 20;
        var heightContainer = 88 + 20;
        var pos = {
            x: 113,
            y: 145
        };
        var limit = {
            toop: pos.y,
            button: pos.y + heightContainer * nbrButtonShow
        };
        var dx = pos.x;
        var dy = pos.y;
        var nbrBirdToAdd = 0;
        var time1 = 5 * 50;
        var bnt;
        var bird;
        var txtPrix;
        var diam;
        var a = -1;
        while (nbrBirdToAdd < nbrAllButtons) {
            if (FishSpikes.globale.save.dataGame.fishShop[nbrBirdToAdd]) {
                bnt = new Phaser.Button(this.game, dx + a * this.dest, dy, "bntSelect", this.byBird, this, 1, 0, 1, 0);
                bird = new Phaser.Sprite(this.game, dx + 30 + a * this.dest, dy + 5, "fish", nbrBirdToAdd);
                bird.timer = time1;
                this.setPosAnimation(bnt, dx, dx + a * this.dest, false);
                this.setPosAnimation(bird, dx + 30, dx + 30 + a * this.dest, false);
                this.menuShop.add(bird);
                this.menuShop.add(bnt);
                bnt.bird = bird
            } else {
                diam = new Phaser.Sprite(this.game, dx + 130 + a * this.dest, dy + 15, "diam");
                diam.timer = time1;
                txtPrix = new Phaser.BitmapText(this.game, 0, dy + 20, "fontw", configGame.prixFishs[nbrBirdToAdd] + "", 40);
                txtPrix.timer = time1;
                txtPrix.x = dx + 125 - txtPrix.textWidth + a * this.dest;
                txtPrix.align = "center";
                bnt = new Phaser.Button(this.game, dx + a * this.dest, dy, "bntBy", this.byBird, this, 1, 0, 1, 0);
                bnt.diam = diam;
                bnt.txtPrix = txtPrix;
                this.setPosAnimation(bnt, dx, dx + a * this.dest, false);
                this.setPosAnimation(txtPrix, dx + 125 - txtPrix.textWidth, dx + 125 - txtPrix.textWidth + a * this.dest, false);
                this.setPosAnimation(diam, dx + 130, dx + 130 + a * this.dest, false);
                this.menuShop.add(bnt);
                this.menuShop.add(txtPrix);
                this.menuShop.add(diam)
            }
            bnt.numBird = nbrBirdToAdd;
            bnt.timer = time1;
            a *= -1;
            dx += widthContainer;
            nbrBirdToAdd++;
            if (nbrBirdToAdd % 2 === 0) {
                time1 -= 50;
                dx = pos.x;
                dy += heightContainer
            }
        }
        var back = new Phaser.Button(this.game, 160, 840 + this.dest, "back", this.showMenuHomeSh, this, 1, 0, 1, 0);
        back.anchor.setTo(.5, .5);
        this.setPosAnimation(back, 840, 840 + this.dest, true);
        this.menuShop.add(back)
    },
    byBird: function(bnt) {
        if (!this.switchShopTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        if (bnt.key === "bntSelect") {
            FishSpikes.globale.save.dataGame.charPlay = bnt.numBird;
            FishSpikes.globale.save.saveData();
            this.showMenuHome()
        } else if (FishSpikes.globale.save.dataGame.diam >= configGame.prixFishs[bnt.numBird]) {
            console.log("by bird diam : " + FishSpikes.globale.save.dataGame.diam);
            FishSpikes.globale.save.dataGame.fishShop[bnt.numBird] = true;
            FishSpikes.globale.save.dataGame.diam -= configGame.prixFishs[bnt.numBird];
            FishSpikes.globale.save.saveData();
            this.updateTxtDiam();
            bnt.loadTexture("bntSelect");
            this.menuShop.remove(bnt.txtPrix, true, true);
            bnt.diam.loadTexture("fish", bnt.numBird);
            bnt.diam.y = bnt.y + 5;
            bnt.diam.x = bnt.x + 30;
            var a = bnt.numBird % 2 == 0 ? -1 : 1;
            this.setPosAnimation(bnt.diam, bnt.x + 30, bnt.x + 30 + a * this.dest, false);
            console.log("by bird diam : " + FishSpikes.globale.save.dataGame.diam);
            bnt.bird = bnt.diam;
            bnt.diam = null
        }
    },
    updateMenus: function() {
        this.updateAnimMenu(this.menuHome, this.switchHomeTr);
        this.updateAnimMenu(this.menucredits, this.switchcreditsTr);
        this.updateAnimMenu(this.menuShop, this.switchShopTr);
        if (this.lastTxtDiamWidth != null && this.lastTxtDiamWidth != this.txtDiam.textWidth) {
            this.lastTxtDiamWidth = null;
            this.txtDiam.x = this.diam.x - this.txtDiam.textWidth - 20
        }
    },
    update: function() {
        this.updateMenus()
    },
    play: function() {
        if (Music.enableMisic) Music.sounds.play("click");
        this.game.state.start("play", true)
    }
};
FishSpikes.Play = function(game) {
    this.groupObj = null;
    this.DebuSwap = null;
    this.mouve = null;
    this.euys = null;
    this.countLevel = 0;
    this.explo = 0;
    this.saveY;
    this.saveIndexTableaux = 0;
    this.fish;
    this.pipes1;
    this.pipes2;
    this.longPipes = 14;
    this.groupEffet;
    this.effetIndex;
    this.scor = 0;
    this.indexHistorique;
    this.indexDerolment;
    this.stopX;
    this.stopY;
    this.hole;
    this.caseSup = 0;
    this.t = 0;
    this.vitesse = 80;
    this.g = 9.8;
    this.a = 1.0472;
    this.Xp;
    this.Yp;
    this.deraction = 1;
    this.historiqueFloor = null;
    this.indexFloot = 0;
    this.topBottom = null;
    this.diplas = 0;
    this.lazer = null;
    this.isTuto = null
};
FishSpikes.Play.prototype = {
    create: function() {
        this.showTuto();
        this.groupTxtLevels = this.add.group();
        this.isGamePaused = false;
        play.numLevel = 0;
        this.lastTxtDiamWidth = -1;
        this.isGamePaused = false;
        this.dest = this.world.height;
        this.div = 20;
        this.nbrSaveBird = 0;
        this.lastWith = null;
        this.initAtributs();
        FishSpikes.globale.save.dataGame.nbrPlayGame++;
        FishSpikes.globale.save.saveData();
        this.maxDistUp = 0;
        this.currentScroll = 0;
        this.countLevel = 0;
        FishSpikes.globale.save.dataGame.lastFloor = 0;
        this.historiqueFloor = [null];
        this.indexFloot = 0;
        game.input.onDown.add(this.launch, this);
        this.pipes1 = game.add.group();
        this.pipes2 = game.add.group();
        this.groupEffet = game.add.group();
        this.effetIndex = 0;
        this.fish = game.add.sprite(this.world.centerX, 400, "fish");
        this.lazer = game.add.image(0, this.world.height - 100, "lazer");
        this.fish.anchor.setTo(.5, .5);
        var indexChar = FishSpikes.globale.save.dataGame.charPlay;
        var nbrCharLine = 12;
        this.fish.frame = indexChar + nbrCharLine * 2;
        this.fish.animations.add("animG", [indexChar + nbrCharLine * 2, indexChar + nbrCharLine * 3, indexChar + nbrCharLine * 2], 5, false);
        this.fish.animations.add("animD", [indexChar, indexChar + nbrCharLine, indexChar], 5, false);
        this.t = 0;
        this.Xp = game.world.centerX;
        this.Yp = game.world.centerY;
        this.deraction = -1;
        for (var i = 0; i < 10; i++) {
            var effets = this.game.add.sprite(-30, -30, "effet", configGame.effectsFish[FishSpikes.globale.save.dataGame.charPlay]);
            effets.anchor.setTo(.5);
            this.groupEffet.add(effets)
        }
        this.stopY = false;
        this.stopX = false;
        this.longPipes = 14;
        this.euys = this.add.group();
        this.chargerGroupe();
        this.nbPiecesOfPipes = 5;
        this.indexDerolment = null;
        this.caseSup = 0;
        this.indexHistorique = 0;
        this.diamBird = this.add.sprite(0, 0, "diam");
        this.diamBird.exists = false;
        this.currentColor = 0;
        this.loadColor();
        this.groupGamePlay = this.add.group();
        this.menuPause = this.add.group();
        this.menuGameOver = this.add.group();
        this.diam = this.add.sprite(570, 20, "diam");
        this.diam.inputEnabled = true;
        this.txtDiam = this.add.bitmapText(0, 25, "fontb", FishSpikes.globale.save.dataGame.diam + "", 40);
        this.txtDiam.x = this.diam.x - this.txtDiam.textWidth;
        this.txtDiam.align = "center";
        this.showPauseBnt();
        this.isGamePaused = false
    },
    initAtributs: function() {
        this.taillecase = 50 * resolution;
        this.DebuSwap = {
            x: 0,
            y: 0
        };
        this.mouve = false;
        this.obj = null;
        this.nbrBut = null;
        this.bntPause = null;
        this.bgTimer = null;
        this.txtTimer = null;
        this.timer = null;
        this.timerGameOver = null;
        this.isTuto = true
    },
    showTuto: function() {
        console.log("show tuto !!");
        this.txtTuto = this.add.bitmapText(0, 500, "fontb", text.txtTuto1, 40);
        var px = (this.game.width - this.txtTuto.textWidth) / 2;
        this.txtTuto.x = -640;
        this.txtTuto.align = "center";
        this.tw = this.add.tween(this.txtTuto).to({
            x: px + 100
        }, 600, Phaser.Easing.Quadratic.Out, false).to({
            x: px
        }, 200, Phaser.Easing.Quadratic.In, false);
        this.tw.start()
    },
    startGameOver: function() {
        Music.musicBg.pause();
        if (Music.enableMisic) Music.sounds.play("die");
        this.switchGameOverTr = true;
        this.isGamePaused = true;
        this.bntPause.animStart = false;
        this.showMenuGameOver()
    },
    updateTxtDiam: function() {
        this.lastTxtDiamWidth = this.txtDiam.textWidth;
        this.txtDiam.setText(FishSpikes.globale.save.dataGame.diam + "")
    },
    updateAnimMenu: function(groupMenu, animStart) {
        if (groupMenu) {
            if (animStart) {
                groupMenu.forEach(this.animShow, this)
            } else {
                groupMenu.forEach(this.animHide, this)
            }
        }
    },
    updateAnimObject: function(obj) {
        if (obj && obj.exists) {
            if (obj.animStart) {
                this.animShow(obj)
            } else {
                this.animHide(obj)
            }
        }
    },
    setPosAnimation: function(obj, s, h, isAnimeUpDown) {
        obj.posShow = s;
        obj.posHide = h;
        obj.isAnimeUpDown = isAnimeUpDown
    },
    animShow: function(obj) {
        if (obj.posShow == null) return;
        if (obj.timer) {
            obj.timer -= this.game.time.elapsed;
            if (obj.timer <= 0) obj.timer = null;
            return
        }
        if (obj.isAnimeUpDown) {
            obj.y += (obj.posShow - obj.y) / (this.div * .5)
        } else {
            obj.x += (obj.posShow - obj.x) / (this.div * .5)
        }
    },
    animHide: function(obj) {
        if (!obj || obj.posHide == null) return;
        if (Math.abs(obj.posHide - obj.y) <= 80) {
            if (obj.parent.name === "group") {
                if (obj.parent.isHome) this.fish = null;
                obj.parent.removeAll(true, true)
            } else {
                obj.exists = false
            }
            return
        }
        if (obj.timer) {
            obj.timer -= this.game.time.elapsed;
            if (obj.timer <= 0) obj.timer = null;
            return
        }
        if (obj.isAnimeUpDown) {
            obj.y += (obj.posHide - obj.y) / (this.div * 2)
        } else {
            obj.x += (obj.posHide - obj.x) / (this.div * 2)
        }
    },
    update: function() {
        this.updateAnimMenu(this.menuPause, this.switchPauseTr);
        this.updateAnimMenu(this.menuGameOver, this.switchGameOverTr);
        this.updateAnimObject(this.bntPause);
        this.updateAnimObject(this.bgTimer);
        this.updateAnimObject(this.txtTimer);
        if (this.timer) {
            if (this.lastWith != null && this.lastWith != this.txtTimer.textWidth) {}
            this.txtTimer.text = Math.floor(this.timer / 1e3) + "";
            this.lastWith = this.txtTimer.textWidth;
            this.timer -= this.time.elapsed;
            if (this.timer <= 0) {
                this.timer = null;
                this.txtTimer.animStart = false;
                this.bgTimer.animStart = false;
                this.isGamePaused = false;
                if (Music.enableMisic) {
                    Music.musicBg.resume()
                }
            }
        }
        if (this.timerGameOver) {
            this.menuGameOver.getAt(4).text = Math.floor(this.timerGameOver / 1e3) + "";
            if (this.lastWith != null && this.lastWith != this.menuGameOver.getAt(4).textWidth) {}
            this.lastWith = this.menuGameOver.getAt(4).textWidth;
            this.timerGameOver -= this.time.elapsed;
            if (this.timerGameOver <= 0) {
                this.timerGameOver = null;
                this.exitGame()
            }
        }
        if (this.lastTxtDiamWidth != null && this.lastTxtDiamWidth != this.txtDiam.textWidth) {
            this.lastTxtDiamWidth = null;
            this.txtDiam.x = this.diam.x - this.txtDiam.textWidth - 20
        }
        if (this.isGamePaused || this.isTuto) return;
        if (this.fish.y > 460) {
            if (this.lazer.y > 890) this.lazer.y -= this.time.elapsed * .001 * 100
        } else {
            if (this.lazer.y < this.game.height) this.lazer.y += this.time.elapsed * .001 * 200
        }
        if (this.lazer.y < this.fish.y + this.fish.height / 2) {
            this.startGameOver();
            return
        }
        this.justifiY = 0;
        this.utilEffet();
        if (!this.stopX) {
            var X = this.vitesse * Math.cos(this.a) * this.t;
            this.fish.x = this.Xp + this.deraction * X;
            if (this.fish.x + this.fish.width / 2 >= 640) {
                this.a = 0;
                this.deraction = -1;
                this.Xp = 640 - this.fish.width / 2 - 3;
                this.Yp = this.fish.y;
                this.vitesse = 40;
                this.t = 0;
                this.fish.animations.play("animG", 5)
            } else if (this.fish.x - this.fish.width / 2 <= 0) {
                this.a = 0;
                this.deraction = 1;
                this.Xp = this.fish.width / 2 + 1;
                this.Yp = this.fish.y;
                this.vitesse = 40;
                this.t = 0;
                this.fish.animations.play("animD", 5)
            }
        }
        if (!this.stopY) {
            var Y = -this.g * this.t * this.t + this.vitesse * Math.sin(this.a) * this.t;
            this.fish.y = this.Yp - Y;
            if (this.fish.y <= game.world.centerY - 160) {
                if (this.indexDerolment === null) {
                    this.indexDerolment = 10
                }
                this.specifiqueTopBottom(1);
                this.topBottom = "top";
                this.justifiTop()
            }
        }
        this.t += .13;
        if (this.diamBird.exists == true && this.diamBird.overlap(this.fish)) {
            if (Music.enableMisic) Music.sounds.play("diam");
            this.diamBird.exists = false;
            FishSpikes.globale.save.dataGame.diam += 1;
            FishSpikes.globale.save.saveData();
            this.updateTxtDiam()
        }
        if (FishSpikes.globale.save.dataGame.lastFloor > 0) {
            if (!this.diamBird.exists) {
                this.diamBird.exists = true;
                if (Math.random() > .5) this.diamBird.x = 480;
                else this.diamBird.x = 480;
                this.diamBird.y = -this.diamBird.height * 2
            } else if (this.diamBird.y > this.game.height) this.diamBird.exists = false
        }
        this.pipes2.forEach(this.collidePlayer, this);
        this.pipes1.forEach(this.collidePlayer, this);
        if (this.countLevel >= 1e3) {
            this.addTxtLevel();
            this.countLevel = 0
        }
        this.groupTxtLevels.forEach(this.updateTxtLevels, this);
        if (this.txtTuto.exists && this.txtTuto.y > this.game.height) this.txtTuto.exists = false
    },
    launch: function() {
        if (this.isTuto) {
            this.tw.stop();
            var tw = this.add.tween(this.txtTuto).to({
                x: -640
            }, 800, Phaser.Easing.Quadratic.Out, false);
            tw.onComplete.add(function() {
                console.log("complete tuto");
                this.txtTuto.exists = false
            }, this);
            tw.start()
        }
        this.isTuto = false;
        this.Xp = this.fish.x;
        this.Yp = this.fish.y;
        this.a = 1.0472;
        this.t = 0;
        this.vitesse = 80;
        if (this.deraction === -1) {
            this.fish.animations.play("animG", 5)
        } else {
            this.fish.animations.play("animD", 5)
        }
        if (Music.enableMisic && !this.isGamePaused) Music.sounds.play("jump")
    },
    chargerGroupe: function() {
        this.historiqueFloor[0] = [];
        this.indexFloot = 0;
        for (var i = 0; i < 11; i++) {
            var p1 = this.game.add.sprite(550, 90 * i, "pipes", i % 6);
            var p2 = this.game.add.sprite(0, 90 * i, "pipes", i % 6 + 6);
            p1.type = i % 6;
            p2.type = p1.type + 6;
            p1.visible = p2.visible = false;
            play.pipes1.add(p1);
            play.pipes2.add(p2);
            this.historiqueFloor[0][i] = {
                R: false,
                L: false
            };
            p1.e = this.game.add.sprite(p1.x + configGame.posYeux[p1.type].x, p1.y + configGame.posYeux[p1.type].y, "e");
            p1.e.visible = false;
            p1.e.anchor.setTo(.5, .5);
            p2.e = this.game.add.sprite(p2.x + configGame.posYeux[p2.type].x, p2.y + configGame.posYeux[p2.type].y, "e");
            p2.e.visible = false;
            p2.e.anchor.setTo(.5, .5);
            this.euys.add(p1.e);
            this.euys.add(p2.e)
        }
        this.scor++;
        this.caseSup = this.indexFloot;
        this.choiseSaurter()
    },
    specifiqueTopBottom: function(valeur) {
        if (valeur === 1 && this.topBottom === "bottom") {
            this.indexDerolment = (this.indexDerolment + 10) % 11;
            for (var j = 0; j < 11; j++) {
                this.indexHistorique = (this.indexHistorique + 13) % this.longPipes;
                if (this.indexHistorique === this.longPipes - 1) {}
            }
        } else if (valeur === 2 && this.topBottom === "top") {
            this.indexDerolment = (this.indexDerolment + 1) % 11;
            for (var j = 0; j < 11; j++) {
                this.indexHistorique = (this.indexHistorique + 13) % this.longPipes;
                if (this.indexHistorique === this.longPipes - 1) {
                    this.indexFloot--
                }
            }
        }
    },
    justifiTop: function() {
        this.diplas = game.world.centerY - 160 - play.fish.y;
        this.justifiY = this.diplas;
        play.fish.y += this.diplas;
        if (this.txtTuto.exists) this.txtTuto.y += this.diplas;
        this.diamBird.y += this.justifiY;
        this.Yp += this.diplas;
        this.currentScroll += this.diplas;
        if (this.currentScroll >= this.maxDistUp) {
            this.maxDistUp += this.diplas;
            this.countLevel += this.diplas
        }
        for (var i = 0; i < 11; i++) {
            var v1 = this.pipes1.getAt(i);
            var v2 = this.pipes2.getAt(i);
            v1.y = v2.y = v2.y + this.diplas;
            if (v1.y >= game.world.height && i === this.indexDerolment) {
                this.indexDerolment = (this.indexDerolment + 1) % 11;
                v2.y = v1.y = this.pipes1.getAt(this.indexDerolment).y - 90;
                this.indexDerolment = (this.indexDerolment + 9) % 11;
                v1.visible = this.historiqueFloor[this.indexFloot][this.indexHistorique].R;
                v1.frame = v1.type + this.currentColor * 12;
                v2.frame = v2.type + this.currentColor * 12;
                v2.visible = this.historiqueFloor[this.indexFloot][this.indexHistorique].L;
                this.indexHistorique = this.indexHistorique + 1;
                if (this.indexHistorique === this.longPipes) {
                    this.indexHistorique = 0;
                    if (this.caseSup < this.indexFloot) {
                        this.scor++;
                        this.caseSup = this.indexFloot;
                        this.choiseSaurter()
                    }
                }
            }
        }
    },
    justifibottom: function() {
        this.diplas = -1 * (play.fish.y + play.fish.height - (game.world.height - 160));
        this.justifiY = this.diplas;
        play.fish.y += this.diplas;
        this.Yp += this.diplas;
        this.currentScroll += this.diplas;
        for (var i = 0; i < 11; i++) {
            var v1 = this.pipes1.getAt(i);
            var v2 = this.pipes2.getAt(i);
            v1.y += this.diplas;
            v2.y += this.diplas;
            if (v1.y + v1.height <= 0 && i === this.indexDerolment) {
                this.indexDerolment = (this.indexDerolment + 10) % 11;
                v2.y = v1.y = this.pipes1.getAt(this.indexDerolment).y + 90;
                if (this.indexFloot > 0) {
                    v1.visible = this.historiqueFloor[this.indexFloot][this.indexHistorique].R;
                    v2.visible = this.historiqueFloor[this.indexFloot][this.indexHistorique].L
                } else {
                    v1.visible = false;
                    v2.visible = false
                }
                v1.frame = v1.type + (this.indexFloot + 4) % 5 * 12;
                v2.frame = v2.type + (this.indexFloot + 4) % 5 * 12;
                this.indexDerolment = (this.indexDerolment + 2) % 11;
                this.indexHistorique = this.indexHistorique - 1;
                if (this.indexHistorique === -1) {
                    this.indexFloot--;
                    if (this.indexFloot < 0) {
                        this.indexFloot = 0
                    }
                    this.indexHistorique = this.longPipes - 1
                }
            }
        }
    },
    choiseSaurter: function() {
        this.nbPiecesOfPipes = this.deficulte();
        var sorti = 0;
        var test = 0;
        var nbrPasSorti = 0;
        var nbrAffichier = 0;
        var sorti2 = 0;
        var test2 = 0;
        var nbrPasSorti2 = 0;
        for (var i = this.longPipes - 1; i >= 0; i--) {
            var visible1 = false;
            var visible2 = false;
            if (i - (this.nbPiecesOfPipes - sorti) > 0) {
                if (sorti <= this.nbPiecesOfPipes) {
                    test = Math.round(Math.random())
                } else {
                    test = 0
                }
            } else {
                test = 1
            }
            if (test === 1 || nbrPasSorti >= 3) {
                if (nbrAffichier <= 5) {
                    visible1 = true;
                    nbrAffichier++;
                    sorti++;
                    nbrPasSorti = 0
                } else {
                    visible1 = false;
                    nbrPasSorti++;
                    nbrAffichier = 0
                }
            } else {
                nbrPasSorti++;
                nbrAffichier = 0
            }
            if (i - (this.nbPiecesOfPipes - sorti2) > 0) {
                if (sorti2 <= this.nbPiecesOfPipes) {
                    test2 = Math.round(Math.random())
                } else {
                    test2 = 0
                }
            } else {
                test2 = 1
            }
            if (test2 === 1 || nbrPasSorti2 >= 3) {
                visible2 = true;
                sorti2++;
                nbrPasSorti2 = 0
            } else {
                nbrPasSorti2++
            }
            this.historiqueFloor[this.indexFloot][i] = {
                R: visible1,
                L: visible2
            }
        }
    },
    deficulte: function() {
        if (this.scor <= 10) {
            return 5
        } else if (this.scor <= 20) {
            return 6
        } else if (this.scor <= 30) {
            return 7
        } else if (this.scor <= 40) {
            return 8
        } else if (this.scor <= 50) {
            return 9
        } else if (this.scor <= 60) {
            return 10
        } else if (this.scor <= 70) {
            return 11
        }
    },
    utilEffet: function() {
        if (Math.abs(this.groupEffet.getAt(this.effetIndex).x - this.fish.x) >= 30) {
            this.effetIndex++;
            this.effetIndex %= 10;
            this.groupEffet.getAt(this.effetIndex).x = this.fish.x;
            this.groupEffet.getAt(this.effetIndex).y = this.fish.y;
            this.groupEffet.getAt(this.effetIndex).scale.setTo(1);
            this.groupEffet.getAt(this.effetIndex).angle = 0
        }
        for (var i = 0; i < 10; i++) {
            var eff = this.groupEffet.getAt(i);
            eff.angle -= 2;
            eff.scale.x = eff.scale.y -= .015;
            eff.y += this.diplas
        }
    },
    updateTxtLevels: function(txt) {
        if (txt.alpha === .3 && txt.y >= this.world.centerY - 160) {
            FishSpikes.globale.save.dataGame.lastFloor += 1;
            if (FishSpikes.globale.save.dataGame.lastFloor % 10 === 0) {
                this.currentColor = (this.currentColor + 1) % 5;
                this.loadColor()
            }
            this.saveLevelsGame();
            txt.alpha = 1;
            if (Music.enableMisic) Music.sounds.play("levelUp")
        }
        txt.y += this.justifiY;
        if ((txt.y + txt.height < -50 || txt.y > this.game.height + 50) && txt.exists === true) txt.exists = false;
        else if (txt.exists == false) txt.exists = true
    },
    loadColor: function() {
        for (var i = this.pipes1.length - 1; i >= 0; i--) {
            this.pipes1.getAt(i).frame = this.pipes1.getAt(i).type + this.currentColor * 12
        }
        for (var i = this.pipes2.length - 1; i >= 0; i--) {
            this.pipes2.getAt(i).frame = this.pipes2.getAt(i).type + this.currentColor * 12
        }
    },
    addTxtLevel: function() {
        var txtfloor;
        if (FishSpikes.globale.save.dataGame.maxFloor === FishSpikes.globale.save.dataGame.lastFloor + 1) {
            txtfloor = new Phaser.BitmapText(this.game, this.world.centerX, 0, "fontb", text.floor + " " + (FishSpikes.globale.save.dataGame.lastFloor + 1) + "\n\n" + text.hightScore, 40)
        } else {
            txtfloor = new Phaser.BitmapText(this.game, this.world.centerX, 0, "fontb", text.floor + " " + (FishSpikes.globale.save.dataGame.lastFloor + 1), 40)
        }
        txtfloor.align = "center";
        txtfloor.x -= txtfloor.textWidth / 2;
        txtfloor.y -= txtfloor.textHeight + 50;
        txtfloor.exists = false;
        txtfloor.align = "center";
        txtfloor.alpha = .3;
        this.groupTxtLevels.add(txtfloor)
    },
    collidePlayer: function(obj) {
        obj.e.x = obj.x + configGame.posYeux[obj.type].x;
        obj.e.y = obj.y + configGame.posYeux[obj.type].y;
        obj.e.angle = Phaser.Math.angleBetween(obj.e.x, obj.e.y, this.fish.x, this.fish.y) / Math.PI * 180;
        obj.e.visible = obj.visible;
        if (obj.visible && this.fish.overlap(obj)) {
            if (this.numLevel == 0) this.collisionPoligone(configGame.objSeg[obj.type], obj.x, obj.y);
            else {
                this.collisionPoligoneHdard(configGame.objSegHard[obj.key == "pipesMode2Left" ? 0 : 1], obj.x, obj.y)
            }
        }
    },
    collisionPoligoneHdard: function(poli2, xp, yp) {
        var polygonBird = configGame.birds[FishSpikes.globale.save.dataGame.charPlay][this.deraction == -1 ? 1 : 0];
        polyg = [];
        for (var i = 0; i < polygonBird.length - 2; i++) {
            var line1 = new Phaser.Line(polygonBird[i].x + this.fish.x, polygonBird[i].y + this.fish.y, polygonBird[i + 1].x + this.fish.x, polygonBird[i + 1].y + this.fish.y);
            for (var i = 0; i < poli2.length - 2; i++) {
                var line2 = new Phaser.Line(poli2[i].x + xp, poli2[i].y + yp, poli2[i + 1].x + xp, poli2[i + 1].y + yp);
                if (line1.intersects(line2, true)) {
                    this.startGameOver()
                }
            }
        }
    },
    collisionPoligone: function(poli2, xp, yp) {
        var polygonBird = configGame.birds[FishSpikes.globale.save.dataGame.charPlay][this.deraction == -1 ? 1 : 0];
        polyg = [];
        for (var i = 0; i < polygonBird.length - 2; i++) {
            var line1 = new Phaser.Line(polygonBird[i].x + this.fish.x - this.fish.width / 2, polygonBird[i].y + this.fish.y - this.fish.height / 2, polygonBird[i + 1].x + this.fish.x - this.fish.width / 2, polygonBird[i + 1].y + this.fish.y - this.fish.height / 2);
            var line2 = new Phaser.Line(poli2.x + xp, poli2.y + yp, poli2.z + xp, poli2.t + yp);
            if (line1.intersects(line2, true)) {
                this.startGameOver()
            }
        }
    },
    collisionGamesOver: function() {},
    showMenuGameOver: function() {
        if (this.menuGameOver.length > 0) {
            return
        }
        var bg = this.add.graphics();
        bg.beginFill(16777215);
        bg.drawRect(0, 0, 640, 960);
        bg.alpha = .9;
        this.menuGameOver.add(bg);
        var txt = new Phaser.BitmapText(this.game, 0, 280 - this.dest, "fontb", text.floorReach + ": " + FishSpikes.globale.save.dataGame.lastFloor, 40);
        txt.x = this.world.centerX - txt.textWidth / 2;
        this.setPosAnimation(txt, 280, 280 - this.dest, true);
        txt.align = "center";
        this.menuGameOver.add(txt);
        txt = new Phaser.BitmapText(this.game, 0, 150 - this.dest, "fontb", text.gameOver, 50);
        txt.x = this.world.centerX - txt.textWidth / 2;
        this.setPosAnimation(txt, 150, 150 - this.dest, true);
        txt.align = "center";
        this.menuGameOver.add(txt);
        this.timerGameOver = 6e3;
        var bgTimer = this.add.image(this.world.centerX + this.dest, this.world.centerY, "imgTimer");
        bgTimer.anchor.setTo(.5, .5);
        this.setPosAnimation(bgTimer, this.world.centerX, this.world.centerX + this.dest, false);
        this.menuGameOver.add(bgTimer);
        var txtTimer = new Phaser.BitmapText(this.game, this.world.centerX - 15 + this.dest, this.world.centerY - 25, "fontb", "", 50);
        txtTimer.text = Math.ceil(this.timerGameOver / 1e3) + "";
        this.setPosAnimation(txtTimer, this.world.centerX - 15, this.world.centerX - 15 + this.dest, false);
        this.menuGameOver.add(txtTimer);
        var bnt = new Phaser.Button(this.game, this.world.centerX, 650 + this.dest, "bntReplay", this.resumeGameGo, this, 1, 0, 1, 0);
        bnt.anchor.setTo(.5, .5);
        this.setPosAnimation(bnt, 650, 650 + this.dest, true);
        this.menuGameOver.add(bnt);
        var diamToSave = this.nbrSaveBird * 2 * 10 + 10;
        txt = new Phaser.BitmapText(this.game, this.world.centerX - 40, 625 + this.dest, "fontw", text.saveMe + " " + diamToSave, 40);
        txt.x = this.world.centerX - 40 - txt.textWidth / 2;
        this.setPosAnimation(txt, 625, 625 + this.dest, true);
        this.menuGameOver.add(txt);
        var diment = this.add.image(txt.x + txt.textWidth + 40, 650 + this.dest, "diam");
        diment.anchor.setTo(.5, .5);
        this.setPosAnimation(diment, 650, 650 + this.dest, true);
        this.menuGameOver.add(diment);
        var indexChar = FishSpikes.globale.save.dataGame.charPlay;
        var player = game.add.sprite(80, 530 + this.dest, "fish", indexChar);
        this.setPosAnimation(player, 530, 530 + this.dest, true);
        this.menuGameOver.add(player);
        var exitbnt = new Phaser.Button(this.game, this.world.centerX + 220 + this.dest, 430, "exit", this.exitGameGo, this, 1, 0, 1, 0);
        exitbnt.anchor.setTo(.5, .5);
        this.setPosAnimation(exitbnt, this.world.centerX + 220, this.world.centerX + 220 + this.dest, false);
        this.menuGameOver.add(exitbnt)
    },
    resumeGamePa: function() {
        if (!this.switchPauseTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        this.resumeGame()
    },
    resumeGameGo: function() {
        if (!this.switchGameOverTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        var diamToSave = this.nbrSaveBird * 2 * 10 + 10;
        if (FishSpikes.globale.save.dataGame.diam >= diamToSave) {
            FishSpikes.globale.save.dataGame.diam -= diamToSave;
            FishSpikes.globale.save.saveData();
            this.updateTxtDiam();
            this.nbrSaveBird++;
            this.resumeGame()
        }
    },
    resumeGame: function() {
        if (this.switchPauseTr) this.switchPauseTr = false;
        if (this.switchGameOverTr) this.switchGameOverTr = false;
        if (this.menuPause) this.menuPause.getAt(0).visible = false;
        if (this.menuGameOver) this.menuGameOver.getAt(0).visible = false;
        this.showPauseBnt();
        this.createTimer();
        this.timerGameOver = null;
        this.killEnemise();
        if (this.lazer.y < this.fish.y + this.fish.height / 2) {
            this.initPlayer()
        }
    },
    initPlayer: function() {
        this.fish.x = this.world.centerX;
        this.fish.y = 400;
        this.launch();
        this.effetIndex = 0;
        var eff;
        for (var i = 0; i < 10; i++) {
            eff = this.groupEffet.getAt(i);
            eff.x = eff.y = -30;
            eff.scale.x = eff.scale.y = 1
        }
    },
    killEnemise: function() {
        for (var i = this.pipes1.length - 1; i >= 0; i--) {
            if (this.pipes1.getAt(i).y > 160) {
                this.pipes1.getAt(i).visible = false;
                this.pipes1.getAt(i).e.visible = false
            }
        }
        for (var i = this.pipes2.length - 1; i >= 0; i--) {
            if (this.pipes2.getAt(i).y > 160) {
                this.pipes2.getAt(i).visible = false;
                this.pipes2.getAt(i).e.visible = false
            }
        }
    },
    createTimer: function(duration, keyImg, font, sizeFont) {
        this.timer = 4e3;
        if (this.bgTimer == null) {
            this.bgTimer = this.add.sprite(this.world.centerX - this.dest, this.world.centerY, "bntMini");
            this.bgTimer.anchor.setTo(.5, .5);
            this.setPosAnimation(this.bgTimer, this.world.centerX, this.world.centerX - this.dest, false)
        }
        this.bgTimer.revive();
        this.bgTimer.animStart = true;
        if (this.txtTimer == null) {
            this.txtTimer = this.add.bitmapText(this.world.centerX - 12 - this.dest, this.world.centerY - 25, "fontw", "", 50);
            this.txtTimer.text = Math.ceil(this.timer / 1e3) + "";
            this.txtTimer.animStart = true;
            this.setPosAnimation(this.txtTimer, this.world.centerX - 12, this.world.centerX - 12 - this.dest, false)
        }
        this.txtTimer.exists = true;
        this.txtTimer.animStart = true
    },
    exitGameGo: function() {
        if (!this.switchGameOverTr) return;
        if (Music.enableMisic) Music.sounds.play("click");
        this.exitGame()
    },
    exitGamePa: function() {
        if (!this.switchPauseTr) return;
        this.exitGame()
    },
    exitGame: function() {
        if (Music.enableMisic) Music.sounds.play("click");
        this.state.start("menu", true)
    },
    saveLevelsGame: function() {
        if (FishSpikes.globale.save.dataGame.maxFloor < FishSpikes.globale.save.dataGame.lastFloor) {
            FishSpikes.globale.save.dataGame.maxFloor = FishSpikes.globale.save.dataGame.lastFloor
        }
        FishSpikes.globale.save.saveData()
    },
    showPauseBnt: function() {
        if (this.bntPause == null) {
            this.bntPause = this.add.button(40, 40 - this.dest, "bntPause", this.pauseGame, this, 1, 0, 1, 0);
            this.setPosAnimation(this.bntPause, 40, 40 - this.dest, true)
        }
        this.bntPause.revive();
        this.bntPause.animStart = true
    },
    pauseGame: function(obj) {
        if (this.isGamePaused) return;
        Music.musicBg.pause();
        if (Music.enableMisic) Music.sounds.play("click");
        this.isGamePaused = true;
        obj.animStart = false;
        this.showMenuPause()
    },
    showMenuPause: function() {
        this.switchPauseTr = true;
        if (this.menuPause.length > 0) {
            return
        }
        var bg = this.add.graphics();
        bg.beginFill(16777215);
        bg.drawRect(0, 0, 640, 960);
        bg.alpha = .9;
        this.menuPause.add(bg);
        var txtPause = new Phaser.BitmapText(this.game, 0, 285 - this.dest, "fontb", text.pause, 40);
        txtPause.x = this.world.centerX - txtPause.textWidth / 2;
        this.setPosAnimation(txtPause, 285, 285 - this.dest, true);
        txtPause.align = "center";
        this.menuPause.add(txtPause);
        var bntResume = new Phaser.Button(this.game, this.world.centerX, 420 + this.dest, "bntResume", this.resumeGamePa, this, 1, 0, 1, 0);
        bntResume.anchor.setTo(.5, .5);
        this.setPosAnimation(bntResume, 420, 420 + this.dest, true);
        this.menuPause.add(bntResume);
        txtPause = new Phaser.BitmapText(this.game, 0, 395 + this.dest, "fontw", text.resume, 40);
        txtPause.x = this.world.centerX - txtPause.textWidth / 2;
        this.setPosAnimation(txtPause, 395, 395 + this.dest, true);
        txtPause.align = "center";
        this.menuPause.add(txtPause);
        bntResume = new Phaser.Button(this.game, this.world.centerX, 560 + this.dest, "bntResume", this.exitGamePa, this, 1, 0, 1, 0);
        bntResume.anchor.setTo(.5, .5);
        this.setPosAnimation(bntResume, 560, 560 + this.dest, true);
        this.menuPause.add(bntResume);
        txtPause = new Phaser.BitmapText(this.game, 0, 535 + this.dest, "fontw", text.menu, 40);
        txtPause.x = this.world.centerX - txtPause.textWidth / 2;
        this.setPosAnimation(txtPause, 535, 535 + this.dest, true);
        txtPause.align = "center";
        this.menuPause.add(txtPause);
        var bntSound;
        bntSound = new Phaser.Button(this.game, 460 + this.dest * 2, 690, "sprSound", this.soundbnt, bntSound);
        bntSound.context = this;
        bntSound.anchor.setTo(.5, .5);
        bntSound.frame = Music.enableMisic ? 0 : 1;
        this.setPosAnimation(bntSound, 460, 460 + this.dest * 2, false);
        var contSound = new Phaser.Button(this.game, 460 + this.dest * 2, 690, "bntMini", this.soundbnt, bntSound, 1, 0, 1, 0);
        contSound.context = this;
        contSound.anchor.setTo(.5, .5);
        this.setPosAnimation(contSound, 460, 460 + this.dest * 2, false);
        this.menuPause.add(contSound);
        this.menuPause.add(bntSound)
    },
    soundbnt: function() {
        if (this.context.isStartGame && this.addToMenu) return;
        Music.enableMisic = !Music.enableMisic;
        this.frame = Music.enableMisic ? 0 : 1
    },
    specifiqueTopBottom: function(valeur) {
        if (valeur === 1 && this.topBottom === "bottom") {
            this.indexDerolment = (this.indexDerolment + 10) % 11;
            for (var j = 0; j < 11; j++) {
                this.indexHistorique = (this.indexHistorique + 13) % this.longPipes;
                if (this.indexHistorique === this.longPipes - 1) {}
            }
        } else if (valeur === 2 && this.topBottom === "top") {
            this.indexDerolment = (this.indexDerolment + 1) % 11;
            for (var j = 0; j < 11; j++) {
                this.indexHistorique = (this.indexHistorique + 13) % this.longPipes;
                if (this.indexHistorique === this.longPipes - 1) {
                    this.indexFloot--
                }
            }
        }
    }
};
window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, 1)
    }, 10);
    game = new Phaser.Game(320 * FishSpikes.globale.resolution, 480 * FishSpikes.globale.resolution, Phaser.CANVAS);
    play = game.state.add("play", FishSpikes.Play, false);
    game.state.add("shop", FishSpikes.Shop, false);
    game.state.add("credits", FishSpikes.Credits, false);
    game.state.add("menu", FishSpikes.Menu, false);
    game.state.add("preload", FishSpikes.Preload, false);
    game.state.add("boot", FishSpikes.Boot, true)
};