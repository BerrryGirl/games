var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// when the page has finished loading, create our game
window.onload = function() {
    var game = new DroneWars.Game();
};
var DroneWars;
(function(DroneWars) {
    var Boot = (function(_super) {
        __extends(Boot, _super);

        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function() {
            this.load.atlasJSONHash('LoadingScene', DroneWars.GameCanvas.route + 'LoadingScene/LoadingScene.png', DroneWars.GameCanvas.route + 'LoadingScene/LoadingScene.json');
            this.load.image('background', DroneWars.GameCanvas.route + 'Background.png');
            this.load.text('localeJson', 'locale/locale.json');
        };
        Boot.prototype.init = function() {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            //this.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.forceOrientation(true, false);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        };
        Boot.prototype.create = function() {
            //Initializate localization
            Locale.initialize(this.game);
            this.game.state.start('Preloader', true, false);
        };
        Boot.prototype.enterIncorrectOrientation = function() {
            DroneWars.GameCanvas.orientated = false;
            document.getElementById('orientation').style.display = 'block';
        };
        Boot.prototype.leaveIncorrectOrientation = function() {
            DroneWars.GameCanvas.orientated = true;
            document.getElementById('orientation').style.display = 'none';
        };
        return Boot;
    }(Phaser.State));
    DroneWars.Boot = Boot;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var Game = (function(_super) {
        __extends(Game, _super);

        function Game() {
            _super.call(this, DroneWars.GameCanvas.defaultWidth, DroneWars.GameCanvas.defaultHeight, Phaser.AUTO, '', null);
            this.state.add('Boot', DroneWars.Boot, false);
            this.state.add('Preloader', DroneWars.Preloader, false);
            this.state.add('MenuScene', DroneWars.MenuScene, false);
            this.state.add('ShopScene', DroneWars.ShopScene, false);
            this.state.add('LevelScene', DroneWars.LevelScene, false);
            this.state.add('InGame', DroneWars.InGame, false);
            this.state.start('Boot');
        }
        return Game;
    }(Phaser.Game));
    DroneWars.Game = Game;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var GameCanvas = (function() {
        function GameCanvas() {}
        GameCanvas.updateScaleRatio = function() {
            var widthToHeight = GameCanvas.defaultWidth / GameCanvas.defaultHeight;
            var newWidthToHeight = window.innerWidth / window.innerHeight;
            if (newWidthToHeight > widthToHeight) {
                GameCanvas.outer.width = GameCanvas.defaultHeight * newWidthToHeight;
                GameCanvas.outer.height = GameCanvas.defaultHeight;
            } else {
                GameCanvas.outer.width = GameCanvas.defaultWidth;
                GameCanvas.outer.height = GameCanvas.defaultWidth / newWidthToHeight;
            }
            GameCanvas.outer.x = -(GameCanvas.outer.width - GameCanvas.defaultWidth) * 0.5;
            GameCanvas.outer.y = -(GameCanvas.outer.height - GameCanvas.defaultHeight) * 0.5;
            GameCanvas.inner.x = 0;
            GameCanvas.inner.y = 0;
            GameCanvas.inner.width = GameCanvas.defaultWidth;
            GameCanvas.inner.height = GameCanvas.defaultHeight;
            var ratio = Math.min(window.innerWidth / GameCanvas.outer.width, window.innerHeight / GameCanvas.outer.height);
            GameCanvas.scaleRatio = ratio;
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        };
        GameCanvas.convertToWorld = function(point) {
            return new Phaser.Point(point.x + GameCanvas.outer.x, point.y + GameCanvas.outer.y);
        };
        /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
        GameCanvas.orientated = false;
        GameCanvas.outer = new Phaser.Rectangle(0, 0, 0, 0);
        GameCanvas.inner = new Phaser.Rectangle(0, 0, 0, 0);
        GameCanvas.defaultWidth = 1024;
        GameCanvas.defaultHeight = 768;
        GameCanvas.route = "assets/hd/";
        return GameCanvas;
    }());
    DroneWars.GameCanvas = GameCanvas;
})(DroneWars || (DroneWars = {}));
var GameData;
(function(GameData) {
    var dataObject = {};

    function setItem(key, data) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, data);
        } else {
            dataObject[key] = data;
        }
    }
    GameData.setItem = setItem;

    function getItem(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(key);
        } else {
            if (dataObject[key])
                return dataObject[key];
            else
                return null;
        }
    }
    GameData.getItem = getItem;

    function clear() {
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
        } else {
            dataObject = {};
        }
    }
    GameData.clear = clear;
})(GameData || (GameData = {}));
var Locale;
(function(Locale) {
    var jsonObject;
    var locale;

    function initialize(game) {
        this.jsonObject = JSON.parse(game.cache.getText('localeJson'));
        var defaultLocale = "en";
        this.locale = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || defaultLocale;
        if (!this.jsonObject.hasOwnProperty(this.locale)) {
            this.locale = defaultLocale;
        }
    }
    Locale.initialize = initialize;

    function translate(key) {
        if (this.jsonObject[this.locale].hasOwnProperty(key)) {
            var localeJson = this.jsonObject[this.locale];
            return localeJson[key];
        } else {
            return key;
        }
    }
    Locale.translate = translate;
})(Locale || (Locale = {}));
var DroneWars;
(function(DroneWars) {
    var Preloader = (function(_super) {
        __extends(Preloader, _super);

        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function() {
            this.wrapper = this.game.add.group();
            this.wrapper.create(0, 0);
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.scale.setResizeCallback(this.resized, this);
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'background');
            this.wrapper.add(this.background);
            //Add grougp wrapper for preload bar
            this.preloadWrapper = this.game.add.group();
            this.preloadWrapper.create(0, 0);
            this.wrapper.add(this.preloadWrapper);
            this.logo = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY - DroneWars.GameCanvas.defaultHeight * 0.09, 'LoadingScene', 'Logo.png');
            this.logo.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.logo);
            var loading = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY + DroneWars.GameCanvas.defaultHeight * 0.15, 'LoadingScene', 'LoadingBar.png');
            loading.anchor.setTo(0.5, 0.5);
            this.preloadWrapper.add(loading);
            this.preloadBar = this.add.sprite(loading.x + 2, loading.y - 4, 'LoadingScene', 'GreenBar.png');
            this.preloadBar.anchor.setTo(0, 0.5);
            this.preloadBar.x = loading.x + 2 - this.preloadBar.width * 0.5;
            this.preloadWrapper.add(this.preloadBar);
            this.load.setPreloadSprite(this.preloadBar);
            //  Load our actual games assets
            this.load.atlasJSONHash('MenuScene', DroneWars.GameCanvas.route + 'MenuScene/MenuScene.png', DroneWars.GameCanvas.route + 'MenuScene/MenuScene.json');
            this.load.audio('menuMusic', ['assets/audio/menu.mp3', 'assets/audio/menu.ogg']);
            this.load.audio('sfx', ['assets/audio/sfx.mp3', 'assets/audio/sfx.ogg']);
            this.load.bitmapFont('CreditsFont', DroneWars.GameCanvas.route + 'Font/Credits.png', DroneWars.GameCanvas.route + 'Font/Credits.xml');
            this.load.bitmapFont('MenuFont', DroneWars.GameCanvas.route + 'Font/MenuFont_44.png', DroneWars.GameCanvas.route + 'Font/MenuFont_44.xml');
            this.load.image('BackgroundBlack', DroneWars.GameCanvas.route + 'BackgroundBlack.png');
            this.load.image('BackgroundRed', DroneWars.GameCanvas.route + 'BackgroundRed.png');
            this.load.text('playerConfig', 'config/player.json');
            this.load.text('statsConfig', 'config/stats.json');
            this.load.text('powerupsConfig', 'config/powerups.json');
            // Set attributes for testing
            /*GameData.setItem("coins","100");
            GameData.setItem("stars","1");
            GameData.setItem("unlockedDrones","100000");
            GameData.setItem("selectedDroneIndex","0");*/
        };
        Preloader.prototype.create = function() {
            var tween = this.add.tween(this.logo).to({
                y: DroneWars.GameCanvas.inner.centerY - DroneWars.GameCanvas.defaultHeight * 0.2
            }, 750, Phaser.Easing.Sinusoidal.InOut, true);
            this.add.tween(this.preloadWrapper).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMenu, this);
        };
        Preloader.prototype.startMenu = function() {
            var music = this.game.add.audio('menuMusic');
            music.loop = true;
            music.play();
            this.game.state.start('MenuScene', true, false);
        };
        Preloader.prototype.resized = function(manager, bounds) {
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.background.x = DroneWars.GameCanvas.outer.x;
            this.background.y = DroneWars.GameCanvas.outer.y;
            this.background.width = DroneWars.GameCanvas.outer.width;
            this.background.height = DroneWars.GameCanvas.outer.height;
        };
        return Preloader;
    }(Phaser.State));
    DroneWars.Preloader = Preloader;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(MenuState) {
        MenuState[MenuState["MAIN"] = 0] = "MAIN";
        MenuState[MenuState["INFORMATION"] = 1] = "INFORMATION";
    })(DroneWars.MenuState || (DroneWars.MenuState = {}));
    var MenuState = DroneWars.MenuState;
    var MenuScene = (function(_super) {
        __extends(MenuScene, _super);

        function MenuScene() {
            _super.apply(this, arguments);
        }
        MenuScene.prototype.create = function() {
            this.wrapper = this.game.add.group();
            this.wrapper.create(0, 0);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('accept', 0, 0.5);
            this.soundFX.addMarker('cancel', 1, 0.6);
            this.soundFX.addMarker('mouseover', 2, 0.4);
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.scale.setResizeCallback(this.resized, this);
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'background');
            this.wrapper.add(this.background);
            //Menu scene
            var logo = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY - DroneWars.GameCanvas.defaultHeight * 0.2, 'LoadingScene', 'Logo.png');
            logo.anchor.setTo(0.5, 0.5);
            this.wrapper.add(logo);
            //Play
            this.playButton = this.add.button(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY + DroneWars.GameCanvas.defaultHeight * 0.15, 'MenuScene', this.onPlay, this, 'Play.png', 'Play.png', 'PlayHold.png');
            this.playButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.playButton);
            this.playButton.scale.setTo(0, 0);
            this.add.tween(this.playButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true);
            this.playButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.playButton);
                this.tweens.removeFrom(this.playButton.scale);
                this.add.tween(this.playButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.playButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.playButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.playButton);
                this.tweens.removeFrom(this.playButton.scale);
                this.add.tween(this.playButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.playButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Sounds
            var soundsEnabled = GameData.getItem("SoundsEnabled");
            if (soundsEnabled === null)
                soundsEnabled = "true";
            if (soundsEnabled === "true") {
                this.game.sound.mute = false;
                this.soundsButton = this.add.button(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.15, DroneWars.GameCanvas.inner.bottom - DroneWars.GameCanvas.defaultHeight * 0.15, 'MenuScene', this.onSounds, this, 'SoundOn.png', 'SoundOn.png', 'SoundOn.png');
            } else {
                this.game.sound.mute = true;
                this.soundsButton = this.add.button(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.15, DroneWars.GameCanvas.inner.bottom - DroneWars.GameCanvas.defaultHeight * 0.15, 'MenuScene', this.onSounds, this, 'SoundOff.png', 'SoundOff.png', 'SoundOff.png');
            }
            this.soundsButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.soundsButton);
            this.soundsButton.scale.setTo(0, 0);
            this.add.tween(this.soundsButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 300);
            this.soundsButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.soundsButton);
                this.tweens.removeFrom(this.soundsButton.scale);
                this.add.tween(this.soundsButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.soundsButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.soundsButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.soundsButton);
                this.tweens.removeFrom(this.soundsButton.scale);
                this.add.tween(this.soundsButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.soundsButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Information
            this.informationButton = this.add.button(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.15, DroneWars.GameCanvas.inner.bottom - DroneWars.GameCanvas.defaultHeight * 0.15, 'MenuScene', this.onInformation, this, 'Info.png', 'Info.png', 'InfoHold.png');
            this.informationButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.informationButton);
            this.informationButton.scale.setTo(0, 0);
            this.add.tween(this.informationButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 300);
            this.informationButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.informationButton);
                this.tweens.removeFrom(this.informationButton.scale);
                this.add.tween(this.informationButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.informationButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.informationButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.informationButton);
                this.tweens.removeFrom(this.informationButton.scale);
                this.add.tween(this.informationButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.informationButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Money & Stars
            var starIcon = this.add.sprite(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.035, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.035, 'MenuScene', 'Star.png');
            starIcon.anchor.setTo(0, 0.5);
            this.wrapper.add(starIcon);
            var stars = GameData.getItem("stars");
            if (stars === null)
                stars = "0";
            this.starsText = this.add.bitmapText(starIcon.x + starIcon.width * 1.2, starIcon.y + starIcon.height * 0.05, 'MenuFont', stars, 44);
            this.starsText.anchor.setTo(0, 0.5);
            this.wrapper.add(this.starsText);
            var moneyIcon = this.add.sprite(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.035, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.035, 'MenuScene', 'MoneyIcon.png');
            moneyIcon.anchor.setTo(1, 0.5);
            this.wrapper.add(moneyIcon);
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            this.coinsText = this.add.bitmapText(moneyIcon.x - moneyIcon.width * 1.2, moneyIcon.y + moneyIcon.height * 0.05, 'MenuFont', coins, 44);
            this.coinsText.anchor.setTo(1, 0.5);
            this.wrapper.add(this.coinsText);
            /*
            SETTINGS
            */
            this.backgroundSettings = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'BackgroundBlack');
            this.backgroundSettings.alpha = 0.0;
            this.wrapper.add(this.backgroundSettings);
            this.settingsGroup = this.add.group();
            this.settingsGroup.alpha = 0;
            this.wrapper.add(this.settingsGroup);
            var settingsBackground = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'MenuScene', 'Credits.png');
            settingsBackground.anchor.setTo(0.5, 0.5);
            this.settingsGroup.add(settingsBackground);
            var developedByText = this.add.bitmapText(settingsBackground.position.x - settingsBackground.width * 0.14, settingsBackground.position.y, 'CreditsFont', Locale.translate("Developed By EliteCoder"), 40);
            developedByText.anchor.setTo(0, 0.5);
            developedByText.maxWidth = settingsBackground.width * 0.6;
            this.settingsGroup.add(developedByText);
            this.closeButton = this.add.button(settingsBackground.position.x + settingsBackground.width * 0.45, settingsBackground.position.y - settingsBackground.height * 0.45, 'MenuScene', this.onCloseInformation, this, 'Close.png', 'Close.png', 'CloseHold.png');
            this.closeButton.anchor.setTo(0.5, 0.5);
            this.closeButton.inputEnabled = false;
            this.closeButton.scale.setTo(0.9, 0.9);
            this.settingsGroup.add(this.closeButton);
            this.closeButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.closeButton);
                this.tweens.removeFrom(this.closeButton.scale);
                this.add.tween(this.closeButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.closeButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.closeButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.closeButton);
                this.tweens.removeFrom(this.closeButton.scale);
                this.add.tween(this.closeButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.closeButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            this.state = MenuState.MAIN;
        };
        MenuScene.prototype.resized = function(manager, bounds) {
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.background.x = DroneWars.GameCanvas.outer.x;
            this.background.y = DroneWars.GameCanvas.outer.y;
            this.background.width = DroneWars.GameCanvas.outer.width;
            this.background.height = DroneWars.GameCanvas.outer.height;
            this.backgroundSettings.x = DroneWars.GameCanvas.outer.x;
            this.backgroundSettings.y = DroneWars.GameCanvas.outer.y;
            this.backgroundSettings.width = DroneWars.GameCanvas.outer.width;
            this.backgroundSettings.height = DroneWars.GameCanvas.outer.height;
        };
        MenuScene.prototype.update = function() {
            this.background.tilePosition.x += this.game.time.physicsElapsed * 12;
            this.background.tilePosition.y += this.game.time.physicsElapsed * 12;
        };
        MenuScene.prototype.onPlay = function() {
            this.soundFX.play('accept');
            this.game.state.start('LevelScene', true, false);
        };
        MenuScene.prototype.onInformation = function() {
            if (this.state === MenuState.MAIN) {
                this.soundFX.play('accept');
                this.informationButton.onInputOut.dispatch();
                this.add.tween(this.backgroundSettings).to({
                    alpha: 0.8
                }, 150, Phaser.Easing.Linear.None, true);
                this.settingsGroup.alpha = 1;
                this.closeButton.inputEnabled = true;
                this.closeButton.input.useHandCursor = true;
                this.playButton.inputEnabled = false;
                this.soundsButton.inputEnabled = false;
                this.informationButton.inputEnabled = false;
                this.state = MenuState.INFORMATION;
            }
        };
        MenuScene.prototype.onCloseInformation = function() {
            this.soundFX.play('cancel');
            if (this.state === MenuState.INFORMATION) {
                this.backgroundSettings.alpha = 0;
                this.settingsGroup.alpha = 0;
                this.closeButton.inputEnabled = false;
                this.playButton.inputEnabled = true;
                this.playButton.input.useHandCursor = true;
                this.soundsButton.inputEnabled = true;
                this.soundsButton.input.useHandCursor = true;
                this.informationButton.inputEnabled = true;
                this.informationButton.input.useHandCursor = true;
                this.state = MenuState.MAIN;
            }
        };
        MenuScene.prototype.onSounds = function() {
            if (GameData.getItem("SoundsEnabled") === "false") {
                this.game.sound.mute = false;
                GameData.setItem("SoundsEnabled", "true");
                this.soundsButton.setFrames("SoundOn.png", "SoundOn.png", "SoundOn.png", "SoundOn.png");
                this.soundFX.play('accept');
            } else {
                this.game.sound.mute = true;
                GameData.setItem("SoundsEnabled", "false");
                this.soundsButton.setFrames("SoundOff.png", "SoundOff.png", "SoundOff.png", "SoundOff.png");
            }
        };
        return MenuScene;
    }(Phaser.State));
    DroneWars.MenuScene = MenuScene;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(ShopState) {
        ShopState[ShopState["MAIN"] = 0] = "MAIN";
        ShopState[ShopState["LEVELSELECTED"] = 1] = "LEVELSELECTED";
    })(DroneWars.ShopState || (DroneWars.ShopState = {}));
    var ShopState = DroneWars.ShopState;
    var ShopScene = (function(_super) {
        __extends(ShopScene, _super);

        function ShopScene() {
            _super.apply(this, arguments);
            this.preloadWrapper = null;
            this.buttonsDrones = [];
            this.buttonImages = [];
            this.sizeBars = new Phaser.Point(0, 0);
            this.buttonsUpgrades = [];
            this.timeElapsed = 0;
        }
        ShopScene.prototype.init = function(argument) {
            this.sceneDestination = argument;
        };
        ShopScene.prototype.preload = function() {
            this.wrapper = this.game.add.group();
            this.wrapper.create(0, 0);
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.scale.setResizeCallback(this.resized, this);
            if (!this.load.checkKeyExists("atlasJSONHash", "ShopScene")) {
                this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'background');
                this.wrapper.add(this.background);
                //Add grougp wrapper for preload bar
                this.preloadWrapper = this.game.add.group();
                this.preloadWrapper.create(0, 0);
                this.wrapper.add(this.preloadWrapper);
                var loading = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'LoadingScene', 'LoadingBar.png');
                loading.anchor.setTo(0.5, 0.5);
                this.preloadWrapper.add(loading);
                this.preloadBar = this.add.sprite(loading.x + 2, loading.y - 4, 'LoadingScene', 'GreenBar.png');
                this.preloadBar.anchor.setTo(0, 0.5);
                this.preloadBar.x = loading.x + 2 - this.preloadBar.width * 0.5;
                this.preloadWrapper.add(this.preloadBar);
                this.load.setPreloadSprite(this.preloadBar);
                //  Load our actual games assets
                this.load.atlasJSONHash('ShopScene', DroneWars.GameCanvas.route + 'ShopScene/ShopScene.png', DroneWars.GameCanvas.route + 'ShopScene/ShopScene.json');
                this.load.audio('sfx', ['assets/audio/sfx.mp3', 'assets/audio/sfx.ogg']);
                this.load.bitmapFont('Font_Riffic28', DroneWars.GameCanvas.route + 'Font/Font_Riffic28.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic28.xml');
                this.load.bitmapFont('Font_Riffic42', DroneWars.GameCanvas.route + 'Font/Font_Riffic42.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic42.xml');
            }
        };
        ShopScene.prototype.create = function() {
            if (this.preloadWrapper !== null)
                this.preloadWrapper.visible = false;
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('accept', 0, 0.5);
            this.soundFX.addMarker('cancel', 1, 0.6);
            this.soundFX.addMarker('mouseover', 2, 0.4);
            this.soundFX.addMarker('buy', 4, 1.4);
            this.soundFX.addMarker('upgrade', 5.5, 1);
            this.soundFX.addMarker('cancelupgrade', 7, 0.6);
            this.soundFX.addMarker('cancelbuy', 8, 0.4);
            this.droneBarGroup = this.add.group();
            this.droneBarGroup.position.setTo(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.bottom);
            this.wrapper.add(this.droneBarGroup);
            this.jsonDrones = JSON.parse(this.cache.getText('playerConfig'));
            //Money
            var moneyIcon = this.add.sprite(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.035, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.035, 'MenuScene', 'MoneyIcon.png');
            moneyIcon.anchor.setTo(0, 0.5);
            this.wrapper.add(moneyIcon);
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            this.coinsHUDText = this.add.bitmapText(moneyIcon.x - moneyIcon.width * 0.2, moneyIcon.y + moneyIcon.height * 0.05, 'MenuFont', coins, 44);
            this.coinsHUDText.anchor.setTo(1, 0.5);
            this.wrapper.add(this.coinsHUDText);
            this.selectedDroneIndex = GameData.getItem("selectedDroneIndex");
            if (this.selectedDroneIndex === null)
                this.selectedDroneIndex = "0";
            var droneBarSprite = this.add.sprite(0, 0, 'ShopScene', 'DronesBar.png');
            droneBarSprite.anchor.setTo(0.5, 1);
            this.droneBarGroup.add(droneBarSprite);
            var unlockedDrones = GameData.getItem("unlockedDrones");
            if (unlockedDrones === null)
                unlockedDrones = "100000";
            var stars = GameData.getItem("stars");
            if (stars === null)
                stars = "0";
            this.buttonImages = [];
            this.buttonsDrones = [];
            var space = DroneWars.GameCanvas.defaultWidth * 0.03;
            var buttonDrone;
            var buttonImage;
            var lock;
            for (var i = 0; i < 6; i++) {
                if (i === parseInt(this.selectedDroneIndex))
                    buttonDrone = this.add.button(0, -droneBarSprite.height * 0.38, 'ShopScene', this.onDroneButtonSelected, this, 'Selection_Select.png', 'Selection_Select.png', 'Selection_Select.png');
                else if (unlockedDrones.charAt(i) === "0")
                    buttonDrone = this.add.button(0, -droneBarSprite.height * 0.38, 'ShopScene', this.onDroneButtonSelected, this, 'Selection_Block.png', 'Selection_Block.png', 'Selection_Block.png');
                else
                    buttonDrone = this.add.button(0, -droneBarSprite.height * 0.38, 'ShopScene', this.onDroneButtonSelected, this, 'Selection_NoSelect.png', 'Selection_NoSelect.png', 'Selection_NoSelect.png');
                buttonDrone.anchor.setTo(0.5, 0.5);
                buttonDrone.scale.setTo(0.9, 0.9);
                this.droneBarGroup.add(buttonDrone);
                buttonDrone.onInputOver.add(function(pageButton) {
                    this.soundFX.play('mouseover');
                    this.tweens.removeFrom(pageButton.scale);
                    this.add.tween(pageButton.scale).to({
                        x: 1,
                        y: 1
                    }, 300, Phaser.Easing.Elastic.Out, true);
                }, this);
                buttonDrone.onInputOut.add(function(pageButton) {
                    this.tweens.removeFrom(pageButton.scale);
                    this.add.tween(pageButton.scale).to({
                        x: 0.9,
                        y: 0.9
                    }, 100, Phaser.Easing.Linear.None, true);
                }, this);
                if (parseInt(stars) < this.jsonDrones.drones[i].starsToUnlock && i !== 0) {
                    buttonImage = this.add.sprite(0, 0, 'ShopScene', 'Block_Drone' + (i + 1).toString() + '.png');
                } else {
                    if (unlockedDrones.charAt(i) === "0") {
                        buttonImage = this.add.sprite(0, 0, 'ShopScene', 'Inactive_Drone' + (i + 1).toString() + '.png');
                    } else {
                        buttonImage = this.add.sprite(0, 0, 'ShopScene', 'Small_Drone' + (i + 1).toString() + '.png');
                    }
                }
                buttonImage.anchor.setTo(0.5, 0.5);
                buttonDrone.addChild(buttonImage);
                this.buttonImages.push(buttonImage);
                if (parseInt(stars) < this.jsonDrones.drones[i].starsToUnlock && i !== 0) {
                    lock = this.add.sprite(buttonDrone.width * 0.25, buttonDrone.height * 0.25, 'ShopScene', 'BlockIcon.png');
                    lock.anchor.setTo(0.5, 0.5);
                    buttonDrone.addChild(lock);
                    var backStar = this.add.sprite(0, 0, 'ShopScene', 'StarCounter.png');
                    backStar.anchor.setTo(0.5, 0.5);
                    backStar.alpha = 0.4;
                    buttonDrone.addChild(backStar);
                    var starIcon = this.add.sprite(0, 0, 'ShopScene', 'StarIcon.png');
                    starIcon.anchor.setTo(0.5, 0.5);
                    buttonDrone.addChild(starIcon);
                    var starText = this.add.bitmapText(0, 0, 'Font_Riffic28', stars + '/' + this.jsonDrones.drones[i].starsToUnlock, 24);
                    starText.anchor.setTo(0, 0.5);
                    buttonDrone.addChild(starText);
                    var spaceStar = starIcon.width * 0.1;
                    starIcon.position.x = -(starIcon.width + spaceStar + starText.width) * 0.5 + starIcon.width * 0.5;
                    starText.position.x = starIcon.position.x + starIcon.width * 0.5 + spaceStar;
                    buttonDrone.inputEnabled = false;
                }
                this.buttonsDrones.push(buttonDrone);
            }
            var initialX = -(buttonDrone.width * 6 + (6 - 1) * space) * 0.5 + buttonDrone.width * 0.5;
            for (var i = 0; i < 6; i++) {
                this.buttonsDrones[i].position.x = initialX + i * (space + buttonDrone.width);
            }
            this.selectArrow = this.add.sprite(this.buttonsDrones[0].position.x, this.buttonsDrones[0].position.y - this.buttonsDrones[0].height * 0.6, 'ShopScene', 'SelectArrow.png');
            this.selectArrow.anchor.setTo(0.5, 0.5);
            this.droneBarGroup.add(this.selectArrow);
            /*
            Drone Big
            */
            this.droneTitle = this.add.bitmapText(DroneWars.GameCanvas.defaultWidth * 0.25, DroneWars.GameCanvas.defaultHeight * 0.1, 'Font_Riffic42', this.jsonDrones.drones[parseInt(this.selectedDroneIndex)].name, 42);
            this.droneTitle.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.droneTitle);
            var indexDrone = parseInt(this.selectedDroneIndex) + 1;
            this.droneImageBig = this.add.sprite(DroneWars.GameCanvas.defaultWidth * 0.25, DroneWars.GameCanvas.defaultHeight * 0.25, 'ShopScene', 'Big_Drone' + indexDrone + '.png');
            this.droneImageBig.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.droneImageBig);
            this.upgradeAnimation = this.add.sprite(this.droneImageBig.position.x, this.droneImageBig.position.y, 'ShopScene', 'PowerUp_Hp_0.png');
            var animation = this.upgradeAnimation.animations.add('upgrade', ['PowerUp_Hp_0.png', 'PowerUp_Hp_1.png', 'PowerUp_Hp_2.png', 'PowerUp_Hp_3.png', 'PowerUp_Hp_4.png', 'PowerUp_Hp_5.png', 'PowerUp_Hp_6.png', 'PowerUp_Hp_7.png', 'PowerUp_Hp_8.png', 'PowerUp_Hp_9.png', 'PowerUp_Hp_10.png', 'PowerUp_Hp_11.png', 'PowerUp_Hp_12.png', 'PowerUp_Hp_13.png', 'PowerUp_Hp_14.png', 'PowerUp_Hp_15.png', 'PowerUp_Hp_16.png', 'PowerUp_Hp_17.png', 'PowerUp_Hp_18.png', 'PowerUp_Hp_19.png', 'PowerUp_Hp_20.png', 'PowerUp_Hp_21.png', 'PowerUp_Hp_22.png', 'PowerUp_Hp_23.png', 'PowerUp_Hp_24.png', 'PowerUp_Hp_25.png', 'PowerUp_Hp_26.png', 'PowerUp_Hp_27.png', 'PowerUp_Hp_28.png', 'PowerUp_Hp_29.png', 'PowerUp_Hp_30.png']);
            animation.onComplete.add(this.onCompleteUpgradeAnimation, this);
            this.upgradeAnimation.anchor.setTo(0.3, 0.7);
            this.upgradeAnimation.visible = false;
            this.wrapper.add(this.upgradeAnimation);
            this.backgroundStats = this.add.sprite(DroneWars.GameCanvas.defaultWidth * 0.25, DroneWars.GameCanvas.defaultHeight * 0.45, 'ShopScene', 'AbilityChart.png');
            this.backgroundStats.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.backgroundStats);
            var backStats;
            var backGreen;
            var backYellow;
            this.maskBarsGreen = this.add.graphics(0, 0);
            this.backgroundStats.addChild(this.maskBarsGreen);
            this.maskBarsYellow = this.add.graphics(0, 0);
            this.backgroundStats.addChild(this.maskBarsYellow);
            for (var i = 0; i < 3; i++) {
                backStats = this.add.sprite(this.backgroundStats.width * 0.1, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29, 'ShopScene', 'Ability_Bar.png');
                backStats.anchor.setTo(0.5, 0.5);
                this.backgroundStats.addChild(backStats);
                backYellow = this.add.sprite(this.backgroundStats.width * 0.1, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29, 'ShopScene', 'Ability_BarYellow.png');
                backYellow.anchor.setTo(0.5, 0.5);
                this.backgroundStats.addChild(backYellow);
                backGreen = this.add.sprite(this.backgroundStats.width * 0.1, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29, 'ShopScene', 'Ability_BarGreen.png');
                backGreen.anchor.setTo(0.5, 0.5);
                this.backgroundStats.addChild(backGreen);
                this.sizeBars.setTo(backGreen.width, backGreen.height);
                backGreen.mask = this.maskBarsGreen;
                backYellow.mask = this.maskBarsYellow;
            }
            this.droneSelectButton = this.add.button(DroneWars.GameCanvas.defaultWidth * 0.25, DroneWars.GameCanvas.defaultHeight * 0.63, 'ShopScene', this.onSelected, this, 'Selected.png', 'Selected.png', 'Selected.png');
            this.droneSelectButton.anchor.setTo(0.5, 0.5);
            this.droneSelectButton.scale.setTo(0.9, 0.9);
            this.wrapper.add(this.droneSelectButton);
            var selectText = this.add.bitmapText(0, 0, 'Font_Riffic28', Locale.translate('Selected'));
            selectText.anchor.setTo(0.5, 0.5);
            this.droneSelectButton.addChild(selectText);
            this.droneSelectButton.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            this.droneSelectButton.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            /*
            Stats Buttons for Upgrade and Buy
            */
            this.buyDroneGroup = this.add.group();
            this.wrapper.add(this.buyDroneGroup);
            this.buttonBuy = this.add.button(DroneWars.GameCanvas.defaultWidth * 0.65, DroneWars.GameCanvas.defaultHeight * 0.37, 'ShopScene', this.onBuyDrone, this, 'Button_BuyDroneNormal.png', 'Button_BuyDroneNormal.png', 'Button_BuyDroneNormal.png');
            this.buttonBuy.anchor.setTo(0.5, 0.5);
            this.buttonBuy.scale.setTo(0.9, 0.9);
            this.buyDroneGroup.add(this.buttonBuy);
            this.buttonBuy.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            this.buttonBuy.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            this.labelBuyText = this.add.bitmapText(0, -this.buttonBuy.height * 0.18, 'Font_Riffic28', Locale.translate('Buy Now!'));
            this.labelBuyText.anchor.setTo(0.5, 0.5);
            this.buttonBuy.addChild(this.labelBuyText);
            this.coinIconBuy = this.add.sprite(-this.buttonBuy.width * 0.11, this.buttonBuy.height * 0.14, 'ShopScene', 'MoneyIcon.png');
            this.coinIconBuy.anchor.setTo(0, 0.5);
            this.buttonBuy.addChild(this.coinIconBuy);
            this.buyCoinText = this.add.bitmapText(-this.buttonBuy.width * 0.11 + this.coinIconBuy.width * 1.1, this.buttonBuy.height * 0.16, 'Font_Riffic28', '0');
            this.buyCoinText.anchor.setTo(0, 0.5);
            this.buttonBuy.addChild(this.buyCoinText);
            this.confirmBuyDroneGroup = this.add.group();
            this.confirmBuyDroneGroup.position.setTo(this.buttonBuy.position.x + this.buttonBuy.width * 0.65, this.buttonBuy.position.y);
            this.confirmBuyDroneGroup.visible = false;
            this.buyDroneGroup.add(this.confirmBuyDroneGroup);
            var okButton = this.add.button(0, 0, 'ShopScene', this.onConfirmBuy, this, 'Confirm_Ok.png', 'Confirm_Ok.png', 'Confirm_Ok.png');
            okButton.anchor.setTo(0.5, 0.5);
            okButton.scale.setTo(0.9, 0.9);
            this.confirmBuyDroneGroup.add(okButton);
            okButton.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            okButton.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            var cancelButton = this.add.button(okButton.width * 1.2, 0, 'ShopScene', this.onCancelBuy, this, 'Confirm_Cancel.png', 'Confirm_Cancel.png', 'Confirm_Cancel.png');
            cancelButton.anchor.setTo(0.5, 0.5);
            cancelButton.scale.setTo(0.9, 0.9);
            this.confirmBuyDroneGroup.add(cancelButton);
            cancelButton.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            cancelButton.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            this.upgradeDroneGroup = this.add.group();
            this.upgradeDroneGroup.visible = false;
            this.wrapper.add(this.upgradeDroneGroup);
            var buttonUpgrade;
            var imageStats;
            var levelText;
            var coinIcon;
            var coinsUpgradeText;
            this.buttonsUpgrades = [];
            for (var i = 0; i < 3; i++) {
                buttonUpgrade = this.add.button(DroneWars.GameCanvas.defaultWidth * 0.65, DroneWars.GameCanvas.defaultHeight * 0.17 + i * DroneWars.GameCanvas.defaultHeight * 0.22, 'ShopScene', this.onUpgrade, this, 'Button_UpAbility.png', 'Button_UpAbility.png', 'Button_UpAbility.png');
                buttonUpgrade.anchor.setTo(0.5, 0.5);
                buttonUpgrade.scale.setTo(0.9, 0.9);
                this.upgradeDroneGroup.add(buttonUpgrade);
                this.buttonsUpgrades.push(buttonUpgrade);
                buttonUpgrade.onInputOver.add(function(droneSelectButton) {
                    this.soundFX.play('mouseover');
                    this.tweens.removeFrom(droneSelectButton.scale);
                    this.add.tween(droneSelectButton.scale).to({
                        x: 1,
                        y: 1
                    }, 300, Phaser.Easing.Elastic.Out, true);
                }, this);
                buttonUpgrade.onInputOut.add(function(droneSelectButton) {
                    this.tweens.removeFrom(droneSelectButton.scale);
                    this.add.tween(droneSelectButton.scale).to({
                        x: 0.9,
                        y: 0.9
                    }, 100, Phaser.Easing.Linear.None, true);
                }, this);
                if (i === 0)
                    imageStats = this.add.sprite(-buttonUpgrade.width * 0.27, -buttonUpgrade.height * 0.05, 'ShopScene', 'Icon_Damage.png');
                else if (i === 1)
                    imageStats = this.add.sprite(-buttonUpgrade.width * 0.27, -buttonUpgrade.height * 0.05, 'ShopScene', 'Icon_Speed.png');
                else if (i === 2)
                    imageStats = this.add.sprite(-buttonUpgrade.width * 0.27, -buttonUpgrade.height * 0.05, 'ShopScene', 'Icon_Hp.png');
                imageStats.anchor.setTo(0.5, 0.5);
                buttonUpgrade.addChild(imageStats);
                levelText = this.add.bitmapText(-buttonUpgrade.width * 0.11, -buttonUpgrade.height * 0.17, 'Font_Riffic28', Locale.translate('Lv.'));
                levelText.anchor.setTo(0, 0.5);
                buttonUpgrade.addChild(levelText);
                coinIcon = this.add.sprite(-buttonUpgrade.width * 0.11, buttonUpgrade.height * 0.14, 'ShopScene', 'MoneyIcon.png');
                coinIcon.anchor.setTo(0, 0.5);
                buttonUpgrade.addChild(coinIcon);
                coinsUpgradeText = this.add.bitmapText(-buttonUpgrade.width * 0.11 + coinIcon.width * 1.1, buttonUpgrade.height * 0.16, 'Font_Riffic28', '0');
                coinsUpgradeText.anchor.setTo(0, 0.5);
                buttonUpgrade.addChild(coinsUpgradeText);
            }
            this.confirmUpgradeGroup = this.add.group();
            this.confirmUpgradeGroup.position.setTo(buttonUpgrade.position.x + buttonUpgrade.width * 0.75, buttonUpgrade.position.y);
            this.confirmUpgradeGroup.visible = false;
            this.upgradeDroneGroup.add(this.confirmUpgradeGroup);
            var okUpgradeButton = this.add.button(0, 0, 'ShopScene', this.onConfirmUpgrade, this, 'Confirm_Ok.png', 'Confirm_Ok.png', 'Confirm_Ok.png');
            okUpgradeButton.anchor.setTo(0.5, 0.5);
            okUpgradeButton.scale.setTo(0.9, 0.9);
            this.confirmUpgradeGroup.add(okUpgradeButton);
            okUpgradeButton.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            okUpgradeButton.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            var cancelUpgradeButton = this.add.button(okUpgradeButton.width * 1.2, 0, 'ShopScene', this.onCancelUpgrade, this, 'Confirm_Cancel.png', 'Confirm_Cancel.png', 'Confirm_Cancel.png');
            cancelUpgradeButton.anchor.setTo(0.5, 0.5);
            cancelUpgradeButton.scale.setTo(0.9, 0.9);
            this.confirmUpgradeGroup.add(cancelUpgradeButton);
            cancelUpgradeButton.onInputOver.add(function(droneSelectButton) {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            cancelUpgradeButton.onInputOut.add(function(droneSelectButton) {
                this.tweens.removeFrom(droneSelectButton.scale);
                this.add.tween(droneSelectButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            this.onDroneSelected(this.buttonsDrones[parseInt(this.selectedDroneIndex)]);
            //Home
            this.backButton = this.add.button(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.048, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.048, 'ShopScene', this.onBack, this, 'Back.png', 'Back.png', 'BackHold.png');
            this.backButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.backButton);
            this.backButton.scale.setTo(0, 0);
            this.add.tween(this.backButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 300);
            this.backButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.backButton);
                this.tweens.removeFrom(this.backButton.scale);
                this.add.tween(this.backButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.backButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.backButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.backButton);
                this.tweens.removeFrom(this.backButton.scale);
                this.add.tween(this.backButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.backButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
        };
        ShopScene.prototype.resized = function(manager, bounds) {
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.background.x = DroneWars.GameCanvas.outer.x;
            this.background.y = DroneWars.GameCanvas.outer.y;
            this.background.width = DroneWars.GameCanvas.outer.width;
            this.background.height = DroneWars.GameCanvas.outer.height;
        };
        ShopScene.prototype.onCompleteUpgradeAnimation = function() {
            this.upgradeAnimation.visible = false;
        };
        ShopScene.prototype.onBack = function() {
            this.soundFX.play('cancel');
            if (this.sceneDestination === "fromMenu") {
                this.game.state.start('MenuScene', true, false);
            } else if (this.sceneDestination === "fromLevels") {
                this.game.state.start('LevelScene', true, false);
            }
        };
        ShopScene.prototype.onDroneButtonSelected = function(button) {
            this.soundFX.play('accept');
            this.onDroneSelected(button);
        };
        ShopScene.prototype.onDroneSelected = function(button) {
            var image = button.getChildAt(0);
            this.droneIndex = parseInt(image.frameName.substring(image.frameName.length - 5, image.frameName.length - 4)) - 1;
            this.selectArrow.position.setTo(this.buttonsDrones[this.droneIndex].position.x, this.buttonsDrones[this.droneIndex].position.y - this.buttonsDrones[0].height * 0.6);
            this.droneTitle.setText(this.jsonDrones.drones[this.droneIndex].name + '');
            this.confirmUpgradeGroup.visible = false;
            if (parseInt(this.selectedDroneIndex) === this.droneIndex) {
                this.droneSelectButton.setFrames("Selected.png", "Selected.png", "Selected.png", "Selected.png");
                this.droneSelectButton.getChildAt(0).setText(Locale.translate("Selected"));
            } else {
                this.droneSelectButton.setFrames("Unselected.png", "Unselected.png", "Unselected.png", "Unselected.png");
                this.droneSelectButton.getChildAt(0).setText(Locale.translate("Select"));
            }
            if (this.confirmBuyDroneGroup.visible) {
                this.buttonBuy.setFrames("Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png");
                this.confirmBuyDroneGroup.visible = false;
                this.buttonBuy.inputEnabled = true;
                this.buttonBuy.input.useHandCursor = true;
                this.tweens.removeFrom(this.buttonBuy.scale);
                this.add.tween(this.buttonBuy.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }
            var unlockedDrones = GameData.getItem("unlockedDrones");
            if (unlockedDrones === null)
                unlockedDrones = "100000";
            var levelsDrone = GameData.getItem("levelsDrone" + this.droneIndex.toString());
            if (levelsDrone === null)
                levelsDrone = "000";
            if (unlockedDrones.charAt(this.droneIndex) === "1") {
                this.droneImageBig.frameName = 'Big_Drone' + (this.droneIndex + 1).toString() + '.png';
                var levelText;
                for (var i = 0; i < 3; i++) {
                    this.buttonsUpgrades[i].scale.setTo(0.9, 0.9);
                    levelText = this.buttonsUpgrades[i].getChildAt(1);
                    if (parseInt(levelsDrone.charAt(i)) === this.jsonDrones.drones[this.droneIndex].levels.length - 1) {
                        levelText.position.y = 0;
                        levelText.setText(Locale.translate("Lv.") + Locale.translate("Max"));
                        this.buttonsUpgrades[i].setFrames("Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png");
                        this.buttonsUpgrades[i].inputEnabled = false;
                        this.buttonsUpgrades[i].getChildAt(2).visible = false;
                        this.buttonsUpgrades[i].getChildAt(3).visible = false;
                    } else {
                        levelText.position.y = -button.height * 0.17;
                        levelText.setText(Locale.translate("Lv.") + (parseInt(levelsDrone.charAt(i)) + 1).toString());
                        this.buttonsUpgrades[i].getChildAt(2).visible = true;
                        this.buttonsUpgrades[i].getChildAt(3).visible = true;
                        var coinsToUpgrade;
                        if (i === 0) {
                            this.buttonsUpgrades[i].getChildAt(3).setText(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].attack.coins);
                            coinsToUpgrade = parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].attack.coins);
                        } else if (i === 1) {
                            this.buttonsUpgrades[i].getChildAt(3).setText(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].velocity.coins);
                            coinsToUpgrade = parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].velocity.coins);
                        } else if (i === 2) {
                            this.buttonsUpgrades[i].getChildAt(3).setText(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].health.coins);
                            coinsToUpgrade = parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseInt(levelsDrone.charAt(i)) + 1].health.coins);
                        }
                        var coins = GameData.getItem("coins");
                        if (coins === null)
                            coins = "0";
                        if (parseInt(coins) >= coinsToUpgrade) {
                            this.buttonsUpgrades[i].setFrames("Button_UpAbility.png", "Button_UpAbility.png", "Button_UpAbility.png", "Button_UpAbility.png");
                            this.buttonsUpgrades[i].inputEnabled = true;
                            this.buttonsUpgrades[i].input.useHandCursor = true;
                        } else {
                            this.buttonsUpgrades[i].setFrames("Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png");
                            this.buttonsUpgrades[i].inputEnabled = false;
                        }
                    }
                }
                this.buyDroneGroup.visible = false;
                this.upgradeDroneGroup.visible = true;
                this.droneSelectButton.visible = true;
            } else {
                this.droneImageBig.frameName = 'BigInactive_Drone' + (this.droneIndex + 1).toString() + '.png';
                this.buyCoinText.setText(this.jsonDrones.drones[this.droneIndex].coinsToBuy);
                var sizeText = this.buyCoinText.width + this.coinIconBuy.width;
                this.coinIconBuy.position.x = -sizeText * 0.5;
                this.buyCoinText.position.x = this.coinIconBuy.position.x + this.coinIconBuy.width;
                var coins = GameData.getItem("coins");
                if (coins === null)
                    coins = "0";
                if (parseInt(coins) >= parseInt(this.jsonDrones.drones[this.droneIndex].coinsToBuy)) {
                    this.labelBuyText.setText(Locale.translate("Buy Now!"));
                    this.buttonBuy.inputEnabled = true;
                    this.buttonBuy.input.useHandCursor = true;
                    this.buttonBuy.setFrames("Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png");
                } else {
                    this.labelBuyText.setText(Locale.translate("Not Available"));
                    this.buttonBuy.inputEnabled = false;
                    this.buttonBuy.setFrames("Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png", "Button_BuyDroneBlock.png");
                }
                this.buyDroneGroup.visible = true;
                this.upgradeDroneGroup.visible = false;
                this.droneSelectButton.visible = false;
            }
            //Search for maximum at every stats
            var maxAttack = 0,
                maxVelocity = 0,
                maxHealth = 0;
            for (var i = 0; i < this.jsonDrones.drones.length; i++) {
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].attack.stats > maxAttack) {
                    maxAttack = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].attack.stats;
                }
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].velocity.stats > maxVelocity) {
                    maxVelocity = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].velocity.stats;
                }
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].health.stats > maxHealth) {
                    maxHealth = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].health.stats;
                }
            }
            var x1 = 0,
                x2 = maxAttack,
                y1 = 0,
                y2 = this.sizeBars.x,
                y, x;
            this.maskBarsGreen.clear();
            this.maskBarsYellow.clear();
            this.maskBarsGreen.beginFill(0xffffff);
            this.maskBarsYellow.beginFill(0xffffff);
            for (var i = 0; i < 3; i++) {
                if (i == 0) {
                    x2 = maxAttack;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].attack.stats;
                } else if (i == 1) {
                    x2 = maxVelocity;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].velocity.stats;
                } else if (i == 2) {
                    x2 = maxHealth;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].health.stats;
                }
                y = Math.min(y2, Math.max(0, ((y2 - y1) / (x2 - x1)) * (x - x1) + y1));
                this.maskBarsGreen.drawRect(this.backgroundStats.width * 0.1 - this.sizeBars.x * 0.5, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29 - this.sizeBars.y * 0.5, y, this.sizeBars.y);
                this.maskBarsYellow.drawRect(this.backgroundStats.width * 0.1 - this.sizeBars.x * 0.5, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29 - this.sizeBars.y * 0.5, y, this.sizeBars.y);
            }
        };
        ShopScene.prototype.onSelected = function(button) {
            if (parseInt(this.selectedDroneIndex) !== this.droneIndex) {
                this.soundFX.play('buy');
                this.buttonsDrones[parseInt(this.selectedDroneIndex)].setFrames("Selection_NoSelect.png", "Selection_NoSelect.png", "Selection_NoSelect.png", "Selection_NoSelect.png");
                this.selectedDroneIndex = this.droneIndex.toString();
                GameData.setItem("selectedDroneIndex", this.selectedDroneIndex);
                this.buttonsDrones[this.droneIndex].setFrames("Selection_Select.png", "Selection_Select.png", "Selection_Select.png", "Selection_Select.png");
                this.buttonImages[this.droneIndex].frameName = 'Small_Drone' + (this.droneIndex + 1).toString() + '.png';
                this.droneSelectButton.setFrames("Selected.png", "Selected.png", "Selected.png", "Selected.png");
                this.droneSelectButton.getChildAt(0).setText(Locale.translate("Selected"));
            }
        };
        ShopScene.prototype.onUpgrade = function(button) {
            this.soundFX.play('accept');
            this.onDroneSelected(this.buttonsDrones[this.droneIndex]);
            this.indexUpgrade = this.buttonsUpgrades.indexOf(button);
            this.buttonsUpgrades[this.indexUpgrade].scale.setTo(1.0, 1.0);
            this.buttonsUpgrades[this.indexUpgrade].inputEnabled = false;
            this.buttonsUpgrades[this.indexUpgrade].setFrames("Button_UpAbilityLight.png", "Button_UpAbilityLight.png", "Button_UpAbilityLight.png", "Button_UpAbilityLight.png");
            var levelsDrone = GameData.getItem("levelsDrone" + this.droneIndex.toString());
            if (levelsDrone === null)
                levelsDrone = "000";
            levelsDrone = levelsDrone.substr(0, this.indexUpgrade) + (parseInt(levelsDrone.charAt(this.indexUpgrade)) + 1).toString() + levelsDrone.substr(this.indexUpgrade + 1);
            //Search for maximum at every stats
            var maxAttack = 0,
                maxVelocity = 0,
                maxHealth = 0;
            for (var i = 0; i < this.jsonDrones.drones.length; i++) {
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].attack.stats > maxAttack) {
                    maxAttack = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].attack.stats;
                }
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].velocity.stats > maxVelocity) {
                    maxVelocity = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].velocity.stats;
                }
                if (this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].health.stats > maxHealth) {
                    maxHealth = this.jsonDrones.drones[i].levels[this.jsonDrones.drones[i].levels.length - 1].health.stats;
                }
            }
            var x1 = 0,
                x2 = maxAttack,
                y1 = 0,
                y2 = this.sizeBars.x,
                y, x;
            this.maskBarsYellow.clear();
            this.maskBarsYellow.beginFill(0xffffff);
            for (var i = 0; i < 3; i++) {
                if (i === 0) {
                    x2 = maxAttack;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].attack.stats;
                } else if (i === 1) {
                    x2 = maxVelocity;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].velocity.stats;
                } else if (i === 2) {
                    x2 = maxHealth;
                    x = this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(i))].health.stats;
                }
                y = Math.min(y2, Math.max(0, ((y2 - y1) / (x2 - x1)) * (x - x1) + y1));
                this.maskBarsYellow.drawRect(this.backgroundStats.width * 0.1 - this.sizeBars.x * 0.5, -this.backgroundStats.height * 0.29 + i * this.backgroundStats.height * 0.29 - this.sizeBars.y * 0.5, y, this.sizeBars.y);
            }
            this.confirmUpgradeGroup.position.y = button.position.y;
            this.confirmUpgradeGroup.visible = true;
        };
        ShopScene.prototype.onBuyDrone = function(button) {
            this.soundFX.play('accept');
            if (!this.confirmBuyDroneGroup.visible) {
                this.buttonBuy.setFrames("Button_BuyDroneLight.png", "Button_BuyDroneLight.png", "Button_BuyDroneLight.png", "Button_BuyDroneLight.png");
                this.buttonBuy.scale.setTo(1, 1);
                this.buttonBuy.inputEnabled = false;
                this.confirmBuyDroneGroup.position.setTo(this.buttonBuy.position.x + this.buttonBuy.width * 0.65, this.buttonBuy.position.y);
                this.confirmBuyDroneGroup.visible = true;
            }
        };
        /*
        Functions for confirmation in buy screen
        */
        ShopScene.prototype.onConfirmBuy = function(button) {
            this.soundFX.play('buy');
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            var newCoins = parseInt(coins) - parseInt(this.jsonDrones.drones[this.droneIndex].coinsToBuy);
            GameData.setItem("coins", coins.toString());
            var unlockedDrones = GameData.getItem("unlockedDrones");
            if (unlockedDrones === null)
                unlockedDrones = "100000";
            var newUnlockedDrones = unlockedDrones.substr(0, this.droneIndex) + "1" + unlockedDrones.substr(this.droneIndex + 1);
            GameData.setItem("unlockedDrones", newUnlockedDrones);
            this.coinsHUDText.setText(newCoins.toString());
            this.onDroneSelected(this.buttonsDrones[this.droneIndex]);
            this.onSelected(this.droneSelectButton);
        };
        ShopScene.prototype.onCancelBuy = function(button) {
            if (this.confirmBuyDroneGroup.visible) {
                this.soundFX.play('cancelbuy');
                this.buttonBuy.setFrames("Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png", "Button_BuyDroneNormal.png");
                this.confirmBuyDroneGroup.visible = false;
                this.buttonBuy.inputEnabled = true;
                this.buttonBuy.input.useHandCursor = true;
                this.tweens.removeFrom(this.buttonBuy.scale);
                this.add.tween(this.buttonBuy.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }
        };
        ShopScene.prototype.onConfirmUpgrade = function(button) {
            this.soundFX.play('upgrade');
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            var levelsDrone = GameData.getItem("levelsDrone" + this.droneIndex.toString());
            if (levelsDrone === null)
                levelsDrone = "000";
            levelsDrone = levelsDrone.substr(0, this.indexUpgrade) + (parseInt(levelsDrone.charAt(this.indexUpgrade)) + 1).toString() + levelsDrone.substr(this.indexUpgrade + 1);
            GameData.setItem("levelsDrone" + this.droneIndex.toString(), levelsDrone);
            var newCoins = parseInt(coins) - parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(0))].attack.coins);
            if (this.indexUpgrade === 1)
                newCoins = parseInt(coins) - parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(1))].velocity.coins);
            else if (this.indexUpgrade === 2)
                newCoins = parseInt(coins) - parseInt(this.jsonDrones.drones[this.droneIndex].levels[parseFloat(levelsDrone.charAt(2))].health.coins);
            GameData.setItem("coins", newCoins.toString());
            this.coinsHUDText.setText(newCoins.toString());
            this.onDroneSelected(this.buttonsDrones[this.droneIndex]);
            this.upgradeAnimation.visible = true;
            this.upgradeAnimation.play('upgrade', 60, false);
        };
        ShopScene.prototype.onCancelUpgrade = function(button) {
            this.soundFX.play('cancelupgrade');
            if (this.confirmUpgradeGroup.visible) {
                this.confirmUpgradeGroup.visible = false;
                this.onDroneSelected(this.buttonsDrones[this.droneIndex]);
            }
        };
        ShopScene.prototype.update = function() {
            this.background.tilePosition.x += this.game.time.physicsElapsed * 12;
            this.background.tilePosition.y += this.game.time.physicsElapsed * 12;
            this.timeElapsed += this.game.time.physicsElapsed;
            var posY = 0.03 * (DroneWars.GameCanvas.defaultHeight / 6) * Math.cos(this.timeElapsed * 3) + DroneWars.GameCanvas.defaultHeight * 0.3 - (DroneWars.GameCanvas.defaultHeight / 6) * 0.37;
            this.droneImageBig.position.y = posY;
        };
        return ShopScene;
    }(Phaser.State));
    DroneWars.ShopScene = ShopScene;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(LevelState) {
        LevelState[LevelState["MAIN"] = 0] = "MAIN";
        LevelState[LevelState["LEVELSELECTED"] = 1] = "LEVELSELECTED";
    })(DroneWars.LevelState || (DroneWars.LevelState = {}));
    var LevelState = DroneWars.LevelState;
    var LevelScene = (function(_super) {
        __extends(LevelScene, _super);

        function LevelScene() {
            _super.apply(this, arguments);
            this.preloadWrapper = null;
            this.pagesBullets = [];
            this.pageStars = [];
            this.pagesLevels = [];
            this.pageNumbers = [];
            this.selectionStars = [];
            this.selectionTexts = [];
            this.selectionDifficulties = [];
            this.difficultySelected = 0;
        }
        LevelScene.prototype.preload = function() {
            this.wrapper = this.game.add.group();
            this.wrapper.create(0, 0);
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.scale.setResizeCallback(this.resized, this);
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'background');
            this.wrapper.add(this.background);
            //Add grougp wrapper for preload bar
            this.preloadWrapper = this.game.add.group();
            this.preloadWrapper.create(0, 0);
            this.wrapper.add(this.preloadWrapper);
            var loading = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'LoadingScene', 'LoadingBar.png');
            loading.anchor.setTo(0.5, 0.5);
            this.preloadWrapper.add(loading);
            this.preloadBar = this.add.sprite(loading.x + 2, loading.y - 4, 'LoadingScene', 'GreenBar.png');
            this.preloadBar.anchor.setTo(0, 0.5);
            this.preloadBar.x = loading.x + 2 - this.preloadBar.width * 0.5;
            this.preloadWrapper.add(this.preloadBar);
            this.load.setPreloadSprite(this.preloadBar);
            //  Load our actual games assets
            this.load.atlasJSONHash('LevelScene', DroneWars.GameCanvas.route + 'LevelScene/LevelScene.png', DroneWars.GameCanvas.route + 'LevelScene/LevelScene.json');
            this.load.audio('ingameMusic', ['assets/audio/ingame.mp3', 'assets/audio/ingame.ogg']);
            this.load.image('Background1', DroneWars.GameCanvas.route + 'GameScene/Background/Background1.png');
            this.load.image('Background2', DroneWars.GameCanvas.route + 'GameScene/Background/Background2.png');
            this.load.image('Background3', DroneWars.GameCanvas.route + 'GameScene/Background/Background3.png');
            this.load.image('Background4', DroneWars.GameCanvas.route + 'GameScene/Background/Background4.png');
            this.load.image('Background5', DroneWars.GameCanvas.route + 'GameScene/Background/Background5.png');
            this.load.image('Background6', DroneWars.GameCanvas.route + 'GameScene/Background/Background6.png');
            this.load.audio('sfx', ['assets/audio/sfx.mp3', 'assets/audio/sfx.ogg']);
            this.load.bitmapFont('Font_Riffic42', DroneWars.GameCanvas.route + 'Font/Font_Riffic42.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic42.xml');
            this.load.bitmapFont('Font_Riffic62', DroneWars.GameCanvas.route + 'Font/Font_Riffic62.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic62.xml');
            this.load.image('Background1_Color', DroneWars.GameCanvas.route + 'GameScene/Background/Background1_Color.png');
            this.load.image('Background2_Color', DroneWars.GameCanvas.route + 'GameScene/Background/Background2_Color.png');
            this.load.image('Background3_Color', DroneWars.GameCanvas.route + 'GameScene/Background/Background3_Color.png');
            this.load.image('Background4_Color', DroneWars.GameCanvas.route + 'GameScene/Background/Background4_Color.png');
            this.load.image('Background5_Color', DroneWars.GameCanvas.route + 'GameScene/Background/Background5_Color.png');
            this.load.text('levelsConfig', 'config/levels.json');
        };
        LevelScene.prototype.create = function() {
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'Background1_Color');
            this.wrapper.add(this.background);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('accept', 0, 0.5);
            this.soundFX.addMarker('cancel', 1, 0.6);
            this.soundFX.addMarker('mouseover', 2, 0.4);
            this.soundFX.addMarker('gobattle', 2.5, 1.4);
            if (this.preloadWrapper !== null)
                this.preloadWrapper.visible = false;
            this.backgroundLevel = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'Background1');
            this.backgroundLevel.anchor.setTo(0.5, 0.5);
            this.backgroundLevel.alpha = 0.3;
            this.wrapper.add(this.backgroundLevel);
            var indexPageString = GameData.getItem("indexPage");
            if (indexPageString === null)
                indexPageString = "0";
            this.indexPage = parseInt(indexPageString);
            this.jsonLevels = JSON.parse(this.cache.getText('levelsConfig'));
            //Left Button
            this.leftButton = this.add.button(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.07, DroneWars.GameCanvas.inner.centerY, 'LevelScene', this.onLeft, this, 'Back.png', 'Back.png', 'BackHold.png');
            this.leftButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.leftButton);
            this.leftButton.scale.setTo(0, 0);
            this.add.tween(this.leftButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 250);
            this.leftButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.leftButton);
                this.tweens.removeFrom(this.leftButton.scale);
                this.add.tween(this.leftButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.leftButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.leftButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.leftButton);
                this.tweens.removeFrom(this.leftButton.scale);
                this.add.tween(this.leftButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.leftButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Right Button
            this.rightButton = this.add.button(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.07, DroneWars.GameCanvas.inner.centerY, 'LevelScene', this.onRight, this, 'Next.png', 'Next.png', 'NextHold.png');
            this.rightButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.rightButton);
            this.rightButton.scale.setTo(0, 0);
            this.add.tween(this.rightButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 250);
            this.rightButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.rightButton);
                this.tweens.removeFrom(this.rightButton.scale);
                this.add.tween(this.rightButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.rightButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.rightButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.rightButton);
                this.tweens.removeFrom(this.rightButton.scale);
                this.add.tween(this.rightButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.rightButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Home
            this.homeButton = this.add.button(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.1, DroneWars.GameCanvas.inner.bottom - DroneWars.GameCanvas.defaultHeight * 0.1, 'LevelScene', this.onHome, this, 'Home.png', 'Home.png', 'HomeHold.png');
            this.homeButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.homeButton);
            this.homeButton.scale.setTo(0, 0);
            this.add.tween(this.homeButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 300);
            this.homeButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.homeButton);
                this.tweens.removeFrom(this.homeButton.scale);
                this.add.tween(this.homeButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.homeButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.homeButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.homeButton);
                this.tweens.removeFrom(this.homeButton.scale);
                this.add.tween(this.homeButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.homeButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //Shop
            this.shopButton = this.add.button(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.1, DroneWars.GameCanvas.inner.bottom - DroneWars.GameCanvas.defaultHeight * 0.1, 'LevelScene', this.onShop, this, 'Shop.png', 'Shop.png', 'ShopHold.png');
            this.shopButton.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.shopButton);
            this.shopButton.scale.setTo(0, 0);
            this.add.tween(this.shopButton.scale).to({
                x: 0.9,
                y: 0.9
            }, 600, Phaser.Easing.Elastic.Out, true, 300);
            this.shopButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.shopButton);
                this.tweens.removeFrom(this.shopButton.scale);
                this.add.tween(this.shopButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.shopButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.shopButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.shopButton);
                this.tweens.removeFrom(this.shopButton.scale);
                this.add.tween(this.shopButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.shopButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            var selectedDroneIndex = GameData.getItem("selectedDroneIndex");
            if (selectedDroneIndex === null)
                selectedDroneIndex = "0";
            var imageDrone = this.add.sprite(0, 0, 'LevelScene', 'Small_Drone' + (parseInt(selectedDroneIndex) + 1).toString() + '.png');
            imageDrone.anchor.setTo(0.5, 0.5);
            this.shopButton.addChild(imageDrone);
            //Money & Stars
            var starIcon = this.add.sprite(DroneWars.GameCanvas.inner.left + DroneWars.GameCanvas.defaultWidth * 0.035, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.035, 'MenuScene', 'Star.png');
            starIcon.anchor.setTo(0, 0.5);
            this.wrapper.add(starIcon);
            var stars = GameData.getItem("stars");
            if (stars === null)
                stars = "0";
            this.starsText = this.add.bitmapText(starIcon.x + starIcon.width * 1.2, starIcon.y + starIcon.height * 0.05, 'MenuFont', stars, 44);
            this.starsText.anchor.setTo(0, 0.5);
            this.wrapper.add(this.starsText);
            var moneyIcon = this.add.sprite(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.035, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.035, 'MenuScene', 'MoneyIcon.png');
            moneyIcon.anchor.setTo(1, 0.5);
            this.wrapper.add(moneyIcon);
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            this.coinsText = this.add.bitmapText(moneyIcon.x - moneyIcon.width * 1.2, moneyIcon.y + moneyIcon.height * 0.05, 'MenuFont', coins, 44);
            this.coinsText.anchor.setTo(1, 0.5);
            this.wrapper.add(this.coinsText);
            //Levels
            this.title = this.add.bitmapText(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultHeight * 0.1, 'Font_Riffic42', Locale.translate('World 1'), 42);
            this.title.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.title);
            this.pagesBullets = [];
            var space = DroneWars.GameCanvas.defaultWidth * 0.01;
            var totalPages = Math.floor(30 / 6);
            var pageSprite;
            for (var i = 0; i < totalPages; i++) {
                pageSprite = this.add.sprite(DroneWars.GameCanvas.inner.centerX, this.shopButton.position.y, 'LevelScene', 'BulletEmpty.png');
                pageSprite.anchor.setTo(0.5, 0.5);
                this.wrapper.add(pageSprite);
                this.pagesBullets.push(pageSprite);
            }
            var initialX = DroneWars.GameCanvas.inner.centerX - (pageSprite.width * totalPages + (totalPages - 1) * space) * 0.5 + pageSprite.width * 0.5;
            for (var i = 0; i < totalPages; i++) {
                this.pagesBullets[i].position.x = initialX + i * (space + pageSprite.width);
            }
            //Levels Buttons
            this.pagesLevels = [];
            this.pageStars = [];
            this.pageNumbers = [];
            space = DroneWars.GameCanvas.defaultWidth * 0.18;
            var pageButton;
            var star;
            var levelText;
            for (var i = 0; i < 6; i++) {
                pageButton = this.add.button(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'LevelScene', this.onLevel, this, 'Level.png', 'Level.png', 'LevelHold.png');
                pageButton.anchor.setTo(0.5, 0.5);
                this.wrapper.add(pageButton);
                pageButton.onInputOver.add(function(pageButton) {
                    this.soundFX.play('mouseover');
                    this.tweens.removeFrom(pageButton);
                    this.tweens.removeFrom(pageButton.scale);
                    this.add.tween(pageButton.scale).to({
                        x: 1,
                        y: 1
                    }, 300, Phaser.Easing.Elastic.Out, true);
                    this.add.tween(pageButton).to({
                        rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                    }, 50, Phaser.Easing.Linear.None, true);
                }, this);
                pageButton.onInputOut.add(function(pageButton) {
                    this.tweens.removeFrom(pageButton);
                    this.tweens.removeFrom(pageButton.scale);
                    this.add.tween(pageButton.scale).to({
                        x: 0.9,
                        y: 0.9
                    }, 100, Phaser.Easing.Linear.None, true);
                    this.add.tween(pageButton).to({
                        rotation: 0
                    }, 100, Phaser.Easing.Linear.None, true);
                }, this);
                levelText = this.add.bitmapText(0, -pageButton.height * 0.05, 'Font_Riffic62', '0', 62);
                levelText.anchor.setTo(0.5, 0.5);
                pageButton.addChild(levelText);
                this.pageNumbers.push(levelText);
                for (var j = 0; j < 3; j++) {
                    star = this.add.sprite(-pageButton.width * 0.22 + j * pageButton.width * 0.22, pageButton.height * 0.2 + pageButton.height * 0.05 * (j % 2), 'LevelScene', 'SmallStarEmpty.png');
                    star.anchor.setTo(0.5, 0.5);
                    pageButton.addChild(star);
                    this.pageStars.push(star);
                }
                pageButton.scale.setTo(0, 0);
                this.pagesLevels.push(pageButton);
            }
            initialX = DroneWars.GameCanvas.inner.centerX - (pageButton.width * 3 + (3 - 1) * space) * 0.5 + pageButton.width * 0.5;
            var initialY = DroneWars.GameCanvas.inner.centerY - (pageButton.height * 2 + (2 - 1) * space) * 0.5 + pageButton.height * 0.5;
            for (var i = 0; i < 6; i++) {
                this.pagesLevels[i].position.x = initialX + (i % 3) * (space + pageButton.width);
                this.pagesLevels[i].position.y = initialY + Math.floor(i / 3) * (space + pageButton.width);
            }
            this.onPageSelected(this.indexPage);
            this.state = LevelState.MAIN;
            /*
            Selection
            */
            this.selectionStars = [];
            this.selectionDifficulties = [];
            this.selectionTexts = [];
            this.selectionGroup = this.add.group();
            this.selectionGroup.position.setTo(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY);
            this.selectionGroup.visible = false;
            this.wrapper.add(this.selectionGroup);
            var selectionBackground = this.add.sprite(0, 0, 'LevelScene', 'LevelInfo.png');
            selectionBackground.anchor.setTo(0.5, 0.5);
            this.selectionGroup.add(selectionBackground);
            this.closeButton = this.add.button(selectionBackground.position.x + selectionBackground.width * 0.45, selectionBackground.position.y - selectionBackground.height * 0.45, 'MenuScene', this.onCloseLevel, this, 'Close.png', 'Close.png', 'CloseHold.png');
            this.closeButton.anchor.setTo(0.5, 0.5);
            this.closeButton.scale.setTo(0.9, 0.9);
            this.selectionGroup.add(this.closeButton);
            this.closeButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.closeButton);
                this.tweens.removeFrom(this.closeButton.scale);
                this.add.tween(this.closeButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.add.tween(this.closeButton).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.closeButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.closeButton);
                this.tweens.removeFrom(this.closeButton.scale);
                this.add.tween(this.closeButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(this.closeButton).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            this.selectionTitle = this.add.bitmapText(0, -selectionBackground.height * 0.39, 'Font_Riffic42', Locale.translate('Level') + ' 1-1', 42);
            this.selectionTitle.anchor.setTo(0.5, 0.5);
            this.selectionGroup.add(this.selectionTitle);
            var star;
            for (var j = 0; j < 3; j++) {
                star = this.add.sprite(selectionBackground.width * 0.105 + j * selectionBackground.width * 0.13, -selectionBackground.height * 0.26, 'LevelScene', 'StarEmpty.png');
                star.anchor.setTo(0.5, 0.5);
                this.selectionGroup.add(star);
                this.selectionStars.push(star);
            }
            var rewardsText = this.add.bitmapText(selectionBackground.width * 0.235, -selectionBackground.height * 0.1, 'Font_Riffic42', Locale.translate('Rewards'), 42);
            rewardsText.anchor.setTo(0.5, 0.5);
            this.selectionGroup.add(rewardsText);
            var coinsRewardSprite = this.add.sprite(selectionBackground.width * 0.095, selectionBackground.height * 0.0, 'MenuScene', 'MoneyIcon.png');
            coinsRewardSprite.anchor.setTo(0.5, 0.5);
            this.selectionGroup.add(coinsRewardSprite);
            this.coinsRewardsText = this.add.bitmapText(selectionBackground.width * 0.15, selectionBackground.height * 0.0, 'Font_Riffic42', '0', 34);
            this.coinsRewardsText.anchor.setTo(0, 0.5);
            this.selectionGroup.add(this.coinsRewardsText);
            this.starReward = this.add.group();
            this.selectionGroup.add(this.starReward);
            var starRewardSprite = this.add.sprite(selectionBackground.width * 0.095, selectionBackground.height * 0.1, 'LevelScene', 'SmallStar.png');
            starRewardSprite.anchor.setTo(0.5, 0.5);
            this.starReward.add(starRewardSprite);
            var starRewardsText = this.add.bitmapText(selectionBackground.width * 0.15, selectionBackground.height * 0.1, 'Font_Riffic42', '1', 34);
            starRewardsText.anchor.setTo(0, 0.5);
            this.starReward.add(starRewardsText);
            //Difficulty Buttons
            space = DroneWars.GameCanvas.defaultHeight * 0.12;
            var difficultyButton;
            var difficultyText;
            for (var i = 0; i < 3; i++) {
                difficultyButton = this.add.button(-selectionBackground.width * 0.25, -selectionBackground.height * 0.24 + space * i, 'LevelScene', this.onDifficulty, this, 'LevelButton.png', 'LevelButton.png', 'LevelButton.png');
                difficultyButton.anchor.setTo(0.5, 0.5);
                this.selectionGroup.add(difficultyButton);
                difficultyButton.onInputOver.add(function(difficultyButton) {
                    this.soundFX.play('mouseover');
                    this.tweens.removeFrom(difficultyButton.scale);
                    this.add.tween(difficultyButton.scale).to({
                        x: 1,
                        y: 1
                    }, 300, Phaser.Easing.Elastic.Out, true);
                }, this);
                difficultyButton.onInputOut.add(function(difficultyButton) {
                    this.tweens.removeFrom(difficultyButton.scale);
                    this.add.tween(difficultyButton.scale).to({
                        x: 0.9,
                        y: 0.9
                    }, 100, Phaser.Easing.Linear.None, true);
                }, this);
                difficultyText = this.add.bitmapText(0, -difficultyButton.height * 0.03, 'Font_Riffic42', 'Easy', 42);
                if (i == 0)
                    difficultyText.setText(Locale.translate("Easy"));
                else if (i == 1)
                    difficultyText.setText(Locale.translate("Normal"));
                else if (i == 2)
                    difficultyText.setText(Locale.translate("Hard"));
                difficultyText.anchor.setTo(0.5, 0.5);
                difficultyButton.addChild(difficultyText);
                this.selectionTexts.push(difficultyText);
                this.selectionDifficulties.push(difficultyButton);
            }
            this.difficultySelected = 0;
            this.battleButton = this.add.button(0, selectionBackground.height * 0.35, 'LevelScene', this.goBattle, this, 'StartBattle2.png', 'StartBattle1.png', 'StartBattle2.png', 'StartBattle1.png');
            this.battleButton.anchor.setTo(0.5, 0.5);
            this.battleButton.scale.setTo(0.9, 0.9);
            this.selectionGroup.add(this.battleButton);
            this.battleButton.onInputOver.add(function() {
                this.soundFX.play('mouseover');
                this.tweens.removeFrom(this.battleButton.scale);
                this.add.tween(this.battleButton.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
            }, this);
            this.battleButton.onInputOut.add(function() {
                this.tweens.removeFrom(this.battleButton.scale);
                this.add.tween(this.battleButton.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            var battleText = this.add.bitmapText(0, 0, 'Font_Riffic42', Locale.translate('Go Battle!'), 42);;
            battleText.anchor.setTo(0.5, 0.5);
            this.battleButton.addChild(battleText);
        };
        LevelScene.prototype.resized = function(manager, bounds) {
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.background.x = DroneWars.GameCanvas.outer.x;
            this.background.y = DroneWars.GameCanvas.outer.y;
            this.background.width = DroneWars.GameCanvas.outer.width;
            this.background.height = DroneWars.GameCanvas.outer.height;
        };
        LevelScene.prototype.onPageSelected = function(index) {
            this.indexPage = index;
            GameData.setItem("indexPage", index.toString());
            this.title.setText(Locale.translate("World " + (this.indexPage + 1).toString()));
            var textureKey = index + 1;
            this.backgroundLevel.loadTexture("Background" + textureKey.toString());
            this.background.loadTexture("Background" + textureKey.toString() + "_Color");
            for (var i = 0; i < this.pagesBullets.length; i++) {
                if (index == i)
                    this.pagesBullets[i].frameName = "Bullet.png";
                else
                    this.pagesBullets[i].frameName = "BulletEmpty.png";
            }
            var unlockedLevels = GameData.getItem("unlockedLevels");
            if (unlockedLevels === null)
                unlockedLevels = "1";
            for (var i = 0; i < this.pagesLevels.length; i++) {
                if (index * 6 + i < parseInt(unlockedLevels)) {
                    this.pagesLevels[i].setFrames("Level.png", "Level.png", "LevelHold.png", "Level.png");
                    this.pagesLevels[i].inputEnabled = true;
                    this.pagesLevels[i].input.useHandCursor = true;
                    var levelNumber = this.indexPage * 6 + i;
                    this.pageNumbers[i].setText((i + 1).toString());
                    this.pageNumbers[i].visible = true;
                    var unlockedStars = GameData.getItem("unlockedStars" + levelNumber.toString());
                    if (unlockedStars === null)
                        unlockedStars = "0";
                    for (var j = 0; j < 3; j++) {
                        this.pageStars[j + i * 3].visible = true;
                        if (j < parseInt(unlockedStars)) {
                            this.pageStars[j + i * 3].frameName = "SmallStar.png";
                        } else {
                            this.pageStars[j + i * 3].frameName = "SmallStarEmpty.png";
                        }
                    }
                } else {
                    this.pagesLevels[i].setFrames("LevelLocked.png", "LevelLocked.png", "LevelLocked.png", "LevelLocked.png");
                    this.pagesLevels[i].inputEnabled = false;
                    this.pageNumbers[i].visible = false;
                    for (var j = 0; j < 3; j++) {
                        this.pageStars[j + i * 3].visible = false;
                    }
                }
                this.tweens.removeFrom(this.pagesLevels[i]);
                this.tweens.removeFrom(this.pagesLevels[i].scale);
                this.pagesLevels[i].rotation = 0;
                this.pagesLevels[i].scale.setTo(0, 0);
                this.add.tween(this.pagesLevels[i].scale).to({
                    x: 0.9,
                    y: 0.9
                }, 600, Phaser.Easing.Elastic.Out, true, this.game.rnd.integerInRange(0, 200));
            }
            if (index == 0) {
                this.tweens.removeFrom(this.leftButton);
                this.tweens.removeFrom(this.leftButton.scale);
                this.leftButton.rotation = 0;
                this.leftButton.scale.setTo(0.9, 0.9);
                this.leftButton.visible = false;
                this.rightButton.visible = true;
            } else if (index == this.pagesBullets.length - 1) {
                this.leftButton.visible = true;
                this.tweens.removeFrom(this.rightButton);
                this.tweens.removeFrom(this.rightButton.scale);
                this.rightButton.rotation = 0;
                this.rightButton.scale.setTo(0.9, 0.9);
                this.rightButton.visible = false;
            } else {
                this.leftButton.visible = true;
                this.rightButton.visible = true;
            }
        };
        LevelScene.prototype.onLeft = function() {
            this.soundFX.play('accept');
            this.onPageSelected(this.indexPage - 1);
        };
        LevelScene.prototype.onRight = function() {
            this.soundFX.play('accept');
            this.onPageSelected(this.indexPage + 1);
        };
        LevelScene.prototype.onShop = function() {
            this.soundFX.play('accept');
            this.game.state.start('ShopScene', true, false, "fromLevels");
        };
        LevelScene.prototype.onHome = function() {
            this.soundFX.play('accept');
            this.game.state.start('MenuScene', true, false);
        };
        LevelScene.prototype.onLevel = function(pageButton) {
            this.soundFX.play('accept');
            for (var i = 0; i < this.pagesLevels.length; i++) {
                this.tweens.removeFrom(this.pagesLevels[i]);
                this.tweens.removeFrom(this.pagesLevels[i].scale);
                this.pagesLevels[i].scale.setTo(0.9, 0.9);
                this.pagesLevels[i].rotation = 0;
                this.pagesLevels[i].inputEnabled = false;
            }
            this.leftButton.inputEnabled = false;
            this.rightButton.inputEnabled = false;
            this.closeButton.rotation = 0;
            this.closeButton.scale.setTo(0.9, 0.9);
            var text = pageButton.getChildAt(0);
            var level = parseInt(text.text);
            this.levelSelected = level;
            var unlockedStars = GameData.getItem("unlockedStars" + (level - 1 + this.indexPage * 6).toString());
            if (unlockedStars === null)
                unlockedStars = "0";
            this.difficultySelected = Math.min(2, parseInt(unlockedStars));
            for (var j = 0; j < 3; j++) {
                if (j < parseInt(unlockedStars)) {
                    this.selectionStars[j].frameName = "Star.png";
                } else {
                    this.selectionStars[j].frameName = "StarEmpty.png";
                }
                if (j <= parseInt(unlockedStars)) {
                    if (this.difficultySelected === j)
                        this.selectionDifficulties[j].setFrames("LevelButton.png", "LevelButton.png", "LevelButton.png", "LevelButton.png");
                    else
                        this.selectionDifficulties[j].setFrames("LevelButtonHold.png", "LevelButtonHold.png", "LevelButtonHold.png", "LevelButtonHold.png");
                    this.selectionDifficulties[j].inputEnabled = true;
                    this.selectionDifficulties[j].input.useHandCursor = true;
                    this.selectionTexts[j].visible = true;
                } else {
                    this.selectionDifficulties[j].setFrames("LevelButtonBlock.png", "LevelButtonBlock.png", "LevelButtonBlock.png", "LevelButtonBlock.png");
                    this.selectionDifficulties[j].inputEnabled = false;
                    this.selectionTexts[j].visible = false;
                }
            }
            if (parseInt(unlockedStars) > this.difficultySelected) {
                this.starReward.visible = false;
            }
            if (this.difficultySelected == 0) {
                var coins = parseInt(this.jsonLevels.levels[level - 1].rewardEasy);
                this.coinsRewardsText.setText(coins.toString());
            } else if (this.difficultySelected == 1) {
                var coins = parseInt(this.jsonLevels.levels[level - 1].rewardNormal);
                this.coinsRewardsText.setText(coins.toString());
            } else if (this.difficultySelected == 2) {
                var coins = parseInt(this.jsonLevels.levels[level - 1].rewardHard);
                this.coinsRewardsText.setText(coins.toString());
            }
            this.selectionTitle.setText(Locale.translate("Level") + " " + (this.indexPage + 1).toString() + " - " + level);
            this.selectionGroup.scale.setTo(0.9, 0.9);
            this.selectionGroup.visible = true;
            this.add.tween(this.selectionGroup.scale).to({
                x: 1.0,
                y: 1.0
            }, 600, Phaser.Easing.Elastic.Out, true);
            this.state = LevelState.LEVELSELECTED;
        };
        LevelScene.prototype.onCloseLevel = function() {
            this.soundFX.play('cancel');
            for (var i = 0; i < this.pagesLevels.length; i++) {
                this.tweens.removeFrom(this.pagesLevels[i]);
                this.tweens.removeFrom(this.pagesLevels[i].scale);
                this.pagesLevels[i].scale.setTo(0.9, 0.9);
                this.pagesLevels[i].rotation = 0;
                if (this.pagesLevels[i].frameName === 'LevelButtonBlock.png') {
                    this.pagesLevels[i].inputEnabled = false;
                } else {
                    this.pagesLevels[i].inputEnabled = true;
                    this.pagesLevels[i].input.useHandCursor = true;
                }
            }
            this.leftButton.inputEnabled = true;
            this.leftButton.input.useHandCursor = true;
            this.rightButton.inputEnabled = true;
            this.rightButton.input.useHandCursor = true;
            this.selectionGroup.visible = false;
            this.state = LevelState.MAIN;
        };
        LevelScene.prototype.onDifficulty = function(button) {
            this.soundFX.play('accept');
            var text = button.getChildAt(0);
            var difficulty = text.text;
            if (difficulty === Locale.translate("Easy")) {
                this.difficultySelected = 0;
            } else if (difficulty === Locale.translate("Normal")) {
                this.difficultySelected = 1;
            } else if (difficulty === Locale.translate("Hard")) {
                this.difficultySelected = 2;
            }
            if (this.difficultySelected == 0) {
                var coins = parseInt(this.jsonLevels.levels[this.levelSelected - 1].rewardEasy);
                this.coinsRewardsText.setText(coins.toString());
            } else if (this.difficultySelected == 1) {
                var coins = parseInt(this.jsonLevels.levels[this.levelSelected - 1].rewardNormal);
                this.coinsRewardsText.setText(coins.toString());
            } else if (this.difficultySelected == 2) {
                var coins = parseInt(this.jsonLevels.levels[this.levelSelected - 1].rewardHard);
                this.coinsRewardsText.setText(coins.toString());
            }
            var unlockedStars = GameData.getItem("unlockedStars" + (this.levelSelected - 1).toString());
            if (unlockedStars === null)
                unlockedStars = "0";
            if (parseInt(unlockedStars) === this.difficultySelected) {
                this.starReward.visible = true;
            } else {
                this.starReward.visible = false;
            }
            for (var j = 0; j < 3; j++) {
                if (this.selectionTexts[j].visible) {
                    if (this.difficultySelected === j)
                        this.selectionDifficulties[j].setFrames("LevelButton.png", "LevelButton.png", "LevelButton.png", "LevelButton.png");
                    else
                        this.selectionDifficulties[j].setFrames("LevelButtonHold.png", "LevelButtonHold.png", "LevelButtonHold.png", "LevelButtonHold.png");
                }
            }
        };
        LevelScene.prototype.goBattle = function() {
            this.game.sound.removeByKey('menuMusic');
            this.soundFX.play('gobattle');
            var music = this.game.add.audio('ingameMusic');
            music.loop = true;
            music.play();
            this.game.state.start('InGame', true, false, this.levelSelected, this.indexPage + 1, this.difficultySelected);
        };
        LevelScene.prototype.update = function() {};
        return LevelScene;
    }(Phaser.State));
    DroneWars.LevelScene = LevelScene;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(FinishHUDState) {
        FinishHUDState[FinishHUDState["IDLE"] = 0] = "IDLE";
        FinishHUDState[FinishHUDState["WAITING"] = 1] = "WAITING";
        FinishHUDState[FinishHUDState["SHOW"] = 2] = "SHOW";
    })(DroneWars.FinishHUDState || (DroneWars.FinishHUDState = {}));
    var FinishHUDState = DroneWars.FinishHUDState;
    (function(FinishHUDType) {
        FinishHUDType[FinishHUDType["WIN"] = 0] = "WIN";
        FinishHUDType[FinishHUDType["LOSE"] = 1] = "LOSE";
    })(DroneWars.FinishHUDType || (DroneWars.FinishHUDType = {}));
    var FinishHUDType = DroneWars.FinishHUDType;
    var FinishHUD = (function(_super) {
        __extends(FinishHUD, _super);

        function FinishHUD(game) {
            _super.call(this, game);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('accept', 0, 0.5);
            this.soundFX.addMarker('mouseover', 2, 0.4);
            this.soundFX.addMarker('star', 20.5, 1);
            this.jsonLevels = JSON.parse(game.cache.getText('levelsConfig'));
            this.backgroundLose = game.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'BackgroundRed');
            this.backgroundLose.alpha = 0.3;
            this.add(this.backgroundLose);
            this.back_emitter = game.add.emitter(DroneWars.GameCanvas.defaultWidth * 0.5, -32, 150);
            this.back_emitter.makeParticles('confetiPurple');
            this.back_emitter.maxParticleScale = 0.5;
            this.back_emitter.minParticleScale = 0.3;
            this.back_emitter.setYSpeed(80, 150);
            this.back_emitter.setXSpeed(-50, 50);
            this.back_emitter.gravity = 0;
            this.back_emitter.width = DroneWars.GameCanvas.defaultWidth;
            this.back_emitter.minRotation = 30;
            this.back_emitter.maxRotation = 60;
            this.mid_emitter = game.add.emitter(DroneWars.GameCanvas.defaultWidth * 0.5, -32, 80);
            this.mid_emitter.makeParticles('confetiBlue');
            this.mid_emitter.maxParticleScale = 0.8;
            this.mid_emitter.minParticleScale = 0.6;
            this.mid_emitter.setYSpeed(100, 250);
            this.mid_emitter.setXSpeed(-50, 50);
            this.mid_emitter.gravity = 0;
            this.mid_emitter.width = DroneWars.GameCanvas.defaultWidth;
            this.mid_emitter.minRotation = 30;
            this.mid_emitter.maxRotation = 60;
            this.front_emitter = game.add.emitter(DroneWars.GameCanvas.defaultWidth * 0.5, -32, 40);
            this.front_emitter.makeParticles('confetiGreen');
            this.front_emitter.maxParticleScale = 1.2;
            this.front_emitter.minParticleScale = 0.9;
            this.front_emitter.setYSpeed(200, 300);
            this.front_emitter.setXSpeed(-50, 50);
            this.front_emitter.gravity = 0;
            this.front_emitter.width = DroneWars.GameCanvas.defaultWidth;
            this.front_emitter.minRotation = 30;
            this.front_emitter.maxRotation = 60;
            this.add(this.back_emitter);
            this.add(this.mid_emitter);
            this.add(this.front_emitter);
            this.background = game.add.sprite(DroneWars.GameCanvas.defaultWidth * 0.5, DroneWars.GameCanvas.defaultHeight * 0.5, 'GameScene', 'Hud_EndScene.png');
            this.background.anchor.setTo(0.5, 0.5);
            this.add(this.background);
            this.title = game.add.bitmapText(0, -this.background.height * 0.38, 'MenuFont_52', Locale.translate('Victory!'), 52);
            this.title.anchor.setTo(0.5, 0.5);
            this.background.addChild(this.title);
            this.level = game.add.bitmapText(0, -this.background.height * 0.24, 'Font_Riffic42', Locale.translate('Level') + ' 1-1', 42);
            this.level.anchor.setTo(0.5, 0.5);
            this.background.addChild(this.level);
            //Stats Group
            this.statsGroup = game.add.group();
            this.background.addChild(this.statsGroup);
            var starBackground = game.add.sprite(-this.background.width * 0.3, -this.background.height * 0.05, 'GameScene', 'Hud_BigStarOff.png');
            starBackground.anchor.setTo(0.5, 0.5);
            this.background.addChild(starBackground);
            this.starBig = game.add.sprite(starBackground.position.x, starBackground.position.y, 'GameScene', 'Hud_BigStar.png');
            this.starBig.anchor.setTo(0.5, 0.5);
            this.background.addChild(this.starBig);
            this.difficultyText = game.add.bitmapText(starBackground.position.x + starBackground.width * 0.6, starBackground.position.y + starBackground.height * 0.05, 'Font_Riffic42', Locale.translate('Easy'), 42);
            this.difficultyText.anchor.setTo(0, 0.5);
            this.background.addChild(this.difficultyText);
            var coinsIcon = game.add.sprite(this.background.width * 0.1, -this.background.height * 0.05, 'MenuScene', 'MoneyIcon.png');
            coinsIcon.anchor.setTo(0.5, 0.5);
            this.background.addChild(coinsIcon);
            this.coinsText = game.add.bitmapText(coinsIcon.position.x + coinsIcon.width * 0.65, coinsIcon.position.y, 'Font_Riffic42', '400', 42);
            this.coinsText.anchor.setTo(0, 0.5);
            this.background.addChild(this.coinsText);
            this.bonusText = game.add.bitmapText(coinsIcon.position.x + coinsIcon.width * 0.65, coinsIcon.position.y, 'Font_Riffic42', '+200', 42);
            this.bonusText.anchor.setTo(0, 0.5);
            this.background.addChild(this.bonusText);
            //level button
            this.levelButton = game.add.button(-this.background.width * 0.22, this.background.height * 0.27, 'GameScene', this.onLevelButton, this, 'Hud_Level.png', 'Hud_Level.png', 'Hud_LevelHold.png');
            this.levelButton.anchor.setTo(0.5, 0.5);
            this.background.addChild(this.levelButton);
            this.levelButton.scale.setTo(0.9, 0.9);
            this.levelButton.onInputOver.add(function(button) {
                this.soundFX.play('mouseover');
                this.game.tweens.removeFrom(button);
                this.game.tweens.removeFrom(button.scale);
                this.game.add.tween(button.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.game.add.tween(button).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.levelButton.onInputOut.add(function(button) {
                this.game.tweens.removeFrom(button);
                this.game.tweens.removeFrom(button.scale);
                this.game.add.tween(button.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.game.add.tween(button).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            //play button
            this.playButton = game.add.button(this.background.width * 0.22, this.background.height * 0.27, 'GameScene', this.onPlayButton, this, 'Hud_NextLevel.png', 'Hud_NextLevel.png', 'Hud_NextLevelHold.png');
            this.playButton.anchor.setTo(0.5, 0.5);
            this.background.addChild(this.playButton);
            this.playButton.scale.setTo(0.9, 0.9);
            this.playButton.onInputOver.add(function(button) {
                this.soundFX.play('mouseover');
                this.game.tweens.removeFrom(button);
                this.game.tweens.removeFrom(button.scale);
                this.game.add.tween(button.scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Elastic.Out, true);
                this.game.add.tween(button).to({
                    rotation: this.game.rnd.realInRange(-Math.PI * 0.08, Math.PI * 0.08)
                }, 50, Phaser.Easing.Linear.None, true);
            }, this);
            this.playButton.onInputOut.add(function(button) {
                this.game.tweens.removeFrom(button);
                this.game.tweens.removeFrom(button.scale);
                this.game.add.tween(button.scale).to({
                    x: 0.9,
                    y: 0.9
                }, 100, Phaser.Easing.Linear.None, true);
                this.game.add.tween(button).to({
                    rotation: 0
                }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            game.add.existing(this);
            this.state = FinishHUDState.IDLE;
            this.visible = false;
        }
        FinishHUD.prototype.showFinish = function(type, levelNumber, worldNumber, difficultyNumber, delay) {
            this.levelNumber = levelNumber;
            this.worldNumber = worldNumber;
            this.difficultyNumber = difficultyNumber;
            this.type = type;
            var difficultyText = Locale.translate("Easy");
            if (this.difficultyNumber == 1)
                difficultyText = Locale.translate("Normal");
            else if (this.difficultyNumber == 2)
                difficultyText = Locale.translate("Hard");
            this.difficultyText.setText(difficultyText);
            this.level.setText(Locale.translate("Level") + " " + this.worldNumber + "-" + this.levelNumber);
            var levelIndex = (this.worldNumber - 1) * 6 + (this.levelNumber - 1);
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            this.coinsText.setText(coins);
            this.currentCoins = parseFloat(coins);
            if (this.difficultyNumber == 0) {
                var coinsNew = parseInt(this.jsonLevels.levels[levelIndex].rewardEasy);
                this.bonusText.setText('+' + coinsNew.toString());
                this.finalCoins = this.currentCoins + coinsNew;
            } else if (this.difficultyNumber == 1) {
                var coinsNew = parseInt(this.jsonLevels.levels[levelIndex].rewardNormal);
                this.bonusText.setText('+' + coinsNew.toString());
                this.finalCoins = this.currentCoins + coinsNew;
            } else if (this.difficultyNumber == 2) {
                var coinsNew = parseInt(this.jsonLevels.levels[levelIndex].rewardHard);
                this.bonusText.setText('+' + coinsNew.toString());
                this.finalCoins = this.currentCoins + coinsNew;
            }
            this.bonusText.visible = false;
            this.velocityCoins = (this.finalCoins - this.currentCoins) / 1.5;
            GameData.setItem("coins", this.finalCoins.toString());
            if (type === FinishHUDType.LOSE) {
                this.game.sound.removeByKey('ingameMusic');
                var soundfinish = this.game.add.audio('gameoverSound');
                soundfinish.play();
                this.title.setText(Locale.translate('Game Over'));
                this.playButton.setFrames('Hud_Restart.png', 'Hud_Restart.png', 'Hud_RestartHold.png');
                this.backgroundLose.alpha = 0;
                this.game.add.tween(this.backgroundLose).to({
                    alpha: 0.3
                }, 700, Phaser.Easing.Sinusoidal.Out, true);
                var unlockedStars = GameData.getItem("unlockedStars" + levelIndex.toString());
                if (unlockedStars === null)
                    unlockedStars = "0";
                //Ask if is a new difficulty clear stage
                if (this.difficultyNumber >= parseInt(unlockedStars)) {
                    this.starBig.visible = false;
                }
            } else if (type === FinishHUDType.WIN) {
                this.game.sound.removeByKey('ingameMusic');
                var soundfinish = this.game.add.audio('winSound');
                soundfinish.play();
                this.back_emitter.start(false, 14000, 20);
                this.mid_emitter.start(false, 12000, 40);
                this.front_emitter.start(false, 6000, 1000);
                var unlockedStars = GameData.getItem("unlockedStars" + levelIndex.toString());
                if (unlockedStars === null)
                    unlockedStars = "0";
                //Ask if is a new difficulty clear stage
                if (this.difficultyNumber >= parseInt(unlockedStars)) {
                    this.starBig.visible = false;
                    var stars = GameData.getItem("stars");
                    if (stars === null)
                        stars = "0";
                    GameData.setItem("stars", (parseInt(stars) + 1).toString());
                    unlockedStars = (this.difficultyNumber + 1).toString();
                    GameData.setItem("unlockedStars" + levelIndex.toString(), unlockedStars);
                    var unlockedLevels = GameData.getItem("unlockedLevels");
                    if (unlockedLevels === null)
                        unlockedLevels = "1";
                    if (levelIndex + 1 >= parseInt(unlockedLevels)) {
                        GameData.setItem("unlockedLevels", (parseInt(unlockedLevels) + 1).toString());
                    }
                }
                this.backgroundLose.alpha = 0;
                this.title.setText(Locale.translate('Victory!'));
                this.playButton.setFrames('Hud_NextLevel.png', 'Hud_NextLevel.png', 'Hud_NextLevelHold.png');
            }
            this.timeElapsed = 0;
            this.delay = delay;
            this.background.position.y = -DroneWars.GameCanvas.defaultHeight * 0.5 - (DroneWars.GameCanvas.outer.height - DroneWars.GameCanvas.inner.height) * 0.5;
            this.visible = true;
            this.state = FinishHUDState.WAITING;
        };
        FinishHUD.prototype.onLevelButton = function() {
            this.soundFX.play('accept');
            this.game.sound.removeByKey('ingameMusic');
            var music = this.game.add.audio('menuMusic');
            music.loop = true;
            music.play();
            this.game.state.start('LevelScene', true, false);
        };
        FinishHUD.prototype.onPlayButton = function() {
            this.soundFX.play('accept');
            var music = this.game.add.audio('ingameMusic');
            music.loop = true;
            music.play();
            if (this.type === FinishHUDType.WIN) {
                this.levelNumber += 1;
                if (this.levelNumber === 7) {
                    this.levelNumber = 1;
                    this.worldNumber += 1;
                    if (this.worldNumber === 6) {
                        this.levelNumber = 6;
                        this.worldNumber = 5;
                    }
                }
                var levelIndex = (this.worldNumber - 1) * 6 + (this.levelNumber - 1);
                var unlockedStars = GameData.getItem("unlockedStars" + levelIndex.toString());
                if (unlockedStars === null)
                    unlockedStars = "0";
                this.game.state.start('InGame', true, false, this.levelNumber, this.worldNumber, Math.min(parseInt(unlockedStars), 2));
            } else if (this.type === FinishHUDType.LOSE) {
                this.game.state.start('InGame', true, false, this.levelNumber, this.worldNumber, this.difficultyNumber);
            }
        };
        FinishHUD.prototype.startBonus = function() {
            if (this.type === FinishHUDType.WIN) {
                this.bonusText.visible = true;
            }
        };
        FinishHUD.prototype.soundStar = function() {
            this.soundFX.play('star');
        };
        FinishHUD.prototype.update = function() {
            if (this.state === FinishHUDState.WAITING) {
                this.timeElapsed += this.game.time.physicsElapsed;
                if (this.timeElapsed >= this.delay) {
                    //Ask if the star must appear
                    if (!this.starBig.visible && this.type === FinishHUDType.WIN) {
                        this.starBig.scale.setTo(3.0, 3.0);
                        this.starBig.alpha = 0;
                        this.starBig.visible = true;
                        var tweenSound = this.game.add.tween(this.starBig).to({
                            alpha: 1
                        }, 200, Phaser.Easing.Sinusoidal.Out, false, 500);
                        tweenSound.onComplete.add(this.soundStar, this);
                        tweenSound.start();
                        this.game.add.tween(this.starBig.scale).to({
                            x: 1,
                            y: 1
                        }, 1000, Phaser.Easing.Elastic.Out, true, 500);
                    }
                    var pos = this.bonusText.position.y;
                    this.game.add.tween(this.bonusText.position).to({
                        y: pos - this.background.height * 0.15
                    }, 1200, Phaser.Easing.Sinusoidal.Out, true, 500);
                    var tween = this.game.add.tween(this.bonusText).to({
                        alpha: 0
                    }, 1200, Phaser.Easing.Sinusoidal.Out, false, 500);
                    tween.onStart.add(this.startBonus, this);
                    tween.start();
                    this.game.add.tween(this.background.position).to({
                        y: DroneWars.GameCanvas.defaultHeight * 0.5
                    }, 700, Phaser.Easing.Elastic.Out, true);
                    this.state = FinishHUDState.SHOW;
                }
            } else if (this.state === FinishHUDState.SHOW && this.type === FinishHUDType.WIN) {
                this.currentCoins += this.velocityCoins * this.game.time.physicsElapsed;
                if (this.currentCoins < this.finalCoins) {
                    this.coinsText.setText(this.currentCoins.toFixed(0).toString());
                } else {
                    this.coinsText.setText(this.finalCoins.toString());
                }
            }
        };
        return FinishHUD;
    }(Phaser.Group));
    DroneWars.FinishHUD = FinishHUD;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(InGameState) {
        InGameState[InGameState["PRELOADING"] = 1] = "PRELOADING";
        InGameState[InGameState["STARTING"] = 1] = "STARTING";
        InGameState[InGameState["TUTORIAL"] = 2] = "TUTORIAL";
        InGameState[InGameState["PLAYING"] = 3] = "PLAYING";
        InGameState[InGameState["PAUSED"] = 4] = "PAUSED";
        InGameState[InGameState["GAME_OVER"] = 5] = "GAME_OVER";
        InGameState[InGameState["WIN"] = 6] = "WIN";
    })(DroneWars.InGameState || (DroneWars.InGameState = {}));
    var InGameState = DroneWars.InGameState;
    var InGame = (function(_super) {
        __extends(InGame, _super);

        function InGame() {
            _super.apply(this, arguments);
            this.preloadWrapper = null;
            //Indexes for walls
            this.indexesRedWall = [125, 150];
            this.indexesBlueWall = [126, 149];
        }
        InGame.prototype.init = function(levelNumber, worldNumber, difficultyNumber) {
            this.levelNumber = levelNumber;
            this.worldNumber = worldNumber;
            this.difficultyNumber = difficultyNumber;
            DroneWars.DroneManager.reset();
            DroneWars.TurretManager.reset();
            DroneWars.PowerUpsManager.reset();
            DroneWars.BulletManager.reset();
            DroneWars.ExplosionManager.reset();
            DroneWars.SwitchesManager.reset();
        };
        InGame.prototype.preload = function() {
            this.wrapper = this.game.add.group();
            this.wrapper.create(0, 0);
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.scale.setResizeCallback(this.resized, this);
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'background');
            this.wrapper.add(this.background);
            //Add grougp wrapper for preload bar
            this.preloadWrapper = this.game.add.group();
            this.preloadWrapper.create(0, 0);
            this.wrapper.add(this.preloadWrapper);
            var loading = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'LoadingScene', 'LoadingBar.png');
            loading.anchor.setTo(0.5, 0.5);
            this.preloadWrapper.add(loading);
            this.preloadBar = this.add.sprite(loading.x + 2, loading.y - 4, 'LoadingScene', 'GreenBar.png');
            this.preloadBar.anchor.setTo(0, 0.5);
            this.preloadBar.x = loading.x + 2 - this.preloadBar.width * 0.5;
            this.preloadWrapper.add(this.preloadBar);
            this.load.setPreloadSprite(this.preloadBar);
            var levelIndex = 1 + (this.worldNumber - 1) * 6 + (this.levelNumber - 1);
            //  Load our actual games assets
            this.load.atlasJSONHash('GameScene', DroneWars.GameCanvas.route + 'GameScene/GameScene.png', DroneWars.GameCanvas.route + 'GameScene/GameScene.json');
            this.load.audio('winSound', ['assets/audio/win.mp3', 'assets/audio/win.ogg']);
            this.load.audio('gameoverSound', ['assets/audio/gameover.mp3', 'assets/audio/gameover.ogg']);
            this.load.tilemap('Level', DroneWars.GameCanvas.route + 'GameScene/Levels/Level' + levelIndex.toString() + '.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('TileMap', DroneWars.GameCanvas.route + 'GameScene/Levels/TileMap.png');
            this.load.audio('sfx', ['assets/audio/sfx.mp3', 'assets/audio/sfx.ogg']);
            this.load.bitmapFont('Font_NumberRiffic36', DroneWars.GameCanvas.route + 'Font/Font_NumberRiffic36.png', DroneWars.GameCanvas.route + 'Font/Font_NumberRiffic36.xml');
            this.load.bitmapFont('Font_Riffic28', DroneWars.GameCanvas.route + 'Font/Font_Riffic28.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic28.xml');
            this.load.bitmapFont('Font_Riffic62', DroneWars.GameCanvas.route + 'Font/Font_Riffic62.png', DroneWars.GameCanvas.route + 'Font/Font_Riffic62.xml');
            this.load.bitmapFont('MenuFont', DroneWars.GameCanvas.route + 'Font/MenuFont_44.png', DroneWars.GameCanvas.route + 'Font/MenuFont_44.xml');
            this.load.bitmapFont('MenuFont_52', DroneWars.GameCanvas.route + 'Font/MenuFont_52.png', DroneWars.GameCanvas.route + 'Font/MenuFont_52.xml');
            this.load.image('BackgroundBlack', DroneWars.GameCanvas.route + 'BackgroundBlack.png');
            this.load.image('confetiBlue', DroneWars.GameCanvas.route + 'Particle_Blue.png');
            this.load.image('confetiPurple', DroneWars.GameCanvas.route + 'Particle_Purple.png');
            this.load.image('confetiGreen', DroneWars.GameCanvas.route + 'Particle_Green.png');
            this.load.image('confetiWhite', DroneWars.GameCanvas.route + 'Particle_White.png');
            this.load.text('levelsConfig', 'config/levels.json');
            this.state = InGameState.PRELOADING;
        };
        InGame.prototype.create = function() {
            this.background = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'Background1_Color');
            this.wrapper.add(this.background);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('unpause', 1, 0.6);
            this.soundFX.addMarker('clickOnTiles', 8.5, 0.4);
            this.soundFX.addMarker('labelAppear', 9, 1.9);
            this.soundFX.addMarker('clickOnTilesNotAvailable', 16, 0.4);
            DroneWars.BulletManager.init(this.game);
            if (this.preloadWrapper !== null)
                this.preloadWrapper.visible = false;
            var backgroundLevel = this.add.sprite(DroneWars.GameCanvas.inner.centerX, DroneWars.GameCanvas.inner.centerY, 'Background1');
            backgroundLevel.anchor.setTo(0.5, 0.5);
            this.wrapper.add(backgroundLevel);
            //Create groups for game, pause and HUD
            var gameGroup = this.add.group();
            DroneWars.BulletManager.bulletGroup = this.add.group();
            DroneWars.ExplosionManager.explosionGroup = this.add.group();
            var pauseGroup = this.add.group();
            this.hudGroup = this.add.group();
            var finishGroup = this.add.group();
            this.pauseGroup = this.add.group();
            this.wrapper.add(gameGroup);
            this.wrapper.add(DroneWars.BulletManager.bulletGroup);
            this.wrapper.add(DroneWars.ExplosionManager.explosionGroup);
            this.wrapper.add(pauseGroup);
            this.wrapper.add(this.hudGroup);
            this.wrapper.add(finishGroup);
            this.wrapper.add(this.pauseGroup);
            this.map = this.add.tilemap('Level');
            this.map.addTilesetImage('TileMap');
            var layer3 = this.map.createLayer('Shadows', 1024, 768, gameGroup);
            this.collisionsLayer = this.map.createLayer('Base', 1024, 768, gameGroup);
            /*Create sprite for touch location*/
            this.locationTouch = this.add.sprite(0, 0, 'GameScene', 'Hud_Click.png');
            this.locationTouch.anchor.setTo(0.5, 0.5);
            this.locationTouch.alpha = 0;
            layer3.addChild(this.locationTouch);
            //Exclude only the red wall and empty
            this.map.setCollisionByExclusion([0, this.indexesRedWall[0], this.indexesRedWall[1]], true, this.collisionsLayer);
            //  Here we create our player group
            var wallsGroup = this.add.group();
            this.elementsGroup = this.add.group();
            gameGroup.add(wallsGroup);
            gameGroup.add(this.elementsGroup);
            this.collisionsLayer.resizeWorld();
            layer3.resizeWorld();
            this.collisionsLayer.smoothed = false;
            layer3.smoothed = false;
            var colorDrones = DroneWars.DroneColor.BLACK;
            var objectList = this.map.objects["Objects"];
            var i;
            var drone;
            var turret;
            var SwitchObject;
            var wall;
            var powerup;
            var boss;
            for (i = 0; i < objectList.length; i++) {
                if (objectList[i].name === "PJ") {
                    this.player = new DroneWars.Player(this.game, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(this.player);
                } else if (objectList[i].name === "LD") {
                    var route = null;
                    if (typeof(objectList[i].properties) !== 'undefined') {
                        if (typeof(objectList[i].properties["route"]) !== 'undefined') {
                            var routeString = objectList[i].properties["route"];
                            route = routeString.split('');
                        }
                    }
                    drone = DroneWars.DroneManager.createDrone(this.game, DroneWars.DroneType.LIGHT, colorDrones, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight, route);
                    this.elementsGroup.add(drone);
                    drone.startMovement();
                } else if (objectList[i].name === "MD") {
                    var route = null;
                    if (typeof(objectList[i].properties) !== 'undefined') {
                        if (typeof(objectList[i].properties["route"]) !== 'undefined') {
                            var routeString = objectList[i].properties["route"];
                            route = routeString.split('');
                        }
                    }
                    drone = DroneWars.DroneManager.createDrone(this.game, DroneWars.DroneType.MEDIUM, colorDrones, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight, route);
                    this.elementsGroup.add(drone);
                    drone.startMovement();
                } else if (objectList[i].name === "HD") {
                    var route = null;
                    if (typeof(objectList[i].properties) !== 'undefined') {
                        if (typeof(objectList[i].properties["route"]) !== 'undefined') {
                            var routeString = objectList[i].properties["route"];
                            route = routeString.split('');
                        }
                    }
                    drone = DroneWars.DroneManager.createDrone(this.game, DroneWars.DroneType.HEAVY, colorDrones, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight, route);
                    this.elementsGroup.add(drone);
                    drone.startMovement();
                } else if (objectList[i].name === "LT") {
                    turret = DroneWars.TurretManager.createTurret(this.game, DroneWars.TurretType.LIGHT, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(turret);
                } else if (objectList[i].name === "HT") {
                    turret = DroneWars.TurretManager.createTurret(this.game, DroneWars.TurretType.HEAVY, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(turret);
                } else if (objectList[i].name === "SB") {
                    SwitchObject = DroneWars.SwitchesManager.createSwitch(this.game, DroneWars.SwitchWallColor.BLUE, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    wallsGroup.add(SwitchObject);
                } else if (objectList[i].name === "SR") {
                    SwitchObject = DroneWars.SwitchesManager.createSwitch(this.game, DroneWars.SwitchWallColor.RED, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    wallsGroup.add(SwitchObject);
                } else if (objectList[i].name === "LWB") {
                    wall = DroneWars.SwitchesManager.createWall(this.game, DroneWars.SwitchWallColor.BLUE, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    wallsGroup.add(wall);
                } else if (objectList[i].name === "LWR") {
                    wall = DroneWars.SwitchesManager.createWall(this.game, DroneWars.SwitchWallColor.RED, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    wallsGroup.add(wall);
                } else if (objectList[i].name === "BS") {
                    powerup = DroneWars.PowerUpsManager.createPowerUp(this.game, DroneWars.PowerUpType.DEFENSE, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(powerup);
                } else if (objectList[i].name === "BD") {
                    powerup = DroneWars.PowerUpsManager.createPowerUp(this.game, DroneWars.PowerUpType.ATTACK, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(powerup);
                } else if (objectList[i].name === "BM") {
                    powerup = DroneWars.PowerUpsManager.createPowerUp(this.game, DroneWars.PowerUpType.SPEED, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(powerup);
                } else if (objectList[i].name === "HP") {
                    powerup = DroneWars.PowerUpsManager.createPowerUp(this.game, DroneWars.PowerUpType.HEALTH, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(powerup);
                } else if (objectList[i].name === "B") {
                    boss = DroneWars.DroneManager.createBoss(this.game, this.difficultyNumber, objectList[i].x, objectList[i].y, this.map.tileWidth, this.map.tileHeight);
                    this.elementsGroup.add(boss);
                }
            }
            //HUD
            this.pauseButton = this.add.button(DroneWars.GameCanvas.inner.right - DroneWars.GameCanvas.defaultWidth * 0.05, DroneWars.GameCanvas.inner.top + DroneWars.GameCanvas.defaultWidth * 0.044, 'GameScene', this.onPause, this, 'Hud_Pause.png', 'Hud_Pause.png', 'Hud_PauseHold.png');
            this.pauseButton.anchor.setTo(0.5, 0.5);
            this.hudGroup.add(this.pauseButton);
            this.leftHUDGroup = this.add.group();
            this.leftHUDGroup.position.setTo(DroneWars.GameCanvas.inner.left, DroneWars.GameCanvas.inner.top);
            this.hudGroup.add(this.leftHUDGroup);
            var levelText = this.add.bitmapText(DroneWars.GameCanvas.defaultWidth * 0.01, DroneWars.GameCanvas.defaultWidth * 0.02, 'Font_Riffic28', Locale.translate("Level") + " " + this.worldNumber + "-" + this.levelNumber, 28);
            levelText.anchor.setTo(0, 0.5);
            this.leftHUDGroup.add(levelText);
            var moneyIcon = this.add.sprite(DroneWars.GameCanvas.defaultWidth * 0.01, DroneWars.GameCanvas.defaultWidth * 0.05, 'MenuScene', 'MoneyIcon.png');
            moneyIcon.anchor.setTo(0, 0.5);
            this.leftHUDGroup.add(moneyIcon);
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            this.coinsText = this.add.bitmapText(moneyIcon.x + moneyIcon.width * 1.2, moneyIcon.y + moneyIcon.height * 0.09, 'Font_NumberRiffic36', coins, 36);
            this.coinsText.anchor.setTo(0, 0.5);
            this.leftHUDGroup.add(this.coinsText);
            this.finishHUD = new DroneWars.FinishHUD(this.game);
            finishGroup.add(this.finishHUD);
            this.game.onPause.add(this.onPause, this);
            this.game.onResume.add(this.onResume, this);
            this.game.input.onDown.add(this.onDown, this);
            /*
            labelStarting
            */
            this.backLabel = this.add.tileSprite(DroneWars.GameCanvas.outer.x + DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.inner.centerY - DroneWars.GameCanvas.defaultHeight * 0.25 * 0.5, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.defaultHeight * 0.25, 'BackgroundBlack');
            this.backLabel.alpha = 0.4;
            this.wrapper.add(this.backLabel);
            this.labelText = this.add.bitmapText(DroneWars.GameCanvas.inner.centerX + DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.inner.centerY, 'Font_Riffic62', Locale.translate("Destroy your enemies!"), 62);
            this.labelText.anchor.setTo(0.5, 0.5);
            this.wrapper.add(this.labelText);
            var tween1 = this.add.tween(this.backLabel.position).to({
                x: DroneWars.GameCanvas.outer.x
            }, 400, Phaser.Easing.Quartic.Out, false, 700);
            var tween2 = this.add.tween(this.backLabel.position).to({
                x: DroneWars.GameCanvas.outer.x - DroneWars.GameCanvas.outer.width
            }, 400, Phaser.Easing.Quartic.In, false, 1000);
            tween1.chain(tween2);
            var tween3 = this.add.tween(this.labelText.position).to({
                x: DroneWars.GameCanvas.inner.centerX
            }, 400, Phaser.Easing.Quartic.Out, false, 700);
            var tween4 = this.add.tween(this.labelText.position).to({
                x: DroneWars.GameCanvas.inner.centerX - DroneWars.GameCanvas.outer.width
            }, 400, Phaser.Easing.Quartic.In, false, 1000);
            tween3.chain(tween4);
            tween1.onStart.add(function() {
                this.soundFX.play('labelAppear');
            }, this);
            tween1.onComplete.add(this.onStartGame, this);
            tween2.onComplete.add(this.onHideLabel, this);
            tween1.start();
            tween3.start();
            /*PAUSE*/
            var backgroundPause = this.add.tileSprite(DroneWars.GameCanvas.outer.x, DroneWars.GameCanvas.outer.y, DroneWars.GameCanvas.outer.width, DroneWars.GameCanvas.outer.height, 'BackgroundBlack');
            backgroundPause.alpha = 0.7;
            this.pauseGroup.add(backgroundPause);
            var pausebig = this.add.sprite(DroneWars.GameCanvas.defaultWidth * 0.5, DroneWars.GameCanvas.defaultHeight * 0.5, 'GameScene', 'PauseBig.png');
            pausebig.anchor.setTo(0.5, 0.5);
            this.pauseGroup.add(pausebig);
            this.pauseGroup.visible = false;
            //fill matrix
            this.createMatrix(this.player.location.y, this.player.location.x);
            this.state = InGameState.STARTING;
        };
        InGame.prototype.resized = function(manager, bounds) {
            DroneWars.GameCanvas.updateScaleRatio();
            this.wrapper.scale.setTo(DroneWars.GameCanvas.scaleRatio);
            this.wrapper.x = window.innerWidth * 0.5 - DroneWars.GameCanvas.defaultWidth * this.wrapper.scale.y * 0.5;
            this.wrapper.y = window.innerHeight * 0.5 - DroneWars.GameCanvas.defaultHeight * this.wrapper.scale.x * 0.5;
            this.background.x = DroneWars.GameCanvas.outer.x;
            this.background.y = DroneWars.GameCanvas.outer.y;
            this.background.width = DroneWars.GameCanvas.outer.width;
            this.background.height = DroneWars.GameCanvas.outer.height;
        };
        InGame.prototype.onCoinsAdded = function(coinsAdded) {
            var coins = GameData.getItem("coins");
            if (coins === null)
                coins = "0";
            var newCoins = coinsAdded + parseInt(coins);
            GameData.setItem("coins", newCoins.toString());
            this.coinsText.setText(newCoins.toString());
        };
        InGame.prototype.onPause = function() {
            if (!this.game.paused) {
                this.pauseGroup.visible = true;
                this.game.paused = true;
            }
        };
        InGame.prototype.onResume = function() {
            if (this.game.paused) {
                this.soundFX.play('unpause');
                this.pauseGroup.visible = false;
                this.game.paused = false;
            }
        };
        InGame.prototype.onStartGame = function() {
            this.state = InGameState.PLAYING;
        };
        InGame.prototype.onHideLabel = function() {
            this.backLabel.alpha = 0.0;
            this.labelText.alpha = 0.0;
        };
        InGame.prototype.onGameOver = function() {
            this.game.add.tween(this.hudGroup).to({
                alpha: 0
            }, 700, Phaser.Easing.Sinusoidal.Out, true);
            this.pauseButton.inputEnabled = false;
            var delay = 0.7;
            this.finishHUD.showFinish(DroneWars.FinishHUDType.LOSE, this.levelNumber, this.worldNumber, this.difficultyNumber, delay);
            this.state = InGameState.GAME_OVER;
        };
        InGame.prototype.onWin = function() {
            this.game.add.tween(this.hudGroup).to({
                alpha: 0
            }, 700, Phaser.Easing.Sinusoidal.Out, true);
            this.pauseButton.inputEnabled = false;
            var delay = 0.7;
            this.finishHUD.showFinish(DroneWars.FinishHUDType.WIN, this.levelNumber, this.worldNumber, this.difficultyNumber, delay);
            this.state = InGameState.WIN;
        };
        InGame.prototype.onDown = function() {
            if (this.game.paused) {
                this.onResume();
                return;
            }
            if (this.state === InGameState.PLAYING && this.player.state !== DroneWars.PlayerState.DYING && this.player.state !== DroneWars.PlayerState.DIED) {
                var point = this.game.input.getLocalPosition(this.wrapper, this.game.input.activePointer);
                var column = Math.max(0, Math.min(this.map.width - 1, Math.floor(point.x / this.map.tileWidth)));
                var row = Math.max(0, Math.min(this.map.height - 1, Math.floor(point.y / this.map.tileHeight)));
                if (this.tilesForMoving[row][column]) {
                    this.soundFX.play('clickOnTiles');
                    this.showLocation(row, column);
                    this.player.moveToLocation(column, row, this.map);
                } else {
                    this.soundFX.play('clickOnTilesNotAvailable');
                }
            }
        };
        InGame.prototype.createMatrix = function(row, column) {
            this.tilesForMoving = [];
            for (var rowa = 0; rowa < 12; rowa++) {
                this.tilesForMoving[rowa] = [];
                for (var columna = 0; columna < 16; columna++) {
                    this.tilesForMoving[rowa][columna] = false;
                }
            }
            this.findPathAvailable(row, column);
            for (var rowa = 0; rowa < 12; rowa++) {
                for (var columna = 0; columna < 16; columna++) {
                    if (this.map.getTile(columna, rowa, "Base") !== null) {
                        if (this.map.getTile(columna, rowa, "Base").index === this.indexesBlueWall[0] || this.map.getTile(columna, rowa, "Base").index === this.indexesBlueWall[1]) {
                            this.tilesForMoving[rowa][columna] = false;
                        }
                    }
                }
            }
        };
        InGame.prototype.findPathAvailable = function(row, column) {
            this.tilesForMoving[row][column] = true;
            if (row + 1 < 12) {
                if (!this.tilesForMoving[row + 1][column]) {
                    if (this.map.getTile(column, row + 1, "Base") !== null) {
                        if (this.map.getTile(column, row + 1, "Base").index === this.indexesBlueWall[0] || this.map.getTile(column, row + 1, "Base").index === this.indexesBlueWall[1]) {
                            this.findPathAvailable(row + 1, column);
                        }
                    } else {
                        if (!DroneWars.SwitchesManager.isWallSet(column, row + 1)) {
                            this.findPathAvailable(row + 1, column);
                        }
                    }
                }
            }
            if (row - 1 > 0) {
                if (!this.tilesForMoving[row - 1][column]) {
                    if (this.map.getTile(column, row - 1, "Base") !== null) {
                        if (this.map.getTile(column, row - 1, "Base").index === this.indexesBlueWall[0] || this.map.getTile(column, row - 1, "Base").index === this.indexesBlueWall[1]) {
                            this.findPathAvailable(row - 1, column);
                        }
                    } else {
                        if (!DroneWars.SwitchesManager.isWallSet(column, row - 1)) {
                            this.findPathAvailable(row - 1, column);
                        }
                    }
                }
            }
            if (column + 1 < 15) {
                if (!this.tilesForMoving[row][column + 1]) {
                    if (this.map.getTile(column + 1, row, "Base") !== null) {
                        if (this.map.getTile(column + 1, row, "Base").index === this.indexesBlueWall[0] || this.map.getTile(column + 1, row, "Base").index === this.indexesBlueWall[1]) {
                            this.findPathAvailable(row, column + 1);
                        }
                    } else {
                        if (!DroneWars.SwitchesManager.isWallSet(column + 1, row)) {
                            this.findPathAvailable(row, column + 1);
                        }
                    }
                }
            }
            if (column - 1 > 0) {
                if (!this.tilesForMoving[row][column - 1]) {
                    if (this.map.getTile(column - 1, row, "Base") !== null) {
                        if (this.map.getTile(column - 1, row, "Base").index === this.indexesBlueWall[0] || this.map.getTile(column - 1, row, "Base").index === this.indexesBlueWall[1]) {
                            this.findPathAvailable(row, column - 1);
                        }
                    } else {
                        if (!DroneWars.SwitchesManager.isWallSet(column - 1, row)) {
                            this.findPathAvailable(row, column - 1);
                        }
                    }
                }
            }
        };
        InGame.prototype.showLocation = function(row, column) {
            this.locationTouch.position.setTo(column * this.map.tileWidth + this.map.tileWidth * 0.5, row * this.map.tileHeight + this.map.tileHeight * 0.5);
            this.tweens.removeFrom(this.locationTouch);
            this.locationTouch.scale.setTo(0.3, 0.3);
            this.locationTouch.alpha = 0.9;
            this.add.tween(this.locationTouch).to({
                alpha: 0.0
            }, 150, Phaser.Easing.Linear.None, true);
            this.add.tween(this.locationTouch.scale).to({
                x: 1.5,
                y: 1.5
            }, 150, Phaser.Easing.Linear.None, true);
        };
        InGame.prototype.bulletCollisions = function() {
            var i;
            var j;
            var bullet;
            var tiles;
            var line = new Phaser.Line();
            for (i = 0; i < DroneWars.BulletManager.bulletArray.length; i++) {
                bullet = DroneWars.BulletManager.bulletArray[i];
                if (bullet.state === DroneWars.BulletState.IDLE)
                    continue;
                if (bullet.type === DroneWars.BulletType.PLAYER_BASIC || bullet.type === DroneWars.BulletType.PLAYER_HEAVY || bullet.type === DroneWars.BulletType.PLAYER_POWERUP) {
                    for (j = 0; j < DroneWars.DroneManager.droneArray.length; j++) {
                        if (DroneWars.DroneManager.droneArray[j].state === DroneWars.DroneState.IDLE)
                            continue;
                        if (DroneWars.DroneManager.droneArray[j].isCollisioning(bullet)) {
                            DroneWars.DroneManager.droneArray[j].hit(bullet);
                            bullet.explode();
                            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.BULLET, bullet.currentLocation);
                            break;
                        }
                    }
                    if (bullet.state === DroneWars.BulletState.IDLE)
                        continue;
                    for (j = 0; j < DroneWars.DroneManager.bossArray.length; j++) {
                        if (DroneWars.DroneManager.bossArray[j].state === DroneWars.BossState.IDLE)
                            continue;
                        if (DroneWars.DroneManager.bossArray[j].isCollisioning(bullet)) {
                            DroneWars.DroneManager.bossArray[j].hit(bullet);
                            bullet.explode();
                            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.BULLET, bullet.currentLocation);
                            break;
                        }
                    }
                    if (bullet.state === DroneWars.BulletState.IDLE)
                        continue;
                    for (j = 0; j < DroneWars.TurretManager.turretArray.length; j++) {
                        if (DroneWars.TurretManager.turretArray[j].state === DroneWars.TurretState.IDLE)
                            continue;
                        if (DroneWars.TurretManager.turretArray[j].isCollisioning(bullet)) {
                            DroneWars.TurretManager.turretArray[j].hit(bullet);
                            bullet.explode();
                            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.BULLET, bullet.currentLocation);
                            break;
                        }
                    }
                } else {
                    if (this.player.isCollisioning(bullet) && this.player.state !== DroneWars.PlayerState.DYING) {
                        this.player.hit(bullet);
                        bullet.explode();
                        DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.BULLET, bullet.currentLocation);
                        break;
                    }
                }
                if (bullet.state === DroneWars.BulletState.IDLE)
                    continue;
                line.start.setTo(bullet.previousLocation.x, bullet.previousLocation.y);
                line.end.setTo(bullet.currentLocation.x, bullet.currentLocation.y);
                tiles = this.collisionsLayer.getRayCastTiles(line, 4, true, false);
                if (tiles.length > 0) {
                    bullet.explode();
                    DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.BULLET, bullet.currentLocation);
                }
            }
        };
        InGame.prototype.shootingProcedure = function() {
            var i;
            var line = new Phaser.Line();
            var tiles;
            var distance = DroneWars.GameCanvas.defaultWidth;
            var minimumPoint = null;
            var pointPlayer = new Phaser.Point(this.player.getBoundingBox().centerX, this.player.getBoundingBox().centerY);;
            var pointTarget;
            for (i = 0; i < DroneWars.DroneManager.droneArray.length && this.player.state !== DroneWars.PlayerState.DYING; i++) {
                if (DroneWars.DroneManager.droneArray[i].state !== DroneWars.DroneState.IDLE && (DroneWars.DroneManager.droneArray[i].isReadyForShooting() || this.player.isReadyForShooting())) {
                    pointTarget = new Phaser.Point(DroneWars.DroneManager.droneArray[i].getBoundingBox().centerX, DroneWars.DroneManager.droneArray[i].getBoundingBox().centerY);
                    line.start.setTo(pointTarget.x, pointTarget.y);
                    line.end.setTo(pointPlayer.x, pointPlayer.y);
                    tiles = this.collisionsLayer.getRayCastTiles(line, 4, true, false);
                    //If there is no tile collisioning
                    if (tiles.length === 0) {
                        if (!DroneWars.SwitchesManager.isWallSetRaycast(line, 4)) {
                            if (DroneWars.DroneManager.droneArray[i].isReadyForShooting() && line.length <= DroneWars.DroneManager.droneArray[i].getRange())
                                DroneWars.DroneManager.droneArray[i].shoot(pointPlayer);
                            if (this.player.isReadyForShooting() && line.length <= this.player.range && line.length < distance) {
                                distance = line.length;
                                minimumPoint = pointTarget.clone();
                            }
                        }
                    }
                }
            }
            for (i = 0; i < DroneWars.DroneManager.bossArray.length && this.player.state !== DroneWars.PlayerState.DYING; i++) {
                if (DroneWars.DroneManager.bossArray[i].state !== DroneWars.BossState.IDLE && (DroneWars.DroneManager.bossArray[i].isReadyForShooting() || this.player.isReadyForShooting())) {
                    pointTarget = new Phaser.Point(DroneWars.DroneManager.bossArray[i].getBoundingBox().centerX, DroneWars.DroneManager.bossArray[i].getBoundingBox().centerY);
                    line.start.setTo(pointTarget.x, pointTarget.y);
                    line.end.setTo(pointPlayer.x, pointPlayer.y);
                    tiles = this.collisionsLayer.getRayCastTiles(line, 4, true, false);
                    //If there is no tile collisioning
                    if (tiles.length === 0) {
                        if (!DroneWars.SwitchesManager.isWallSetRaycast(line, 4)) {
                            if (DroneWars.DroneManager.bossArray[i].isReadyForShooting())
                                DroneWars.DroneManager.bossArray[i].shoot(pointPlayer);
                            if (this.player.isReadyForShooting() && line.length <= this.player.range && line.length < distance) {
                                distance = line.length;
                                minimumPoint = pointTarget.clone();
                            }
                        }
                    }
                }
            }
            for (i = 0; i < DroneWars.TurretManager.turretArray.length && this.player.state !== DroneWars.PlayerState.DYING; i++) {
                if (DroneWars.TurretManager.turretArray[i].state !== DroneWars.TurretState.IDLE && (DroneWars.TurretManager.turretArray[i].isReadyForShooting() || this.player.isReadyForShooting())) {
                    pointTarget = new Phaser.Point(DroneWars.TurretManager.turretArray[i].getBoundingBox().centerX, DroneWars.TurretManager.turretArray[i].getBoundingBox().centerY);
                    line.start.setTo(pointTarget.x, pointTarget.y);
                    line.end.setTo(pointPlayer.x, pointPlayer.y);
                    tiles = this.collisionsLayer.getRayCastTiles(line, 4, true, false);
                    //If there is no tile collisioning
                    if (tiles.length === 0) {
                        if (!DroneWars.SwitchesManager.isWallSetRaycast(line, 4)) {
                            if (DroneWars.TurretManager.turretArray[i].isReadyForShooting())
                                DroneWars.TurretManager.turretArray[i].shoot(pointPlayer);
                            if (this.player.isReadyForShooting() && line.length <= this.player.range && line.length < distance) {
                                distance = line.length;
                                minimumPoint = pointTarget.clone();
                            }
                        }
                    }
                }
            }
            if (this.player.isReadyForShooting() && minimumPoint !== null && this.player.state !== DroneWars.PlayerState.DYING) {
                this.player.shoot(minimumPoint);
            }
        };
        InGame.prototype.update = function() {
            if (this.state === InGameState.PRELOADING) {
                this.background.tilePosition.x += this.game.time.physicsElapsed * 12;
                this.background.tilePosition.y += this.game.time.physicsElapsed * 12;
            } else if (this.state === InGameState.PLAYING) {
                this.shootingProcedure();
                this.bulletCollisions();
                DroneWars.SwitchesManager.checkPressSwitches(this.player, this);
                DroneWars.PowerUpsManager.checkPowerUps(this.player);
                //Check if gme is over
                if (!DroneWars.TurretManager.availableTurrets() && !DroneWars.DroneManager.availableDronesBosses()) {
                    this.onWin();
                }
            }
            this.elementsGroup.sort('z', Phaser.Group.SORT_ASCENDING);
        };
        return InGame;
    }(Phaser.State));
    DroneWars.InGame = InGame;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(PlayerState) {
        PlayerState[PlayerState["IDLE"] = 0] = "IDLE";
        PlayerState[PlayerState["MOVING"] = 1] = "MOVING";
        PlayerState[PlayerState["DYING"] = 2] = "DYING";
        PlayerState[PlayerState["DIED"] = 3] = "DIED";
    })(DroneWars.PlayerState || (DroneWars.PlayerState = {}));
    var PlayerState = DroneWars.PlayerState;
    (function(Direction) {
        Direction[Direction["UP"] = 0] = "UP";
        Direction[Direction["DOWN"] = 1] = "DOWN";
        Direction[Direction["LEFT"] = 2] = "LEFT";
        Direction[Direction["RIGHT"] = 3] = "RIGHT";
        Direction[Direction["UP_LEFT"] = 4] = "UP_LEFT";
        Direction[Direction["UP_RIGHT"] = 5] = "UP_RIGHT";
        Direction[Direction["DOWN_LEFT"] = 6] = "DOWN_LEFT";
        Direction[Direction["DOWN_RIGHT"] = 7] = "DOWN_RIGHT";
    })(DroneWars.Direction || (DroneWars.Direction = {}));
    var Direction = DroneWars.Direction;
    var Player = (function(_super) {
        __extends(Player, _super);

        function Player(game, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.location = new Phaser.Point(0, 0);
            this.timeElapsed = this.game.rnd.realInRange(0, Math.PI * 2);
            this.state = PlayerState.IDLE;
            this.tintTween = null;
            this.positionsList = [];
            this.shootTime = 0;
            this.powerUpGrabbed = [];
            //Indexes for walls
            this.indexesRedWall = [125, 150];
            this.indexesBlueWall = [126, 149];
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('hit2', 13.5, 0.4);
            this.soundFX.addMarker('hit3', 14, 0.4);
            this.soundFX.addMarker('explode', 14.5, 0.4);
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            this.shadowSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Starter_Shadow.png');
            this.shadowSprite.anchor.setTo(0.5, 1);
            this.add(this.shadowSprite);
            this.selectedDroneIndex = GameData.getItem("selectedDroneIndex");
            if (this.selectedDroneIndex === null)
                this.selectedDroneIndex = "0";
            var indexDrone = parseInt(this.selectedDroneIndex) + 1;
            this.droneSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.4, 'GameScene', 'Drone_' + indexDrone + '.png');
            this.droneSprite.anchor.setTo(0.5, 1);
            this.add(this.droneSprite);
            //this.graphics = game.add.graphics(0,0);
            //this.add(this.graphics);
            /*PowerUp*/
            this.powerUpSprite = game.add.sprite(this.getBoundingBox().centerX - this.droneSprite.position.x, -this.droneSprite.height * 0.5, 'GameScene', 'PowerUp_ShieldDrone.png');
            this.powerUpSprite.anchor.setTo(0.5, 0.5);
            this.powerUpSprite.animations.add('defense', ['PowerUp_ShieldDrone.png']);
            this.powerUpSprite.animations.add('damage', ['PowerUp_DamageCircle.png']);
            this.powerUpSprite.animations.add('speed', ['PowerUp_SpeedBuff_0.png', 'PowerUp_SpeedBuff_1.png', 'PowerUp_SpeedBuff_2.png', 'PowerUp_SpeedBuff_3.png', 'PowerUp_SpeedBuff_4.png', 'PowerUp_SpeedBuff_5.png', 'PowerUp_SpeedBuff_6.png', 'PowerUp_SpeedBuff_7.png', 'PowerUp_SpeedBuff_8.png', 'PowerUp_SpeedBuff_9.png', 'PowerUp_SpeedBuff_10.png']);
            this.powerUpSprite.animations.add('health', ['PowerUp_Hp_0.png', 'PowerUp_Hp_1.png', 'PowerUp_Hp_2.png', 'PowerUp_Hp_3.png', 'PowerUp_Hp_4.png', 'PowerUp_Hp_5.png', 'PowerUp_Hp_6.png', 'PowerUp_Hp_7.png', 'PowerUp_Hp_8.png', 'PowerUp_Hp_9.png', 'PowerUp_Hp_10.png', 'PowerUp_Hp_11.png', 'PowerUp_Hp_12.png', 'PowerUp_Hp_13.png', 'PowerUp_Hp_14.png', 'PowerUp_Hp_15.png', 'PowerUp_Hp_16.png', 'PowerUp_Hp_17.png', 'PowerUp_Hp_18.png', 'PowerUp_Hp_19.png', 'PowerUp_Hp_20.png', 'PowerUp_Hp_21.png', 'PowerUp_Hp_22.png', 'PowerUp_Hp_23.png', 'PowerUp_Hp_24.png', 'PowerUp_Hp_25.png', 'PowerUp_Hp_26.png', 'PowerUp_Hp_27.png', 'PowerUp_Hp_28.png', 'PowerUp_Hp_29.png', 'PowerUp_Hp_30.png', 'PowerUp_Hp_31.png', 'PowerUp_Hp_32.png', 'PowerUp_Hp_33.png', 'PowerUp_Hp_34.png', 'PowerUp_Hp_35.png']);
            this.powerUpSprite.visible = false;
            this.droneSprite.addChild(this.powerUpSprite);
            this.powerUpIcon = game.add.sprite(this.getBoundingBox().centerX - this.droneSprite.position.x, -this.droneSprite.height * 1.4, 'GameScene', 'PowerUp_IconDamage.png');
            this.powerUpIcon.anchor.setTo(0.5, 0.5);
            this.powerUpIcon.visible = false;
            this.droneSprite.addChild(this.powerUpIcon);
            this.hpGroup = game.add.group();
            this.hpGroup.visible = false;
            this.droneSprite.addChild(this.hpGroup);
            var hpBackground;
            hpBackground = game.add.sprite(this.getBoundingBox().centerX - this.droneSprite.position.x, -this.droneSprite.height * 1.1, 'GameScene', 'Hud_MediumHpBar.png');
            hpBackground.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(hpBackground);
            this.maskBarGreen = game.add.graphics(0, 0);
            this.hpGroup.addChild(this.maskBarGreen);
            this.hpGreen = game.add.sprite(this.getBoundingBox().centerX - this.droneSprite.position.x, -this.droneSprite.height * 1.1, 'GameScene', 'Hud_MediumGreenBar.png');
            this.hpGreen.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(this.hpGreen);
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width, this.hpGreen.height);
            this.hpGreen.mask = this.maskBarGreen;
            this.tileSize.setTo(tileWidth, tileHeight);
            var jsonDrones = JSON.parse(game.cache.getText('playerConfig'));
            var selectedDroneIndex = GameData.getItem("selectedDroneIndex");
            if (selectedDroneIndex === null)
                selectedDroneIndex = "0";
            this.timeBetweenShoots = jsonDrones.drones[parseInt(selectedDroneIndex)].timeBetweenShoots;
            this.bulletVelocity = jsonDrones.drones[parseInt(selectedDroneIndex)].bulletVelocity;
            this.range = jsonDrones.drones[parseInt(selectedDroneIndex)].range;
            this.healthSecondsAppearing = jsonDrones.drones[parseInt(selectedDroneIndex)].healthSecondsAppearing;
            this.healthTime = this.healthSecondsAppearing;
            var levelsDrone = GameData.getItem("levelsDrone" + parseInt(selectedDroneIndex).toString());
            if (levelsDrone === null)
                levelsDrone = "000";
            this.attack = jsonDrones.drones[parseInt(selectedDroneIndex)].levels[parseInt(levelsDrone.charAt(0))].attack.stats;
            this.speed = jsonDrones.drones[parseInt(selectedDroneIndex)].levels[parseInt(levelsDrone.charAt(1))].velocity.stats;
            this.health = jsonDrones.drones[parseInt(selectedDroneIndex)].levels[parseInt(levelsDrone.charAt(2))].health.stats;
            this.maxHealth = this.health;
            game.add.existing(this);
        }
        Player.prototype.getCollisionSprite = function() {
            return this.shadowSprite;
        };
        Player.prototype.moveToLocation = function(x, y, map) {
            this.weightMatrix = [];
            for (var row = 0; row < 12; row++) {
                this.weightMatrix[row] = [];
                for (var column = 0; column < 16; column++) {
                    if (map.getTile(column, row, "Base") !== null) {
                        //ask if tile is not a blue wall
                        var tile = map.getTile(column, row, "Base");
                        if (tile.index !== this.indexesBlueWall[0] && tile.index !== this.indexesBlueWall[1]) {
                            this.weightMatrix[row][column] = 1000000;
                        } else {
                            this.weightMatrix[row][column] = -1;
                        }
                    } else if (column === 0 || column === 15 || row === 0)
                        this.weightMatrix[row][column] = 1000000;
                    else if (DroneWars.SwitchesManager.isWallSet(column, row))
                        this.weightMatrix[row][column] = 1000000;
                    else
                        this.weightMatrix[row][column] = -1;
                }
            }
            this.location.setTo(Math.floor((this.shadowSprite.position.x - this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((this.shadowSprite.position.y - this.tileSize.y) / this.tileSize.y));
            if (this.location.equals(new Phaser.Point(x, y)))
                return;
            this.searchPath(this.location.y, this.location.x, 0);
            var astar = new AStar(new DijkstrasHeuristic());
            astar.load(this.weightMatrix);
            var nodeA = astar.getNode(this.location.x, this.location.y),
                nodeB = astar.getNode(x, y);
            this.positionsList = astar.path(nodeA, nodeB);
            this.transformRoute(map);
            var i = 0;
            while (i < this.positionsList.length) {
                if (map.getTile(this.positionsList[i].x, this.positionsList[i].y, "Base") !== null || this.positionsList[i].x === 0 || this.positionsList[i].x === 15 || this.positionsList[i].y === 0) {
                    if (map.getTile(this.positionsList[i].x, this.positionsList[i].y, "Base").index !== this.indexesBlueWall[0] && map.getTile(this.positionsList[i].x, this.positionsList[i].y, "Base").index !== this.indexesBlueWall[1]) {
                        this.positionsList.splice(i, 1);
                    } else {
                        i++;
                    }
                } else {
                    i++;
                }
            }
            if (this.positionsList[1].x < this.location.x) {
                this.droneSprite.scale.x = -1;
            } else if (this.positionsList[1].x > this.location.x) {
                this.droneSprite.scale.x = 1;
            }
            var distance = this.shadowSprite.position.distance(new Phaser.Point(this.positionsList[1].x * this.tileSize.x + this.tileSize.x * 0.5, this.positionsList[1].y * this.tileSize.y + this.tileSize.y));
            if (this.tweenMovement)
                this.tweenMovement.stop();
            this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                x: this.positionsList[1].x * this.tileSize.x + this.tileSize.x * 0.5,
                y: this.positionsList[1].y * this.tileSize.y + this.tileSize.y
            }, (distance / this.speed) * 1000, Phaser.Easing.Linear.None, false);
            this.tweenMovement.onComplete.add(this.nextMovement, this);
            this.positionsList.splice(0, 2);
            this.tweenMovement.start();
            this.state = PlayerState.MOVING;
        };
        /*
        A method to adjust the route founded by dijkstras algorithm
        */
        Player.prototype.transformRoute = function(map) {
            var direction;
            var newDirection;
            var i = 1;
            var x, y, z, weight;
            while (i < this.positionsList.length) {
                newDirection = this.getDirectionFromNodes(this.positionsList[i - 1], this.positionsList[i]);
                if (newDirection === Direction.DOWN_LEFT && map.getTile(this.positionsList[i - 1].x - 1, this.positionsList[i - 1].y, "Base") !== null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y + 1, "Base") === null) {
                    x = this.positionsList[i - 1].x;
                    y = this.positionsList[i - 1].y + 1;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.DOWN_LEFT && map.getTile(this.positionsList[i - 1].x - 1, this.positionsList[i - 1].y, "Base") === null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y + 1, "Base") !== null) {
                    x = this.positionsList[i - 1].x - 1;
                    y = this.positionsList[i - 1].y;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.DOWN_RIGHT && map.getTile(this.positionsList[i - 1].x + 1, this.positionsList[i - 1].y, "Base") !== null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y + 1, "Base") === null) {
                    x = this.positionsList[i - 1].x;
                    y = this.positionsList[i - 1].y + 1;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.DOWN_RIGHT && map.getTile(this.positionsList[i - 1].x + 1, this.positionsList[i - 1].y, "Base") === null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y + 1, "Base") !== null) {
                    x = this.positionsList[i - 1].x + 1;
                    y = this.positionsList[i - 1].y;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.UP_LEFT && map.getTile(this.positionsList[i - 1].x - 1, this.positionsList[i - 1].y, "Base") !== null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y - 1, "Base") === null) {
                    x = this.positionsList[i - 1].x;
                    y = this.positionsList[i - 1].y - 1;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.UP_LEFT && map.getTile(this.positionsList[i - 1].x - 1, this.positionsList[i - 1].y, "Base") === null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y - 1, "Base") !== null) {
                    x = this.positionsList[i - 1].x - 1;
                    y = this.positionsList[i - 1].y;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.UP_RIGHT && map.getTile(this.positionsList[i - 1].x + 1, this.positionsList[i - 1].y, "Base") !== null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y - 1, "Base") === null) {
                    x = this.positionsList[i - 1].x;
                    y = this.positionsList[i - 1].y - 1;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else if (newDirection === Direction.UP_RIGHT && map.getTile(this.positionsList[i - 1].x + 1, this.positionsList[i - 1].y, "Base") === null && map.getTile(this.positionsList[i - 1].x, this.positionsList[i - 1].y - 1, "Base") !== null) {
                    x = this.positionsList[i - 1].x + 1;
                    y = this.positionsList[i - 1].y;
                    z = this.positionsList[i - 1].z;
                    weight = this.positionsList[i - 1].weight;
                    this.positionsList.splice(i, 0, new GraphNode(x, y, z, weight));
                    i += 2;
                } else {
                    i += 1;
                }
            }
            i = 2;
            direction = this.getDirectionFromNodes(this.positionsList[0], this.positionsList[1]);
            while (i < this.positionsList.length) {
                newDirection = this.getDirectionFromNodes(this.positionsList[i - 1], this.positionsList[i]);
                if (newDirection === direction) {
                    this.positionsList.splice(i - 1, 1);
                } else {
                    direction = newDirection;
                    i += 1;
                }
            }
        };
        Player.prototype.getDirectionFromNodes = function(nodeFrom, nodeTo) {
            if (nodeFrom.x === nodeTo.x) {
                if (nodeTo.y < nodeFrom.y)
                    return Direction.UP;
                else if (nodeTo.y > nodeFrom.y)
                    return Direction.DOWN;
            }
            if (nodeFrom.y === nodeTo.y) {
                if (nodeTo.x < nodeFrom.x)
                    return Direction.LEFT;
                else if (nodeTo.x > nodeFrom.x)
                    return Direction.RIGHT;
            }
            if (nodeTo.x > nodeFrom.x && nodeTo.y < nodeFrom.y)
                return Direction.UP_RIGHT;
            else if (nodeTo.x < nodeFrom.x && nodeTo.y < nodeFrom.y)
                return Direction.UP_LEFT;
            else if (nodeTo.x > nodeFrom.x && nodeTo.y > nodeFrom.y)
                return Direction.DOWN_RIGHT;
            else if (nodeTo.x < nodeFrom.x && nodeTo.y > nodeFrom.y)
                return Direction.DOWN_LEFT;
            return Direction.UP;
        };
        Player.prototype.nextMovement = function() {
            this.location.setTo(Math.floor((this.shadowSprite.position.x - this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((this.shadowSprite.position.y - this.tileSize.y) / this.tileSize.y));
            if (this.positionsList.length > 0) {
                if (this.positionsList[0].x < this.location.x) {
                    this.droneSprite.scale.x = -1;
                } else if (this.positionsList[0].x > this.location.x) {
                    this.droneSprite.scale.x = 1;
                }
                var distance = this.shadowSprite.position.distance(new Phaser.Point(this.positionsList[0].x * this.tileSize.x + this.tileSize.x * 0.5, this.positionsList[0].y * this.tileSize.y + this.tileSize.y));
                this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                    x: this.positionsList[0].x * this.tileSize.x + this.tileSize.x * 0.5,
                    y: this.positionsList[0].y * this.tileSize.y + this.tileSize.y
                }, (distance / this.speed) * 1000, Phaser.Easing.Linear.None, false);
                this.tweenMovement.onComplete.add(this.nextMovement, this);
                this.positionsList.splice(0, 1);
                this.tweenMovement.start();
            } else {
                this.state = PlayerState.IDLE;
            }
        };
        Player.prototype.searchPath = function(row, column, distance) {
            this.weightMatrix[row][column] = distance;
            if (row + 1 < 12) {
                if (this.weightMatrix[row + 1][column - 1] === -1 || (this.weightMatrix[row + 1][column - 1] > distance + 1 && this.weightMatrix[row + 1][column - 1] !== 1000000))
                    this.searchPath(row + 1, column - 1, distance + 1);
                if (this.weightMatrix[row + 1][column] === -1 || (this.weightMatrix[row + 1][column] > distance + 1 && this.weightMatrix[row + 1][column] !== 1000000))
                    this.searchPath(row + 1, column, distance + 1);
                if (this.weightMatrix[row + 1][column + 1] === -1 || (this.weightMatrix[row + 1][column + 1] > distance + 1 && this.weightMatrix[row + 1][column + 1] !== 1000000))
                    this.searchPath(row + 1, column + 1, distance + 1);
            }
            if (this.weightMatrix[row][column - 1] === -1 || (this.weightMatrix[row][column - 1] > distance + 1 && this.weightMatrix[row][column - 1] !== 1000000))
                this.searchPath(row, column - 1, distance + 1);
            if (this.weightMatrix[row][column + 1] === -1 || (this.weightMatrix[row][column + 1] > distance + 1 && this.weightMatrix[row][column + 1] !== 1000000))
                this.searchPath(row, column + 1, distance + 1);
            if (this.weightMatrix[row - 1][column - 1] === -1 || (this.weightMatrix[row - 1][column - 1] > distance + 1 && this.weightMatrix[row - 1][column - 1] !== 1000000))
                this.searchPath(row - 1, column - 1, distance + 1);
            if (this.weightMatrix[row - 1][column] === -1 || (this.weightMatrix[row - 1][column] > distance + 1 && this.weightMatrix[row - 1][column] !== 1000000))
                this.searchPath(row - 1, column, distance + 1);
            if (this.weightMatrix[row - 1][column + 1] === -1 || (this.weightMatrix[row - 1][column + 1] > distance + 1 && this.weightMatrix[row - 1][column + 1] !== 1000000))
                this.searchPath(row - 1, column + 1, distance + 1);
        };
        Player.prototype.getShootingLocation = function() {
            return new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY);
        };
        Player.prototype.getBoundingBox = function() {
            if (this.selectedDroneIndex === "0") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.6, this.droneSprite.height * 0.7);
            } else if (this.selectedDroneIndex === "1") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.6, this.droneSprite.height * 0.7);
            } else if (this.selectedDroneIndex === "2") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.6, this.droneSprite.height * 0.7);
            } else if (this.selectedDroneIndex === "3") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.35, this.droneSprite.position.y - this.droneSprite.height * 0.9, this.droneSprite.width * 0.65, this.droneSprite.height * 0.8);
            } else if (this.selectedDroneIndex === "4") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.35, this.droneSprite.position.y - this.droneSprite.height * 0.74, this.droneSprite.width * 0.75, this.droneSprite.height * 0.7);
            } else if (this.selectedDroneIndex === "5") {
                return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.6, this.droneSprite.height * 0.7);
            }
        };
        Player.prototype.isReadyForShooting = function() {
            if (this.shootTime >= this.timeBetweenShoots) {
                return true;
            }
            return false;
        };
        Player.prototype.shoot = function(location) {
            this.shootTime = 0;
            var direction = location.clone().subtract(this.getShootingLocation().x, this.getShootingLocation().y).normalize();
            var attackBuff = false;
            if (this.powerUpGrabbed.length > 0) {
                var i;
                for (i = 0; i < this.powerUpGrabbed.length; i++) {
                    if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.ATTACK) {
                        attackBuff = true;
                        break;
                    }
                }
            }
            if (attackBuff)
                DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.PLAYER_POWERUP, this.bulletVelocity, this.attack, this.getShootingLocation(), direction);
            else {
                if (this.selectedDroneIndex === "4" || this.selectedDroneIndex === "5") {
                    DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.PLAYER_HEAVY, this.bulletVelocity, this.attack, this.getShootingLocation(), direction, this.getBoundingBox().height * 0.8);
                } else {
                    DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.PLAYER_BASIC, this.bulletVelocity, this.attack, this.getShootingLocation(), direction, this.getBoundingBox().height * 0.8);
                }
            }
            if (direction.x < 0 && this.state !== PlayerState.MOVING) {
                this.droneSprite.scale.x = -1;
            } else if (direction.x > 0 && this.state !== PlayerState.MOVING) {
                this.droneSprite.scale.x = 1;
            }
        };
        Player.prototype.hit = function(bullet) {
            var _this = this;
            if (this.powerUpGrabbed.length > 0) {
                var i;
                for (i = 0; i < this.powerUpGrabbed.length; i++) {
                    if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.DEFENSE)
                        return;
                }
            }
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            //Ask if i die
            if (this.health - bullet.attack <= 0) {
                this.soundFX.play('explode');
                this.health = 0;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth), this.hpGreen.height);
                this.die();
            } else {
                if (this.selectedDroneIndex === "4" || this.selectedDroneIndex === "5")
                    this.soundFX.play('hit3');
                else
                    this.soundFX.play('hit2');
                this.health -= bullet.attack;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth), this.hpGreen.height);
                this.healthTime = 0;
                this.hpGroup.visible = true;
                var colorBlend = {
                    step: 0
                };
                if (this.tintTween !== null)
                    this.tintTween.stop();
                this.tintTween = this.game.add.tween(colorBlend).to({
                        step: 100
                    }, 200, Phaser.Easing.Default, false)
                    .onUpdateCallback(function() {
                        _this.droneSprite.tint = Phaser.Color.interpolateColor(0xff9696, 0xffffff, 100, colorBlend.step, 1);
                    })
                    .start();
            }
        };
        Player.prototype.die = function() {
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY), 0);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX + this.getBoundingBox().width * 0.15, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.1), 0.15);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX - this.getBoundingBox().width * 0.13, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.12), 0.3);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY), 0.45);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX + this.getBoundingBox().width * 0.15, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.1), 0.60);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX - this.getBoundingBox().width * 0.13, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.12), 0.75);
            if (this.tweenMovement)
                this.tweenMovement.stop();
            this.timeElapsedDying = 0;
            this.state = PlayerState.DYING;
        };
        Player.prototype.isCollisioning = function(bullet) {
            var rectangle = this.getBoundingBox();
            if (rectangle.width < 0) {
                rectangle.x += rectangle.width;
                rectangle.width *= -1;
            }
            var direction = bullet.currentLocation.clone().subtract(bullet.previousLocation.x, bullet.previousLocation.y);
            if (rectangle.contains(bullet.previousLocation.x + 0.25 * direction.x, bullet.previousLocation.y + 0.25 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.5 * direction.x, bullet.previousLocation.y + 0.5 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.75 * direction.x, bullet.previousLocation.y + 0.75 * direction.y))
                return true;
            if (rectangle.contains(bullet.currentLocation.x, bullet.currentLocation.y))
                return true;
            return false;
        };
        Player.prototype.grabPowerUp = function(powerUp) {
            if (powerUp.type === DroneWars.PowerUpType.HEALTH) {
                this.maskBarGreen.clear();
                this.maskBarGreen.beginFill(0xffffff);
                var healthSum = Math.floor(this.maxHealth * powerUp.amount);
                this.health += healthSum;
                if (this.health > this.maxHealth)
                    this.health = this.maxHealth;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth), this.hpGreen.height);
                this.hpGroup.visible = true;
                this.healthTime = 0;
                this.powerUpGrabbed.push(powerUp);
                this.powerUpSprite.play('health', 35, true);
            } else if (powerUp.type === DroneWars.PowerUpType.SPEED) {
                this.speed += powerUp.amount;
                this.powerUpGrabbed.push(powerUp);
                this.powerUpSprite.play('speed', 30, true);
                this.powerUpIcon.frameName = 'PowerUp_IconSpeed.png';
                this.powerUpIcon.visible = true;
            } else if (powerUp.type === DroneWars.PowerUpType.ATTACK) {
                this.attack += powerUp.amount;
                this.powerUpGrabbed.push(powerUp);
                this.powerUpSprite.play('damage', 20, true);
                this.powerUpIcon.frameName = 'PowerUp_IconDamage.png';
                this.powerUpIcon.visible = true;
            } else if (powerUp.type === DroneWars.PowerUpType.DEFENSE) {
                this.powerUpGrabbed.push(powerUp);
                this.powerUpSprite.play('defense', 20, true);
                this.powerUpIcon.frameName = 'PowerUp_IconShield.png';
                this.powerUpIcon.visible = true;
            }
            this.powerUpSprite.visible = true;
        };
        Player.prototype.update = function() {
            this.timeElapsed += this.game.time.physicsElapsed;
            var scaleShadow = 0.05 * Math.cos(this.timeElapsed * 3) + 0.95;
            this.shadowSprite.scale.setTo(scaleShadow, scaleShadow);
            var posY = 0.03 * this.tileSize.y * Math.cos(this.timeElapsed * 3) + this.shadowSprite.y - this.tileSize.y * 0.37;
            this.droneSprite.position.setTo(this.shadowSprite.x, posY);
            if (this.shootTime < this.timeBetweenShoots)
                this.shootTime += this.game.time.physicsElapsed;
            // draw a rectangle
            //this.graphics.clear();
            //this.graphics.lineStyle(2, 0x0000FF, 1);
            //this.graphics.drawRect(this.getBoundingBox().x, this.getBoundingBox().y, this.getBoundingBox().width, this.getBoundingBox().height);
            if (this.hpGroup.visible) {
                this.healthTime += this.game.time.physicsElapsed;
                if (this.healthTime >= this.healthSecondsAppearing) {
                    this.hpGroup.visible = false;
                }
            }
            if (this.state === PlayerState.DYING) {
                this.timeElapsedDying += this.game.time.physicsElapsed;
                if (this.timeElapsedDying >= 0.75) {
                    this.droneSprite.visible = false;
                    this.shadowSprite.visible = false;
                    var ingame = this.game.state.getCurrentState();
                    ingame.onGameOver();
                    this.state = PlayerState.DIED;
                }
            }
            if (this.powerUpGrabbed.length > 0) {
                var isHealth = false;
                var i = 0;
                while (i < this.powerUpGrabbed.length) {
                    if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.HEALTH) {
                        isHealth = true;
                    }
                    if (this.powerUpGrabbed[i].state === DroneWars.PowerUpState.FINISHED) {
                        if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.SPEED) {
                            this.speed -= this.powerUpGrabbed[i].amount;
                        } else if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.ATTACK) {
                            this.attack -= this.powerUpGrabbed[i].amount;
                        } else if (this.powerUpGrabbed[i].type === DroneWars.PowerUpType.DEFENSE) {}
                        this.powerUpGrabbed[i].setIdle();
                        this.powerUpGrabbed.splice(i, 1);
                        this.powerUpSprite.visible = false;
                        this.powerUpIcon.visible = false;
                    } else {
                        i++;
                    }
                }
                if (isHealth)
                    this.powerUpSprite.alpha = 1.0;
                else
                    this.powerUpSprite.alpha = 0.8 + 0.2 * Math.sin(this.timeElapsed * 6);
                this.powerUpIcon.scale.x = 0.95 + 0.05 * Math.sin(this.timeElapsed * 6);
                this.powerUpIcon.scale.y = 0.9 + 0.1 * Math.cos(this.timeElapsed * 6);
            }
            this.z = this.shadowSprite.position.y + 4;
        };
        return Player;
    }(Phaser.Group));
    DroneWars.Player = Player;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(BulletState) {
        BulletState[BulletState["IDLE"] = 0] = "IDLE";
        BulletState[BulletState["MOVING"] = 1] = "MOVING";
        BulletState[BulletState["DISAPPEAR"] = 2] = "DISAPPEAR";
    })(DroneWars.BulletState || (DroneWars.BulletState = {}));
    var BulletState = DroneWars.BulletState;
    (function(BulletType) {
        BulletType[BulletType["PLAYER_BASIC"] = 0] = "PLAYER_BASIC";
        BulletType[BulletType["PLAYER_HEAVY"] = 1] = "PLAYER_HEAVY";
        BulletType[BulletType["PLAYER_POWERUP"] = 2] = "PLAYER_POWERUP";
        BulletType[BulletType["BASIC"] = 3] = "BASIC";
        BulletType[BulletType["MEDIUM"] = 4] = "MEDIUM";
        BulletType[BulletType["HEAVY"] = 5] = "HEAVY";
    })(DroneWars.BulletType || (DroneWars.BulletType = {}));
    var BulletType = DroneWars.BulletType;
    var Bullet = (function(_super) {
        __extends(Bullet, _super);

        function Bullet(game, type, velocity, attack, location, direction, offset) {
            if (offset === void 0) {
                offset = 0;
            }
            _super.call(this, game);
            this.direction = new Phaser.Point(0, 0);
            this.state = BulletState.IDLE;
            this.type = type;
            this.velocity = velocity;
            this.attack = attack;
            if (type === BulletType.PLAYER_BASIC)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Pj_Bullet1.png');
            else if (type === BulletType.PLAYER_HEAVY)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Pj_Bullet2.png');
            else if (type === BulletType.PLAYER_POWERUP)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'PowerUp_Bullet.png');
            else if (type === BulletType.BASIC)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Bullet1.png');
            else if (type === BulletType.MEDIUM)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Bullet1.png');
            else if (type === BulletType.HEAVY)
                this.bulletSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Bullet2.png');
            this.bulletSprite.anchor.setTo(0.95, 0.5);
            this.bulletSprite.rotation = direction.angle(new Phaser.Point(0, 0)) + Math.PI;
            this.add(this.bulletSprite);
            var directionUni = direction.clone();
            directionUni = directionUni.multiply(offset, offset);
            location = location.add(directionUni.x, directionUni.y);
            this.bulletSprite.position.setTo(location.x, location.y);
            this.direction = direction.multiply(this.velocity, this.velocity);
            game.add.existing(this);
            DroneWars.BulletManager.bulletGroup.add(this);
            this.previousLocation = this.bulletSprite.position.clone();
            this.currentLocation = this.bulletSprite.position.clone();
            this.state = BulletState.MOVING;
        }
        Bullet.prototype.shoot = function(type, velocity, attack, location, direction, offset) {
            if (offset === void 0) {
                offset = 0;
            }
            this.type = type;
            this.velocity = velocity;
            this.attack = attack;
            if (type === BulletType.PLAYER_BASIC)
                this.bulletSprite.frameName = "Pj_Bullet1.png";
            else if (type === BulletType.PLAYER_HEAVY)
                this.bulletSprite.frameName = "Pj_Bullet2.png";
            else if (type === BulletType.PLAYER_POWERUP)
                this.bulletSprite.frameName = "PowerUp_Bullet.png";
            else if (type === BulletType.BASIC)
                this.bulletSprite.frameName = "Bullet1.png";
            else if (type === BulletType.MEDIUM)
                this.bulletSprite.frameName = "Bullet1.png";
            else if (type === BulletType.HEAVY)
                this.bulletSprite.frameName = "Bullet2.png";
            var directionUni = direction.clone();
            directionUni = directionUni.multiply(offset, offset);
            location = location.add(directionUni.x, directionUni.y);
            this.bulletSprite.position.setTo(location.x, location.y);
            this.bulletSprite.rotation = direction.angle(new Phaser.Point(0, 0)) + Math.PI;
            this.direction = direction.multiply(this.velocity, this.velocity);
            this.previousLocation = this.bulletSprite.position.clone();
            this.currentLocation = this.bulletSprite.position.clone();
            this.bulletSprite.visible = true;
            this.bulletSprite.alpha = 1;
            this.state = BulletState.MOVING;
        };
        Bullet.prototype.explode = function() {
            this.bulletSprite.visible = false;
            this.state = BulletState.IDLE;
        };
        Bullet.prototype.update = function() {
            if (this.state === BulletState.MOVING) {
                this.previousLocation = this.bulletSprite.position.clone();
                this.bulletSprite.position.x += this.direction.x * this.game.time.physicsElapsed;
                this.bulletSprite.position.y += this.direction.y * this.game.time.physicsElapsed;
                this.currentLocation = this.bulletSprite.position.clone();
                if ((this.bulletSprite.position.x < 0 || this.bulletSprite.position.x >= DroneWars.GameCanvas.defaultWidth || this.bulletSprite.position.y < 0 || this.bulletSprite.position.y > DroneWars.GameCanvas.defaultHeight) && this.state === BulletState.MOVING) {
                    var tweenMovement = this.game.add.tween(this.bulletSprite).to({
                        alpha: 0
                    }, 150, Phaser.Easing.Linear.None, false);
                    tweenMovement.onComplete.add(this.explode, this);
                    tweenMovement.start();
                    this.state = BulletState.DISAPPEAR;
                }
            }
        };
        return Bullet;
    }(Phaser.Group));
    DroneWars.Bullet = Bullet;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var BulletManager = (function() {
        function BulletManager() {}
        BulletManager.init = function(game) {
            BulletManager.soundFX = game.add.audio('sfx');
            BulletManager.soundFX.allowMultiple = true;
            BulletManager.soundFX.addMarker('shoot1', 11, 0.4);
            BulletManager.soundFX.addMarker('shoot2', 11.5, 0.4);
            BulletManager.soundFX.addMarker('shoot3', 12, 0.6);
        };
        BulletManager.reset = function() {
            BulletManager.bulletArray = [];
        };
        BulletManager.createBullet = function(game, type, velocity, attack, location, direction, offset) {
            if (offset === void 0) {
                offset = 0;
            }
            if (type === DroneWars.BulletType.BASIC || type === DroneWars.BulletType.PLAYER_BASIC) {
                BulletManager.soundFX.play('shoot1');
            } else if (type === DroneWars.BulletType.MEDIUM || type === DroneWars.BulletType.PLAYER_HEAVY) {
                BulletManager.soundFX.play('shoot2');
            } else if (type === DroneWars.BulletType.HEAVY || type === DroneWars.BulletType.PLAYER_POWERUP) {
                BulletManager.soundFX.play('shoot3');
            }
            var i;
            var bullet;
            for (i = 0; i < BulletManager.bulletArray.length; i++) {
                bullet = BulletManager.bulletArray[i];
                if (bullet.state === DroneWars.BulletState.IDLE) {
                    bullet.shoot(type, velocity, attack, location, direction, offset);
                    return bullet;
                }
            }
            bullet = new DroneWars.Bullet(game, type, velocity, attack, location, direction, offset);
            BulletManager.bulletArray.push(bullet);
            return bullet;
        };
        BulletManager.bulletArray = [];
        return BulletManager;
    }());
    DroneWars.BulletManager = BulletManager;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(BossState) {
        BossState[BossState["IDLE"] = 0] = "IDLE";
        BossState[BossState["SET"] = 1] = "SET";
    })(DroneWars.BossState || (DroneWars.BossState = {}));
    var BossState = DroneWars.BossState;
    var Boss = (function(_super) {
        __extends(Boss, _super);

        function Boss(game, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.location = new Phaser.Point(0, 0);
            this.timeElapsed = this.game.rnd.realInRange(0, Math.PI * 2);
            this.state = BossState.IDLE;
            this.tintTween = null;
            this.shootTime = 0;
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('hit3', 14, 0.4);
            this.soundFX.addMarker('explode', 14.5, 0.4);
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            this.baseSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Boss_Base.png');
            this.baseSprite.anchor.setTo(0.5, 0.6);
            this.add(this.baseSprite);
            this.bossSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'Boss_Drone.png');
            this.bossSprite.anchor.setTo(0.515, 1);
            this.add(this.bossSprite);
            this.hpGroup = game.add.group();
            this.hpGroup.position.setTo(this.getBoundingBox().centerX, -this.bossSprite.height * 1.1);
            this.hpGroup.visible = false;
            this.bossSprite.addChild(this.hpGroup);
            var hpBackground;
            hpBackground = game.add.sprite(-this.bossSprite.position.x, 0, 'GameScene', 'Hud_BigHpBar.png');
            hpBackground.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(hpBackground);
            this.maskBarGreen = game.add.graphics(0, 0);
            this.hpGroup.addChild(this.maskBarGreen);
            this.hpGreen = game.add.sprite(-this.bossSprite.position.x, 0, 'GameScene', 'Hud_BigGreenBar.png');
            this.hpGreen.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(this.hpGreen);
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width, this.hpGreen.height);
            this.hpGreen.mask = this.maskBarGreen;
            this.tileSize.setTo(tileWidth, tileHeight);
            //Set Easy
            this.difficulty = 0;
            game.add.existing(this);
            this.state = BossState.SET;
        }
        Boss.prototype.setAttack = function(attack) {
            this.attack = attack;
        };
        Boss.prototype.setHealth = function(health) {
            this.health = health[this.difficulty];
            this.maxHealth = health;
        };
        Boss.prototype.setTimeBetweenShoots = function(timeBetweenShoots) {
            this.timeBetweenShoots = timeBetweenShoots;
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Boss.prototype.setBulletVelocity = function(bulletVelocity) {
            this.bulletVelocity = bulletVelocity;
        };
        Boss.prototype.setHealthSecondsAppearing = function(healthSecondsAppearing) {
            this.healthSecondsAppearing = healthSecondsAppearing;
            this.healthTime = healthSecondsAppearing;
        };
        Boss.prototype.setCoins = function(coins) {
            this.coins = coins;
        };
        Boss.prototype.setDifficulty = function(difficulty) {
            this.difficulty = difficulty;
            this.health = this.maxHealth[this.difficulty];
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Boss.prototype.update = function() {
            this.timeElapsed += this.game.time.physicsElapsed;
            var posY = 0.03 * this.tileSize.y * Math.cos(this.timeElapsed * 3) + this.location.y * this.tileSize.y + this.tileSize.y - this.tileSize.y * 0.47;
            this.bossSprite.y = posY;
            if (this.shootTime < this.timeBetweenShoots[this.difficulty])
                this.shootTime += this.game.time.physicsElapsed;
            if (this.hpGroup.visible) {
                this.healthTime += this.game.time.physicsElapsed;
                if (this.healthTime >= this.healthSecondsAppearing) {
                    this.hpGroup.visible = false;
                }
            }
            this.z = this.baseSprite.position.y + 3;
        };
        Boss.prototype.getShootingLocation = function() {
            return new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY);
        };
        Boss.prototype.getBoundingBox = function() {
            return new Phaser.Rectangle(this.bossSprite.position.x - this.bossSprite.width * 0.2, this.bossSprite.position.y - this.bossSprite.height * 0.8, this.bossSprite.width * 0.45, this.bossSprite.height * 0.7);
        };
        Boss.prototype.isReadyForShooting = function() {
            if (this.shootTime >= this.timeBetweenShoots[this.difficulty] && this.state !== BossState.IDLE) {
                return true;
            }
            return false;
        };
        Boss.prototype.shoot = function(location) {
            this.shootTime = 0;
            var direction = location.clone().subtract(this.getShootingLocation().x, this.getShootingLocation().y).normalize();
            DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.HEAVY, this.bulletVelocity[this.difficulty], this.attack[this.difficulty], this.getShootingLocation(), direction, this.getBoundingBox().height * 0.7);
            if (direction.x < 0) {
                this.bossSprite.scale.x = -1;
            } else if (direction.x > 0) {
                this.bossSprite.scale.x = 1;
            }
        };
        Boss.prototype.hit = function(bullet) {
            var _this = this;
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            //Ask if i die
            if (this.health - bullet.attack <= 0) {
                this.soundFX.play('explode');
                this.health = 0;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.die();
            } else {
                this.soundFX.play('hit3');
                this.health -= bullet.attack;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.healthTime = 0;
                this.hpGroup.visible = true;
                var colorBlend = {
                    step: 0
                };
                if (this.tintTween !== null)
                    this.tintTween.stop();
                this.tintTween = this.game.add.tween(colorBlend).to({
                        step: 100
                    }, 200, Phaser.Easing.Default, false)
                    .onUpdateCallback(function() {
                        _this.bossSprite.tint = Phaser.Color.interpolateColor(0xff9696, 0xffffff, 100, colorBlend.step, 1);
                    })
                    .start();
            }
        };
        Boss.prototype.die = function() {
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY));
            this.bossSprite.visible = false;
            this.baseSprite.visible = false;
            this.state = BossState.IDLE;
            var ingame = this.game.state.getCurrentState();
            ingame.onCoinsAdded(this.coins[this.difficulty]);
        };
        Boss.prototype.isCollisioning = function(bullet) {
            var rectangle = this.getBoundingBox();
            if (rectangle.width < 0) {
                rectangle.x += rectangle.width;
                rectangle.width *= -1;
            }
            var direction = bullet.currentLocation.clone().subtract(bullet.previousLocation.x, bullet.previousLocation.y);
            if (rectangle.contains(bullet.previousLocation.x + 0.25 * direction.x, bullet.previousLocation.y + 0.25 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.5 * direction.x, bullet.previousLocation.y + 0.5 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.75 * direction.x, bullet.previousLocation.y + 0.75 * direction.y))
                return true;
            if (rectangle.contains(bullet.currentLocation.x, bullet.currentLocation.y))
                return true;
            return false;
        };
        return Boss;
    }(Phaser.Group));
    DroneWars.Boss = Boss;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(DroneState) {
        DroneState[DroneState["IDLE"] = 0] = "IDLE";
        DroneState[DroneState["SET"] = 1] = "SET";
        DroneState[DroneState["MOVING"] = 2] = "MOVING";
        DroneState[DroneState["SHOOTING"] = 3] = "SHOOTING";
    })(DroneWars.DroneState || (DroneWars.DroneState = {}));
    var DroneState = DroneWars.DroneState;
    (function(DroneType) {
        DroneType[DroneType["LIGHT"] = 0] = "LIGHT";
        DroneType[DroneType["MEDIUM"] = 1] = "MEDIUM";
        DroneType[DroneType["HEAVY"] = 2] = "HEAVY";
    })(DroneWars.DroneType || (DroneWars.DroneType = {}));
    var DroneType = DroneWars.DroneType;
    (function(DroneColor) {
        DroneColor[DroneColor["RED"] = 0] = "RED";
        DroneColor[DroneColor["YELLOW"] = 1] = "YELLOW";
        DroneColor[DroneColor["MAGENTA"] = 2] = "MAGENTA";
        DroneColor[DroneColor["GREEN"] = 3] = "GREEN";
        DroneColor[DroneColor["BLACK"] = 4] = "BLACK";
    })(DroneWars.DroneColor || (DroneWars.DroneColor = {}));
    var DroneColor = DroneWars.DroneColor;
    (function(DroneDesign) {
        DroneDesign[DroneDesign["A"] = 0] = "A";
        DroneDesign[DroneDesign["B"] = 1] = "B";
    })(DroneWars.DroneDesign || (DroneWars.DroneDesign = {}));
    var DroneDesign = DroneWars.DroneDesign;
    var Drone = (function(_super) {
        __extends(Drone, _super);

        function Drone(game, type, droneColor, x, y, tileWidth, tileHeight, route) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.location = new Phaser.Point(0, 0);
            this.timeElapsed = this.game.rnd.realInRange(0, Math.PI * 2);
            this.state = DroneState.IDLE;
            this.tintTween = null;
            this.shootTime = 0;
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('hit1', 13, 0.4);
            this.soundFX.addMarker('hit2', 13.5, 0.4);
            this.soundFX.addMarker('hit3', 14, 0.4);
            this.soundFX.addMarker('explode', 14.5, 0.4);
            this.type = type;
            var colorIndex = this.game.rnd.integerInRange(0, 4);
            if (colorIndex === 0)
                this.droneColor = DroneColor.RED;
            else if (colorIndex === 1)
                this.droneColor = DroneColor.YELLOW;
            else if (colorIndex === 2)
                this.droneColor = DroneColor.MAGENTA;
            else if (colorIndex === 3)
                this.droneColor = DroneColor.GREEN;
            else if (colorIndex === 4)
                this.droneColor = DroneColor.BLACK;
            this.route = route;
            if (this.route !== null) {
                if (this.route.length === 0)
                    this.route = null;
            }
            this.indexRoute = 0;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            if (type === DroneType.LIGHT)
                this.shadowSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Light_Shadow.png');
            else if (type === DroneType.MEDIUM)
                this.shadowSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Medium_Shadow.png');
            else if (type === DroneType.HEAVY)
                this.shadowSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Heavy_Shadow.png');
            this.shadowSprite.anchor.setTo(0.5, 1);
            this.add(this.shadowSprite);
            this.droneDesign = this.game.rnd.integerInRange(0, 1);
            var designString = "A";
            if (this.droneDesign === DroneDesign.B)
                designString = "B";
            var colorString = "Red";
            if (this.droneColor === DroneColor.RED)
                colorString = "Red";
            else if (this.droneColor === DroneColor.YELLOW)
                colorString = "Orange";
            else if (this.droneColor === DroneColor.MAGENTA)
                colorString = "Pink";
            else if (this.droneColor === DroneColor.GREEN)
                colorString = "Green";
            else if (this.droneColor === DroneColor.BLACK)
                colorString = "Black";
            if (type === DroneType.LIGHT)
                this.droneSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.4, 'GameScene', 'Light' + designString + '_' + colorString + '.png');
            else if (type === DroneType.MEDIUM)
                this.droneSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.4, 'GameScene', 'Medium' + designString + '_' + colorString + '.png');
            else if (type === DroneType.HEAVY)
                this.droneSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.4, 'GameScene', 'Heavy' + designString + '_' + colorString + '.png');
            this.droneSprite.anchor.setTo(0.5, 1);
            this.add(this.droneSprite);
            this.hpGroup = game.add.group();
            this.hpGroup.position.setTo(this.getBoundingBox().centerX, -this.droneSprite.height * 1.1);
            this.hpGroup.visible = false;
            this.droneSprite.addChild(this.hpGroup);
            var hpBackground;
            if (type === DroneType.LIGHT)
                hpBackground = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_SmallHpBar.png');
            else if (type === DroneType.MEDIUM)
                hpBackground = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_MediumHpBar.png');
            else if (type === DroneType.HEAVY)
                hpBackground = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_BigHpBar.png');
            hpBackground.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(hpBackground);
            this.maskBarGreen = game.add.graphics(0, 0);
            this.hpGroup.addChild(this.maskBarGreen);
            if (type === DroneType.LIGHT)
                this.hpGreen = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_SmallGreenBar.png');
            else if (type === DroneType.MEDIUM)
                this.hpGreen = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_MediumGreenBar.png');
            else if (type === DroneType.HEAVY)
                this.hpGreen = game.add.sprite(-this.droneSprite.position.x, 0, 'GameScene', 'Hud_BigGreenBar.png');
            this.hpGreen.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(this.hpGreen);
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width, this.hpGreen.height);
            this.hpGreen.mask = this.maskBarGreen;
            this.tileSize.setTo(tileWidth, tileHeight);
            game.add.existing(this);
            this.type = type;
            //Set Easy
            this.difficulty = 0;
            if (this.route !== null) {
                this.createPositionsList();
                this.indexRoute = 0;
                this.state = DroneState.SET;
            } else {
                this.state = DroneState.SET;
            }
        }
        Drone.prototype.createPositionsList = function() {
            this.positionsList = [];
            var x = this.location.x;
            var y = this.location.y;
            var i;
            for (i = 0; i < this.route.length; i++) {
                if (this.route[i] === 'U')
                    y -= 1;
                else if (this.route[i] === 'D')
                    y += 1;
                else if (this.route[i] === 'L')
                    x -= 1;
                else if (this.route[i] === 'R')
                    x += 1;
                this.positionsList.push(new Phaser.Point(x, y));
            }
        };
        Drone.prototype.startMovement = function() {
            if (this.route !== null) {
                if (this.route[this.indexRoute] === 'L') {
                    this.droneSprite.scale.x = -1;
                } else if (this.route[this.indexRoute] === 'R') {
                    this.droneSprite.scale.x = 1;
                }
                if (this.route[this.indexRoute] === 'W') {
                    this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                        x: this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5,
                        y: this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y
                    }, this.waitSeconds * 1000, Phaser.Easing.Linear.None, false);
                } else {
                    var distance = this.shadowSprite.position.distance(new Phaser.Point(this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5, this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y));
                    this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                        x: this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5,
                        y: this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y
                    }, (distance / this.velocity[this.difficulty]) * 1000, Phaser.Easing.Linear.None, false);
                }
                this.tweenMovement.onComplete.add(this.nextMovement, this);
                this.tweenMovement.start();
                this.state = DroneState.MOVING;
            }
        };
        Drone.prototype.nextMovement = function() {
            this.location.setTo(Math.floor((this.shadowSprite.position.x - this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((this.shadowSprite.position.y - this.tileSize.y) / this.tileSize.y));
            this.indexRoute += 1;
            if (this.indexRoute >= this.route.length)
                this.indexRoute = 0;
            if (this.route[this.indexRoute] === 'L') {
                this.droneSprite.scale.x = -1;
            } else if (this.route[this.indexRoute] === 'R') {
                this.droneSprite.scale.x = 1;
            }
            if (this.route[this.indexRoute] === 'W') {
                this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                    x: this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5,
                    y: this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y
                }, this.waitSeconds * 1000, Phaser.Easing.Linear.None, false);
            } else {
                var distance = this.shadowSprite.position.distance(new Phaser.Point(this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5, this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y));
                this.tweenMovement = this.game.add.tween(this.shadowSprite.position).to({
                    x: this.positionsList[this.indexRoute].x * this.tileSize.x + this.tileSize.x * 0.5,
                    y: this.positionsList[this.indexRoute].y * this.tileSize.y + this.tileSize.y
                }, (distance / this.velocity[this.difficulty]) * 1000, Phaser.Easing.Linear.None, false);
            }
            this.tweenMovement.onComplete.add(this.nextMovement, this);
            this.tweenMovement.start();
        };
        Drone.prototype.setDrone = function(droneColor, x, y, tileWidth, tileHeight, route) {
            this.droneColor = droneColor;
            this.route = route;
            this.indexRoute = 0;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
        };
        Drone.prototype.setAttack = function(attack) {
            this.attack = attack;
        };
        Drone.prototype.setHealth = function(health) {
            this.health = health[this.difficulty];
            this.maxHealth = health;
        };
        Drone.prototype.setVelocity = function(velocity) {
            this.velocity = velocity;
        };
        Drone.prototype.setTimeBetweenShoots = function(timeBetweenShoots) {
            this.timeBetweenShoots = timeBetweenShoots;
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Drone.prototype.setBulletVelocity = function(bulletVelocity) {
            this.bulletVelocity = bulletVelocity;
        };
        Drone.prototype.setRange = function(range) {
            this.range = range;
        };
        Drone.prototype.setWaitSeconds = function(waitSeconds) {
            this.waitSeconds = waitSeconds;
        };
        Drone.prototype.setHealthSecondsAppearing = function(healthSecondsAppearing) {
            this.healthSecondsAppearing = healthSecondsAppearing;
            this.healthTime = healthSecondsAppearing;
        };
        Drone.prototype.setCoins = function(coins) {
            this.coins = coins;
        };
        Drone.prototype.setDifficulty = function(difficulty) {
            this.difficulty = difficulty;
            this.health = this.maxHealth[this.difficulty];
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Drone.prototype.getRange = function() {
            return this.range[this.difficulty];
        };
        Drone.prototype.update = function() {
            this.timeElapsed += this.game.time.physicsElapsed;
            var scaleShadow = 0.05 * Math.cos(this.timeElapsed * 3) + 0.95;
            this.shadowSprite.scale.setTo(scaleShadow, scaleShadow);
            var posY = 0.03 * this.tileSize.y * Math.cos(this.timeElapsed * 3) + this.shadowSprite.y - this.tileSize.y * 0.37;
            this.droneSprite.position.setTo(this.shadowSprite.x, posY);
            if (this.shootTime < this.timeBetweenShoots[this.difficulty])
                this.shootTime += this.game.time.physicsElapsed;
            if (this.hpGroup.visible) {
                this.healthTime += this.game.time.physicsElapsed;
                if (this.healthTime >= this.healthSecondsAppearing) {
                    this.hpGroup.visible = false;
                }
            }
            this.z = this.shadowSprite.position.y + 1;
        };
        Drone.prototype.getShootingLocation = function() {
            return new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY);
        };
        Drone.prototype.getBoundingBox = function() {
            if (this.type === DroneType.LIGHT) {
                if (this.droneDesign === DroneDesign.A) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.7, this.droneSprite.width * 0.65, this.droneSprite.height * 0.65);
                } else if (this.droneDesign === DroneDesign.B) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.65, this.droneSprite.height * 0.65);
                }
            } else if (this.type === DroneType.MEDIUM) {
                if (this.droneDesign === DroneDesign.A) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.9, this.droneSprite.width * 0.7, this.droneSprite.height * 0.8);
                } else if (this.droneDesign === DroneDesign.B) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.7, this.droneSprite.height * 0.8);
                }
            } else if (this.type === DroneType.HEAVY) {
                if (this.droneDesign === DroneDesign.A) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.3, this.droneSprite.position.y - this.droneSprite.height * 0.8, this.droneSprite.width * 0.65, this.droneSprite.height * 0.7);
                } else if (this.droneDesign === DroneDesign.B) {
                    return new Phaser.Rectangle(this.droneSprite.position.x - this.droneSprite.width * 0.23, this.droneSprite.position.y - this.droneSprite.height * 0.75, this.droneSprite.width * 0.5, this.droneSprite.height * 0.7);
                }
            }
        };
        Drone.prototype.isReadyForShooting = function() {
            if (this.shootTime >= this.timeBetweenShoots[this.difficulty] && this.state !== DroneState.IDLE) {
                return true;
            }
            return false;
        };
        Drone.prototype.shoot = function(location) {
            this.shootTime = 0;
            var direction = location.clone().subtract(this.getShootingLocation().x, this.getShootingLocation().y).normalize();
            if (this.type === DroneType.LIGHT) {
                DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.BASIC, this.bulletVelocity[this.difficulty], this.attack[this.difficulty], this.getShootingLocation(), direction, this.getBoundingBox().height * 0.8);
            } else if (this.type === DroneType.MEDIUM || this.type === DroneType.HEAVY) {
                DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.MEDIUM, this.bulletVelocity[this.difficulty], this.attack[this.difficulty], this.getShootingLocation(), direction, this.getBoundingBox().height * 0.8);
            }
            if (direction.x < 0 && this.state !== DroneState.MOVING) {
                this.droneSprite.scale.x = -1;
            } else if (direction.x > 0 && this.state !== DroneState.MOVING) {
                this.droneSprite.scale.x = 1;
            }
        };
        Drone.prototype.hit = function(bullet) {
            var _this = this;
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            //Ask if i die
            if (this.health - bullet.attack <= 0) {
                this.soundFX.play('explode');
                this.health = 0;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.die();
            } else {
                if (this.type === DroneType.LIGHT)
                    this.soundFX.play('hit1');
                else if (this.type === DroneType.MEDIUM)
                    this.soundFX.play('hit2');
                else if (this.type === DroneType.HEAVY)
                    this.soundFX.play('hit3');
                this.health -= bullet.attack;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.healthTime = 0;
                this.hpGroup.visible = true;
                var colorBlend = {
                    step: 0
                };
                if (this.tintTween !== null)
                    this.tintTween.stop();
                this.tintTween = this.game.add.tween(colorBlend).to({
                        step: 100
                    }, 200, Phaser.Easing.Default, false)
                    .onUpdateCallback(function() {
                        _this.droneSprite.tint = Phaser.Color.interpolateColor(0xff9696, 0xffffff, 100, colorBlend.step, 1);
                    })
                    .start();
            }
        };
        Drone.prototype.die = function() {
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY), 0);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX + this.getBoundingBox().width * 0.15, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.1), 0.15);
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX - this.getBoundingBox().width * 0.13, this.getBoundingBox().centerY - this.getBoundingBox().height * 0.12), 0.2);
            this.droneSprite.visible = false;
            this.shadowSprite.visible = false;
            this.state = DroneState.IDLE;
            var ingame = this.game.state.getCurrentState();
            ingame.onCoinsAdded(this.coins[this.difficulty]);
        };
        Drone.prototype.isCollisioning = function(bullet) {
            var rectangle = this.getBoundingBox();
            if (rectangle.width < 0) {
                rectangle.x += rectangle.width;
                rectangle.width *= -1;
            }
            var direction = bullet.currentLocation.clone().subtract(bullet.previousLocation.x, bullet.previousLocation.y);
            if (rectangle.contains(bullet.previousLocation.x + 0.25 * direction.x, bullet.previousLocation.y + 0.25 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.5 * direction.x, bullet.previousLocation.y + 0.5 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.75 * direction.x, bullet.previousLocation.y + 0.75 * direction.y))
                return true;
            if (rectangle.contains(bullet.currentLocation.x, bullet.currentLocation.y))
                return true;
            return false;
        };
        return Drone;
    }(Phaser.Group));
    DroneWars.Drone = Drone;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var DroneManager = (function() {
        function DroneManager() {}
        DroneManager.init = function(game) {
            DroneManager.jsonDrones = JSON.parse(game.cache.getText('statsConfig'));
        };
        DroneManager.reset = function() {
            DroneManager.droneArray = [];
            DroneManager.bossArray = [];
        };
        DroneManager.createDrone = function(game, type, droneColor, difficulty, x, y, tileWidth, tileHeight, route) {
            if (DroneManager.jsonDrones === null) {
                DroneManager.init(game);
            }
            var i;
            var drone;
            for (i = 0; i < DroneManager.droneArray.length; i++) {
                drone = DroneManager.droneArray[i];
                if (drone.state === DroneWars.DroneState.IDLE && drone.type === type) {
                    drone.setDrone(droneColor, x, y, tileWidth, tileHeight, route);
                    return drone;
                }
            }
            drone = new DroneWars.Drone(game, type, droneColor, x, y, tileWidth, tileHeight, route);
            if (type === DroneWars.DroneType.LIGHT) {
                drone.setAttack(DroneManager.jsonDrones.LD.attack);
                drone.setHealth(DroneManager.jsonDrones.LD.health);
                drone.setVelocity(DroneManager.jsonDrones.LD.velocity);
                drone.setTimeBetweenShoots(DroneManager.jsonDrones.LD.timeBetweenShoots);
                drone.setBulletVelocity(DroneManager.jsonDrones.LD.bulletVelocity);
                drone.setRange(DroneManager.jsonDrones.LD.range);
                drone.setWaitSeconds(DroneManager.jsonDrones.LD.waitSeconds);
                drone.setHealthSecondsAppearing(DroneManager.jsonDrones.LD.healthSecondsAppearing);
                drone.setCoins(DroneManager.jsonDrones.LD.coins);
            } else if (type === DroneWars.DroneType.MEDIUM) {
                drone.setAttack(DroneManager.jsonDrones.MD.attack);
                drone.setHealth(DroneManager.jsonDrones.MD.health);
                drone.setVelocity(DroneManager.jsonDrones.MD.velocity);
                drone.setTimeBetweenShoots(DroneManager.jsonDrones.MD.timeBetweenShoots);
                drone.setBulletVelocity(DroneManager.jsonDrones.MD.bulletVelocity);
                drone.setRange(DroneManager.jsonDrones.MD.range);
                drone.setWaitSeconds(DroneManager.jsonDrones.MD.waitSeconds);
                drone.setHealthSecondsAppearing(DroneManager.jsonDrones.MD.healthSecondsAppearing);
                drone.setCoins(DroneManager.jsonDrones.MD.coins);
            } else if (type === DroneWars.DroneType.HEAVY) {
                drone.setAttack(DroneManager.jsonDrones.HD.attack);
                drone.setHealth(DroneManager.jsonDrones.HD.health);
                drone.setVelocity(DroneManager.jsonDrones.HD.velocity);
                drone.setTimeBetweenShoots(DroneManager.jsonDrones.HD.timeBetweenShoots);
                drone.setBulletVelocity(DroneManager.jsonDrones.HD.bulletVelocity);
                drone.setRange(DroneManager.jsonDrones.HD.range);
                drone.setWaitSeconds(DroneManager.jsonDrones.HD.waitSeconds);
                drone.setHealthSecondsAppearing(DroneManager.jsonDrones.HD.healthSecondsAppearing);
                drone.setCoins(DroneManager.jsonDrones.HD.coins);
            }
            drone.setDifficulty(difficulty);
            DroneManager.droneArray.push(drone);
            return drone;
        };
        DroneManager.createBoss = function(game, difficulty, x, y, tileWidth, tileHeight) {
            if (DroneManager.jsonDrones === null) {
                DroneManager.init(game);
            }
            var i;
            var boss;
            for (i = 0; i < DroneManager.bossArray.length; i++) {
                boss = DroneManager.bossArray[i];
                if (boss.state === DroneWars.BossState.IDLE) {
                    return boss;
                }
            }
            boss = new DroneWars.Boss(game, x, y, tileWidth, tileHeight);
            boss.setAttack(DroneManager.jsonDrones.Boss.attack);
            boss.setHealth(DroneManager.jsonDrones.Boss.health);
            boss.setTimeBetweenShoots(DroneManager.jsonDrones.Boss.timeBetweenShoots);
            boss.setBulletVelocity(DroneManager.jsonDrones.Boss.bulletVelocity);
            boss.setHealthSecondsAppearing(parseFloat(DroneManager.jsonDrones.Boss.healthSecondsAppearing));
            boss.setCoins(DroneManager.jsonDrones.Boss.coins);
            boss.setDifficulty(difficulty);
            DroneManager.bossArray.push(boss);
            return boss;
        };
        DroneManager.availableDronesBosses = function() {
            var i;
            var drone;
            var boss;
            for (i = 0; i < DroneManager.droneArray.length; i++) {
                drone = DroneManager.droneArray[i];
                if (drone.state !== DroneWars.DroneState.IDLE) {
                    return true;
                }
            }
            for (i = 0; i < DroneManager.bossArray.length; i++) {
                boss = DroneManager.bossArray[i];
                if (boss.state !== DroneWars.BossState.IDLE) {
                    return true;
                }
            }
            return false;
        };
        DroneManager.droneArray = [];
        DroneManager.bossArray = [];
        DroneManager.jsonDrones = null;
        return DroneManager;
    }());
    DroneWars.DroneManager = DroneManager;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(ExplosionState) {
        ExplosionState[ExplosionState["IDLE"] = 0] = "IDLE";
        ExplosionState[ExplosionState["WAITING"] = 1] = "WAITING";
        ExplosionState[ExplosionState["EXPLODING"] = 2] = "EXPLODING";
    })(DroneWars.ExplosionState || (DroneWars.ExplosionState = {}));
    var ExplosionState = DroneWars.ExplosionState;
    (function(ExplosionType) {
        ExplosionType[ExplosionType["BULLET"] = 0] = "BULLET";
        ExplosionType[ExplosionType["ENEMY"] = 1] = "ENEMY";
    })(DroneWars.ExplosionType || (DroneWars.ExplosionType = {}));
    var ExplosionType = DroneWars.ExplosionType;
    var Explosion = (function(_super) {
        __extends(Explosion, _super);

        function Explosion(game, type, location, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            _super.call(this, game);
            this.state = ExplosionState.IDLE;
            this.type = type;
            if (type === ExplosionType.BULLET)
                this.explosionSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Damage.png');
            else if (type === ExplosionType.ENEMY)
                this.explosionSprite = game.add.sprite(location.x, location.y, 'GameScene', 'Explosion.png');
            this.explosionSprite.anchor.setTo(0.5, 0.5);
            this.explosionSprite.visible = false;
            this.delay = delay;
            this.add(this.explosionSprite);
            game.add.existing(this);
            DroneWars.ExplosionManager.explosionGroup.add(this);
            this.timeElapsed = 0;
            this.state = ExplosionState.WAITING;
        }
        Explosion.prototype.explode = function(type, location, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            this.type = type;
            this.delay = delay;
            this.explosionSprite.visible = false;
            if (type === ExplosionType.BULLET)
                this.explosionSprite.frameName = "Damage.png";
            else if (type === ExplosionType.ENEMY)
                this.explosionSprite.frameName = "Explosion.png";
            this.explosionSprite.position.setTo(location.x, location.y);
            this.timeElapsed = 0;
            this.state = ExplosionState.WAITING;
        };
        Explosion.prototype.finish = function() {
            this.state = ExplosionState.IDLE;
        };
        Explosion.prototype.update = function() {
            if (this.state === ExplosionState.WAITING) {
                this.timeElapsed += this.game.time.physicsElapsed;
                if (this.timeElapsed >= this.delay) {
                    this.explosionSprite.scale.setTo(0.3, 0.3);
                    this.explosionSprite.alpha = 1;
                    this.explosionSprite.visible = true;
                    this.game.add.tween(this.explosionSprite).to({
                        alpha: 0
                    }, 150, Phaser.Easing.Linear.None, true);
                    var tweenMovement = this.game.add.tween(this.explosionSprite.scale).to({
                        x: 1,
                        y: 1
                    }, 150, Phaser.Easing.Linear.None, false);
                    tweenMovement.onComplete.add(this.finish, this);
                    tweenMovement.start();
                    this.state = ExplosionState.EXPLODING;
                }
            }
        };
        return Explosion;
    }(Phaser.Group));
    DroneWars.Explosion = Explosion;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var ExplosionManager = (function() {
        function ExplosionManager() {}
        ExplosionManager.init = function() {};
        ExplosionManager.reset = function() {
            ExplosionManager.explosionArray = [];
        };
        ExplosionManager.createExplosion = function(game, type, location, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            var i;
            var explosion;
            for (i = 0; i < ExplosionManager.explosionArray.length; i++) {
                explosion = ExplosionManager.explosionArray[i];
                if (explosion.state === DroneWars.ExplosionState.IDLE) {
                    explosion.explode(type, location, delay);
                    return explosion;
                }
            }
            explosion = new DroneWars.Explosion(game, type, location, delay);
            ExplosionManager.explosionArray.push(explosion);
            return explosion;
        };
        ExplosionManager.explosionArray = [];
        return ExplosionManager;
    }());
    DroneWars.ExplosionManager = ExplosionManager;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(PowerUpState) {
        PowerUpState[PowerUpState["IDLE"] = 0] = "IDLE";
        PowerUpState[PowerUpState["SET"] = 1] = "SET";
        PowerUpState[PowerUpState["GRABBED"] = 2] = "GRABBED";
        PowerUpState[PowerUpState["FINISHED"] = 3] = "FINISHED";
    })(DroneWars.PowerUpState || (DroneWars.PowerUpState = {}));
    var PowerUpState = DroneWars.PowerUpState;
    (function(PowerUpType) {
        PowerUpType[PowerUpType["SPEED"] = 0] = "SPEED";
        PowerUpType[PowerUpType["DEFENSE"] = 1] = "DEFENSE";
        PowerUpType[PowerUpType["ATTACK"] = 2] = "ATTACK";
        PowerUpType[PowerUpType["HEALTH"] = 3] = "HEALTH";
    })(DroneWars.PowerUpType || (DroneWars.PowerUpType = {}));
    var PowerUpType = DroneWars.PowerUpType;
    var PowerUp = (function(_super) {
        __extends(PowerUp, _super);

        function PowerUp(game, type, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.state = PowerUpState.IDLE;
            this.location = new Phaser.Point(0, 0);
            this.timeElapsed = this.game.rnd.realInRange(0, Math.PI * 2);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('bonusHealth', 16.5, 0.9);
            this.soundFX.addMarker('bonusAttack', 19.5, 0.9);
            this.soundFX.addMarker('bonusSpeed', 18.5, 0.9);
            this.soundFX.addMarker('bonusDefense', 17.5, 0.8);
            this.type = type;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            this.shadowSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'Light_Shadow.png');
            this.shadowSprite.anchor.setTo(0.5, 1);
            this.add(this.shadowSprite);
            if (type === PowerUpType.SPEED)
                this.powerupSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.25, 'GameScene', 'PowerUp_Speed.png');
            else if (type === PowerUpType.DEFENSE)
                this.powerupSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.25, 'GameScene', 'PowerUp_Shield.png');
            else if (type === PowerUpType.ATTACK)
                this.powerupSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.25, 'GameScene', 'PowerUp_Damage.png');
            else if (type === PowerUpType.HEALTH)
                this.powerupSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.25, 'GameScene', 'PowerUp_Heal.png');
            this.powerupSprite.anchor.setTo(0.5, 1);
            this.add(this.powerupSprite);
            this.tileSize.setTo(tileWidth, tileHeight);
            game.add.existing(this);
            this.state = PowerUpState.SET;
        }
        PowerUp.prototype.setTimeEffect = function(timeEffect) {
            this.timeEffect = timeEffect;
        };
        PowerUp.prototype.setAmount = function(amount) {
            this.amount = amount;
        };
        PowerUp.prototype.setSwitch = function(type, x, y) {
            this.type = type;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((y - this.tileSize.y * 0.5) / this.tileSize.y));
            if (type === PowerUpType.SPEED)
                this.powerupSprite.frameName = 'PowerUp_Speed.png';
            else if (type === PowerUpType.DEFENSE)
                this.powerupSprite.frameName = 'PowerUp_Shield.png';
            else if (type === PowerUpType.ATTACK)
                this.powerupSprite.frameName = 'PowerUp_Damage.png';
            else if (type === PowerUpType.HEALTH)
                this.powerupSprite.frameName = 'PowerUp_Heal.png';
            this.powerupSprite.position.setTo(this.location.x * this.tileSize.x + this.tileSize.x * 0.5, this.location.y * this.tileSize.y + this.tileSize.y - this.tileSize.y * 0.25);
            this.visible = true;
            this.state = PowerUpState.SET;
        };
        PowerUp.prototype.update = function() {
            this.timeElapsed += this.game.time.physicsElapsed;
            var scaleShadow = 0.05 * Math.cos(this.timeElapsed * 3) + 0.95;
            this.shadowSprite.scale.setTo(scaleShadow, scaleShadow);
            var posY = 0.03 * this.tileSize.y * Math.cos(this.timeElapsed * 3) + this.location.y * this.tileSize.y + this.tileSize.y - this.tileSize.y * 0.22;
            this.powerupSprite.y = posY;
            this.z = this.shadowSprite.position.y;
            if (this.state === PowerUpState.GRABBED) {
                this.timeEffectElapsed += this.game.time.physicsElapsed;
                if (this.timeEffectElapsed >= this.timeEffect) {
                    this.state = PowerUpState.FINISHED;
                }
            }
        };
        PowerUp.prototype.getBoundingBox = function() {
            return new Phaser.Rectangle(this.powerupSprite.position.x - this.powerupSprite.width * 0.5, this.powerupSprite.position.y - this.powerupSprite.height * 1.0, this.powerupSprite.width * 1.0, this.powerupSprite.height * 1.0);
        };
        PowerUp.prototype.isTouchingPowerUp = function(player) {
            return (this.getBoundingBox().contains(player.shadowSprite.position.x, player.shadowSprite.position.y) || this.getBoundingBox().contains(player.shadowSprite.position.x, player.shadowSprite.position.y - player.shadowSprite.height)) && player.location.y === this.location.y;
        };
        PowerUp.prototype.setIdle = function() {
            this.state = PowerUpState.IDLE;
        };
        PowerUp.prototype.grabPowerUp = function() {
            if (this.type === PowerUpType.ATTACK)
                this.soundFX.play('bonusAttack');
            else if (this.type === PowerUpType.DEFENSE)
                this.soundFX.play('bonusDefense');
            else if (this.type === PowerUpType.HEALTH)
                this.soundFX.play('bonusHealth');
            else if (this.type === PowerUpType.SPEED)
                this.soundFX.play('bonusSpeed');
            this.visible = false;
            this.timeEffectElapsed = 0;
            this.state = PowerUpState.GRABBED;
        };
        return PowerUp;
    }(Phaser.Group));
    DroneWars.PowerUp = PowerUp;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var PowerUpsManager = (function() {
        function PowerUpsManager() {}
        PowerUpsManager.init = function(game) {
            PowerUpsManager.jsonPowerUps = JSON.parse(game.cache.getText('powerupsConfig'));
        };
        PowerUpsManager.reset = function() {
            PowerUpsManager.powerUpsArray = [];
        };
        PowerUpsManager.createPowerUp = function(game, type, x, y, tileWidth, tileHeight) {
            if (PowerUpsManager.jsonPowerUps === null) {
                PowerUpsManager.init(game);
            }
            var i;
            var powerup;
            for (i = 0; i < PowerUpsManager.powerUpsArray.length; i++) {
                powerup = PowerUpsManager.powerUpsArray[i];
                if (powerup.state === DroneWars.PowerUpState.IDLE) {
                    return powerup;
                }
            }
            powerup = new DroneWars.PowerUp(game, type, x, y, tileWidth, tileHeight);
            if (type === DroneWars.PowerUpType.SPEED) {
                powerup.setTimeEffect(parseFloat(PowerUpsManager.jsonPowerUps.BM.timeEffect));
                powerup.setAmount(parseFloat(PowerUpsManager.jsonPowerUps.BM.amount));
            } else if (type === DroneWars.PowerUpType.DEFENSE) {
                powerup.setTimeEffect(parseFloat(PowerUpsManager.jsonPowerUps.BS.timeEffect));
            } else if (type === DroneWars.PowerUpType.HEALTH) {
                powerup.setAmount(parseFloat(PowerUpsManager.jsonPowerUps.HP.amount));
                powerup.setTimeEffect(parseFloat(PowerUpsManager.jsonPowerUps.HP.timeEffect));
            } else if (type === DroneWars.PowerUpType.ATTACK) {
                powerup.setTimeEffect(parseFloat(PowerUpsManager.jsonPowerUps.BD.timeEffect));
                powerup.setAmount(parseFloat(PowerUpsManager.jsonPowerUps.BD.amount));
            }
            PowerUpsManager.powerUpsArray.push(powerup);
            return powerup;
        };
        PowerUpsManager.checkPowerUps = function(player) {
            var i;
            var j;
            var powerUp;
            for (i = 0; i < PowerUpsManager.powerUpsArray.length; i++) {
                powerUp = PowerUpsManager.powerUpsArray[i];
                if (powerUp.state === DroneWars.PowerUpState.SET && powerUp.isTouchingPowerUp(player)) {
                    player.grabPowerUp(powerUp);
                    powerUp.grabPowerUp();
                }
            }
        };
        PowerUpsManager.powerUpsArray = [];
        PowerUpsManager.jsonPowerUps = null;
        return PowerUpsManager;
    }());
    DroneWars.PowerUpsManager = PowerUpsManager;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(SwitchState) {
        SwitchState[SwitchState["IDLE"] = 0] = "IDLE";
        SwitchState[SwitchState["SET"] = 1] = "SET";
        SwitchState[SwitchState["PRESSED"] = 2] = "PRESSED";
    })(DroneWars.SwitchState || (DroneWars.SwitchState = {}));
    var SwitchState = DroneWars.SwitchState;
    var Switch = (function(_super) {
        __extends(Switch, _super);

        function Switch(game, color, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.state = SwitchState.IDLE;
            this.location = new Phaser.Point(0, 0);
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('switch', 15.5, 0.4);
            this.switchColor = color;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            if (color === DroneWars.SwitchWallColor.BLUE)
                this.switchSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'Obstacles_BlueButton.png');
            else if (color === DroneWars.SwitchWallColor.RED)
                this.switchSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'Obstacles_RedButton.png');
            this.switchSprite.anchor.setTo(0.5, 0.5);
            this.add(this.switchSprite);
            this.tileSize.setTo(tileWidth, tileHeight);
            game.add.existing(this);
            this.state = SwitchState.SET;
        }
        Switch.prototype.setSwitch = function(color, x, y) {
            this.switchColor = color;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((y - this.tileSize.y * 0.5) / this.tileSize.y));
            if (color === DroneWars.SwitchWallColor.BLUE)
                this.switchSprite.frameName = 'Obstacles_BlueButton.png';
            else if (color === DroneWars.SwitchWallColor.RED)
                this.switchSprite.frameName = 'Obstacles_RedButton.png';
            this.switchSprite.position.setTo(this.location.x * this.tileSize.x + this.tileSize.x * 0.5, this.location.y * this.tileSize.y + this.tileSize.y - this.tileSize.y * 0.5);
            this.state = SwitchState.SET;
        };
        Switch.prototype.update = function() {};
        Switch.prototype.getBoundingBox = function() {
            return new Phaser.Rectangle(this.switchSprite.position.x - this.switchSprite.width * 0.5, this.switchSprite.position.y - this.switchSprite.height * 0.5, this.switchSprite.width * 1.0, this.switchSprite.height * 1.0);
        };
        Switch.prototype.isTouchingSwitch = function(player) {
            return this.getBoundingBox().contains(player.shadowSprite.position.x, player.shadowSprite.position.y) || this.getBoundingBox().contains(player.shadowSprite.position.x, player.shadowSprite.position.y - player.shadowSprite.height);
        };
        Switch.prototype.pressSwitch = function() {
            this.soundFX.play('switch');
            if (this.switchColor === DroneWars.SwitchWallColor.BLUE)
                this.switchSprite.frameName = 'Obstacles_BlueButtonHold.png';
            else if (this.switchColor === DroneWars.SwitchWallColor.RED)
                this.switchSprite.frameName = 'Obstacles_RedButtonHold.png';
            this.state = SwitchState.PRESSED;
        };
        return Switch;
    }(Phaser.Group));
    DroneWars.Switch = Switch;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(SwitchWallColor) {
        SwitchWallColor[SwitchWallColor["RED"] = 0] = "RED";
        SwitchWallColor[SwitchWallColor["BLUE"] = 1] = "BLUE";
    })(DroneWars.SwitchWallColor || (DroneWars.SwitchWallColor = {}));
    var SwitchWallColor = DroneWars.SwitchWallColor;
    var SwitchesManager = (function() {
        function SwitchesManager() {}
        SwitchesManager.init = function(game) {};
        SwitchesManager.reset = function() {
            SwitchesManager.wallsArray = [];
            SwitchesManager.switchesArray = [];
        };
        SwitchesManager.createWall = function(game, color, x, y, tileWidth, tileHeight) {
            var i;
            var wall;
            for (i = 0; i < SwitchesManager.wallsArray.length; i++) {
                wall = SwitchesManager.wallsArray[i];
                if (wall.state === DroneWars.WallState.IDLE) {
                    wall.setWall(color, x, y);
                    return wall;
                }
            }
            wall = new DroneWars.Wall(game, color, x, y, tileWidth, tileHeight);
            SwitchesManager.wallsArray.push(wall);
            return wall;
        };
        SwitchesManager.createSwitch = function(game, color, x, y, tileWidth, tileHeight) {
            var i;
            var switchObject;
            for (i = 0; i < SwitchesManager.switchesArray.length; i++) {
                switchObject = SwitchesManager.switchesArray[i];
                if (switchObject.state === DroneWars.SwitchState.IDLE) {
                    switchObject.setSwitch(color, x, y);
                    return switchObject;
                }
            }
            switchObject = new DroneWars.Switch(game, color, x, y, tileWidth, tileHeight);
            SwitchesManager.switchesArray.push(switchObject);
            return switchObject;
        };
        SwitchesManager.isWallSet = function(x, y) {
            var i;
            var wall;
            for (i = 0; i < SwitchesManager.wallsArray.length; i++) {
                wall = SwitchesManager.wallsArray[i];
                if (wall.state === DroneWars.WallState.SET && wall.location.x === x && wall.location.y === y) {
                    return true;
                }
            }
            return false;
        };
        SwitchesManager.isWallSetRaycast = function(line, stepRate) {
            var results = [];
            var coords = line.coordinatesOnLine(stepRate, results);
            var i;
            var j;
            var wall;
            for (i = 0; i < SwitchesManager.wallsArray.length; i++) {
                wall = SwitchesManager.wallsArray[i];
                if (wall.state === DroneWars.WallState.SET) {
                    for (j = 0; j < coords.length; j++) {
                        if (wall.containsPoint(coords[j])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        SwitchesManager.checkPressSwitches = function(player, scene) {
            var i;
            var j;
            var wall;
            var switchObject;
            for (i = 0; i < SwitchesManager.switchesArray.length; i++) {
                switchObject = SwitchesManager.switchesArray[i];
                if (switchObject.state === DroneWars.SwitchState.SET && switchObject.isTouchingSwitch(player)) {
                    switchObject.pressSwitch();
                    for (j = 0; j < SwitchesManager.wallsArray.length; j++) {
                        wall = SwitchesManager.wallsArray[j];
                        if (wall.state === DroneWars.WallState.SET && wall.wallColor === switchObject.switchColor) {
                            wall.openWall();
                            scene.createMatrix(wall.location.y, wall.location.x);
                        }
                    }
                }
            }
        };
        SwitchesManager.wallsArray = [];
        SwitchesManager.switchesArray = [];
        return SwitchesManager;
    }());
    DroneWars.SwitchesManager = SwitchesManager;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(WallState) {
        WallState[WallState["IDLE"] = 0] = "IDLE";
        WallState[WallState["SET"] = 1] = "SET";
        WallState[WallState["OPENED"] = 2] = "OPENED";
    })(DroneWars.WallState || (DroneWars.WallState = {}));
    var WallState = DroneWars.WallState;
    var Wall = (function(_super) {
        __extends(Wall, _super);

        function Wall(game, color, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.location = new Phaser.Point(0, 0);
            this.state = WallState.IDLE;
            this.wallColor = color;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            if (color === DroneWars.SwitchWallColor.BLUE) {
                this.wallSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'Obstacles_BlueWall1.png');
                this.wallSprite.animations.add('open', ['Obstacles_BlueWall1.png', 'Obstacles_BlueWall2.png', 'Obstacles_BlueWall3.png', 'Obstacles_BlueWall4.png']);
            } else if (color === DroneWars.SwitchWallColor.RED) {
                this.wallSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'Obstacles_RedWall1.png');
                this.wallSprite.animations.add('open', ['Obstacles_RedWall1.png', 'Obstacles_RedWall2.png', 'Obstacles_RedWall3.png', 'Obstacles_RedWall4.png']);
            }
            this.wallSprite.anchor.setTo(0.5, 0.5);
            this.add(this.wallSprite);
            this.tileSize.setTo(tileWidth, tileHeight);
            game.add.existing(this);
            this.state = WallState.SET;
        }
        Wall.prototype.setWall = function(color, x, y) {
            this.wallColor = color;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + this.tileSize.x * 0.5) / this.tileSize.x), Math.floor((y - this.tileSize.y * 0.5) / this.tileSize.y));
            if (color === DroneWars.SwitchWallColor.BLUE) {
                this.wallSprite.frameName = 'Obstacles_BlueWall1.png';
                this.wallSprite.animations.add('open', ['Obstacles_BlueWall1.png', 'Obstacles_BlueWall2.png', 'Obstacles_BlueWall3.png', 'Obstacles_BlueWall4.png']);
            } else if (color === DroneWars.SwitchWallColor.RED) {
                this.wallSprite.frameName = 'Obstacles_RedWall1.png';
                this.wallSprite.animations.add('open', ['Obstacles_RedWall1.png', 'Obstacles_RedWall2.png', 'Obstacles_RedWall3.png', 'Obstacles_RedWall4.png']);
            }
            this.wallSprite.position.setTo(this.location.x * this.tileSize.x + this.tileSize.x * 0.5, this.location.y * this.tileSize.y + this.tileSize.y - this.tileSize.y * 0.5);
            this.state = WallState.SET;
        };
        Wall.prototype.update = function() {};
        Wall.prototype.getBoundingBox = function() {
            return new Phaser.Rectangle(this.wallSprite.position.x - this.wallSprite.width * 0.5, this.wallSprite.position.y - this.wallSprite.height * 0.5, this.wallSprite.width * 1.0, this.wallSprite.height * 1.0);
        };
        Wall.prototype.containsPoint = function(point) {
            if (point[0] >= this.location.x * this.tileSize.x && point[0] <= (this.location.x + 1) * this.tileSize.x && point[1] >= (this.location.y + 0) * this.tileSize.y && point[1] <= (this.location.y + 1) * this.tileSize.y)
                return true;
            return false;
        };
        Wall.prototype.openWall = function() {
            this.wallSprite.play('open', 20, false);
            this.state = WallState.OPENED;
        };
        return Wall;
    }(Phaser.Group));
    DroneWars.Wall = Wall;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    (function(TurretState) {
        TurretState[TurretState["IDLE"] = 0] = "IDLE";
        TurretState[TurretState["SET"] = 1] = "SET";
        TurretState[TurretState["SHOOTING"] = 2] = "SHOOTING";
    })(DroneWars.TurretState || (DroneWars.TurretState = {}));
    var TurretState = DroneWars.TurretState;
    (function(TurretType) {
        TurretType[TurretType["LIGHT"] = 0] = "LIGHT";
        TurretType[TurretType["HEAVY"] = 1] = "HEAVY";
    })(DroneWars.TurretType || (DroneWars.TurretType = {}));
    var TurretType = DroneWars.TurretType;
    var Turret = (function(_super) {
        __extends(Turret, _super);

        function Turret(game, type, x, y, tileWidth, tileHeight) {
            _super.call(this, game);
            this.tileSize = new Phaser.Point(0, 0);
            this.location = new Phaser.Point(0, 0);
            this.timeElapsed = this.game.rnd.realInRange(0, Math.PI * 2);
            this.state = TurretState.IDLE;
            this.tintTween = null;
            this.shootTime = 0;
            this.soundFX = this.game.add.audio('sfx');
            this.soundFX.allowMultiple = true;
            this.soundFX.addMarker('hit2', 13.5, 0.4);
            this.soundFX.addMarker('hit3', 14, 0.4);
            this.soundFX.addMarker('explode', 14.5, 0.4);
            this.type = type;
            //Calculate the right position in matrix
            this.location.setTo(Math.floor((x + tileWidth * 0.5) / tileWidth), Math.floor((y - tileHeight * 0.5) / tileHeight));
            if (type === TurretType.LIGHT)
                this.baseSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'TurretLight_Base.png');
            else if (type === TurretType.HEAVY)
                this.baseSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight, 'GameScene', 'TurretHeavy_Base.png');
            this.baseSprite.anchor.setTo(0.65, 0.85);
            this.add(this.baseSprite);
            if (type === TurretType.LIGHT)
                this.turretSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'TurretLight_Drone.png');
            else if (type === TurretType.HEAVY)
                this.turretSprite = game.add.sprite(this.location.x * tileWidth + tileWidth * 0.5, this.location.y * tileHeight + tileHeight - tileHeight * 0.5, 'GameScene', 'TurretHeavy_Drone.png');
            this.turretSprite.anchor.setTo(0.5, 1);
            this.add(this.turretSprite);
            this.hpGroup = game.add.group();
            this.hpGroup.position.setTo(this.getBoundingBox().centerX, -this.turretSprite.height * 1.1);
            this.hpGroup.visible = false;
            this.turretSprite.addChild(this.hpGroup);
            var hpBackground;
            if (type === TurretType.LIGHT)
                hpBackground = game.add.sprite(-this.turretSprite.position.x, 0, 'GameScene', 'Hud_MediumHpBar.png');
            else if (type === TurretType.HEAVY)
                hpBackground = game.add.sprite(-this.turretSprite.position.x, 0, 'GameScene', 'Hud_BigHpBar.png');
            hpBackground.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(hpBackground);
            this.maskBarGreen = game.add.graphics(0, 0);
            this.hpGroup.addChild(this.maskBarGreen);
            if (type === TurretType.LIGHT)
                this.hpGreen = game.add.sprite(-this.turretSprite.position.x, 0, 'GameScene', 'Hud_MediumGreenBar.png');
            else if (type === TurretType.HEAVY)
                this.hpGreen = game.add.sprite(-this.turretSprite.position.x, 0, 'GameScene', 'Hud_BigGreenBar.png');
            this.hpGreen.anchor.setTo(0.5, 0.5);
            this.hpGroup.add(this.hpGreen);
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width, this.hpGreen.height);
            this.hpGreen.mask = this.maskBarGreen;
            this.tileSize.setTo(tileWidth, tileHeight);
            this.location.setTo(x, y);
            game.add.existing(this);
            //Set Easy
            this.difficulty = 0;
            this.type = type;
            this.state = TurretState.SET;
        }
        Turret.prototype.setAttack = function(attack) {
            this.attack = attack;
        };
        Turret.prototype.setHealth = function(health) {
            this.health = health[this.difficulty];
            this.maxHealth = health;
        };
        Turret.prototype.setTimeBetweenShoots = function(timeBetweenShoots) {
            this.timeBetweenShoots = timeBetweenShoots;
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Turret.prototype.setBulletVelocity = function(bulletVelocity) {
            this.bulletVelocity = bulletVelocity;
        };
        Turret.prototype.setHealthSecondsAppearing = function(healthSecondsAppearing) {
            this.healthSecondsAppearing = healthSecondsAppearing;
            this.healthTime = healthSecondsAppearing;
        };
        Turret.prototype.setCoins = function(coins) {
            this.coins = coins;
        };
        Turret.prototype.setDifficulty = function(difficulty) {
            this.difficulty = difficulty;
            this.health = this.maxHealth[this.difficulty];
            this.shootTime = this.timeBetweenShoots[this.difficulty];
        };
        Turret.prototype.update = function() {
            this.timeElapsed += this.game.time.physicsElapsed;
            var posY = 0.03 * this.tileSize.y * Math.cos(this.timeElapsed * 3) + this.location.y - this.tileSize.y * 0.47;
            this.turretSprite.y = posY;
            if (this.shootTime < this.timeBetweenShoots[this.difficulty])
                this.shootTime += this.game.time.physicsElapsed;
            if (this.hpGroup.visible) {
                this.healthTime += this.game.time.physicsElapsed;
                if (this.healthTime >= this.healthSecondsAppearing) {
                    this.hpGroup.visible = false;
                }
            }
            this.z = this.baseSprite.position.y + 1;
        };
        Turret.prototype.getShootingLocation = function() {
            return new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY);
        };
        Turret.prototype.getBoundingBox = function() {
            if (this.type === TurretType.LIGHT) {
                return new Phaser.Rectangle(this.turretSprite.position.x - this.turretSprite.width * 0.3, this.turretSprite.position.y - this.turretSprite.height * 0.8, this.turretSprite.width * 0.6, this.turretSprite.height * 0.7);
            } else if (this.type === TurretType.HEAVY) {
                return new Phaser.Rectangle(this.turretSprite.position.x - this.turretSprite.width * 0.35, this.turretSprite.position.y - this.turretSprite.height * 0.8, this.turretSprite.width * 0.7, this.turretSprite.height * 0.7);
            }
        };
        Turret.prototype.isReadyForShooting = function() {
            if (this.shootTime >= this.timeBetweenShoots[this.difficulty] && this.state !== TurretState.IDLE) {
                return true;
            }
            return false;
        };
        Turret.prototype.shoot = function(location) {
            this.shootTime = 0;
            var direction = location.clone().subtract(this.getShootingLocation().x, this.getShootingLocation().y).normalize();
            DroneWars.BulletManager.createBullet(this.game, DroneWars.BulletType.HEAVY, this.bulletVelocity[this.difficulty], this.attack[this.difficulty], this.getShootingLocation(), direction, this.getBoundingBox().height * 0.7);
        };
        Turret.prototype.hit = function(bullet) {
            var _this = this;
            this.maskBarGreen.clear();
            this.maskBarGreen.beginFill(0xffffff);
            //Ask if i die
            if (this.health - bullet.attack <= 0) {
                this.soundFX.play('explode');
                this.health = 0;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.die();
            } else {
                if (this.type === TurretType.LIGHT)
                    this.soundFX.play('hit2');
                else if (this.type === TurretType.HEAVY)
                    this.soundFX.play('hit3');
                this.health -= bullet.attack;
                this.maskBarGreen.drawRect(this.hpGreen.position.x - this.hpGreen.width * 0.5, this.hpGreen.position.y - this.hpGreen.height * 0.5, this.hpGreen.width * (this.health / this.maxHealth[this.difficulty]), this.hpGreen.height);
                this.healthTime = 0;
                this.hpGroup.visible = true;
                var colorBlend = {
                    step: 0
                };
                if (this.tintTween !== null)
                    this.tintTween.stop();
                this.tintTween = this.game.add.tween(colorBlend).to({
                        step: 100
                    }, 200, Phaser.Easing.Default, false)
                    .onUpdateCallback(function() {
                        _this.turretSprite.tint = Phaser.Color.interpolateColor(0xff9696, 0xffffff, 100, colorBlend.step, 1);
                        _this.baseSprite.tint = Phaser.Color.interpolateColor(0xff9696, 0xffffff, 100, colorBlend.step, 1);
                    })
                    .start();
            }
        };
        Turret.prototype.die = function() {
            DroneWars.ExplosionManager.createExplosion(this.game, DroneWars.ExplosionType.ENEMY, new Phaser.Point(this.getBoundingBox().centerX, this.getBoundingBox().centerY));
            this.turretSprite.visible = false;
            this.baseSprite.visible = false;
            this.state = TurretState.IDLE;
            var ingame = this.game.state.getCurrentState();
            ingame.onCoinsAdded(this.coins[this.difficulty]);
        };
        Turret.prototype.isCollisioning = function(bullet) {
            var rectangle = this.getBoundingBox();
            if (rectangle.width < 0) {
                rectangle.x += rectangle.width;
                rectangle.width *= -1;
            }
            var direction = bullet.currentLocation.clone().subtract(bullet.previousLocation.x, bullet.previousLocation.y);
            if (rectangle.contains(bullet.previousLocation.x + 0.25 * direction.x, bullet.previousLocation.y + 0.25 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.5 * direction.x, bullet.previousLocation.y + 0.5 * direction.y))
                return true;
            if (rectangle.contains(bullet.previousLocation.x + 0.75 * direction.x, bullet.previousLocation.y + 0.75 * direction.y))
                return true;
            if (rectangle.contains(bullet.currentLocation.x, bullet.currentLocation.y))
                return true;
            return false;
        };
        return Turret;
    }(Phaser.Group));
    DroneWars.Turret = Turret;
})(DroneWars || (DroneWars = {}));
var DroneWars;
(function(DroneWars) {
    var TurretManager = (function() {
        function TurretManager() {}
        TurretManager.init = function(game) {
            TurretManager.jsonTurrets = JSON.parse(game.cache.getText('statsConfig'));
        };
        TurretManager.reset = function() {
            TurretManager.turretArray = [];
        };
        TurretManager.createTurret = function(game, type, difficulty, x, y, tileWidth, tileHeight) {
            if (TurretManager.jsonTurrets === null) {
                TurretManager.init(game);
            }
            var i;
            var turret;
            for (i = 0; i < TurretManager.turretArray.length; i++) {
                turret = TurretManager.turretArray[i];
                if (turret.state === DroneWars.TurretState.IDLE) {
                    return turret;
                }
            }
            turret = new DroneWars.Turret(game, type, x, y, tileWidth, tileHeight);
            if (type === DroneWars.TurretType.LIGHT) {
                turret.setAttack(TurretManager.jsonTurrets.LT.attack);
                turret.setHealth(TurretManager.jsonTurrets.LT.health);
                turret.setTimeBetweenShoots(TurretManager.jsonTurrets.LT.timeBetweenShoots);
                turret.setBulletVelocity(TurretManager.jsonTurrets.LT.bulletVelocity);
                turret.setHealthSecondsAppearing(TurretManager.jsonTurrets.LT.healthSecondsAppearing);
                turret.setCoins(TurretManager.jsonTurrets.LT.coins);
            } else if (type === DroneWars.TurretType.HEAVY) {
                turret.setAttack(TurretManager.jsonTurrets.HT.attack);
                turret.setHealth(TurretManager.jsonTurrets.HT.health);
                turret.setTimeBetweenShoots(TurretManager.jsonTurrets.HT.timeBetweenShoots);
                turret.setBulletVelocity(TurretManager.jsonTurrets.HT.bulletVelocity);
                turret.setCoins(TurretManager.jsonTurrets.HT.coins);
            }
            turret.setDifficulty(difficulty);
            TurretManager.turretArray.push(turret);
            return turret;
        };
        TurretManager.availableTurrets = function() {
            var i;
            var turret;
            for (i = 0; i < TurretManager.turretArray.length; i++) {
                turret = TurretManager.turretArray[i];
                if (turret.state !== DroneWars.TurretState.IDLE) {
                    return true;
                }
            }
            return false;
        };
        TurretManager.turretArray = [];
        TurretManager.jsonTurrets = null;
        return TurretManager;
    }());
    DroneWars.TurretManager = TurretManager;
})(DroneWars || (DroneWars = {}));