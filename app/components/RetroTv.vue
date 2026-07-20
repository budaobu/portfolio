<template>
  <div class="main_wrapper" :class="props.class">
    <div class="main">
      <div class="antenna">
        <div class="antenna_shadow"></div>
        <div class="a1"></div>
        <div class="a1d"></div>
        <div class="a2"></div>
        <div class="a2d"></div>
        <div class="a_base"></div>
      </div>
      <div class="tv">
        <div class="cruve">
          <svg
            viewBox="0 0 189.929 189.929"
            xmlns="http://www.w3.org/2000/svg"
            class="curve_svg"
          >
            <path
              d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
            ></path>
          </svg>
        </div>
        <div class="display_div">
          <div class="screen_out">
            <div class="screen_out1">
              <div class="screen">
                <span class="notfound_text">{{ errorMessage }}</span>
              </div>
              <!-- 模拟屏幕噪点动画层 -->
              <div class="screenM"></div>
            </div>
          </div>
        </div>
        <div class="lines">
          <div class="line1"></div>
          <div class="line2"></div>
          <div class="line3"></div>
        </div>
        <div class="buttons_div">
          <div class="b1"><div></div></div>
          <div class="b2"></div>
          <div class="speakers">
            <div class="g1">
              <div class="g11"></div>
              <div class="g12"></div>
              <div class="g13"></div>
            </div>
            <div class="g"></div>
            <div class="g"></div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="base1"></div>
        <div class="base2"></div>
        <div class="base3"></div>
      </div>
    </div>
    <div class="text_404">
      <div v-for="(digit, index) in errorCodeDigits" :key="index" :class="`text_404${index + 1}`">
        {{ digit }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  errorCode?: string
  errorMessage?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  errorCode: '404',
  errorMessage: 'NOT FOUND',
  class: ''
})

const errorCodeDigits = computed(() => props.errorCode.split(''))
</script>

<style scoped>
/* Retro TV CSS Implementation 
  基于提供的 DOM 结构实现的复古电视样式
*/

.main_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transform: scale(0.8); /* 整体缩放适应 */
}

/* 天线部分 */
.antenna {
  width: 5px;
  height: 10px;
  background-color: #374151; /* gray-700 */
  margin-bottom: -10px;
  position: relative;
  z-index: 2;
}
.antenna_shadow {
  position: absolute;
  background-color: transparent;
  width: 50px;
  height: 56px;
  margin-left: 16.8px;
  border-radius: 45%;
  transform: rotate(140deg);
  border: 4px solid transparent;
  box-shadow: inset 0px 16px #cbd5e122; /* gray-300 alpha */
}
.a1, .a2 {
  position: relative;
  top: -102%;
  left: -130%;
  width: 12px;
  height: 80px;
  background-color: #374151;
  border-radius: 50px;
  transform: rotate(-29deg);
}
.a1d, .a2d {
  position: relative;
  top: -211%;
  left: -35%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ef4444; /* red-500 */
  box-shadow: inset 0px -3px 2px #00000040;
}
.a2 {
  transform: rotate(29deg);
  left: 35%;
  top: -200%;
}
.a2d {
  left: 130%;
  top: -308%;
  background-color: #374151;
}
.a_base {
  position: absolute;
  bottom: -2px;
  left: -20px;
  width: 45px;
  height: 10px;
  background-color: #374151;
  border-radius: 50px;
}

/* 电视主体 */
.tv {
  width: 350px; /* 增加宽度 */
  height: 200px; /* 增加高度 */
  margin-top: 20px;
  background-color: #1f2937; /* gray-800 */
  border-radius: 20px;
  display: flex;
  justify-content: center;
  border: 4px solid #111827; /* gray-900 */
  box-shadow: inset 2px 2px 5px #4b5563, 10px 10px 20px rgba(0,0,0,0.5);
  position: relative;
}

/* 屏幕光泽曲线 SVG */
.cruve {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 15px;
  left: 15px;
  opacity: 0.1;
  pointer-events: none;
}
.curve_svg path {
  fill: #fff;
}

/* 显示区域 */
.display_div {
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: -2px 2px 5px #111827;
}
.screen_out {
  width: 230px;
  height: 160px;
  background-color: #111827;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.screen_out1 {
  width: 210px;
  height: 140px;
  background-color: #000;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  border: 2px solid #374151;
}

/* 屏幕内容与噪点 */
.screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    #22c55e20 4px
  );
  z-index: 2;
  position: relative;
}
.notfound_text {
  font-family: monospace;
  font-weight: bold;
  color: #22c55e; /* green-500 */
  text-shadow: 0 0 5px #22c55e;
  letter-spacing: 2px;
  animation: blink 2s infinite;
}

.screenM {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 50%, #000 150%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
  z-index: 1;
  animation: noise 0.5s steps(5) infinite;
}

/* 装饰线条 */
.lines {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  position: absolute;
  right: 80px;
  top: 25px;
  opacity: 0.3;
}
.line1, .line2, .line3 {
  width: 3px;
  height: 30px;
  background-color: #000;
  border-radius: 5px;
}

/* 按钮区域 */
.buttons_div {
  width: 70px;
  height: 160px;
  background-color: #374151;
  align-self: center;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 10px;
  border: 2px solid #111827;
  box-shadow: inset 2px 2px 2px #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
  gap: 15px;
}
.b1 {
  width: 35px;
  height: 35px;
  background-color: #1f2937;
  border-radius: 50%;
  box-shadow: 2px 2px 2px #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}
.b1 div {
  width: 20px;
  height: 4px;
  background-color: #6b7280;
  border-radius: 2px;
  transform: rotate(-45deg);
}
.b2 {
  width: 20px;
  height: 20px;
  background-color: #1f2937;
  border-radius: 50%;
  box-shadow: 1px 1px 2px #111827;
}
.speakers {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: auto;
  margin-bottom: 15px;
}
.g1 {
  display: flex;
  gap: 3px;
}
.g11, .g12, .g13, .g {
  width: 40px;
  height: 3px;
  background-color: #111827;
  border-radius: 2px;
}
.g11 { width: 10px; }
.g12 { width: 10px; }
.g13 { width: 10px; }

/* 底部支架 */
.bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -5px;
  position: relative;
  z-index: 1;
}
.base1, .base2, .base3 {
  width: 15px;
  height: 15px;
  background-color: #1f2937;
  border: 2px solid #111827;
  box-shadow: inset 1px 1px 2px #4b5563;
}
.base1 { transform: skewX(-20deg); margin-right: 150px; }
.base2 { width: 80px; height: 10px; margin-top: -5px; background-color: #111827; }
.base3 { transform: skewX(20deg); margin-left: -20px; }

/* 404 文字 */
.text_404 {
  position: absolute;
  top: -35%;
  display: flex;
  gap: 120px;
  z-index: 0;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
  font-size: 8rem;
  color: #22c55e; /* gray-200 */
  opacity: 0.15;
  user-select: none;
  pointer-events: none;
}

/* 动画 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes noise {
  0% { transform: translate(0,0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0,0); }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .main { transform: scale(0.6); }
  .text_404 { font-size: 5rem; gap: 80px; }
}

@media (prefers-reduced-motion: reduce) {
  .notfound_text { animation: none; }
  .screenM { animation: none; }
}
</style>