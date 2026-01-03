// Mock getBoundingClientRect for testing
Element.prototype.getBoundingClientRect = jest.fn(function getBoundingClientRectMock() {
  return {
    width: parseFloat(this.style.width) || 0,
    height: parseFloat(this.style.height) || 0,
    top: parseFloat(this.style.top) || 0,
    left: parseFloat(this.style.left) || 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON() {}
  };
});

// Keep window.resizeTo (not a standard API)
window.resizeTo = (width, height) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};
