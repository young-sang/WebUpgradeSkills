const form = document.getElementById('dataForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, age }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    responseMessage.textContent = responseData.message;
    console.log('Server Response:', responseData);
  } catch (error) {
    console.error('Error:', error);
    responseMessage.textContent = 'An error occurred while sending data.';
  }
});
