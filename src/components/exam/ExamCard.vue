<template>
  <div class="exam-card">
   <div>
      <a-button @click="back" ghost shape="round" type="primary" style="margin-top:20px;margin-left: 1380px">返回</a-button>
    </div>
    <div v-if="!isStarted" class="exam-start">
      <el-card class="box-card" >
        <div slot="header" class="clearfix" align="center" >
          <h2>考试须知</h2>
        </div>
        <div class="text" >
          <p>一、考试为在线考试，有时间限制,时间结束自动交卷</p>
          <p>二、考试请独立思考，不得与他人交流</p>
          <p>三、考试为机器判卷，请规范作答，不要加多余的符号</p>
          <p>四、可以在规定时间内多次测试，截止后不能查看</p>
        </div>
        <div align="center" style="margin-top:30px">
          <button @click="startExam">开始考试</button>
        </div>
      </el-card>
    </div>
    <div v-else-if="isOver" class="exam-start" style="text-align: center;">
  <el-card class="box-card" style="text-align: center; margin: auto;">
    <div slot="header" class="clearfix" style="text-align: center;">
      <h1>已交卷</h1>
    </div>
    <div class="tat">
      <h2 v-bind:style="{color: 'red'}">您的得分是：{{score}}分</h2>
    </div>
   
  </el-card>
</div>


    <div v-else>
      <div class="question" >
        <div class="head">
          <h2>{{currentQuestionIndex+1}}、{{ currentQuestion.question }}</h2>
        </div>
        <div class="op">
          <li v-for="(option, index) in currentQuestion.options" :key="index">
            <div style="margin: 30px">
              <input type="checkbox" v-if="currentQuestion.type == 'multiple-choice'" v-model="selectOptions[index]" :value="option" />
              <input type="radio" v-else-if="currentQuestion.type == 'single-choice'" v-model="currentAnswer" :value="option" />
               {{ option }}
            </div>
          </li>
          <li v-if="currentQuestion.type == 'true-false'">
            <div style="margin: 30px">
              <input type="radio" v-model="currentAnswer" value="true" />
              正确
            </div>
            <div style="margin: 30px">
              <input type="radio" v-model="currentAnswer" value="false" />
              错误
            </div>
          </li>
          <li v-if="currentQuestion.type == 'short-answer'">
            <input type="text" v-model="currentAnswer" style="margin-top:20px;margin-left:30px"/>
          </li>
        </div>
        <div class="left">
          <button :disabled="currentQuestionIndex == 0" @click="previousQuestion">上一题</button>
        </div>
        <div class="right">  
          <button :disabled="currentQuestionIndex == questions.length - 1" @click="nextQuestion">下一题</button>
        </div>
      </div>
      <div class="card">
        <div >
          <div v-if="remainingTime > 0" style="margin:20px;margin-left:40px">
            考试倒计时：{{ minutes }} 分钟 {{ seconds }} 秒
          </div>
          <div v-else style="margin:20px;margin-left:40px">
            考试结束
          </div>
          <div style="margin:20px;margin-left:20px">
            <button v-for="(question, index) in questions" :key="index" @click="gotoQuestion(index)" :class="{ answered: answers[index] }" style="margin-top:20px;margin-left:20px">{{ index + 1 }}</button>
          </div>
          <div style="margin-top:390px;margin-left:80px">
            <button @click="submitExam">提交考试</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from "axios";
import { useRouter } from "vue-router"; // 引入 useRouter 函数
import HeaderBar from '@/components/common-comps/header-bar.vue';



export default {
  name:"ExamCard",
  data() {
    return {
      isStarted: false,
      isOver:false,
      currentQuestionIndex: 0,
      currentAnswer: '',
      selectOptions:[],
      questions: [],
      answers: [],
      examTime: 10,
      remainingTime: 10 * 60,
      timer: null,
      allscore:0,
      score:0
    }
  },
  setup() {
  const tcc = ref(null);
  const pcc = ref(null);
  const realquestions=ref(null);
  const router = useRouter();
  const state = reactive({
    tests: [],
  });
  const remainingTime = ref(null); // create a ref for remainingTime
  const allscore=ref(null);
  const questions=ref(null);

  const getTestCanData = async () => {
    await axios
      .get("http://localhost:8000/paper/" + router.currentRoute.value.params.id)
      .then((response) => {
        tcc.value = JSON.parse(JSON.stringify(response.data)).data;
        console.log(tcc.value);
      });
     await axios
      .get("http://121.41.117.97:3000/paperproblem?paper="+tcc.value.id)
      .then((response) => {
        pcc.value =JSON.parse(JSON.stringify(response.data));
        console.log(pcc.value.problems);state.tests=pcc.value.problems.split(',');
      });
      
      for(let i in state.tests)await axios
      .get("http://121.41.117.97:3000/problem?id="+state.tests[i])
      .then((response) => {
        realquestions.value=JSON.parse(JSON.stringify(response.data));
        console.log(realquestions.value.options);
      });
  };

  onMounted(() => {
    getTestCanData();
  });

 

  watch(
    () => tcc.value?.time,
    (newValue) => {
      if (newValue) {
        remainingTime.value = newValue * 60; // use the ref here
      }
    }
  );
watch(
    () => pcc.value?.score,
    (newValue) => {
      if (newValue) {
        allscore.value = newValue; // use the ref here
      }
    }
  );
  watch(
    () => realquestions.value,
    (newValue) => {
      if (newValue) {
        var ttt={
          question: newValue.question,
          type: newValue.type,
          options: [],
          answer:newValue.answer,
          score:allscore
        };
        if(newValue.options!=null)ttt.options=newValue.options.split(',');
        if (questions.value === null) {
        questions.value = [];
      }
      
      questions.value.push(ttt);
      }
    }
  );

  return {
    tcc,
    state,
    router,
    remainingTime, 
    pcc,
    realquestions,
    questions
    // add the ref to the returned object
  };
},


  methods: {
    back(){
      this.router.back();
    },
    startExam() {
      this.isStarted = true;
      this.timer = setInterval(() => {
        this.remainingTime--;
      }, 1000);
    },
    nextQuestion() {
      if(this.questions[this.currentQuestionIndex].type=='multiple-choice') this.currentAnswer=this.selectOptions.toString();
      this.selectOptions=[]
      this.answers[this.currentQuestionIndex] = this.currentAnswer;
      this.currentQuestionIndex++;
      this.currentAnswer = this.answers[this.currentQuestionIndex] || '';
    },
    previousQuestion() {
      if(this.questions[this.currentQuestionIndex].type=='multiple-choice') this.currentAnswer=this.selectOptions.toString();
      this.selectOptions=[]
      this.answers[this.currentQuestionIndex] = this.currentAnswer;
      this.currentQuestionIndex--;
      this.currentAnswer = this.answers[this.currentQuestionIndex] || '';
    },
    gotoQuestion(index) {
      if(this.questions[this.currentQuestionIndex].type=='multiple-choice') this.currentAnswer=this.selectOptions.toString();
      this.selectOptions=[]
      this.answers[this.currentQuestionIndex] = this.currentAnswer;
      this.currentQuestionIndex = index;
      this.currentAnswer = this.answers[this.currentQuestionIndex] || '';
    },
    submitExam() {
      if(this.questions[this.currentQuestionIndex].type=='multiple-choice') this.currentAnswer=this.selectOptions.toString();
      this.selectOptions=[]
      clearInterval(this.timer);
      this.answers[this.currentQuestionIndex] = this.currentAnswer;
      console.log('提交答案', this.answers);
      this.isOver=true;

      
  for (let i = 0; i < this.questions.length; i++) {
    if (this.answers[i] === this.questions[i].answer) {
      this.score += this.questions[i].score;
    }
  }
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    minutes() {
      return Math.floor(this.remainingTime / 60);
    },
    seconds() {
      return this.remainingTime % 60;
    }
  },
  watch: {
    remainingTime(value) {
      if (value === 0) {
        this.submitExam();
      }
    }
  }
}
</script>





<style scoped>
.answered {
  background-color: green;
  color: white;
}
.exam-card {
  overflow: scroll;
  background: url("../../assets/background1.jpg");
  width: 100%;
  height: 100%;
}
.exam-start {
  display: flex;
  margin: 150px 560px;
  background: rgba(255, 255, 255, 0.5);
  height: 40%;
}
.box-card{
  padding:20px;
}
.question{
  display: flex;
  margin-left: 380px;
  margin-top:20px;
  background: rgba(255, 255, 255, 1);
  width:70%;
  height:600px;
  position:absolute;
}
.head{
  margin-left:120px;
  margin-top:60px;
  width:100%;
  position:absolute;
}
.op{
  position:absolute;
  margin-left:120px;
  margin-top:120px;
}
.card{
  display: flex;
  margin-left: 80px;
  margin-top:20px;
  background: rgba(255, 255, 255, 0.5);
  width:18%;
  height:600px;
  position:absolute;
}
.left{
  margin-left: 30px;
  margin-top:550px;
  position:absolute;
}
.right{
  margin-left: 970px;
  margin-top:530px;
  position:absolute;
}
.tat{
  color:red;
}
</style>
