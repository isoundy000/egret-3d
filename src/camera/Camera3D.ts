﻿module egret3d {

    /**
    * @language zh_CN
    * @class egret3d.CameraType
    * @classdesc
    * 摄像机类型</p>
    * 不同的摄像机类型，会产生不同的渲染视觉效果。</p>
    * 透视投影 是从某个投射中心将物体投射到单一投影面上所得到的图形。</p>
    * 正交投影 投影线垂直于投影面的投影。</p>
    * orthogonal 和 orthogonalToCenter都是正交投影，只是使用不同的方式创建</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    export enum CameraType {

        /**
        * @language zh_CN
        * 透视投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        perspective,

        /**
        * @language zh_CN
        * 正交投影
        * @see egret3d.Matrix4_4.ortho
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonal,

        /**
        * @language zh_CN
        * 正交投影
        * @see egret3d.Matrix4_4.orthoOffCenter
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonalToCenter,


        ///**
        //* VR投影
        //* @version Egret 3.0
        //* @platform Web,Native
        //*/
        //VR
    };

    /**
    * @class egret3d.Camera3D
    * @classdesc
    * 相机数据处理，生成3D摄相机。</p>
    * 渲染场景从摄像机视点到缓冲区。</p>
    * 相机分为透视摄像机、正交摄像机。</p>
    * 默认相机朝向是(0, 0, 1) 头朝向是(0, 1, 0)
    *
    * @see egret3d.Matrix4_4
    * @see egret3d.Object3D
    * 
    * @includeExample camera/Camera3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    export class Camera3D extends Object3D {

        /**
        * @language zh_CN
        * 相机投影矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        public projectMatrix: Matrix4_4 = new Matrix4_4();

        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _orthProjectMatrix: Matrix4_4 = new Matrix4_4();

        /**
        * @private
        * @language zh_CN
        * 眼睛矩阵(左，右眼) 实现VR时会用到
        * @version Egret 3.0
        * @platform Web,Native
        */
        //public eyeMatrix: EyesMatrix;

        /**
         * @language zh_CN        
         * 相机的视椎体，用来检测是否在当前相机可视范围内
         * @version Egret 3.0
         * @platform Web,Native
         */
        public frustum: Frustum;

        private _viewPort: Rectangle = new Rectangle();

        private _scissorRect: Rectangle = new Rectangle();

        private _aspectRatio: number = 1.0;

        private _fovY: number = 45.0;

        private _near: number = 1;

        private _far: number = 10000.0;

        private temp: Matrix4_4 = new Matrix4_4();

        private _lookAtPosition: Vector3D = new Vector3D();

        private _up: Vector3D = new Vector3D(0, 1, 0);

        private _cameraType: number = 0;

        private _cameraMatrixChange: boolean = false;

        private _viewMatrix: Matrix4_4 = new Matrix4_4();

        private _tempQuat: Quaternion = new Quaternion();

        private _normalMatrix: Matrix4_4 = new Matrix4_4();

        private _unprojection: Matrix4_4 = new Matrix4_4();

        protected _animation: any = [];

        protected orthProjectChange: boolean = true;

        protected _mat: Matrix4_4 = new Matrix4_4();

        protected _maxBest: boolean = false;
        protected _maxBestPoint: Point = new Point() ;


        private _angleVector: Vector3D = new Vector3D();
        /*
        * @private
        */
        public billboardX: Matrix4_4 = new Matrix4_4();
        /*
        * @private
        */
        public billboardY: Matrix4_4 = new Matrix4_4();
        /*
        * @private
        */
        public billboardZ: Matrix4_4 = new Matrix4_4();
        /*
        * @private
        */
        public billboardXYZ: Matrix4_4 = new Matrix4_4();


        /**
        * @language zh_CN        
        * constructor
        * @param cameraType 相机类型 默认为 CameraType.perspective 透视相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(cameraType: CameraType = CameraType.perspective) {
            super();
            this.frustum = new Frustum(this);
            this._orthProjectMatrix.ortho(this._viewPort.width, this._viewPort.height, this._near, this._far);
            this.cameraType = cameraType;
            CameraManager.instance.addCamera(this);
            this._viewMatrix.identity();
        }

        /**
         * @language zh_CN        
         * 设置相机类型
         * @param cameraType 相机类型
         * @version Egret 3.0
         * @platform Web,Native
         */
        public set cameraType(cameraType: CameraType) {
            this._cameraType = cameraType;
            switch (cameraType) {
                case CameraType.orthogonal:
                    this.projectMatrix.ortho(this._viewPort.width, this._viewPort.height, this._near, this._far);
                    break;
                case CameraType.orthogonalToCenter:
                    this.projectMatrix.orthoOffCenter(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height, this._near, this._far);
                    break;
                case CameraType.perspective:
                    this.projectMatrix.perspective(this._fovY, this._aspectRatio, this._near, this._far);
                    break;
                //case CameraType.VR:
                //    this.projectMatrix.perspective(this._fovY, 1.0, this._near, this._far);
                //    this.eyeMatrix = this.eyeMatrix || new EyesMatrix();
                //    break;
            }
            this._orthProjectMatrix.ortho(this._viewPort.width, this._viewPort.height, this._near, this._far);
            this.frustum.updateFrustum();
        }

        /**
        * @language zh_CN        
        * 获取相机类型
        * @returns CameraType 相机类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get cameraType(): CameraType {
            return this._cameraType;
        }

        public get maxWidthAndHeight(): Point  {
            if (!this._maxBest) {
                this._maxBest = true;
                this._maxBestPoint.x = sizeUtil.getBestPowerOf2(this.viewPort.width);
                this._maxBestPoint.y = sizeUtil.getBestPowerOf2(this.viewPort.height);
            }
            return this._maxBestPoint; 
        }

        /**
        * @private
        * @language zh_CN        
        * 打开VR相机
        * @param cameraType 相机类型
        * @param vrType VR类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        //public tap(cameraType: CameraType, vrType: VRType = null) {
        //    if (cameraType == CameraType.VR) {
        //        this.eyeMatrix.update(this);
        //        this.orthProjectChange = true;
        //        if (vrType == VRType.left) {
        //            this.viewMatrix.copyFrom(this.eyeMatrix.leftEyeMatrix);
        //        } else if (vrType == VRType.right) {
        //            this.viewMatrix.copyFrom(this.eyeMatrix.rightEyeMatrix);
        //        }
        //        this.viewMatrix.invert();
        //    }
        //}

        /**
        * @language zh_CN        
        * 设置相机横纵比
        *  
        * @param value 横纵比
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set aspectRatio(value: number) {
            if (this._aspectRatio != value) {
                this._aspectRatio = value;
                this.cameraType = this._cameraType;
            }
        }

        /**
        * @language zh_CN        
        * 返回相机横纵比
        *  
        * @returns number 横纵比
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get aspectRatio(): number {
            return this._aspectRatio;
        }

        /**
        * @language zh_CN
        * 设置相机fovY
        *  
        * @param value fovY
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set fieldOfView(value: number) {
            if (this._fovY != value) {
                this._fovY = value;
                this.cameraType = this._cameraType;
            }
        }

        /**
        * @language zh_CN
        * 返回相机fovY
        *  
        * @returns number fovY
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get fieldOfView(): number {
            return this._fovY;
        }

        /**
        * @language zh_CN
        * 设置相机近截面
        *  
        * @param value 近截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set near(value: number) {
            if (this._near != value) {
                this._near = value;
                this.cameraType = this._cameraType;
            }
        }

        /**
        * @language zh_CN
        * 返回相机近截面
        *  
        * @returns 近截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get near(): number {
            return this._near;
        }

        /**
        * @language zh_CN
        * 设置相机远截面
        *  
        * @param value 远截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set far(value: number) {
            if (this._far != value) {
                this._far = value;
                this.cameraType = this._cameraType;
            }
        }

        /**
        * @language zh_CN
        * 返回相机远截面
        *  
        * @returns 远截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get far(): number {
            return this._far;
        }

        /**
        * @language zh_CN
        * 返回viewPort
        *  
        * @returns Rectangle 
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get viewPort(): Rectangle {
            return this._viewPort;
        }

        /**
        * @language zh_CN
        * 返回相机视图投影矩阵
        *  
        * @returns 视图投影矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get viewProjectionMatrix(): Matrix4_4 {
            this.temp.copyFrom(this.viewMatrix);
            this.temp.multiply(this.projectMatrix);
            return this.temp;
        }

        public get orthProjectionMatrix(): Matrix4_4 {
            //this.updataOrth(this._orthProjectMatrix);
            if (this.orthProjectChange) {
                this.orthProjectChange = false;
                this._orthProjectMatrix.ortho(this._viewPort.width, this._viewPort.height, this._near, this._far);
            }
           
            return this._orthProjectMatrix;
        }

        ///**
        //* @language zh_CN
        //* 视图noormal矩阵
        //* normal 矩阵用来纠正透视相机影响视图变形，所影响的法线轴变形，一般用 modeviewMatrix 的逆举证的转置矩阵。
        //* @version Egret 3.0
        //* @platform Web,Native
        //*/
        //public get normalMatrix(): Matrix4_4 {
        //    this._normalMatrix.copyFrom(this.viewMatrix);
        //    this._normalMatrix.multiply(this.projectMatrix);
        //    return this._normalMatrix; 
        //}

        /**
         * @private
         * @language zh_CN
         * @param x number
         * @param y number
         * @param width number
         * @param height number
         * @version Egret 3.0
         * @platform Web,Native
         */
        public updateScissorRect(x: number, y: number, width: number, height: number) {
            this._scissorRect.x = x;
            this._scissorRect.y = y;
            this._scissorRect.width = width;
            this._scissorRect.height = height;
        }

        /**
        * @language zh_CN
        * 更新视口
        * @param x number
        * @param y number
        * @param width number
        * @param height number
        * @version Egret 3.0
        * @platform Web,Native
        */
        public updateViewport(x: number, y: number, width: number, height: number) {
            if (x == this._viewPort.x && y == this._viewPort.y &&
                width == this._viewPort.width && height == this._viewPort.height) {
                return;
            }
            this.orthProjectChange = true;
            this._viewPort.x = x;
            this._viewPort.y = y;
            this._viewPort.width = width;
            this._viewPort.height = height;

            switch (this.cameraType) {
                case CameraType.orthogonal:
                case CameraType.orthogonalToCenter:
                    this.cameraType = this.cameraType;
                    break;
            }
        }

        /**
        * @language zh_CN
        * 当前对象对视位置 (全局坐标) (修改的是自身的全局变换)
        * @param pos 相机的位置     (全局坐标)
        * @param target 目标的位置  (全局坐标)
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        public lookAt(pos: Vector3D, target: Vector3D, up: Vector3D = Vector3D.Y_AXIS) {
            this.globalPosition = pos;
            this._lookAtPosition.copyFrom(target);
            this._up.copyFrom(up);
            this._viewMatrix.lookAt(pos, target, up);
            this._mat.copyFrom(this._viewMatrix);
            this._mat.invert();

            var prs: Vector3D[] = this._mat.decompose(Orientation3D.QUATERNION);
            this._tempQuat.x = prs[1].x;
            this._tempQuat.y = prs[1].y;
            this._tempQuat.z = prs[1].z;
            this._tempQuat.w = prs[1].w;
            this.globalOrientation = this._tempQuat;
        }

        /**
        * @language zh_CN
        * 当前对象对视位置 (本地坐标) (修改的是自身的本地变换)
        * @param pos 相机的位置     (本地坐标)
        * @param target 目标的位置  (本地坐标)
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        public lookAtLocal(pos: Vector3D, target: Vector3D, up: Vector3D = Vector3D.Y_AXIS) {
            this.position = pos;
            this._lookAtPosition.copyFrom(target);
            this._up.copyFrom(up);
            this._viewMatrix.lookAt(pos, target, up);
            this._mat.copyFrom(this._viewMatrix);
            this._mat.invert();

            var prs: Vector3D[] = this._mat.decompose(Orientation3D.QUATERNION);
            this._tempQuat.x = prs[1].x;
            this._tempQuat.y = prs[1].y;
            this._tempQuat.z = prs[1].z;
            this._tempQuat.w = prs[1].w;
            this.orientation = this._tempQuat;
        }

        protected onMakeTransform() {
            Vector3D.HELP_1.setTo(1, 1, 1, 1);
            Vector3D.HELP_0.setTo(0, 0, 0, 1);

            this._modelMatrix3D.makeTransform(this._pos, Vector3D.HELP_1, this._orientation);
            this._modelMatrix3D.makeTransform(this._globalPos, Vector3D.HELP_1, this._globalOrientation);


            MathUtil.calcDegree(this._globalOrientation, this._angleVector);
            //this.billboardX.identity();
            //this.billboardX.appendRotation(this._angleVector.x, Vector3D.X_AXIS);

            this.billboardY.identity();
            this.billboardY.createByRotation(this._angleVector.y, Vector3D.Y_AXIS);

            //this.billboardZ.identity();
            //this.billboardZ.appendRotation(this._angleVector.z, Vector3D.Z_AXIS);

            this.billboardXYZ.makeTransform(Vector3D.HELP_0, Vector3D.HELP_1, this._globalOrientation);
        }

       
        protected onUpdateTransform() {
            this._viewMatrix.copyFrom(this._modelMatrix3D);
            this._viewMatrix.invert();

            this.frustum.update();
        }

        /**
         * @language zh_CN
         *  
         * 相机视图矩阵
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get viewMatrix(): Matrix4_4 {
            if (this._transformChange) {
                this.modelMatrix;
            }
            return this._viewMatrix;
        }

        /**
         * @language zh_CN
         *  
         * 相机目标点
         * @version Egret 3.0
         * @platform Web,Native
         */
        public get lookAtPosition(): Vector3D {
            return this._lookAtPosition;
        }

        private raw: Float32Array = new Float32Array(16);
        /**
        * @private
        * @language zh_CN
        * 更新正交矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        public updataOrth(target: Matrix4_4) {
            var _projectionHeight: number = 2000;
            var _yMax: number = _projectionHeight * .5;
            var _xMax: number = _yMax * this._aspectRatio;

            var left: number, right: number, top: number, bottom: number;
            ///return 
            if (this._scissorRect.x == 0 && this._scissorRect.y == 0 && this._scissorRect.width == this._viewPort.width && this._scissorRect.height == this._viewPort.height) {
                /// assume symmetric frustum
                left = -_xMax;
                right = _xMax;
                top = -_yMax;
                bottom = _yMax;

                this.raw[0] = 2 / (_projectionHeight * this._aspectRatio);
                this.raw[5] = 2 / _projectionHeight;
                this.raw[10] = 1 / (this._far - this._near);
                this.raw[14] = this._near / (this._near - this._far);
                this.raw[1] = this.raw[2] = this.raw[3] = this.raw[4] =
                    this.raw[6] = this.raw[7] = this.raw[8] = this.raw[9] =
                    this.raw[11] = this.raw[12] = this.raw[13] = 0;
                this.raw[15] = 1;

            } else {

                var xWidth: number = _xMax * (this._viewPort.width / this._scissorRect.width);
                var yHgt: number = _yMax * (this._viewPort.height / this._scissorRect.height);
                var center: number = _xMax * (this._scissorRect.x * 2 - this._viewPort.width) / this._scissorRect.width + _xMax;
                var middle: number = -_yMax * (this._scissorRect.y * 2 - this._viewPort.height) / this._scissorRect.height - _yMax;

                left = center - xWidth;
                right = center + xWidth;
                top = middle - yHgt;
                bottom = middle + yHgt;

                this.raw[0] = 2 * 1 / (right - left);
                this.raw[5] = -2 * 1 / (top - bottom);
                this.raw[10] = 1 / (this._far - this._near);

                this.raw[12] = (right + left) / (right - left);
                this.raw[13] = (bottom + top) / (bottom - top);
                this.raw[14] = this._near / (this.near - this.far);

                this.raw[1] = this.raw[2] = this.raw[3] = this.raw[4] =
                    this.raw[6] = this.raw[7] = this.raw[8] = this.raw[9] = this.raw[11] = 0;
                this.raw[15] = 1;
            }

            target.copyRawDataFrom(this.raw);
        }

        /**
         * @language zh_CN
         * 检测对象是否在相机视椎体内
         * @param renderItem 需要体测的对象
         * @returns 成功返回true
         * @version Egret 3.0
         * @platform Web,Native
         */
        public isVisibleToCamera(renderItem: IRender): boolean {
            //尝试刷新modelMatrix的值，有可能changed为true
            renderItem.modelMatrix;
            this.modelMatrix;

            //添加 手动让当前单位一直处于不剔除状态
            var bool: boolean = true;
            if (renderItem.bound) {
                bool = renderItem.bound.inBound(this.frustum) || !renderItem.enableCulling;
            }
            renderItem.inFrustum = bool;
            return bool;
        }

        /**
        * @private
        * @language zh_CN
        * 增加相机动画
        * @param name 相机动画名字
        * @param ani 相机动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        public addAnimation(name: string, ani: CameraAnimationController) {
            this._animation[name] = ani;
        }

        /**
        * @private
        * @language zh_CN
        * 播放某个动画
        * 根据动画名字来播放，指定摄像机，并且控制动画是否循环播放
        * @param name 动画名
        * @param isLoop 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        public play(name: string, isLoop: boolean = false) {
            if (this._animation[name]) {
                this._animation[name].bindCamera(this);
                this._animation[name].play(isLoop);
            }
        }

        /**
        * @private
        * @language zh_CN
        * 当前对象数据更新
        * @param time 当前时间
        * @param delay 每帧时间间隔
        * @param camera 当前渲染的摄相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        public update(time: number, delay: number, camera: Camera3D) {
            super.update(time, delay, camera);
            for (var key in this._animation) {
                this._animation[key].update(time, delay);
            }
        }

        private _halfw: number;
        private _halfh: number;

        /**
        * @language zh_CN
        * 3维坐标转2维屏幕坐标
        * @param n 3维坐标
        * @param target 2维屏幕坐标 默认为null 为null会返回一个新的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public object3DToScreenRay(n: Vector3D, target: Vector3D = null): Vector3D {
            if (!target) {
                target = new Vector3D()
            }
            this._halfw = this.viewPort.width * 0.5;
            this._halfh = this.viewPort.height * 0.5;

            target = this.viewMatrix.transformVector(n, target);
            this.project(target, target);

            target.x = this._halfw + target.x * this._halfw;
            target.y = this.viewPort.height - (this._halfh - target.y * this._halfh);
            return target;
        }

        /**
        * @language zh_CN
        * 2维屏幕坐标转3维坐标
        * @param n 2维屏幕坐标
        * @param target 3维坐标 默认为null 为null会返回一个新的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public ScreenRayToObject3D(n: Vector3D, target: Vector3D = null): Vector3D {
            if (!target) {
                target = new Vector3D()
            }
            this._halfw = this.viewPort.width * 0.5;
            this._halfh = this.viewPort.height * 0.5;

            target.x = (n.x - this._halfw) / this._halfw;
            target.y = (this._halfh - (this.viewPort.height - n.y)) / this._halfh;

            this.unproject(target.x, target.y, n.z, target);
            this.modelMatrix.transformVector(target, target);

            return target;
        }

        private v: Vector3D = new Vector3D();
        private p: Vector3D = new Vector3D();
        private unproject(nX: number, nY: number, sZ: number, target: Vector3D): Vector3D {
            target.x = nX;
            target.y = -nY;
            target.z = sZ;
            target.w = 1.0;

            target.x *= sZ;
            target.y *= sZ;

            this._unprojection.copyFrom(this.projectMatrix);
            this._unprojection.invert();

            this._unprojection.transformVector(target, target);

            target.z = sZ;

            return target;
        }

        private project(n: Vector3D, target: Vector3D): Vector3D {
            target = this.projectMatrix.transformVector(n, target);
            target.x = target.x / target.w;
            target.y = -target.y / target.w;

            target.z = n.z;

            return target;
        }

        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        public dispose() {
            CameraManager.instance.removeCamera(this);
            super.dispose();
            if (this.frustum) {
                this.frustum.dispose();
            }
            this.frustum = null;
        }

        /**
        * @language zh_CN
        * 克隆当前Camera3D
        * @returns Camera3D 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public clone(): Camera3D {
            var cloneObject: Camera3D = new Camera3D();
            cloneObject.copy(this);
            return cloneObject;
        }
    }
} 