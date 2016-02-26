﻿module egret3d_dev {

    /**
    * @private
    * @class egret3d_dev.Entity
    * @classdesc
    * 3d空间中的实体对象 extends Object3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    export class Entity extends Object3D{
        public bound: any;
        public canPick: boolean;
        public renderLayer: number;
        
        /**
        * @language zh_CN
        * constructor 
        */
        constructor() {
            super();
        }

    }
} 