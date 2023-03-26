const updateTitle = (window, originalTitle) => {
  const { enterpriseName = '' } = window;
  // 如果只有一个窗口，就不显示企业名字
  if (enterpriseName) {
    window.setTitle(`${enterpriseName} - ${originalTitle}`);
  } else {
    window.setTitle(`${originalTitle}`);
  }
};

module.exports = updateTitle;
