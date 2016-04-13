﻿module egret3d {

    /**
    * @private
    */
    export class DiffusePass extends MaterialPass {

        constructor(materialData: MaterialData) {
            super(materialData);
        }

        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        public initUseMethod(animation: IAnimation) {
            this._passChange = false;
            var i: number = 0;
            this._passUsage = new PassUsage();

            this._materialData.textureMethodTypes.push(TextureMethodType.color);

            this._passUsage.vertexShader.shaderType = Shader.vertex;
            this._passUsage.fragmentShader.shaderType = Shader.fragment;

            if (!animation || !animation.animaNodeCollection) {
                this._passUsage.vertexShader.addUseShaderName("base_vs");
            }

            this._passUsage.fragmentShader.addUseShaderName("base_fs");
            this._passUsage.fragmentShader.addUseShaderName("materialSource_fs");


            if (animation) {
                if (animation.animaNodeCollection) {
                    this._passUsage.vertexShader.addUseShaderName("particle_vs");
                }
                else {
                    this._passUsage.maxBone = animation.skeletonAnimationController.jointNumber * 2;
                    this._passUsage.vertexShader.addUseShaderName("skeleton_vertex");
                }
            }
            else {
                this._passUsage.vertexShader.addUseShaderName("diffuse_vertex");
            }

            if (this._materialData.textureMethodTypes.indexOf(TextureMethodType.color) != -1) {
                this._passUsage.fragmentShader.addUseShaderName("gamma_fs");
                this._passUsage.fragmentShader.addUseShaderName("diffuse_fragment");
            }
            if (this._materialData.textureMethodTypes.indexOf(TextureMethodType.normal) != -1) {
                this._passUsage.fragmentShader.addUseShaderName("normalMap_fragment");
            }

            if (this.lightGroup) {
                this._passUsage.maxDirectLight = this.lightGroup.directLightList.length;
                this._passUsage.maxSpotLight = this.lightGroup.spotLightList.length;
                this._passUsage.maxPointLight = this.lightGroup.pointLightList.length;

                this._passUsage.fragmentShader.addUseShaderName("lightingBase_fs");

                if (this.lightGroup.directLightList.length) {
                    this._passUsage.directLightData = new Float32Array(DirectLight.stride * this.lightGroup.directLightList.length);
                    this._passUsage.fragmentShader.addUseShaderName("directLight_fragment");
                }
                if (this.lightGroup.spotLightList.length) {
                    this._passUsage.spotLightData = new Float32Array(SpotLight.stride * this.lightGroup.spotLightList.length);
                    this._passUsage.fragmentShader.addUseShaderName("spotLight_fragment");
                }
                if (this.lightGroup.pointLightList.length) {
                    this._passUsage.pointLightData = new Float32Array(PointLight.stride * this.lightGroup.pointLightList.length);
                    this._passUsage.fragmentShader.addUseShaderName("pointLight_fragment");
                }
            }

            if (this._materialData.textureMethodTypes.indexOf(TextureMethodType.specular) != -1) {
                this._passUsage.fragmentShader.addUseShaderName("specularMap_fragment");
            }

            if (!animation || !animation.animaNodeCollection) {
                this._passUsage.vertexShader.addEndShaderName("end_vs");
            }
            this._passUsage.fragmentShader.addEndShaderName("end_fs");

            if (this.methodList) {
                for (var i: number = 0; i < this.methodList.length; i++) {
                    this._passUsage.vertexShader.addUseShaderName(this.methodList[i].vsShaderName);
                    this._passUsage.fragmentShader.addUseShaderName(this.methodList[i].fsShaderName);
                }
            }
        }
    }
} 