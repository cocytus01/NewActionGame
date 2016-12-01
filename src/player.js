
// define enum for runner status
if(typeof RunnerStat == "undefined") {
    var RunnerStat = {};

    RunnerStat.running = 0;
    RunnerStat.jumpUp = 1;
    RunnerStat.jumpDown = 2;
    RunnerStat.idling = 3;
    RunnerStat.landing = 4;
};

//プレイヤークラス
var Player = cc.Class.extend({ // cc.Classを継承
   sprite: null, // スプライトを保持
   spriteSheet: null,
   body: null, // bodyを保持
   shape: null, // Shapeを保持
   runningAction: null,
   jumpAction: null,
   idolAction: null,
   deathAction: null,
   startPos:null,
   status:null,

   ctor: function(parent, posX, posY, tag) { // コンストラクタ

       this.startPos = cc.p(posX,posY);
       this.spriteSheet = new cc.SpriteBatchNode(res.player_png);
       // ランニングアクションを初期化
       var animFrames = [];
       for (var i = 0; i < 4; i++) {
        var spriteFrame = new cc.SpriteFrame(res.player_png, cc.rect(70 * i, 0, 70, 90));

        var str = "player" + i;
        cc.spriteFrameCache.addSpriteFrame(spriteFrame,  str);
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
      }
        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.runningAction.retain();

        animFrames = [];
            var spriteFrame = new cc.SpriteFrame(res.player_jump_png, cc.rect(0, 0, 40, 90));
            var str = "runnerJumpUp" + i;
            cc.spriteFrameCache.addSpriteFrame(spriteFrame,  str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        animation = new cc.Animation(animFrames, 0.2);
        this.jumpUpAction = new cc.Animate(animation);
        this.jumpUpAction.retain();

        animFrames = [];
        for (var i = 0; i < 7; i++) {
            var spriteFrame = new cc.SpriteFrame(res.player_idol_png, cc.rect(70 * i, 0, 70, 90));
            var str = "runneridol" + i;
            cc.spriteFrameCache.addSpriteFrame(spriteFrame,  str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
          }
        animation = new cc.Animation(animFrames, 0.3);
        this.idolAction = new cc.RepeatForever(new cc.Animate(animation));
        this.idolAction.retain();


        animFrames = [];
            var spriteFrame = new cc.SpriteFrame(res.player_death_png, cc.rect(0, 0, 80, 90));
            var str = "death" + i;
            cc.spriteFrameCache.addSpriteFrame(spriteFrame,  str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        animation = new cc.Animation(animFrames, 0.2);
        this.deathAction = new cc.Animate(animation);
        this.deathAction.retain();

      this.sprite = cc.Sprite.create('#player0');

      //this.sprite.runAction(this.runningAction);
      this.sprite.runAction(this.idolAction);

      var size =   this.sprite.getContentSize(); // スプライトのサイズを取得
       this.sprite.setScale(35/size.width, 45/size.height);
       this.sprite.setContentSize(cc.size(24, 40));
      //this.sprite.setScale(0.5,0.5)


      var size =   this.sprite.getContentSize(); // スプライトのサイズを取得
      this.body = new cp.Body(1, cp.momentForBox(1, size.width, size.height));
      this.body.setPos(cp.v(posX, posY));
      //回転率。高いほど回らない
      this.body.setMoment(Infinity);
      gameLayer.addChild(this.sprite, 0);
      this.sprite.setPosition(posX, posY);
      space.addBody(this.body);
      var shape = new cp.BoxShape(this.body, size.width, size.height);
      shape.setFriction(0);
      shape.setElasticity(0);
      shape.tag = tag;
      shape.setCollisionType(shape.tag);
      shape.image =   this.sprite;
      space.addShape(shape);
      shapeArray.push(shape);
      this.invulnerability = 0;
   },

   jump:function () {
       cc.log("jump");
       if (this.stat == RunnerStat.running) {
           this.body.applyImpulse(cp.v(0, 250), cp.v(0, 0));
           this.stat = RunnerStat.jumpUp;
           this.sprite.stopAllActions();
        //   this.sprite.runAction(this.jumpUpAction);

           cc.audioEngine.playEffect(res.jump_mp3);

       }
   },

   update: function(dt) {

     var statusLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Status);
        statusLayer.updateMeter(this.sprite.getPositionX() - g_runnerStartX);

        // check and update runner stat
        var vel = this.body.getVel();
        if (this.stat == RunnerStat.jumpUp) {
            if (vel.y < 0.1) {
                this.stat = RunnerStat.jumpDown;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.jumpDownAction);
            }
        } else if (this.stat == RunnerStat.jumpDown) {
            if (vel.y == 0) {
                this.stat = RunnerStat.running;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.runningAction);
            }
        }

   },

   getDistanceX: function() {
      return this.sprite.getPositionX() - this.startPos.x;
   },
   getDistanceY: function() {
      return this.sprite.getPositionY() - this.startPos.y;
   },

});


/*
//プレイヤークラス
var Player = cc.Class.extend({ // cc.Classを継承
   space: null, // Spaceを保持
   sprite: null, // スプライトを保持
   spriteSheet: null,
   body: null, // bodyを保持
   shape: null, // Shapeを保持
   mapIndex: 0, // 配置したマップのIndexを保持

   ctor: function(parent, space, posX, posY, mapIndex) { // コンストラクタ

      this.space = space; // Spaceを取得
      this.spriteSheet = new cc.SpriteBatchNode(res.player_png);
      for (var i = 0; i < 4; i++) {
         var spriteFrame = new cc.SpriteFrame(res.player_png, cc.rect(70 * i, 0, 70, 90));
         cc.spriteFrameCache.addSpriteFrame(spriteFrame, 'walk' + i);
      }
      this.sprite = new cc.PhysicsSprite.create('#walk0');
    //NG  this.sprite.setPosition(posX, posY); // スプライトの位置を設定

      // ランニングアクションを初期化
      var animFrames = [];
      for (var i = 0; i < 4; i++) {
         var str = "walk" + i;
         var frame = cc.spriteFrameCache.getSpriteFrame(str);
         animFrames.push(frame);
      }
      var animation = new cc.Animation(animFrames, 0.1);
      this.runningAction = new cc.RepeatForever(new cc.Animate(animation));

      var contentSize = this.sprite.getContentSize(); // スプライトのサイズを取得
      this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height)); // 動的ボディを作成
      this.body.setPos(cp.v(posX, posY)); // ボティの位置を設定

      // var pos = cp.v(posX, posY);
      // this.body.p = pos; // ボティの位置を設定
      this.shape = new cp.BoxShape(body, contentSize.width, contentSize.height); // 四角形状のShapeを作成
      this.shape.image = this.sprite;
      this.shape.setFriction(1);
      this.shape.setElasticity(0);
      this.shape.tag = SpriteTag.runner;
      this.shape.setCollisionType(SpriteTag.rock); // 衝突タイプ（衝突イベントの識別番号）を設定

      this.space.addShape(this.shape); // Spaceに静的ボディを追加
      this.mapIndex = mapIndex; // 配置したマップのIndexを保持

      parent.addChild(this.sprite, 0); // 親ノードに追加
   },

   update: function(dt) {

      // ランナーのスプライトとBodyの同期
      this.sprite.setPosition(this.body.p); // 位置を同期
      this.sprite.setRotation(-cc.radiansToDegrees(this.body.w)); // 角度を同期
   },

});
*/
