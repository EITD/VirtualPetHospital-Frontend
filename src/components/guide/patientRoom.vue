<template>
  <!-- <div>
    <HeaderRight/>
  </div> -->
  <div class="all">
  <div class="panel">
    <div class="title">问诊室</div>
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
const date = ref("");

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
let  pointControls = null
let  moveForward = null
let  moveBackward= null
let  moveLeft= null
let  moveRight= null
let  canJump= null
let  velocity= new Vector3() // 移动速度
let  direction= new Vector3() // 移动方向

let target = new Vector3(9,5,-20)

camera.position.set(10,5,-10);

const clock = new Clock();

const map = new Map([
  ['Object_626', 
    {
      'name':'基础体检',
      'funcDes':`全面检查宠物的生命体征，包括体温、心率、呼吸等;
检查宠物的眼、耳、口腔、鼻腔、皮肤、毛发等部位，了解宠物的状况;
进行宠物常规的血液、尿液和粪便检查，以检测宠物的健康状况和疾病情况;
对宠物进行体格检查，包括检查骨骼、肌肉、神经系统等，以确定宠物身体状况。`,
      'operating': `1、咨询：宠物主人到达宠物诊所或宠物医院后，需要向医生咨询体检的具体内容和流程。
2、问诊：医生会向宠物主人询问宠物的病史、饮食习惯、行为习惯等相关情况。
3、体检：医生会对宠物进行全面的身体检查，包括测量体温、心率、呼吸等生命体征，检查眼、耳、口腔、鼻腔、皮肤、毛发等部位，以及进行体格检查。
4、辅助检查：如果需要，医生还会进行宠物的血液、尿液和粪便检查等辅助检查。
5、诊断和建议：根据检查结果，医生会给出宠物的诊断和建议，如是否需要治疗、饮食和生活习惯方面的建议等。
6、随访：医生会定期随访宠物的健康状况，以及必要时进行治疗和调整建议。`,
      'video':'https://ph-1317362646.cos.ap-shanghai.myqcloud.com/WenZhen.mp4'
    }
  ], 
])
const roomMap = new Map([
  ["网格985", "front"],
]);
async function init3D() {
  var scene = new Scene();
  var light = new AmbientLight(0x404040);
  light.position.set(0, 100, 0);
  scene.add(light);
  let floorMesh = createFloor();
  scene.add(floorMesh);

  var pointLight = new SpotLight(0xffffff); //点光源
  pointLight.position.set(0, 500, 0);
  pointLight.castShadow = true; // 让光源产生阴影效果
  scene.add(pointLight);

  var ball = new SphereGeometry(15, 15, 15);

  var loader = new GLTFLoader();
  var object = null;

  var group = new Group();
  loader.load(
    "/patient_room.glb",
    function (obj) {
      object = obj.scene;
      scene.add(obj.scene);
      obj.scene.position.set(0,0,0)
      obj.scene.scale.set(10, 10, 10);

      // obj.scene.traverse(function (child) {
      //   if (child.isMesh) {
      //     child.frustumCulled = true;
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
    let p = intersects[0]?.object.name.slice(0,11)
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

  // document.addEventListener('keyup',(e)=>{
  //   if(e.keyCode==27){
  //     toggleFirstPerson(0)  //事件名
  //   }
  // })
  // document.getElementById('model').onclick=function(){
  //   console.log('*****')
  //     toggleFirstPerson(1)
  // }
  var container = document.getElementById( 'model' );
	let selView  = () => {
     pointControls = new PointerLockControls( camera, renderer.domElement );
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
    background-color: rgba(26, 27, 27, 0.645);
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