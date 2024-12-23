// 서버에서 데이터를 가져오는 함수
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    document.getElementById('message').textContent = data.message;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 페이지가 로드되면 데이터 가져오기
window.onload = fetchData;