export const resetMain = () => {
    document.getElementById('app-content').innerHTML = '';
    eventManager.removeAll();
}

// 이벤트 리스너 관리 객체
export const eventManager = {
    listeners: [],

    // 리스너 추가 및 저장
    add: (element, type, handler) => {
        element.addEventListener(type, handler);
        eventManager.listeners.push({ element, type, handler });
    },

    // 모든 리스너 제거
    removeAll: () => {
        eventManager.listeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        eventManager.listeners = []; // 초기화
    }
};

