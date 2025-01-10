const scrollableContainer = document.querySelector('.scrollable-container');

// 스크롤 활성화/비활성화 조건 제어
function toggleScroll(enable) {
  if (enable) {
    scrollableContainer.style.overflowY = 'auto';
  } else {
    scrollableContainer.style.overflowY = 'hidden';
  }
}

// 5초 후 스크롤 비활성화 예제
setTimeout(() => toggleScroll(false), 5000);
