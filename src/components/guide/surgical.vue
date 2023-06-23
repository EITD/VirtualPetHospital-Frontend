<template>
  <!-- <div>
    <HeaderRight/>
  </div> -->
  <div class="all">
  <div class="panel">
    <div class="title">手术室</div>
    <div class="logout" @click="back">退出</div>
    <!-- <div class="identity">
      <div class="img"></div>
      <div class="name">兽医</div>
    </div> -->
    <div class="operation" v-if="equipment !== null">
      <div class="header">{{equipment.name}}</div>
      <div class="item">
        <a-button style="margin: 10px" @click="showPanel=false;panelId=1;showPanel=true">功能说明</a-button>
        <a-button style="margin: 10px" @click="showPanel=false;panelId=2;showPanel=true">操作流程</a-button>
        <a-button style="margin: 10px" @click="showPanel=false;panelId=3;showPanel=true">演示动画</a-button>
      </div>
    </div>
  
   <div ref="model3D" class="model-3d" id="model">
    <div class="modelPanel" v-if="showPanel === true">
      <div class="cancel"><img src="/img/cancel.png" alt="" @click="showPanel=false;"></div>
      <div class="panel1" v-if="panelId === 1">
        <h2 style="color:white;">功能说明</h2>
        <a-typography-paragraph :ellipsis="{rows: 14, expandable: false}" style="color:white;font-size:1.3rem">
          {{ equipment.funcDes }}
        </a-typography-paragraph>
      </div>
       <div class="panel1" v-else-if="panelId === 2">
        <h2 style="color:white;">操作流程</h2>
        <a-typography-paragraph :ellipsis="{rows: 14, expandable: false}" style="color:white;font-size:1.3rem">
          {{ equipment.operating }}
        </a-typography-paragraph>
      </div>
       <div class="panel3" v-else-if="panelId === 3">
        <h2 style="color:white;">演示动画</h2>
        <video  :src="equipment.video" controls style="width:700px;height:400px"></video>
      </div>
    </div>
    </div>
   </div>
   </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
<script setup>
import { useReq } from '@/components/common/use-req.js'
import { useRouter, useRoute } from 'vue-router'
import HeaderRight from '@/components/common-comps/dash-header-right/index.vue'
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  toRaw,
  computed,
  onMounted,
  createVNode,
  getCurrentInstance,
  nextTick,
  onUnmounted
} from "vue";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";
import { Form } from "ant-design-vue";
import * as echarts from "echarts";
import { theme } from "@/configs/chalk_my"; //引入主题
import axios from "axios";
import { useStore } from 'vuex'
import {
  AxesHelper,
  CubeTextureLoader,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  SpotLight,
  PointLight,
  Color,
  PlaneBufferGeometry,
  GridHelper,
  CanvasTexture,
  Texture,
  Sprite,
  ImageUtils,
  WebGLRenderer,
  AnimationMixer,
  Plane,
  Vector3,
  PlaneHelper,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
  SpriteMaterial,
  Vector2,
  Raycaster,
  Group,
  ImageLoader,
  Clock,
  TextureLoader,
  ShaderMaterial,
} from "three";
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import TWEEN from "@tweenjs/tween.js";
const store = useStore()
const model3D = ref();
const value = ref(null);
const { proxy } = getCurrentInstance()
const { handleReqAct } = useReq()
const route = useRoute()
const router = useRouter()
const p = route.params
const equipment = ref(null)
console.log(p)
const showPanel = ref(false)

onMounted(() => {
  if (!localStorage.getItem("refresh")) {
    localStorage.setItem("refresh",1)
    router.go(0)
  }
  init3D();
});
onUnmounted(()=>{
  pointControls = null
  localStorage.removeItem("refresh")
})
let  pointControls = null
let  moveForward = null
let  moveBackward= null
let  moveLeft= null
let  moveRight= null
let  canJump= null
let  velocity= new Vector3() // 移动速度
let  direction= new Vector3() // 移动方向
const date = ref("");

const map = new Map([
  ['OP_Mitte_Mitte_OP_Tex1', 
    {
      'name':'麻醉机',
      'funcDes':"非侵入性：宠物CT机采用无创检查方式，不需要手术或穿刺，能够在不影响宠物健康的情况下进行检查。快速：宠物CT机能够在几分钟内提供高分辨率的图像，对于紧急情况和需要快速确诊的病例非常适用。精准：宠物CT机能够提供高精度的图像，能够识别微小的病变和异常，为疾病的诊断和治疗提供重要的信息。安全：宠物CT机采用低剂量辐射技术，对宠物的健康没有任何负面影响。",
      'operating': '1、安排检查：首先需要安排宠物的检查时间，并告知宠物主人需要做好的准备工作，例如禁食、禁水等。        2、安放宠物：将宠物放在CT机的检查台上，调整好宠物的体位和姿势。3、启动设备：操作人员在计算机上设置CT机的参数，包括扫描范围、扫描方式等。4、开始扫描：当宠物的准备工作和设备参数设置完成后，操作人员可以按下启动按钮，开始进行扫描。 5、扫描结束：扫描完成后，计算机会自动将扫描结果进行图像重建，并生成高清晰度的图像。6、图像评估：操作人员会对图像进行评估，分析图像中出现的任何异常或病变。7、生成报告：根据图像评估的结果，操作人员会生成一份报告，详细说明宠物的健康状况和需要采取的治疗措施。',
      'video':'https://ph-1317362646.cos.ap-shanghai.myqcloud.com/MaZuiJi.mp4'
    }
  ], 
  ['OP_Mitte_Mitte_OP_Tex3', {
    'name':'内视镜',
      'funcDes':`检查病变：内视镜能够精确地检查宠物的内部组织，如口腔、鼻腔、喉咙、肺部、肠道、泌尿道等部位，有助于医生发现病变、肿瘤、异物等问题。
进行诊断：内视镜检查可以帮助医生做出更准确的诊断和治疗方案，有助于提高治疗效果和宠物的康复速度。
进行治疗：内视镜可以通过探头的操作和配件的引导，进行内窥治疗，如切除肿瘤、清除异物、取出结石、止血等。
减少创伤：相比传统的手术方式，内视镜操作能够减少手术创伤和出血量，缩短恢复时间，提高手术安全性。
效果可视化：内视镜操作可以将宠物的内部情况实时呈现在显示器上，医生和宠物主人可以清晰地看到检查结果和治疗过程，更好地了解宠物的健康情况和治疗效果。`,
      'operating': `1.准备工作：将内视镜放入消毒液中消毒，并使用适当的润滑剂使其更容易进入宠物体内。
2.麻醉：麻醉宠物是必要的，因为内视镜的操作可能会给宠物带来一定的不适和疼痛。
3.插入内视镜：将内视镜插入宠物的口腔、鼻腔或肛门，通过操纵手柄控制探头的方向和角度，使摄像头能够拍摄到需要检查的部位。
4.观察和记录：医生通过显示器观察宠物内部的图像和视频，并对检查结果进行记录和分析，以确定诊断和治疗方案。
5.拆卸和清洁：使用清洁剂清洁内视镜和配件，并进行必要的维护和保养，以确保设备的性能和寿命。`,
      'video':'https://ph-1317362646.cos.ap-shanghai.myqcloud.com/NeiKuiJing.mp4'
  }], 
  ['Tracy', 85]
])
const roomMap = new Map([
  ["Window_Door__0003_2", "front"],
]);
var camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

var renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
let target = new Vector3(9,5,-20)

camera.position.set(5,5,-5);

const clock = new Clock();


async function init3D() {
  var scene = new Scene();
  var light = new AmbientLight(0x404040);
  light.position.set(0, 0, 1000);
  scene.add(light);
  let floorMesh = createFloor();
  scene.add(floorMesh);

  var pointLight = new SpotLight(0xffffff); //点光源
  pointLight.position.set(-1000, 500, 1000);
  pointLight.castShadow = true; // 让光源产生阴影效果
  scene.add(pointLight);

  var ball = new SphereGeometry(15, 15, 15);

  var loader = new GLTFLoader();
  var object = null;

  var group = new Group();
  loader.load(
    "/operating_room.glb",
    function (obj) {
      object = obj.scene;
      scene.add(obj.scene);
      obj.scene.position.set(0,0,0)
      obj.scene.scale.set(5, 5, 5);

      // obj.scene.traverse(function (child) {
      //   if (child.isMesh) {
      //     child.frustumCulled = false;
      //     //模型阴影
      //     child.castShadow = true;
      //     //模型自发光
      //     child.material.emissive = child.material.color;
      //     child.material.emissiveMap = child.material.map;
      //   }
      // });
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened", error);
    }
  );
  // let loader2 = new OBJLoader();
  // loader2.load(
  //   "/apartment_4.obj",
  //   function (obj) {
  //     object = obj.scene;
  //     obj.scale.set(0.5, 0.5, 0.5);
  //     obj.position.set(0,0,0)
  //     // obj.scene.name = "house-4";
  //     scene.add(obj);
  //     // obj.scene.traverse(function (child) {
  //     //   if (child.isMesh) {
  //     //     child.frustumCulled = false;
  //     //     //模型阴影
  //     //     child.castShadow = true;
  //     //     //模型自发光
  //     //     child.material.emissive = child.material.color;
  //     //     child.material.emissiveMap = child.material.map;
  //     //   }
  //     // });
  //   },
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //   },
  //   function (error) {
  //     console.log("An error happened", error);
  //   }
  // );
  // var mtlLoader = new MTLLoader();
  // mtlLoader.setPath( '/Apartment_Building_26_obj/' );  
  // // for(let i = 0; i< 10; i++){

  // mtlLoader.load('Apartment Building_26_obj.mtl', function(materials) {
  
  //     materials.preload();
  //     // var buildTexture = new Texture();
  //     // var loader = new ImageLoader( );
  //     // loader.load( '/icgvzl8hyw3k-cctv-camera/tex/CameraLens.png', function ( image ) {
  //     //     buildTexture.image = image;
  //     //     buildTexture.needsUpdate = true;
  //     // } );
  //     var objLoader = new OBJLoader();
  //     objLoader.setMaterials(materials);
  //     objLoader.setPath( '/Apartment_Building_26_obj/' ); 
  //     objLoader.load('Apartment Building_26_obj.obj', function(object) {
  //         object.position.y = 0.5;
  //         // object.name = "house-"+i;
  //         // object.rotation.set(-Math.PI/2,0,-Math.PI/2)
  //         object.scale.set(0.1, 0.1, 0.1);
  //         // object.position.set((i-5)*70,0,0)
  //         scene.add(object);
  //         // object.traverse(function(child) {
  //         //     if (child instanceof Mesh) {
  //         //         //设置模型皮肤
  //         //         child.material.map = ImageUtils.loadTexture( '/obj/textures/AussenWand_C.jpg');
  //         //     }
  //         // });
  //     }, 
  //     function (xhr) {
  //       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     function (error) {
  //       console.log("An error happened", error);
  //     }
  //   );
  // })
  // console.log(22222)
  //   var loader = new FBXLoader();
    
  //     loader.load('/Bina/building.fbx', function (object) {
  //       object.scale.set(0.5, 0.5, 0.5);
  //       object.name = "house-";
  //       object.rotation.set(0,0,0)
  //       object.position.set(-300,0,150)
  //       scene.add(object);
  //     });
  
  

  var raycaster = new Raycaster();
  var mouse = new Vector2();

  async function onMouseClick(event) {
    let div3D = document.getElementById("model");
    let div3DLeft = div3D.getBoundingClientRect().left;
    let div3DTop = div3D.getBoundingClientRect().top;
    //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
    mouse.x = ((event.clientX - div3DLeft) / div3D.offsetWidth) * 2 - 1;
    mouse.y = -((event.clientY - div3DTop) / div3D.offsetHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    // 获取raycaster直线和所有模型相交的数组集合
    var intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    console.log(mouse.x)
    console.log(mouse.y)
    // if (intersects[0]?.object?.parent?.parent?.name !== undefined) {
    //   console.log(intersects[0].object.parent.parent.name);
    //   if (intersects[0].object.parent.parent.name === "house-1") {
    //     const housePanel = document.querySelector(".housePanel");
    //     housePanel.style.marginLeft = event.clientX - 233 + "px";
    //     housePanel.style.marginTop = event.clientY - 110 + "px";
    //     showHousePanel.value = !showHousePanel.value;
    //   }
    // } else {
    //   console.log("nonono");
    //   showHousePanel.value = false;
    // }
    let p = intersects[0]?.object.name.slice(0,22)
    console.log(p)
      if(map.has(p)){
        equipment.value = map.get(p)

        // if (name === "1") {
        //   // const housePanel = document.querySelector(".housePanel");
        //   // housePanel.style.marginLeft = event.clientX  + "px";
        //   // housePanel.style.marginTop = event.clientY  + "px";
        //   // showHousePanel.value = !showHousePanel.value;
        // }
      }
      else {
        equipment.value = null
        
        // if (name === "1") {
        //   // const housePanel = document.querySelector(".housePanel");
        //   // housePanel.style.marginLeft = event.clientX  + "px";
        //   // housePanel.style.marginTop = event.clientY  + "px";
        //   // showHousePanel.value = !showHousePanel.value;
        // }
      }
      let p2 = intersects[0]?.object.name
      if (roomMap.has(p2)) {
        pointControls.unlock();
        router.push({
          name: roomMap.get(p2),
        });
      } else {
      }
    
    
    // if (intersects[0]?.object?.parent?.name !== undefined) {
    //   console.log(intersects[0].object.parent.name);
    //   if (intersects[0].object.parent.name === "house-5") {
    //     const housePanel = document.querySelector(".housePanel");
    //     housePanel.style.marginLeft = event.clientX + "px";
    //     housePanel.style.marginTop = event.clientY+ "px";
    //     showHousePanel.value = !showHousePanel.value;
    //   }
    // } else {
    //   console.log("nonono");
    //   showHousePanel.value = false;
    // }
    // let point = intersects[0]?.object?.parent?.parent?.position;
    // console.log('point',point.x)
    // let target = new Vector3(point.x,point.y+10,point.z+100)
    // _orbitController.target = point;
    // camera.position.set(point.x,point.y+10,point.z+100);
    // _orbitController.update();
    // let point = new Vector3(100, 0, 0)
    // const cloneCamera = camera.clone();
    // // this.camera.lookAt(point3d);
    // cloneCamera.lookAt(point);
    // new TWEEN.Tween(camera.position)
    //   .to({ x: cloneCamera.position.x, y: cloneCamera.position.y, z: cloneCamera.position.z}, 1000)
    //   .easing(TWEEN.Easing.Back.Out).start();

    //   new TWEEN.Tween(camera.rotation)
    //   .to({ x: cloneCamera.rotation.x, y: cloneCamera.rotation.y, z: cloneCamera.rotation.z}, 1000)
    //   .easing(TWEEN.Easing.Back.Out).start();
    //   camera.lookAt(new Vector3(300, 100, 100));
    //   var pos2 = new Vector3(20, 10, 0)
    //   animateCamera(new Vector3(20,10,100), target ,new Vector3(0, 0, 100), point);
    //   _orbitController.target = new Vector3(20, 10, 0)
    //   camera.position.set(20, 10, 100);
    intersects = undefined;
  }
  // var tween;
  // function animateCamera(current1, target1, current2, target2)
  // {
  //     let positionVar = {x1: current1.x,y1: current1.y,z1: current1.z,x2: target1.x,y2: target1.y,z2: target1.z};
  //     _orbitController.enabled = false;
  //     tween = new TWEEN.Tween(positionVar);
  //     tween.to({x1: current2.x,y1: current2.y,z1: current2.z,x2: target2.x,y2: target2.y,z2: target2.z}, 1000);
  //     tween.onUpdate(function() {
  //         camera.position.x = positionVar.x1;
  //         camera.position.y = positionVar.y1;
  //         camera.position.z = positionVar.z1;
  //         _orbitController.target.x = positionVar.x2;
  //         _orbitController.target.y = positionVar.y2;
  //         _orbitController.target.z = positionVar.z2;
  //         _orbitController.update();
  //         console.log(positionVar);
  //     })
  //     tween.onComplete(function() {_orbitController.enabled = true;})
  //     tween.easing(TWEEN.Easing.Cubic.InOut);tween.start();
  // // for ( var i = 0; i < intersects.length; i++ ) {
  // //   intersects[ i ].object.material.color.set( 0xff0000 );
  // // }
  //  }
  //   // current1 相机当前的位置
  //     // target1 相机的目标位置
  //     // current2 当前的controls的target
  //     // target2 新的controls的target
  function animateCamera(current1, target1, current2, target2) {
    var tween = new TWEEN.Tween({
      x1: current1.x, // 相机当前位置x
      y1: current1.y, // 相机当前位置y
      z1: current1.z, // 相机当前位置z
      x2: current2.x, // 控制当前的中心点x
      y2: current2.y, // 控制当前的中心点y
      z2: current2.z, // 控制当前的中心点z
    });
    tween.to(
      {
        x1: target1.x, // 新的相机位置x
        y1: target1.y, // 新的相机位置y
        z1: target1.z, // 新的相机位置z
        x2: target2.x, // 新的控制中心点位置x
        y2: target2.y, // 新的控制中心点位置x
        z2: target2.z, // 新的控制中心点位置x
      },
      1000
    );
    tween.onUpdate(function () {
      camera.position.x = this.x1;
      camera.position.y = this.y1;
      camera.position.z = this.z1;
      _orbitController.target.x = this.x2;
      _orbitController.target.y = this.y2;
      _orbitController.target.z = this.z2;
      _orbitController.update();
    });
    tween.easing(TWEEN.Easing.Cubic.InOut);
    tween.start();
  }
  window.addEventListener("dblclick", onMouseClick, false);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  var controls; 
  function initControls() {
      controls = new FirstPersonControls(camera,renderer.domElement);
      controls.lookSpeed = 0.5; //鼠标移动查看的速度
      controls.movementSpeed = 10; //相机移动速度
      controls.noFly = true;
      controls.constrainVertical = true; //约束垂直
      controls.verticalMin = 1.0;
      controls.verticalMax = 2.0;
      controls.lon = -100; //进入初始视角x轴的角度
      controls.lat = 0; //初始视角进入后y轴的角度
  }
  let flag = 0
  function toggleFirstPerson(v) {
        if(!v) {
            // orbitControls.enabled  = true
            controls.dispose()
            controls = null
            renderer.render(scene,camera)
            camera.updateProjectionMatrix();
            flag = 0
        }else{
            // orbitControls.enabled  = false
            flag = 1
            //initControls()
            camera.updateProjectionMatrix();
        }
  }

  document.addEventListener('keyup',(e)=>{
    if(e.keyCode==27){
      toggleFirstPerson(0)  //事件名
    }
  })
  document.getElementById('model').onclick=function(){
    console.log('*****')
      toggleFirstPerson(1)
  }
	let selView  = () => {
     pointControls = new PointerLockControls( camera, renderer.domElement );
        var container = document.getElementById( 'model' );
        container.addEventListener( 'click', function () {
          pointControls.lock();
        });
        scene.add(pointControls.getObject() );
        var onKeyDown = (event) => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            moveForward = true
            break

          case 37: // left
          case 65: // a
            moveLeft = true
            break

          case 40: // down
          case 83: // s
            moveBackward = true
            break

          case 39: // right
          case 68: // d
            moveRight = true
            break

          case 32: // space
            if (canJump === true) velocity.y += 350
            canJump = false
            break
        }
      }

      var onKeyUp = (event) => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            moveForward = false
            break

          case 37: // left
          case 65: // a
            moveLeft = false
            break

          case 40: // down
          case 83: // s
            moveBackward = false
            break

          case 39: // right
          case 68: // d
            moveRight = false
            break
        }
      }

      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
    }
    
    selView()
  function animate() {
    // flyControls.update(delta) //更新飞行控件
    renderer.render(scene, camera);
    //if(flag === 1) controls.update(clock.getDelta());
    requestAnimationFrame(animate);
    // _orbitController.update();
    if (pointControls) {
          if (pointControls.isLocked) {
            var delta = clock.getDelta()
            velocity.x -= velocity.x * 20.0 * delta
            velocity.z -= velocity.z * 20.0 * delta
            velocity.y -= 9.8 * 200.0 * delta // 控制跳跃的高度

            direction.z = Number(moveForward) - Number(moveBackward)
            direction.x = Number(moveRight) - Number(moveLeft)
            direction.normalize() // 这确保了各个方向的一致运动

            if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta // 可控制移动的速度
            if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta // 可控制移动的速度

            pointControls.moveRight(-velocity.x * delta)
            pointControls.moveForward(-velocity.z * delta)
            pointControls.getObject().position.y += (velocity.y * delta) // new behavior

            if (pointControls.getObject().position.y < 5) {
              velocity.y = 0
              pointControls.getObject().position.y = 5 // 视角锁定时y轴的高度
              pointControls.position0.set(0, 5, 10)
              canJump = true
            }
          } else {
          }
        }
  }

 

  animate();
  await nextTick();
  model3D.value.appendChild(renderer.domElement);
}
// function setModelMode (mode) {
//   if (_transController) _transController.setMode(mode);
// }
function gizmoChange(e) {
  // console.log(e);
  console.log("----------------------------", object);
}
function createFloor() {
  let floorGeometry = new PlaneGeometry(1000, 1000);
  let floorMaterial = new MeshLambertMaterial({
    color: 0xcccccc,
    // specular: 0x444444,
    // shininess: 100
  });
  let floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  return floor;
}
// const housePanel = (id) => {
//     console.log(showHousePanel.value)
//     // const d = document.createElement("d")
//     // d.setAttribute("style","border: 10px solid red; width: 100px; height: 100px")
//     // model3D.value.appendChild(d)
//     // const housePanel = document.querySelector('.housePanel')
//     // housePanel.style.display= 'block'
//     showHousePanel.value = true
// }
const options = ref([
  {
    value: "1",
    label: "1",
  },
  {
    value: "12",
    label: "12",
  },
  {
    value: "2",
    label: "2",
  },
]);
// const handleChange = (value) => {
//   console.log(`selected ${value}`);
//   //TODO: 后端返回位置坐标
//   let point = new Vector3(0, 0, 0);
//   console.log("point", point.x);
//   let target = new Vector3(point.x, point.y + 10, point.z + 100);
//   _orbitController.target = point;
//   camera.position.set(point.x, point.y + 10, point.z + 100);
//   _orbitController.update();
// };
const handleBlur = () => {
  console.log("blur");
};
const handleFocus = () => {
  console.log("focus");
};
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const back = ()=> {
  router.push({
    name: 'GuideView'
  })
}

</script>

<style lang="less" scoped>
.all{
  width: 100%;
  height: 100%;
  .panel{
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 2000;
    .title{
      position: absolute;
      top: 20px;
      left: 20px;
      background-color: rgba(26, 27, 27, 0.645);
      width: 100px;
      height: 50px;
      color: white;
      line-height: 50px;
      text-align: center;
      display: inline-block;
    }
    .logout{
      background-color: rgba(26, 27, 27, 0.645);
      width: 80px;
      height: 30px;
      top: 20px;
      right: 20px;
      position: absolute;
      color: white;
      float: right;
      line-height: 30px;
      text-align: center;
      cursor:pointer;
    }
    .identity{
      
      color: white;
      position: absolute;
      bottom: 20px;
      left: 20px;
      line-height: 30px;
      text-align: center;
      display: flex;
      flex-direction: row;
      align-items: center;
        .img{
          background-color: rgba(26, 27, 27, 0.645);
          width: 60px;
          height: 60px;
        }
        .name{
          margin-left: 10px;
        }
  
      
    }
    .operation{
      width: 500px;
      height: 100px;
      color: white;
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // align-items: center;
        .header{
          height: 30px;
          width: 100px;
          line-height: 30px;
          text-align: center;
          background-color: rgba(26, 27, 27, 0.845);
        }
        .item{
          background-color: rgba(26, 27, 27, 0.545);
          margin: auto;
          display: flex;
          width: 500px;
          height: 70px;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0px 70px;
        }
  
    }
  
  }
  .modelPanel{
    .cancel{
      position: absolute;
      right: 5px;
      top: 5px;
    }
    border: 1px solid rgba(0, 0, 0, 0.418);
    position: absolute;
    z-index: 3000;
    border-radius: 20px;
    // padding: 10px;
    // margin-top: 20px;
    //   background: linear-gradient(
    //     to right,
    //     rgba(61, 149, 172, 0.884) 0%,
    //     rgba(165, 195, 230, 0.521) 50%,
    //     rgba(26, 27, 27, 0.445) 100%,
    //   );
    background-color: rgba(26, 27, 27, 0.845);
    display: flex;
    flex-direction: column;
    color: white;
    display: flex;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 20px 30px;
    .panel1{
      overflow: hidden;
      color: white;
      width: 810px;
      height: 400px;
    }
    .panel3{
      
      overflow: hidden;
      color: white;
    }
  }
}
</style>