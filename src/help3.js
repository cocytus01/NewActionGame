//myScene.js
var Help3Layer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();

        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.bgm3, true);
        }


        var Help3_png = cc.Sprite.create(res.help3_png);
        Help3_png.setPosition(size.width / 2, size.height / 2);
        this.addChild(Help3_png);

        cc.eventManager.addListener({
           event: cc.EventListener.KEYBOARD,
           //キー入力したとき
           onKeyPressed: function(keyCode, event) {
                  console.log(keyCode);

                  if (keyCode == 39) {
                    if (audioEngine.isMusicPlaying()) {
                      audioEngine.stopMusic();
                    }
                    audioEngine.playEffect(res.book_close_mp3);
                    s = cc.TransitionFade.create(2, new HowtoScene());
                    cc.director.runScene(s);
                  }

                  if (keyCode == 37) {
                    audioEngine.playEffect(res.page_mp3);
                    s = cc.TransitionPageTurn.create(1, new Help2Scene(),true);
                    cc.director.runScene(s);
                  }
           },//.bind(this),
           //キーを離したとき
           onKeyReleased: function(keyCode, event){
           }
        }, this);
        //add code
         //タップイベントリスナーを登録する
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
      //bgmの再生をとめる
        /*if (audioEngine.isMusicPlaying()) {
          audioEngine.stopMusic();
        }
        //audioEngine.playEffect("res/se_select16.wav");
        // 次のシーンに切り替える
        //cc.director.runScene(new stageScene());
        audioEngine.playEffect(res.push_se);
        s = cc.TransitionFade.create(2, new gameScene());
        cc.director.runScene(s);*/
        //cc.director.runScene(new gameScene());
    },
});

var Help3Scene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new Help3Layer();
        this.addChild(layer);
    }
});
