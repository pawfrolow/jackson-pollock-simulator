export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const distance = (x1: number, x2: number, y1: number, y2: number) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

export const speed = (distance: number) => {
  return +(10 * (distance / 30)).toFixed(3);
};

export const degreeToRadian = (degree: number) => {
  return (degree * Math.PI) / 180;
};

export const getLineWidth = (speed: number) => {
  if (speed < 2) {
    if (Math.random() > 0.9) return getRandomArbitrary(10, 180);
    return getRandomArbitrary(10, 40);
  }

  if (speed < 50) {
    const step = Math.ceil(speed / 10);
    let width = 10;
    for (let i = 0; i < speed; i += step) {
      width--;
    }
    return width;
  }

  return 1;
};
