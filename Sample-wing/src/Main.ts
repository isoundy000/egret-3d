class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var text: egret.TextField = new egret.TextField();
        text.text = "Egret3D Sample";
        this.stage.addChild( text);
        
        //第一部分
        //new Sample_CreateView3D();
        //new Sample_CreateSky();
        //new Sample_CreateBox();
        //new Sample_Light();
        //new Sample_MaterialBlend();
        //new Sample_MousePick();
        //new Sample_AnimationModel();
       
        
        //第二部分
        //new Sample_LoadScene();
        //new Sample_BlendTerrain();
        //new Sample_ModelTexture();
        //new Sample_Character();
        //new Sample_360Photo();
        
    }
}