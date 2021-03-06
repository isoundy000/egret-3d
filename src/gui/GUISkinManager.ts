﻿module egret3d.gui {
    /**
    * @private
    * @class egret3d.GUISkinManager
    * @classdesc
    * gui的默认皮肤管理器
    * @see egret3d.TextureResourceManager
    * @version Egret 3.0
    * @platform Web,Native 
    */
    export class GUISkinManager {
        private static _instance: GUISkinManager;
        private _defaultSkinTexture: any;

        constructor() {
            this._defaultSkinTexture = {};
        }

        /**
        * @private
        * 获取默认贴图
        * @param skinName 根据皮肤名称获取默认的Texture
        * @returns Texture 获取到的默认贴图
        * @version Egret 3.0
        * @platform Web,Native 
        */
        public getDefaultSkin(skinName: string): Texture {
            return this._defaultSkinTexture[skinName];
        }

        /**
        * @private
        * 初始化该管理器
        * @version Egret 3.0
        * @platform Web,Native 
        */
        public initDefaultSkin() {
            var upState: Texture = textureResMgr.getTexture("normal.png");
            var downState: Texture = textureResMgr.getTexture("pressed.png");
            var overState: Texture = textureResMgr.getTexture("hover.png");

            var checkUpState: Texture = textureResMgr.getTexture("default.png");
            var checkDownState: Texture = textureResMgr.getTexture("checked.png");

            var whiteBg: Texture = textureResMgr.getTexture("whitebackground.png");

            var progressBg: Texture = textureResMgr.getTexture("backgroundpic.png");
            var progressBarSkin: Texture = textureResMgr.getTexture("blue.png");

            var radioUpState: Texture = textureResMgr.getTexture("unselected.png");
            var radioSelected: Texture = textureResMgr.getTexture("selected.png");
            var radioHover: Texture = textureResMgr.getTexture("hover1.png");

            var sliderBar: Texture = textureResMgr.getTexture("bluebackground.png");
            var sliderBackground: Texture = textureResMgr.getTexture("whitebackground.png");

            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_BUTTON_UP, upState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_BUTTON_DOWN, downState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_BUTTON_OVER, overState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_LABEL_BUTTON_UP, upState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_LABE_BUTTON_DOWN, downState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_CHECK_BOX_UP, checkUpState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_CHECK_BOX_DOWN, checkUpState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_CHECK_BOX_SELECTED_UP, checkDownState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_CHECK_BOX_SELECTED_DOWN, checkDownState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_RADIO_BUTTON_UP, radioUpState);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_RADIO_BUTTON_DOWN, radioHover);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_RADIO_BUTTON_SELECTED_DOWN, radioHover);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_RADIO_BUTTON_SELECTED_UP, radioSelected);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_SLIDER_BAR, sliderBar);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_SLIDER_BACKGROUND, sliderBackground);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_PROGRESS_BAR, progressBarSkin);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_PROGRESS_BAR_BACKGROUND, progressBg);
            GUISkinManager.instance.setDefaultSkin(gui.DefaultSkinName.DEFAULT_PANEL_BACKGROUND, whiteBg);
        }

        /**
        * @private
        * 设置默认皮肤对应的贴图
        * @param skinName 默认的皮肤名
        * @param texture 默认皮肤对应的贴图
        * @version Egret 3.0
        * @platform Web,Native 
        */
        public setDefaultSkin(skinName: string, texture: any) {
            if (typeof texture === "string") {
                texture = textureResMgr.getTexture(texture);
            }
            this._defaultSkinTexture[skinName] = texture;
        }

        /**
        * @private
        * 获取单例
        * @param skinName 默认的皮肤名
        * @returns SkinManager 管理器的蛋例
        * @version Egret 3.0
        * @platform Web,Native 
        */
        public static get instance(): GUISkinManager {
            if (!GUISkinManager._instance) {
                GUISkinManager._instance = new GUISkinManager();
            }
            return GUISkinManager._instance;
        }
    }

    /**
    * @private
    */
    export class DefaultSkinName {
        public static DEFAULT_BUTTON_UP:string = 'defaultButtonUp';
        public static DEFAULT_BUTTON_DOWN: string = 'defaultButtonDown';
        public static DEFAULT_BUTTON_OVER: string = 'defaultButtonOver';
        public static DEFAULT_BUTTON_DISABLE:String = "defaultButtonDisable";
        public static DEFAULT_LABEL_BUTTON_UP: string = 'defaultLabelButtonUp';
        public static DEFAULT_LABE_BUTTON_DOWN: string = 'defaultLabelButtonDown';
        public static DEFAULT_LABE_BUTTON_DISABLE: String = "defaultLabelButtonDisable";
        public static DEFAULT_CHECK_BOX_UP:string = "defaultCheckBoxUp";
        public static DEFAULT_CHECK_BOX_DOWN:string = "defaultCheckBoxDown";
        public static DEFAULT_CHECK_BOX_SELECTED_UP:string = "defaultCheckBoxSelectedUp";
        public static DEFAULT_CHECK_BOX_SELECTED_DOWN:string = "defaultCheckBoxSelectedDown";
        public static DEFAULT_CHECK_BOX_DISABLE:string = "defaultCheckBoxDisable";
        public static DEFAULT_PROGRESS_BAR:string = "defaultProgressBar";
        public static DEFAULT_PROGRESS_BAR_BACKGROUND:string = "defaultProgressBarBackground";
        public static DEFAULT_RADIO_BUTTON_UP:string = "defaultRadioButtonUp";
        public static DEFAULT_RADIO_BUTTON_DOWN:string = "defaultRadioButtonDown";
        public static DEFAULT_RADIO_BUTTON_SELECTED_UP:string = "defaultRadioButtonSelectedUp";
        public static DEFAULT_RADIO_BUTTON_SELECTED_DOWN:string = "defaultRadioButtonSelectedDown";
        public static DEFAULT_RADIO_BUTTON_DISABLE:string = "defaultRadioButtonDisable";
        public static DEFAULT_SLIDER_BAR:string  = "defaultSliderBar";
        public static DEFAULT_SLIDER_BACKGROUND:string  = "defaultSliderBarBACKGROUND";
        public static DEFAULT_PANEL_BACKGROUND:string = "defaultPanelBackground";

        
    }
} 