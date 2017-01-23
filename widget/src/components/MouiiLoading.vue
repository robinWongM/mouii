<template>
  <div class="mouii-loading">
    <div class="mouii-loading__double-bounce1"></div>
    <div class="mouii-loading__double-bounce2"></div>
  </div>
</template>

<style>
/* Thanks to http://tobiasahlin.com/spinkit/ */
.mouii-loading {
  position: relative;
  margin: 0 auto;
  width: 2.5rem;
  height: 2.5rem;
}

.mouii-loading__double-bounce1, .mouii-loading__double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  animation: mouii-loading__sk-bounce 2.0s infinite ease-in-out;
}

.mouii-loading__double-bounce2 {
  animation-delay: -1.0s;
}

@keyframes mouii-loading__sk-bounce {
  0%, 100% {
    transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
  }
}
</style>
