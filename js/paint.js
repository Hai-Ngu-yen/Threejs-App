const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let points = []; // Mảng lưu các điểm đã click
let pointsTmp = [];
const clearButton = document.getElementById("clearButton");
const endButton = document.getElementById("endButton");

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", endDrawing);
clearButton.addEventListener("click", clearCanvas);
endButton.addEventListener("click", endLine);

const gridSize = 20;
const numCols = Math.floor(canvas.width / gridSize);
const numRows = Math.floor(canvas.height / gridSize);

function drawGrid() {
  // Vẽ các đường ngang
  ctx.lineWidth = 0.2;
  for (let i = 0; i < numRows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // Vẽ các đường dọc
  for (let j = 0; j < numCols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * gridSize, 0);
    ctx.lineTo(j * gridSize, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
}
drawGrid();
// Vẽ lưới khi trang được tải

function startDrawing(event) {
  drawGrid();
  const startX = event.offsetX;
  const startY = event.offsetY;
  pointsTmp.push({ x: startX, y: startY });
  // points.push({ x: startX, y: startY }); // Lưu điểm bắt đầu vào mảng
  drawLine(event); // Vẽ đường từ điểm bắt đầu đến vị trí chuột hiện tại
}
canvas.addEventListener("mouseout", function (event) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas để vẽ lại
  drawGrid();
  ctx.lineWidth = 4;
  // Vẽ các đường từ điểm bắt đầu đến các điểm trong mảng
  for (let j = 0; j < points.length; j++) {
    for (let i = 0; i < points[j].length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(points[j][i].x, points[j][i].y);
      ctx.lineTo(points[j][i + 1].x, points[j][i + 1].y);
      ctx.stroke();
    }
  }
  for (let i = 0; i < pointsTmp.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(pointsTmp[i].x, pointsTmp[i].y);
    ctx.lineTo(pointsTmp[i + 1].x, pointsTmp[i + 1].y);
    ctx.stroke();
  }
});
function drawLine(event) {
  if (pointsTmp.length < 1) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas để vẽ lại
  drawGrid();
  ctx.lineWidth = 4;
  // Vẽ các đường từ điểm bắt đầu đến các điểm trong mảng
  for (let j = 0; j < points.length; j++) {
    for (let i = 0; i < points[j].length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(points[j][i].x, points[j][i].y);
      ctx.lineTo(points[j][i + 1].x, points[j][i + 1].y);
      ctx.stroke();
    }
  }
  for (let i = 0; i < pointsTmp.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(pointsTmp[i].x, pointsTmp[i].y);
    ctx.lineTo(pointsTmp[i + 1].x, pointsTmp[i + 1].y);
    ctx.stroke();
  }

  // Vẽ đường từ điểm bắt đầu đến vị trí chuột hiện tại
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  ctx.beginPath();
  ctx.moveTo(
    pointsTmp[pointsTmp.length - 1].x,
    pointsTmp[pointsTmp.length - 1].y
  );
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
}

function endDrawing() {
  // Không cần làm gì khi kết thúc vẽ
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  points = []; // Xóa tất cả các điểm đã click
  pointsTmp = [];
}

function endLine() {
  if (pointsTmp.length > 0) {
    points.push(pointsTmp);

    pointsTmp = [];
  }
}

export default function Paint() {
  return points;
}
