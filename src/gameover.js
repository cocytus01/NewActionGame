//thirdScene.js
var ThirdLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        cc.audioEngine.playEffect(res.bell_mp3);
        //音楽再生エンジン
        audioEngine = cc.audioEngine;

        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.bgm8, true);
        }

        var gameoverBG_png = cc.Sprite.create(res.gameover_png);
        gameoverBG_png.setPosition(size.width / 2, size.height / 2);
        this.addChild(gameoverBG_png);

        var scorelabel = cc.LabelTTF.create("MaxCoin:"+score, "怨霊", 30);
        scorelabel.setPosition(size.width / 2, size.height /2);
        this.addChild(scorelabel, 1);

        cc.eventManager.addListener({
           event: cc.EventListener.KEYBOARD,
           //キー入力したとき
           onKeyPressed: function(keyCode, event) {
                  console.log(keyCode);

              if (keyCode == 13) {
                if (audioEngine.isMusicPlaying()) {
                  audioEngine.stopMusic();
                }
                  audioEngine.playEffect(res.push_se);
                  s = cc.TransitionFade.create(2, new MyScene());
                  cc.director.runScene(s);
              }
           },//.bind(this),
           //キーを離したとき
           onKeyReleased: function(keyCode, event){
           }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
          }, this);
          return true;
        },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {

      //cc.director.runScene(new MyScene());
    },
});


var GameOverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(0, 0, 0, 200));
        this.addChild(backgroundLayer);

        var layer3 = new ThirdLayer();
        this.addChild(layer3);
    }
});
