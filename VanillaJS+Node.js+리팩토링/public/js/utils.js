export const resetMain = () => {
    document.getElementById('app-content').innerHTML = '';
    eventManager.removeAll();
}

export const removeContainer = (containerId) => {
    if(containerId){
        containerId.remove();
    }
}

// 이벤트 리스너 관리 객체
export const eventManager = {
    listeners: [],

    // 리스너 추가 및 저장
    add: (element, type, handler) => {
        element.addEventListener(type, handler);
        eventManager.listeners.push({ element, type, handler });
    },

    // 특정 요소와 타입에 연결된 리스너 제거
    remove: (element, type) => {
        eventManager.listeners = eventManager.listeners.filter(({ element: el, type: t, handler }) => {
            if (el === element && t === type) {
                element.removeEventListener(type, handler);
                return false; // 해당 리스너는 제거
            }
            return true; // 나머지는 유지
        });
    },

    // 모든 리스너 제거
    removeAll: () => {
        console.log('reset');
        eventManager.listeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        eventManager.listeners = []; // 초기화
    }
};

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

