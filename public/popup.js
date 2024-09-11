(function() {
  const popupContainer = document.createElement('div');
  popupContainer.id = 'email-popup';
  document.body.appendChild(popupContainer);

  const popupScript = document.createElement('script');
  popupScript.src = 'https://your-app-url.com/frontend/EmailPopup.js';  // 弹窗组件打包后的文件路径
  document.body.appendChild(popupScript);
})();

