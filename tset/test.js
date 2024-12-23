// app.js

// 요소 선택
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// `marked` 라이브러리 설정
marked.setOptions({
  breaks: true, // 줄바꿈 지원
  gfm: true, // GitHub 스타일 Markdown 활성화
});

// 입력 이벤트 처리
editor.addEventListener('input', () => {
  const markdownText = editor.value; // 입력된 Markdown
  const htmlContent = marked.parse(markdownText); // Markdown -> HTML 변환
  preview.innerHTML = htmlContent; // HTML 미리보기
});


const saveButton = document.createElement('button');
saveButton.textContent = 'Save Markdown';
document.body.appendChild(saveButton);

// 저장 기능
saveButton.addEventListener('click', () => {
  const markdownText = editor.value;
  localStorage.setItem('markdown', markdownText);
  alert('Markdown saved!');
});

// 페이지 로드 시 저장된 Markdown 불러오기
window.addEventListener('DOMContentLoaded', () => {
  const savedMarkdown = localStorage.getItem('markdown');
  if (savedMarkdown) {
    editor.value = savedMarkdown;
    preview.innerHTML = marked.parse(savedMarkdown);
  }
});
